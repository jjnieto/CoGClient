import { describe, it, expect, beforeEach, vi } from 'vitest';
import { register, login, getMe } from '../../services/auth';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('auth service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('sends POST with username, email, password and returns auth response', async () => {
      const mockResponse = {
        token: '1|abc123',
        user: { id: 1, username: 'hero1', cogBalance: 0 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await register({
        username: 'hero1',
        email: 'hero1@test.com',
        password: 'password123',
      });

      expect(result).toEqual(mockResponse);
      const [url, options] = mockFetch.mock.calls[0]!;
      expect(url).toContain('/auth/register');
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual({
        username: 'hero1',
        email: 'hero1@test.com',
        password: 'password123',
      });
    });
  });

  describe('login', () => {
    it('sends POST with email and password and returns auth response', async () => {
      const mockResponse = {
        token: '2|xyz789',
        user: { id: 1, username: 'hero1', cogBalance: 500 },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await login({ email: 'hero1@test.com', password: 'password123' });

      expect(result).toEqual(mockResponse);
      const [url, options] = mockFetch.mock.calls[0]!;
      expect(url).toContain('/auth/login');
      expect(options.method).toBe('POST');
    });
  });

  describe('getMe', () => {
    it('sends GET with token and returns user data', async () => {
      const mockUser = { id: 1, username: 'hero1', cogBalance: 1500, isAdmin: false };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser),
      });

      const result = await getMe('my-token');

      expect(result).toEqual(mockUser);
      const [url, options] = mockFetch.mock.calls[0]!;
      expect(url).toContain('/auth/me');
      expect(options.headers['Authorization']).toBe('Bearer my-token');
    });
  });
});
