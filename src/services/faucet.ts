import { apiClient } from './client';
import type { FaucetResponse } from '../types/faucet';

export function withdraw(token: string): Promise<FaucetResponse> {
  return apiClient<FaucetResponse>('/faucet/withdraw', {
    method: 'POST',
    token,
  });
}
