import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { ReservationEntity } from "./reservation.entity";

export interface FindPaginatedQuery {
  rentalUnitId?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export interface FindOverlapParams {
  rentalUnitId: string;
  startDate: string;
  endDate: string;
  excludeId?: string;
}

@Injectable()
export class ReservationRepository {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly repo: Repository<ReservationEntity>,
  ) {}

  /**
   * Returns the active reservation for a unit on a given date, i.e. one where
   * startDate <= today < endDate (half-open interval).
   */
  findCurrentForUnit(
    rentalUnitId: string,
    today: string,
  ): Promise<ReservationEntity | null> {
    return this.repo
      .createQueryBuilder("r")
      .where("r.rentalUnitId = :rentalUnitId", { rentalUnitId })
      .andWhere("r.startDate <= :today", { today })
      .andWhere("r.endDate > :today", { today })
      .orderBy("r.startDate", "ASC")
      .getOne();
  }

  /**
   * Returns the soonest upcoming reservation for a unit, i.e. the one with the
   * earliest startDate that is strictly after today.
   */
  findNextForUnit(
    rentalUnitId: string,
    today: string,
  ): Promise<ReservationEntity | null> {
    return this.repo
      .createQueryBuilder("r")
      .where("r.rentalUnitId = :rentalUnitId", { rentalUnitId })
      .andWhere("r.startDate > :today", { today })
      .orderBy("r.startDate", "ASC")
      .getOne();
  }

  findPaginated(
    query: FindPaginatedQuery,
  ): Promise<[ReservationEntity[], number]> {
    const qb = this.repo
      .createQueryBuilder("r")
      .leftJoinAndSelect("r.rentalUnit", "unit")
      .orderBy("r.startDate", "ASC")
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    if (query.rentalUnitId) {
      qb.andWhere("r.rentalUnitId = :rentalUnitId", {
        rentalUnitId: query.rentalUnitId,
      });
    }
    if (query.startDate) {
      qb.andWhere("r.endDate > :startDate", { startDate: query.startDate });
    }
    if (query.endDate) {
      qb.andWhere("r.startDate < :endDate", { endDate: query.endDate });
    }

    return qb.getManyAndCount();
  }

  findOneWithRelations(id: string): Promise<ReservationEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: { rentalUnit: true },
    });
  }

  findById(id: string): Promise<ReservationEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  /**
   * Finds a reservation that overlaps the given half-open interval [startDate, endDate).
   *
   * Overlap condition: existingStart < newEnd AND existingEnd > newStart
   *
   * This allows same-day checkout/check-in: if guest A has endDate="2024-06-05" and
   * guest B has startDate="2024-06-05", there is no overlap.
   *
   * Pass an EntityManager to run inside an existing transaction.
   */
  findOverlap(
    params: FindOverlapParams,
    manager?: EntityManager,
  ): Promise<ReservationEntity | null> {
    const repo = manager ? manager.getRepository(ReservationEntity) : this.repo;
    const qb = repo
      .createQueryBuilder("r")
      .where("r.rentalUnitId = :rentalUnitId", {
        rentalUnitId: params.rentalUnitId,
      })
      .andWhere("r.startDate < :endDate", { endDate: params.endDate })
      .andWhere("r.endDate > :startDate", { startDate: params.startDate });

    if (params.excludeId) {
      qb.andWhere("r.id != :excludeId", { excludeId: params.excludeId });
    }

    return qb.getOne();
  }

  async createAndSave(
    data: Partial<ReservationEntity>,
    manager?: EntityManager,
  ): Promise<ReservationEntity> {
    const repo = manager ? manager.getRepository(ReservationEntity) : this.repo;
    const reservation = repo.create(data);
    return repo.save(reservation);
  }

  save(
    entity: ReservationEntity,
    manager?: EntityManager,
  ): Promise<ReservationEntity> {
    const repo = manager ? manager.getRepository(ReservationEntity) : this.repo;
    return repo.save(entity);
  }

  async remove(entity: ReservationEntity): Promise<void> {
    await this.repo.remove(entity);
  }

  /**
   * Returns true if the unit has any reservation that ends on or after today,
   * meaning it has active or future bookings that would block deletion.
   */
  async hasActiveOrFutureByUnit(
    rentalUnitId: string,
    today: string,
  ): Promise<boolean> {
    const count = await this.repo
      .createQueryBuilder("r")
      .where("r.rentalUnitId = :rentalUnitId", { rentalUnitId })
      .andWhere("r.endDate >= :today", { today })
      .getCount();
    return count > 0;
  }
}
