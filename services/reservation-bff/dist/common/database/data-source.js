"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const rental_unit_entity_1 = require("./rental-unit.entity");
const reservation_entity_1 = require("./reservation.entity");
const _1748000000000_initial_schema_1 = require("./migrations/1748000000000-initial-schema");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "better-sqlite3",
    database: `${__dirname}/../../../data/reservations.sqlite`,
    entities: [rental_unit_entity_1.RentalUnitEntity, reservation_entity_1.ReservationEntity],
    migrations: [_1748000000000_initial_schema_1.InitialSchema1748000000000],
    synchronize: false,
});
