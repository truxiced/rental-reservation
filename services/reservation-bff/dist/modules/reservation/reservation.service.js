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
exports.ReservationService = void 0;
const common_1 = require("@nestjs/common");
const rental_unit_repository_1 = require("../../common/database/rental-unit.repository");
const reservation_repository_1 = require("../../common/database/reservation.repository");
let ReservationService = class ReservationService {
    constructor(reservationRepository, rentalUnitRepository) {
        this.reservationRepository = reservationRepository;
        this.rentalUnitRepository = rentalUnitRepository;
    }
    async findAll(query) {
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
    async findOne(id) {
        const reservation = await this.reservationRepository.findOneWithRelations(id);
        if (!reservation) {
            throw new common_1.NotFoundException(`Reservation ${id} not found`);
        }
        return this.toResponseShape(reservation);
    }
    async create(dto) {
        const unit = await this.rentalUnitRepository.findById(dto.rentalUnitId);
        if (!unit) {
            throw new common_1.NotFoundException(`Rental unit ${dto.rentalUnitId} not found`);
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
    async update(id, dto) {
        const reservation = await this.reservationRepository.findOneWithRelations(id);
        if (!reservation) {
            throw new common_1.NotFoundException(`Reservation ${id} not found`);
        }
        const newStartDate = dto.startDate ?? reservation.startDate;
        const newEndDate = dto.endDate ?? reservation.endDate;
        if (newEndDate <= newStartDate) {
            throw new common_1.ConflictException('endDate must be after startDate');
        }
        await this.assertNoOverlap(reservation.rentalUnitId, newStartDate, newEndDate, id);
        reservation.guestName = dto.guestName ?? reservation.guestName;
        reservation.startDate = newStartDate;
        reservation.endDate = newEndDate;
        const saved = await this.reservationRepository.save(reservation);
        return this.toResponseShape(saved);
    }
    async remove(id) {
        const reservation = await this.reservationRepository.findById(id);
        if (!reservation) {
            throw new common_1.NotFoundException(`Reservation ${id} not found`);
        }
        await this.reservationRepository.remove(reservation);
    }
    async assertNoOverlap(rentalUnitId, startDate, endDate, excludeId) {
        const conflict = await this.reservationRepository.findOverlap({
            rentalUnitId,
            startDate,
            endDate,
            excludeId,
        });
        if (conflict) {
            throw new common_1.ConflictException({
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
    toResponseShape(r) {
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
};
exports.ReservationService = ReservationService;
exports.ReservationService = ReservationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reservation_repository_1.ReservationRepository,
        rental_unit_repository_1.RentalUnitRepository])
], ReservationService);
