import "reflect-metadata";
import { DataSource } from "typeorm";
import { RentalUnitEntity } from "./rental-unit.entity";
import { ReservationEntity } from "./reservation.entity";
import { InitialSchema1748000000000 } from "./migrations/1748000000000-initial-schema";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: `${__dirname}/../../../data/reservations.sqlite`,
  entities: [RentalUnitEntity, ReservationEntity],
  migrations: [InitialSchema1748000000000],
  synchronize: false,
});
