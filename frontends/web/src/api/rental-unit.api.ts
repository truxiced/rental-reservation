import { apiClient } from './client';
import type {
  RentalUnit,
  RentalUnitDetail,
  CreateRentalUnitInput,
  UpdateRentalUnitInput,
} from './types';

export const rentalUnitApi = {
  list: (search?: string): Promise<RentalUnit[]> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiClient.get<RentalUnit[]>(`/rental-units${params}`);
  },

  getById: (id: string): Promise<RentalUnitDetail> =>
    apiClient.get<RentalUnitDetail>(`/rental-units/${id}`),

  create: (input: CreateRentalUnitInput): Promise<RentalUnit> =>
    apiClient.post<RentalUnit>('/rental-units', input),

  update: (id: string, input: UpdateRentalUnitInput): Promise<RentalUnit> =>
    apiClient.patch<RentalUnit>(`/rental-units/${id}`, input),
};
