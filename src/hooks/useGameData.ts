import { useQuery } from '@tanstack/react-query';
import {
  fetchHeroes,
  fetchEnemies,
  fetchQuests,
  fetchEquipmentDefs,
  fetchPotions,
  fetchMaterials,
  fetchRecipes,
  fetchChestDefs,
} from '../services/gamedata';

const STATIC_QUERY_OPTIONS = {
  staleTime: Infinity,
  gcTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
} as const;

export function useHeroes() {
  return useQuery({
    queryKey: ['gamedata', 'heroes'],
    queryFn: fetchHeroes,
    ...STATIC_QUERY_OPTIONS,
  });
}

export function useEnemies() {
  return useQuery({
    queryKey: ['gamedata', 'enemies'],
    queryFn: fetchEnemies,
    ...STATIC_QUERY_OPTIONS,
  });
}

export function useQuests() {
  return useQuery({
    queryKey: ['gamedata', 'quests'],
    queryFn: fetchQuests,
    ...STATIC_QUERY_OPTIONS,
  });
}

export function useEquipmentDefs() {
  return useQuery({
    queryKey: ['gamedata', 'equipment'],
    queryFn: fetchEquipmentDefs,
    ...STATIC_QUERY_OPTIONS,
  });
}

export function usePotions() {
  return useQuery({
    queryKey: ['gamedata', 'potions'],
    queryFn: fetchPotions,
    ...STATIC_QUERY_OPTIONS,
  });
}

export function useMaterials() {
  return useQuery({
    queryKey: ['gamedata', 'materials'],
    queryFn: fetchMaterials,
    ...STATIC_QUERY_OPTIONS,
  });
}

export function useRecipes() {
  return useQuery({
    queryKey: ['gamedata', 'recipes'],
    queryFn: fetchRecipes,
    ...STATIC_QUERY_OPTIONS,
  });
}

export function useChestDefs() {
  return useQuery({
    queryKey: ['gamedata', 'chests'],
    queryFn: fetchChestDefs,
    ...STATIC_QUERY_OPTIONS,
  });
}
