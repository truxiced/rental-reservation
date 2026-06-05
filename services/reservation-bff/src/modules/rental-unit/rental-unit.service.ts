import { Injectable, NotFoundException } from "@nestjs/common";
import {
  ReservationRepository,
  RentalUnitRepository,
} from "../../common/database";
import { CreateRentalUnitDto, UpdateRentalUnitDto } from "./dto";

@Injectable()
export class RentalUnitService {
  constructor(
    private readonly rentalUnitRepository: RentalUnitRepository,
    private readonly reservationRepository: ReservationRepository,
  ) {}

  search(search: string | undefined) {
    return this.rentalUnitRepository.findAll(search);
  }

  async get(id: string) {
    const unit = await this.rentalUnitRepository.findById(id);

    if (!unit) {
      throw new NotFoundException(`Rental unit ${id} not found`);
    }

    const today = new Date().toISOString().slice(0, 10);

    const [currentReservation, nextReservation] = await Promise.all([
      this.reservationRepository.findCurrentForUnit(id, today),
      this.reservationRepository.findNextForUnit(id, today),
    ]);

    return {
      ...unit,
      isOccupied: currentReservation !== null,
      currentReservation: currentReservation
        ? {
            id: currentReservation.id,
            guestName: currentReservation.guestName,
            startDate: currentReservation.startDate,
            endDate: currentReservation.endDate,
          }
        : null,
      nextReservation: nextReservation
        ? {
            id: nextReservation.id,
            guestName: nextReservation.guestName,
            startDate: nextReservation.startDate,
            endDate: nextReservation.endDate,
          }
        : null,
    };
  }

  create(dto: CreateRentalUnitDto) {
    return this.rentalUnitRepository.createAndSave({
      name: dto.name,
      address: dto.address ?? null,
    });
  }

  async update(id: string, dto: UpdateRentalUnitDto) {
    const unit = await this.rentalUnitRepository.findById(id);
    if (!unit) {
      throw new NotFoundException(`Rental unit ${id} not found`);
    }
    if (dto.name !== undefined) unit.name = dto.name;
    if (dto.address !== undefined) unit.address = dto.address ?? null;
    return this.rentalUnitRepository.save(unit);
  }
}
