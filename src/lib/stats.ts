const CHARACTER_UPGRADE_MATRIX = [100, 180, 280, 400, 550];
const EQUIPMENT_UPGRADE_MATRIX = [100, 160, 240, 350, 500];
const EXPERIENCE_MATRIX = [10, 30, 80, 200, 500];

export function computeCharacterStat(baseStat: number, level: number): number {
  const multiplier = CHARACTER_UPGRADE_MATRIX[level] ?? 100;
  return Math.trunc((baseStat * multiplier) / 100);
}

export function computeEquipmentStat(baseStat: number, level: number): number {
  const multiplier = EQUIPMENT_UPGRADE_MATRIX[level] ?? 100;
  return Math.trunc((baseStat * multiplier) / 100);
}

export function xpForNextLevel(level: number): number | null {
  if (level >= 4) return null;
  return EXPERIENCE_MATRIX[level] ?? null;
}

export const STAT_NAMES = ['HP', 'ATK', 'DEF', 'DDG', 'MST', 'SPD', 'LCK', 'FTH'] as const;

export const RACE_NAMES = ['Barbarian', 'Rogue', 'Assassin', 'Dwarf'] as const;

export const SLOT_NAMES = [
  'Head', 'Neck', 'Chest', 'Belt', 'Legs',
  'Feet', 'Arms', 'Weapon', 'Off-hand', 'Ring', 'Mount',
] as const;

export { CHARACTER_UPGRADE_MATRIX, EQUIPMENT_UPGRADE_MATRIX, EXPERIENCE_MATRIX };
