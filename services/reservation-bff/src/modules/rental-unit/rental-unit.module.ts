import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database';
import { RentalUnitController } from './rental-unit.controller';
import { RentalUnitService } from './rental-unit.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RentalUnitController],
  providers: [RentalUnitService],
})
export class RentalUnitModule {}
