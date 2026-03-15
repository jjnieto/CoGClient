import { apiClient } from './client';
import type { RewardStatus, ClaimRewardRequest, ClaimRewardResponse } from '../types/rewards';

export function getRewardStatus(token: string, characterId: number): Promise<RewardStatus> {
  return apiClient<RewardStatus>(`/rewards/${characterId}`, { token });
}

export function claimReward(token: string, data: ClaimRewardRequest): Promise<ClaimRewardResponse> {
  return apiClient<ClaimRewardResponse>('/rewards/claim', {
    method: 'POST',
    token,
    body: data,
  });
}
