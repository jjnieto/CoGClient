import { apiClient } from './client';
import type { Character } from '../types/character';

export function listCharacters(token: string): Promise<Character[]> {
  return apiClient<Character[]>('/characters', { token });
}

export function getCharacter(token: string, id: number): Promise<Character> {
  return apiClient<Character>(`/characters/${id}`, { token });
}

export function levelUp(token: string, id: number): Promise<Character> {
  return apiClient<Character>(`/characters/${id}/level-up`, {
    method: 'POST',
    token,
  });
}

export function usePotion(token: string, id: number, potionIndex: number): Promise<Character> {
  return apiClient<Character>(`/characters/${id}/use-potion`, {
    method: 'POST',
    token,
    body: { potionIndex },
  });
}

export function equipGear(token: string, id: number, gear: number[]): Promise<Character> {
  return apiClient<Character>(`/characters/${id}/equip`, {
    method: 'PUT',
    token,
    body: { gear },
  });
}
