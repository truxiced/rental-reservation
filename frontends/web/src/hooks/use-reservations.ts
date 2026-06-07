import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reservationApi } from "../api/reservation.api";
import type {
  CreateReservationInput,
  ListReservationsParams,
  UpdateReservationInput,
} from "../api/types";

export const RESERVATION_KEYS = {
  all: ["reservations"] as const,
  list: (params: ListReservationsParams) =>
    ["reservations", "list", params] as const,
  detail: (id: string) => ["reservations", "detail", id] as const,
};

export const useReservations = (params: ListReservationsParams = {}) => {
  return useQuery({
    queryKey: RESERVATION_KEYS.list(params),
    queryFn: () => reservationApi.list(params),
  });
};

export const useReservation = (id: string) => {
  return useQuery({
    queryKey: RESERVATION_KEYS.detail(id),
    queryFn: () => reservationApi.getById(id),
    enabled: Boolean(id),
  });
};

export const useCreateReservation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReservationInput) => reservationApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RESERVATION_KEYS.all });
      // Also invalidate rental unit details since occupancy status may have changed
      qc.invalidateQueries({ queryKey: ["rental-units"] });
    },
  });
};

export const useUpdateReservation = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateReservationInput) =>
      reservationApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RESERVATION_KEYS.all });
      // Also invalidate rental unit details since occupancy status may have changed
      qc.invalidateQueries({ queryKey: ["rental-units"] });
    },
  });
};

export const useDeleteReservation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reservationApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RESERVATION_KEYS.all });
      // Also invalidate rental unit details since occupancy status may have changed
      qc.invalidateQueries({ queryKey: ["rental-units"] });
    },
  });
};
