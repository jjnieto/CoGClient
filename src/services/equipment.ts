import { apiClient } from './client';
import type { Equipment } from '../types/equipment';

export function listEquipment(token: string): Promise<Equipment[]> {
  return apiClient<Equipment[]>('/equipment', { token });
}

export function upgradeEquipment(token: string, id: number): Promise<Equipment> {
  return apiClient<Equipment>(`/equipment/${id}/upgrade`, {
    method: 'POST',
    token,
  });
}
