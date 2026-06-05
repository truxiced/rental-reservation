import { apiClient } from './client';
import type {
  Reservation,
  PaginatedReservations,
  CreateReservationInput,
  UpdateReservationInput,
  ListReservationsParams,
} from './types';

export const reservationApi = {
  list: (params: ListReservationsParams = {}): Promise<PaginatedReservations> => {
    const qs = new URLSearchParams();
    if (params.rentalUnitId) qs.set('rentalUnitId', params.rentalUnitId);
    if (params.startDate) qs.set('startDate', params.startDate);
    if (params.endDate) qs.set('endDate', params.endDate);
    if (params.page) qs.set('page', String(params.page));
    if (params.limit) qs.set('limit', String(params.limit));
    const query = qs.toString() ? `?${qs}` : '';
    return apiClient.get<PaginatedReservations>(`/reservations${query}`);
  },

  getById: (id: string): Promise<Reservation> =>
    apiClient.get<Reservation>(`/reservations/${id}`),

  create: (input: CreateReservationInput): Promise<Reservation> =>
    apiClient.post<Reservation>('/reservations', input),

  update: (id: string, input: UpdateReservationInput): Promise<Reservation> =>
    apiClient.patch<Reservation>(`/reservations/${id}`, input),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/reservations/${id}`),
};
