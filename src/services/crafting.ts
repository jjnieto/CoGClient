import { apiClient } from './client';

export interface CraftItem {
  class: number;
  index: number;
  amount: number;
}

export interface CraftResponse {
  burned: CraftItem[];
  created: CraftItem[];
}

export function craft(token: string, recipeIndex: number): Promise<CraftResponse> {
  return apiClient<CraftResponse>('/crafting/craft', {
    method: 'POST',
    token,
    body: { recipeIndex },
  });
}
