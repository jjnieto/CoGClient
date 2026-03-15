import { describe, it, expect, beforeEach, vi } from 'vitest';
import { withdraw } from '../../services/faucet';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('faucet service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends POST with token and returns faucet response', async () => {
    const mockResponse = { amount: 500, totalWithdrawn: 500, newBalance: 500 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await withdraw('my-token');

    expect(result).toEqual(mockResponse);
    const [url, options] = mockFetch.mock.calls[0]!;
    expect(url).toContain('/faucet/withdraw');
    expect(options.method).toBe('POST');
    expect(options.headers['Authorization']).toBe('Bearer my-token');
  });

  it('throws ApiError when max withdrawal reached', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Max withdrawal reached' }),
    });

    await expect(withdraw('my-token')).rejects.toThrow('Max withdrawal reached');
  });
});
