import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fetchHeroes,
  fetchEnemies,
  fetchQuests,
  fetchEquipmentDefs,
  fetchPotions,
  fetchMaterials,
  fetchRecipes,
  fetchChestDefs,
} from '../../services/gamedata';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function mockSuccess(data: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

describe('gamedata service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchHeroes calls /gamedata/heroes without auth', async () => {
    const heroes = [{ id: 0, name: 'Barbarian', stats: [3700, 2000, 450, 10, 10, 10, 0, 0] }];
    mockSuccess(heroes);

    const result = await fetchHeroes();

    expect(result).toEqual(heroes);
    const [url, options] = mockFetch.mock.calls[0]!;
    expect(url).toContain('/gamedata/heroes');
    expect(options.headers['Authorization']).toBeUndefined();
  });

  it('fetchEnemies calls /gamedata/enemies', async () => {
    mockSuccess([{ id: 1, name: 'Rat plague' }]);
    const result = await fetchEnemies();
    expect(result[0]!.name).toBe('Rat plague');
    expect(mockFetch.mock.calls[0]![0]).toContain('/gamedata/enemies');
  });

  it('fetchQuests calls /gamedata/quests', async () => {
    mockSuccess([{ id: 0, name: 'Clean the Black Harpy' }]);
    const result = await fetchQuests();
    expect(result[0]!.name).toBe('Clean the Black Harpy');
    expect(mockFetch.mock.calls[0]![0]).toContain('/gamedata/quests');
  });

  it('fetchEquipmentDefs calls /gamedata/equipment', async () => {
    mockSuccess([{ id: 8, name: 'Wooden Sword', slot: 7 }]);
    const result = await fetchEquipmentDefs();
    expect(result[0]!.name).toBe('Wooden Sword');
    expect(mockFetch.mock.calls[0]![0]).toContain('/gamedata/equipment');
  });

  it('fetchPotions calls /gamedata/potions', async () => {
    mockSuccess([{ id: 1, name: 'Basic health potion' }]);
    const result = await fetchPotions();
    expect(result[0]!.name).toBe('Basic health potion');
    expect(mockFetch.mock.calls[0]![0]).toContain('/gamedata/potions');
  });

  it('fetchMaterials calls /gamedata/materials', async () => {
    mockSuccess([{ id: 5, name: 'Copper' }]);
    const result = await fetchMaterials();
    expect(result[0]!.name).toBe('Copper');
    expect(mockFetch.mock.calls[0]![0]).toContain('/gamedata/materials');
  });

  it('fetchRecipes calls /gamedata/recipes', async () => {
    mockSuccess([{ id: 1, name: 'Bronze Recipe' }]);
    const result = await fetchRecipes();
    expect(result[0]!.name).toBe('Bronze Recipe');
    expect(mockFetch.mock.calls[0]![0]).toContain('/gamedata/recipes');
  });

  it('fetchChestDefs calls /gamedata/chests', async () => {
    mockSuccess([{ id: 0, name: 'Equipped Rogue' }]);
    const result = await fetchChestDefs();
    expect(result[0]!.name).toBe('Equipped Rogue');
    expect(mockFetch.mock.calls[0]![0]).toContain('/gamedata/chests');
  });
});
