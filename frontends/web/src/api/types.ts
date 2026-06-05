// ---- Rental Units ----

export interface RentalUnit {
  id: string;
  name: string;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RentalUnitDetail extends RentalUnit {
  isOccupied: boolean;
  currentReservation: ReservationSummary | null;
  nextReservation: ReservationSummary | null;
}

export interface ReservationSummary {
  id: string;
  guestName: string;
  startDate: string;
  endDate: string;
}

export interface CreateRentalUnitInput {
  name: string;
  address?: string;
}

export interface UpdateRentalUnitInput {
  name?: string;
  address?: string;
}

// ---- Reservations ----

export interface Reservation {
  id: string;
  rentalUnitId: string;
  rentalUnitName: string;
  guestName: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedReservations {
  items: Reservation[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateReservationInput {
  rentalUnitId: string;
  guestName: string;
  startDate: string;
  endDate: string;
}

export interface UpdateReservationInput {
  guestName?: string;
  startDate?: string;
  endDate?: string;
}

export interface ListReservationsParams {
  rentalUnitId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ---- Error ----

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
  details?: Record<string, unknown>;
}
