import { apiClient } from './client';
import type { StoreCatalog, PurchaseRequest, PurchaseResponse } from '../types/store';

export function getCatalog(token: string): Promise<StoreCatalog> {
  return apiClient<StoreCatalog>('/store', { token });
}

export function purchase(token: string, data: PurchaseRequest): Promise<PurchaseResponse> {
  return apiClient<PurchaseResponse>('/store/purchase', {
    method: 'POST',
    token,
    body: data,
  });
}
