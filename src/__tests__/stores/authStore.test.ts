import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../../stores/authStore';

const mockLocalStorage: Record<string, string> = {};

vi.stubGlobal('localStorage', {
  getItem: (key: string) => mockLocalStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockLocalStorage[key] = value; },
  removeItem: (key: string) => { delete mockLocalStorage[key]; },
});

describe('authStore', () => {
  beforeEach(() => {
    Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  });

  it('starts as not authenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('setAuth stores token and user', () => {
    const user = { id: 1, username: 'hero1', cogBalance: 500 };
    useAuthStore.getState().setAuth('test-token', user);

    const state = useAuthStore.getState();
    expect(state.token).toBe('test-token');
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(mockLocalStorage['token']).toBe('test-token');
  });

  it('setUser updates only user', () => {
    const user = { id: 1, username: 'hero1', cogBalance: 500 };
    useAuthStore.getState().setAuth('test-token', user);

    const updatedUser = { id: 1, username: 'hero1', cogBalance: 1000 };
    useAuthStore.getState().setUser(updatedUser);

    const state = useAuthStore.getState();
    expect(state.user?.cogBalance).toBe(1000);
    expect(state.token).toBe('test-token');
  });

  it('logout clears everything', () => {
    const user = { id: 1, username: 'hero1', cogBalance: 500 };
    useAuthStore.getState().setAuth('test-token', user);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(mockLocalStorage['token']).toBeUndefined();
  });
});
