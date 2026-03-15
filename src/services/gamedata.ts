import { apiClient } from './client';
import type {
  Hero,
  Enemy,
  Quest,
  EquipmentDef,
  Potion,
  Material,
  Recipe,
  ChestDef,
} from '../types/gamedata';

export function fetchHeroes(): Promise<Hero[]> {
  return apiClient<Hero[]>('/gamedata/heroes');
}

export function fetchEnemies(): Promise<Enemy[]> {
  return apiClient<Enemy[]>('/gamedata/enemies');
}

export function fetchQuests(): Promise<Quest[]> {
  return apiClient<Quest[]>('/gamedata/quests');
}

export function fetchEquipmentDefs(): Promise<EquipmentDef[]> {
  return apiClient<EquipmentDef[]>('/gamedata/equipment');
}

export function fetchPotions(): Promise<Potion[]> {
  return apiClient<Potion[]>('/gamedata/potions');
}

export function fetchMaterials(): Promise<Material[]> {
  return apiClient<Material[]>('/gamedata/materials');
}

export function fetchRecipes(): Promise<Recipe[]> {
  return apiClient<Recipe[]>('/gamedata/recipes');
}

export function fetchChestDefs(): Promise<ChestDef[]> {
  return apiClient<ChestDef[]>('/gamedata/chests');
}
