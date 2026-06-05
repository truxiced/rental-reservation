export const ROUTES = {
  dashboard: '/',
  rentalUnits: '/rental-units',
  reservations: '/reservations',
  newReservation: '/reservations/new',
  editReservation: (id: string) => `/reservations/${id}/edit`,
} as const;
