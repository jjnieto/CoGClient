import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getInventory } from '../../services/items';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('items service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getInventory sends GET with token and returns grouped items', async () => {
    const inventory = {
      potions: [{ index: 1, quantity: 5, tokenId: 1 }],
      materials: [{ index: 5, quantity: 10, tokenId: 10005 }],
      recipes: [{ index: 2, quantity: 1, tokenId: 20002 }],
    };
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(inventory) });

    const result = await getInventory('tk');

    expect(result).toEqual(inventory);
    expect(mockFetch.mock.calls[0]![0]).toContain('/items');
    expect(mockFetch.mock.calls[0]![1].headers['Authorization']).toBe('Bearer tk');
  });

  it('returns empty arrays for new user', async () => {
    const inventory = { potions: [], materials: [], recipes: [] };
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(inventory) });

    const result = await getInventory('tk');

    expect(result.potions).toHaveLength(0);
    expect(result.materials).toHaveLength(0);
    expect(result.recipes).toHaveLength(0);
  });
});
