export interface StoreItem {
  itemIndex: number;
  price: number;
  name: string;
}

export interface CogPack {
  amount: number;
  price: number;
}

export interface StoreCatalog {
  characters: StoreItem[];
  equipment: StoreItem[];
  potions: StoreItem[];
  materials: StoreItem[];
  recipes: StoreItem[];
  cog: CogPack[];
}

export interface PurchaseRequest {
  class: number;
  storeIndex: number;
  amount: number;
  characterName?: string;
}

export interface PurchaseResponse {
  purchased: { class: number; index: number; amount: number };
  cogSpent: number;
  newBalance: number;
}
