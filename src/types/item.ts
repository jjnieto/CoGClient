export interface InventoryItem {
  index: number;
  quantity: number;
  tokenId: number;
}

export interface Inventory {
  potions: InventoryItem[];
  materials: InventoryItem[];
  recipes: InventoryItem[];
}
