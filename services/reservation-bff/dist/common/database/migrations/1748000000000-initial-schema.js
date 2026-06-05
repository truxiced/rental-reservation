"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1748000000000 = void 0;
class InitialSchema1748000000000 {
    constructor() {
        this.name = 'InitialSchema1748000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "rental_units" (
        "id"        TEXT      NOT NULL PRIMARY KEY,
        "name"      TEXT      NOT NULL,
        "address"   TEXT,
        "createdAt" DATETIME  NOT NULL DEFAULT (datetime('now')),
        "updatedAt" DATETIME  NOT NULL DEFAULT (datetime('now'))
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "reservations" (
        "id"           TEXT     NOT NULL PRIMARY KEY,
        "rentalUnitId" TEXT     NOT NULL REFERENCES "rental_units"("id") ON DELETE CASCADE,
        "guestName"    TEXT     NOT NULL,
        "startDate"    TEXT     NOT NULL,
        "endDate"      TEXT     NOT NULL,
        "createdAt"    DATETIME NOT NULL DEFAULT (datetime('now')),
        "updatedAt"    DATETIME NOT NULL DEFAULT (datetime('now'))
      )
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_reservations_rentalUnitId" ON "reservations" ("rentalUnitId")
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_reservations_dates" ON "reservations" ("startDate", "endDate")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_reservations_dates"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_reservations_rentalUnitId"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "reservations"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "rental_units"`);
    }
}
exports.InitialSchema1748000000000 = InitialSchema1748000000000;
