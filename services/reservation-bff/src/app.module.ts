import { Module } from "@nestjs/common";
import { DatabaseModule } from "./common/database/";
import { RentalUnitModule } from "./modules/rental-unit/";
import { ReservationModule } from "./modules/reservation/";

@Module({
  imports: [DatabaseModule, RentalUnitModule, ReservationModule],
})
export class AppModule {}
