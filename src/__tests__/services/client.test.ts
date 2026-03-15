import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiClient, ApiError } from '../../services/client';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('makes a GET request to the correct URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });

    const result = await apiClient('/auth/me');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/auth/me',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result).toEqual({ data: 'test' });
  });

  it('includes Authorization header when token is provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await apiClient('/characters', { token: 'my-token' });

    const callHeaders = mockFetch.mock.calls[0]![1]!.headers as Record<string, string>;
    expect(callHeaders['Authorization']).toBe('Bearer my-token');
  });

  it('sends JSON body on POST requests', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'abc' }),
    });

    await apiClient('/auth/login', {
      method: 'POST',
      body: { email: 'test@test.com', password: '123' },
    });

    const [, options] = mockFetch.mock.calls[0]!;
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.body).toBe('{"email":"test@test.com","password":"123"}');
  });

  it('throws ApiError with status and message on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Unauthenticated' }),
    });

    await expect(apiClient('/auth/me')).rejects.toThrow(ApiError);

    try {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 402,
        json: () => Promise.resolve({ error: 'Insufficient COG' }),
      });
      await apiClient('/store/purchase');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(402);
      expect((err as ApiError).message).toBe('Insufficient COG');
    }
  });

  it('handles non-JSON error responses gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('not json')),
    });

    try {
      await apiClient('/broken');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(500);
      expect((err as ApiError).message).toBe('Unknown error');
    }
  });

  it('does not include Content-Type header for GET requests', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await apiClient('/characters');

    const callHeaders = mockFetch.mock.calls[0]![1]!.headers as Record<string, string>;
    expect(callHeaders['Content-Type']).toBeUndefined();
  });
});
