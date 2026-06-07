import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { RentalUnitEntity } from './rental-unit.entity';

@Injectable()
export class RentalUnitRepository {
  constructor(
    @InjectRepository(RentalUnitEntity)
    private readonly repo: Repository<RentalUnitEntity>,
  ) {}

  findAll(search?: string): Promise<RentalUnitEntity[]> {
    const where = search ? { name: ILike(`%${search}%`) } : {};
    return this.repo.find({ where, order: { name: 'ASC' } });
  }

  findById(id: string): Promise<RentalUnitEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  createAndSave(data: Partial<RentalUnitEntity>): Promise<RentalUnitEntity> {
    const unit = this.repo.create(data);
    return this.repo.save(unit);
  }

  save(entity: RentalUnitEntity): Promise<RentalUnitEntity> {
    return this.repo.save(entity);
  }

  async remove(entity: RentalUnitEntity): Promise<void> {
    await this.repo.remove(entity);
  }
}
