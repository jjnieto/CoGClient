import { apiClient } from './client';
import type { Chest, OpenChestResponse } from '../types/chest';

export function listChests(token: string): Promise<Chest[]> {
  return apiClient<Chest[]>('/chests', { token });
}

export function openChest(token: string, id: number): Promise<OpenChestResponse> {
  return apiClient<OpenChestResponse>(`/chests/${id}/open`, {
    method: 'POST',
    token,
  });
}
