export interface Hero {
  id: number;
  name: string;
  description: string;
  stats: number[]; // [HP, ATK, DEF, DDG, MST, SPD, LCK, FTH]
  icon: string;
}

export interface Enemy {
  id: number;
  name: string;
  description: string;
  stats: number[]; // [HP, ATK, DEF]
  icon: string;
}

export interface Quest {
  id: number;
  name: string;
  description: string;
  icon: string;
  stats: [
    number,    // 0: unused
    number,    // 1: enemyId
    number,    // 2: vitalityCost
    number,    // 3: baseXP
    number[],  // 4: [travelTime, missionTime, luck, questLevel]
    number[],  // 5: drop classes
    number[],  // 6: drop itemIndexes
    number[],  // 7: drop amounts
    number[],  // 8: drop rangeMax (cumulative)
  ];
}

export interface EquipmentDef {
  id: number;
  name: string;
  description: string;
  slot: number;
  rarity: number;
  gearset: number;
  stats: number[]; // [HP, ATK, DEF, DDG, MST, SPD, LCK, FTH]
  icon: string;
}

export interface Potion {
  id: number;
  name: string;
  description: string;
  statToBoost: number[];
  boost: number[];
  icon: string;
}

export interface Material {
  id: number;
  name: string;
  description: string;
  ownValue: number;
  icon: string;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  classToBurn: number[];
  itemToBurn: number[];
  amountToBurn: number[];
  classToMint: number[];
  itemToMint: number[];
  amountToMint: number[];
  icon: string;
}

export interface ChestDef {
  id: number;
  name: string;
  description: string;
  questId: number;
  icon: string;
}
