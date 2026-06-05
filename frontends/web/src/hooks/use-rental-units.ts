import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rentalUnitApi } from "../api/rental-unit.api";
import type {
  CreateRentalUnitInput,
  UpdateRentalUnitInput,
} from "../api/types";

export const RENTAL_UNIT_KEYS = {
  all: ["rental-units"] as const,
  list: (search?: string) => ["rental-units", "list", search] as const,
  detail: (id: string) => ["rental-units", "detail", id] as const,
};

export const useRentalUnits = (search?: string) => {
  return useQuery({
    queryKey: RENTAL_UNIT_KEYS.list(search),
    queryFn: () => rentalUnitApi.list(search),
  });
};

export const useRentalUnitDetail = (id: string) => {
  return useQuery({
    queryKey: RENTAL_UNIT_KEYS.detail(id),
    queryFn: () => rentalUnitApi.getById(id),
    enabled: Boolean(id),
  });
};

export const useCreateRentalUnit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRentalUnitInput) => rentalUnitApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RENTAL_UNIT_KEYS.all });
    },
  });
};

export const useUpdateRentalUnit = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateRentalUnitInput) =>
      rentalUnitApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RENTAL_UNIT_KEYS.all });
    },
  });
};
