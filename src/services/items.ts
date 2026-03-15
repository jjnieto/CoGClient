import { apiClient } from './client';
import type { Inventory } from '../types/item';

export function getInventory(token: string): Promise<Inventory> {
  return apiClient<Inventory>('/items', { token });
}
