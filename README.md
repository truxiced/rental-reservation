# Minut Assignment — Reservation Manager

A full-stack reservation management system built with NestJS (backend) and React + MUI (frontend).

## Quick Start

```bash
# Install all dependencies (from repo root)
npm install

# Terminal 1 — backend (http://localhost:3000)
npm run dev:backend

# Terminal 2 — frontend (http://localhost:5173)
npm run dev:frontend
```

## Architecture

| Layer | Tech |
|-------|------|
| Backend | NestJS 10, TypeORM, SQLite (better-sqlite3) |
| Frontend | React 19, Vite, MUI 6, TanStack Query, React Router v7 |
| Database | SQLite — file at `services/reservation-bff/data/reservations.sqlite` |

## API

Base URL: `http://localhost:3000/api`

### Rental Units
| Method | Path | Description |
|--------|------|-------------|
| GET | `/rental-units` | List all (optional `?search=`) |
| GET | `/rental-units/:id` | Get unit + current & next reservation |
| POST | `/rental-units` | Create unit |
| PATCH | `/rental-units/:id` | Update unit |

### Reservations
| Method | Path | Description |
|--------|------|-------------|
| GET | `/reservations` | List with filters + pagination |
| GET | `/reservations/:id` | Get single reservation |
| POST | `/reservations` | Create (validates overlap → 409 on conflict) |
| PATCH | `/reservations/:id` | Update (re-validates overlap) |
| DELETE | `/reservations/:id` | Delete |

## Double-Booking Logic

A unit is occupied from `startDate` (inclusive) through `endDate` (exclusive), allowing same-day turnover (checkout/check-in on the same day is allowed).

Conflict response:
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Reservation overlaps with an existing booking",
  "details": {
    "conflictingReservationId": "...",
    "conflictingGuestName": "Alice",
    "conflictingDates": "2024-06-01 – 2024-06-07"
  }
}
```
