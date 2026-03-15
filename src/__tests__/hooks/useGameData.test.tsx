import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useHeroes, useEnemies, usePotions } from '../../hooks/useGameData';

vi.mock('../../services/gamedata', () => ({
  fetchHeroes: vi.fn(),
  fetchEnemies: vi.fn(),
  fetchQuests: vi.fn(),
  fetchEquipmentDefs: vi.fn(),
  fetchPotions: vi.fn(),
  fetchMaterials: vi.fn(),
  fetchRecipes: vi.fn(),
  fetchChestDefs: vi.fn(),
}));

import { fetchHeroes, fetchEnemies, fetchPotions } from '../../services/gamedata';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useGameData hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useHeroes fetches and returns heroes', async () => {
    const heroes = [{ id: 0, name: 'Barbarian', stats: [3700, 2000, 450, 10, 10, 10, 0, 0] }];
    vi.mocked(fetchHeroes).mockResolvedValueOnce(heroes as never);

    const { result } = renderHook(() => useHeroes(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(heroes);
  });

  it('useEnemies fetches and returns enemies', async () => {
    const enemies = [{ id: 1, name: 'Rat plague', stats: [5000, 2100, 500] }];
    vi.mocked(fetchEnemies).mockResolvedValueOnce(enemies as never);

    const { result } = renderHook(() => useEnemies(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(enemies);
  });

  it('usePotions fetches and returns potions', async () => {
    const potions = [{ id: 1, name: 'Basic health potion', statToBoost: [0], boost: [5000] }];
    vi.mocked(fetchPotions).mockResolvedValueOnce(potions as never);

    const { result } = renderHook(() => usePotions(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(potions);
  });

  it('handles fetch error', async () => {
    vi.mocked(fetchHeroes).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useHeroes(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Network error');
  });
});
