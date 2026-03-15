import { describe, it, expect, beforeEach, vi } from 'vitest';
import { listQuests, playQuest } from '../../services/quests';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function mockSuccess(data: unknown) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(data) });
}

describe('quests service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('listQuests sends GET with token', async () => {
    mockSuccess([{ index: 0, name: 'Clean the Black Harpy' }]);
    const result = await listQuests('tk');
    expect(result[0]!.name).toBe('Clean the Black Harpy');
    expect(mockFetch.mock.calls[0]![0]).toContain('/quests');
    expect(mockFetch.mock.calls[0]![1].headers['Authorization']).toBe('Bearer tk');
  });

  it('playQuest sends POST with quest params', async () => {
    const response = {
      levelUp: false, experience: 1, newLevel: 0,
      combatPercentage: 85, missionTime: 6,
      chest: null, guaranteedDrops: [],
    };
    mockSuccess(response);

    const result = await playQuest('tk', {
      questIndex: 0, characterId: 1, questLevel: 0, potionId: 0,
    });

    expect(result.combatPercentage).toBe(85);
    const body = JSON.parse(mockFetch.mock.calls[0]![1].body);
    expect(body).toEqual({ questIndex: 0, characterId: 1, questLevel: 0, potionId: 0 });
  });

  it('playQuest throws on locked character', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false, status: 423,
      json: () => Promise.resolve({ error: 'Character is locked' }),
    });
    await expect(playQuest('tk', { questIndex: 0, characterId: 1, questLevel: 0, potionId: 0 }))
      .rejects.toThrow('Character is locked');
  });

  it('playQuest throws on insufficient vitality', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false, status: 402,
      json: () => Promise.resolve({ error: 'Insufficient vitality' }),
    });
    await expect(playQuest('tk', { questIndex: 7, characterId: 1, questLevel: 0, potionId: 0 }))
      .rejects.toThrow('Insufficient vitality');
  });
});
