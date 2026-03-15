import { describe, it, expect, beforeEach, vi } from 'vitest';
import { craft } from '../../services/crafting';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('crafting service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('craft sends POST with recipeIndex', async () => {
    const response = {
      burned: [{ class: 3, index: 5, amount: 1 }],
      created: [{ class: 3, index: 11, amount: 1 }],
    };
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(response) });

    const result = await craft('tk', 1);

    expect(result.burned).toHaveLength(1);
    expect(result.created).toHaveLength(1);
    const [url, options] = mockFetch.mock.calls[0]!;
    expect(url).toContain('/crafting/craft');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({ recipeIndex: 1 });
  });

  it('throws on recipe not owned', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false, status: 402,
      json: () => Promise.resolve({ error: 'Recipe not owned' }),
    });
    await expect(craft('tk', 1)).rejects.toThrow('Recipe not owned');
  });

  it('throws on insufficient materials', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false, status: 402,
      json: () => Promise.resolve({ error: 'Insufficient materials' }),
    });
    await expect(craft('tk', 1)).rejects.toThrow('Insufficient materials');
  });
});
