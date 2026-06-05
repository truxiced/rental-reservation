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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("./reservation.entity");
let ReservationRepository = class ReservationRepository {
    constructor(repo) {
        this.repo = repo;
    }
    findCurrentForUnit(rentalUnitId, today) {
        return this.repo
            .createQueryBuilder('r')
            .where('r.rentalUnitId = :rentalUnitId', { rentalUnitId })
            .andWhere('r.startDate <= :today', { today })
            .andWhere('r.endDate > :today', { today })
            .orderBy('r.startDate', 'ASC')
            .getOne();
    }
    findNextForUnit(rentalUnitId, today) {
        return this.repo
            .createQueryBuilder('r')
            .where('r.rentalUnitId = :rentalUnitId', { rentalUnitId })
            .andWhere('r.startDate > :today', { today })
            .orderBy('r.startDate', 'ASC')
            .getOne();
    }
    findPaginated(query) {
        const qb = this.repo
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.rentalUnit', 'unit')
            .orderBy('r.startDate', 'ASC')
            .skip((query.page - 1) * query.limit)
            .take(query.limit);
        if (query.rentalUnitId) {
            qb.andWhere('r.rentalUnitId = :rentalUnitId', { rentalUnitId: query.rentalUnitId });
        }
        if (query.startDate) {
            qb.andWhere('r.endDate > :startDate', { startDate: query.startDate });
        }
        if (query.endDate) {
            qb.andWhere('r.startDate < :endDate', { endDate: query.endDate });
        }
        return qb.getManyAndCount();
    }
    findOneWithRelations(id) {
        return this.repo.findOne({ where: { id }, relations: ['rentalUnit'] });
    }
    findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    /**
     * Finds a reservation that overlaps the given half-open interval [startDate, endDate).
     *
     * Overlap condition: existingStart < newEnd AND existingEnd > newStart
     *
     * This allows same-day checkout/check-in: if guest A has endDate="2024-06-05" and
     * guest B has startDate="2024-06-05", there is no overlap.
     */
    findOverlap(params) {
        const qb = this.repo
            .createQueryBuilder('r')
            .where('r.rentalUnitId = :rentalUnitId', { rentalUnitId: params.rentalUnitId })
            .andWhere('r.startDate < :endDate', { endDate: params.endDate })
            .andWhere('r.endDate > :startDate', { startDate: params.startDate });
        if (params.excludeId) {
            qb.andWhere('r.id != :excludeId', { excludeId: params.excludeId });
        }
        return qb.getOne();
    }
    async createAndSave(data) {
        const reservation = this.repo.create(data);
        return this.repo.save(reservation);
    }
    save(entity) {
        return this.repo.save(entity);
    }
    async remove(entity) {
        await this.repo.remove(entity);
    }
};
exports.ReservationRepository = ReservationRepository;
exports.ReservationRepository = ReservationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.ReservationEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReservationRepository);
