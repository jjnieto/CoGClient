import { apiClient } from './client';
import type {
  CombatStartResponse,
  CombatActionResponse,
  CombatAutoResponse,
  CombatAction,
} from '../types/combat';

export interface StartCombatRequest {
  questIndex: number;
  characterId: number;
  questLevel: number;
  ambush: boolean;
}

export function startCombat(token: string, data: StartCombatRequest): Promise<CombatStartResponse> {
  return apiClient<CombatStartResponse>('/combat/start', {
    method: 'POST',
    token,
    body: data,
  });
}

export function submitAction(
  token: string,
  combatId: number,
  action: CombatAction,
  potionIndex?: number,
): Promise<CombatActionResponse> {
  return apiClient<CombatActionResponse>('/combat/action', {
    method: 'POST',
    token,
    body: { combatId, action, potionIndex: potionIndex ?? 0 },
  });
}

export function autoCombat(token: string, combatId: number): Promise<CombatAutoResponse> {
  return apiClient<CombatAutoResponse>('/combat/auto', {
    method: 'POST',
    token,
    body: { combatId },
  });
}

export function getCombatStatus(token: string, combatId: number): Promise<CombatStartResponse> {
  return apiClient<CombatStartResponse>(`/combat/status?combatId=${combatId}`, { token });
}
