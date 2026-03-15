export interface RewardStatus {
  characterId: number;
  characterLevel: number;
  race: number;
  claims: boolean[];
}

export interface ClaimRewardRequest {
  characterId: number;
  level: number;
}

export interface ClaimRewardResponse {
  chest: {
    id: number;
    questIndex: number;
    questLevel: number;
    percentage: number;
    mintNFT: number;
  };
}
