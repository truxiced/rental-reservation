import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { InitialSchema1748000000000 } from './migrations/1748000000000-initial-schema';
import { RentalUnitEntity } from './rental-unit.entity';
import { RentalUnitRepository } from './rental-unit.repository';
import { ReservationEntity } from './reservation.entity';
import { ReservationRepository } from './reservation.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: path.join(__dirname, '..', '..', '..', 'data', 'reservations.sqlite'),
      entities: [RentalUnitEntity, ReservationEntity],
      migrations: [InitialSchema1748000000000],
      migrationsRun: true,
      synchronize: false,
      logging: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([RentalUnitEntity, ReservationEntity]),
  ],
  providers: [RentalUnitRepository, ReservationRepository],
  exports: [RentalUnitRepository, ReservationRepository],
})
export class DatabaseModule {}
