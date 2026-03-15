export interface QuestDrop {
  classDrop: number;
  itemDrop: number;
  amount: number;
  rangeMax: number;
}

export interface QuestInfo {
  index: number;
  name: string;
  description: string;
  icon: string;
  season: number;
  order: number;
  vitalityCost: number;
  enemyIndex: number;
  travelTime: number;
  missionTime: number;
  luck: number;
  experience: number;
  drops: QuestDrop[];
}

export interface PlayQuestRequest {
  questIndex: number;
  characterId: number;
  questLevel: number;
  potionId: number;
}

export interface QuestChest {
  id: number;
  questIndex: number;
  questLevel: number;
  percentage: number;
  mintNFT: number;
  timeLock: number;
  hits: number[];
}

export interface GuaranteedDrop {
  class: number;
  index: number;
  amount: number;
}

export interface PlayQuestResponse {
  levelUp: boolean;
  experience: number;
  newLevel: number;
  combatPercentage: number;
  missionTime: number;
  chest: QuestChest | null;
  guaranteedDrops: GuaranteedDrop[];
}
