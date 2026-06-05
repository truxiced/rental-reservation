import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RentalUnitRepository } from '../../common/database/rental-unit.repository';
import { ReservationEntity } from '../../common/database/reservation.entity';
import { ReservationRepository } from '../../common/database/reservation.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ListReservationsQueryDto } from './dto/list-reservations-query.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly rentalUnitRepository: RentalUnitRepository,
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
    const reservation = await this.reservationRepository.findOneWithRelations(id);
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

    await this.assertNoOverlap(dto.rentalUnitId, dto.startDate, dto.endDate);

    const saved = await this.reservationRepository.createAndSave({
      rentalUnitId: dto.rentalUnitId,
      guestName: dto.guestName,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });
    saved.rentalUnit = unit;
    return this.toResponseShape(saved);
  }

  async update(id: string, dto: UpdateReservationDto) {
    const reservation = await this.reservationRepository.findOneWithRelations(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation ${id} not found`);
    }

    const newStartDate = dto.startDate ?? reservation.startDate;
    const newEndDate = dto.endDate ?? reservation.endDate;

    if (newEndDate <= newStartDate) {
      throw new ConflictException('endDate must be after startDate');
    }

    await this.assertNoOverlap(reservation.rentalUnitId, newStartDate, newEndDate, id);

    reservation.guestName = dto.guestName ?? reservation.guestName;
    reservation.startDate = newStartDate;
    reservation.endDate = newEndDate;
    const saved = await this.reservationRepository.save(reservation);
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
    excludeId?: string,
  ): Promise<void> {
    const conflict = await this.reservationRepository.findOverlap({
      rentalUnitId,
      startDate,
      endDate,
      excludeId,
    });
    if (conflict) {
      throw new ConflictException({
        statusCode: 409,
        error: 'Conflict',
        message: `Unit is already reserved from ${conflict.startDate} to ${conflict.endDate} by ${conflict.guestName}.`,
        details: {
          conflictingReservationId: conflict.id,
          conflictingGuestName: conflict.guestName,
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
      rentalUnitName: r.rentalUnit?.name ?? '',
      guestName: r.guestName,
      startDate: r.startDate,
      endDate: r.endDate,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }
}
