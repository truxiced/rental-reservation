import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, EntityManager } from "typeorm";
import { RentalUnitRepository } from "../../common/database/rental-unit.repository";
import { ReservationEntity } from "../../common/database/reservation.entity";
import { ReservationRepository } from "../../common/database/reservation.repository";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { ListReservationsQueryDto } from "./dto/list-reservations-query.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly rentalUnitRepository: RentalUnitRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async findAll(query: ListReservationsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [items, total] = await this.reservationRepository.findPaginated({
      rentalUnitId: query.rentalUnitId,
      startDate: query.startDate,
      endDate: query.endDate,
      page,
      limit,
    });

    return {
      items: items.map((r) => this.toResponseShape(r)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const reservation =
      await this.reservationRepository.findOneWithRelations(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation ${id} not found`);
    }
    return this.toResponseShape(reservation);
  }

  async create(dto: CreateReservationDto) {
    const unit = await this.rentalUnitRepository.findById(dto.rentalUnitId);
    if (!unit) {
      throw new NotFoundException(`Rental unit ${dto.rentalUnitId} not found`);
    }

    const saved = await this.dataSource.transaction(
      "SERIALIZABLE",
      async (manager) => {
        await this.assertNoOverlap(
          dto.rentalUnitId,
          dto.startDate,
          dto.endDate,
          undefined,
          manager,
        );
        return this.reservationRepository.createAndSave(
          {
            rentalUnitId: dto.rentalUnitId,
            guestName: dto.guestName,
            startDate: dto.startDate,
            endDate: dto.endDate,
          },
          manager,
        );
      },
    );
    saved.rentalUnit = unit;
    return this.toResponseShape(saved);
  }

  async update(id: string, dto: UpdateReservationDto) {
    const reservation =
      await this.reservationRepository.findOneWithRelations(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation ${id} not found`);
    }

    const newStartDate = dto.startDate ?? reservation.startDate;
    const newEndDate = dto.endDate ?? reservation.endDate;

    if (newEndDate <= newStartDate) {
      throw new ConflictException("endDate must be after startDate");
    }

    const saved = await this.dataSource.transaction(
      "SERIALIZABLE",
      async (manager) => {
        await this.assertNoOverlap(
          reservation.rentalUnitId,
          newStartDate,
          newEndDate,
          id,
          manager,
        );
        reservation.guestName = dto.guestName ?? reservation.guestName;
        reservation.startDate = newStartDate;
        reservation.endDate = newEndDate;
        return this.reservationRepository.save(reservation, manager);
      },
    );
    return this.toResponseShape(saved);
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation ${id} not found`);
    }
    await this.reservationRepository.remove(reservation);
  }

  private async assertNoOverlap(
    rentalUnitId: string,
    startDate: string,
    endDate: string,
    excludeId: string | undefined,
    manager: EntityManager | undefined,
  ): Promise<void> {
    const conflict = await this.reservationRepository.findOverlap(
      { rentalUnitId, startDate, endDate, excludeId },
      manager,
    );
    if (conflict) {
      throw new ConflictException({
        statusCode: 409,
        error: "Conflict",
        message: `Unit is already reserved from ${conflict.startDate} to ${conflict.endDate}.`,
        details: {
          conflictingReservationId: conflict.id,
          conflictingStartDate: conflict.startDate,
          conflictingEndDate: conflict.endDate,
        },
      });
    }
  }

  private toResponseShape(r: ReservationEntity) {
    return {
      id: r.id,
      rentalUnitId: r.rentalUnitId,
      rentalUnitName: r.rentalUnit?.name ?? "",
      guestName: r.guestName,
      startDate: r.startDate,
      endDate: r.endDate,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }
}
