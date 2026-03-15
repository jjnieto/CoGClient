import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCatalog, purchase } from '../../services/store';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('store service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getCatalog sends GET with token', async () => {
    const catalog = {
      characters: [{ itemIndex: 0, price: 200, name: 'Barbarian' }],
      equipment: [],
      potions: [],
      materials: [],
      recipes: [],
      cog: [],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(catalog),
    });

    const result = await getCatalog('my-token');

    expect(result).toEqual(catalog);
    const [url, options] = mockFetch.mock.calls[0]!;
    expect(url).toContain('/store');
    expect(options.headers['Authorization']).toBe('Bearer my-token');
  });

  it('purchase sends POST with class, storeIndex, amount', async () => {
    const response = { purchased: { class: 0, index: 0, amount: 1 }, cogSpent: 200, newBalance: 2300 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(response),
    });

    const result = await purchase('my-token', {
      class: 0,
      storeIndex: 0,
      amount: 1,
      characterName: 'Ragnar',
    });

    expect(result).toEqual(response);
    const [url, options] = mockFetch.mock.calls[0]!;
    expect(url).toContain('/store/purchase');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({
      class: 0,
      storeIndex: 0,
      amount: 1,
      characterName: 'Ragnar',
    });
  });

  it('purchase throws ApiError on insufficient COG', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 402,
      json: () => Promise.resolve({ error: 'Insufficient COG' }),
    });

    await expect(purchase('my-token', { class: 0, storeIndex: 0, amount: 1 })).rejects.toThrow('Insufficient COG');
  });
});
