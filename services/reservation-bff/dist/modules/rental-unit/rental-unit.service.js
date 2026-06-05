"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalUnitService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../common/database");
let RentalUnitService = class RentalUnitService {
    constructor(rentalUnitRepository, reservationRepository) {
        this.rentalUnitRepository = rentalUnitRepository;
        this.reservationRepository = reservationRepository;
    }
    search(search) {
        return this.rentalUnitRepository.findAll(search);
    }
    async get(id) {
        const unit = await this.rentalUnitRepository.findById(id);
        if (!unit) {
            throw new common_1.NotFoundException(`Rental unit ${id} not found`);
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
    create(dto) {
        return this.rentalUnitRepository.createAndSave({
            name: dto.name,
            address: dto.address ?? null,
        });
    }
    async update(id, dto) {
        const unit = await this.rentalUnitRepository.findById(id);
        if (!unit) {
            throw new common_1.NotFoundException(`Rental unit ${id} not found`);
        }
        if (dto.name !== undefined)
            unit.name = dto.name;
        if (dto.address !== undefined)
            unit.address = dto.address ?? null;
        return this.rentalUnitRepository.save(unit);
    }
};
exports.RentalUnitService = RentalUnitService;
exports.RentalUnitService = RentalUnitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.RentalUnitRepository,
        database_1.ReservationRepository])
], RentalUnitService);
