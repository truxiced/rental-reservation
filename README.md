# Minut Assignment — Reservation Manager

A full-stack reservation management system built with NestJS (backend) and React + MUI (frontend).

## Project Structure

```
rental-reservation/
├── frontends/
│   └── web/              # React SPA (Vite, MUI, TanStack Query)
├── services/
│   └── reservation-bff/  # NestJS REST API + SQLite database
├── tsconfig.base.json    # Shared TypeScript compiler options
└── package.json          # npm workspaces root + dev scripts
```

## Quick Start

```bash
# Install all dependencies (from repo root)
npm install

# Run both backend and frontend together
npm run dev

# Or separately:
# Terminal 1 — backend (http://localhost:3000)
npm run dev:backend

# Terminal 2 — frontend (http://localhost:5173)
npm run dev:frontend
```

The frontend dev server proxies all `/api/*` requests to the backend at `http://localhost:3000`, so no CORS configuration is needed during development.

The SQLite database is created automatically on first start and migrations run on every boot — no manual setup required.

## Architecture

| Layer    | Tech                                                                   |
| -------- | ---------------------------------------------------------------------- |
| Backend  | NestJS 10, TypeORM, SQLite (better-sqlite3), TypeScript 6              |
| Frontend | React 19, Vite, MUI 9, TanStack Query 5, React Router v7, TypeScript 6 |
| Database | SQLite — file at `services/reservation-bff/data/reservations.sqlite`   |

## Frontend Routes

| Path                     | View                                         |
| ------------------------ | -------------------------------------------- |
| `/`                      | Dashboard — unit cards with occupancy status |
| `/rental-units`          | Rental unit list + create                    |
| `/reservations`          | Reservation list with filters                |
| `/reservations/new`      | Create reservation                           |
| `/reservations/:id/edit` | Edit reservation                             |

## API

Base URL: `http://localhost:3000/api`

### Rental Units

| Method | Path                | Description                           |
| ------ | ------------------- | ------------------------------------- |
| GET    | `/rental-units`     | List all (optional `?search=`)        |
| GET    | `/rental-units/:id` | Get unit + current & next reservation |
| POST   | `/rental-units`     | Create unit                           |
| PATCH  | `/rental-units/:id` | Update unit                           |

### Reservations

| Method | Path                | Description                                  |
| ------ | ------------------- | -------------------------------------------- |
| GET    | `/reservations`     | List with filters + pagination               |
| GET    | `/reservations/:id` | Get single reservation                       |
| POST   | `/reservations`     | Create (validates overlap → 409 on conflict) |
| PATCH  | `/reservations/:id` | Update (re-validates overlap)                |
| DELETE | `/reservations/:id` | Delete                                       |

#### Reservation list query params

| Param          | Type | Description                                           |
| -------------- | ---- | ----------------------------------------------------- |
| `rentalUnitId` | UUID | Filter by unit                                        |
| `startDate`    | date | Return reservations overlapping on or after this date |
| `endDate`      | date | Return reservations overlapping before this date      |
| `page`         | int  | Page number (default: 1)                              |
| `limit`        | int  | Page size, max 100 (default: 20)                      |

## Double-Booking Logic

A unit is occupied from `startDate` (inclusive) through `endDate` (exclusive), allowing same-day turnover (checkout/check-in on the same day is allowed).

Overlap condition: `existingStart < newEnd AND existingEnd > newStart`

Create and update operations run inside a `SERIALIZABLE` transaction to prevent race conditions between concurrent requests.

Conflict response:

```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Unit is already reserved from 2024-06-01 to 2024-06-07.",
  "details": {
    "conflictingReservationId": "...",
    "conflictingStartDate": "2024-06-01",
    "conflictingEndDate": "2024-06-07"
  }
}
```
