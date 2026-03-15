export interface Chest {
  id: number;
  questIndex: number;
  questLevel: number;
  percentage: number;
  heroId: number;
  mintNFT: number;
  timeLock: number;
  hits: number[];
}

export interface ChestDrop {
  class: number;
  index: number;
  amount: number;
}

export interface OpenChestResponse {
  drops: ChestDrop[];
}
