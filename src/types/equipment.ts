import type { CharacterStats } from './character';

export interface EquipmentDefinition {
  name: string;
  slot: number;
  rarity: number;
  gearset: number;
  icon: string;
}

export interface Equipment {
  id: number;
  class: number;
  level: number;
  equippedIn: number;
  timeLock: number;
  stats: CharacterStats;
  definition: EquipmentDefinition;
}
