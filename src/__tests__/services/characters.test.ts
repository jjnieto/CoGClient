import { describe, it, expect, beforeEach, vi } from 'vitest';
import { listCharacters, getCharacter, levelUp, usePotion, equipGear } from '../../services/characters';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const mockChar = {
  id: 1, name: 'Ragnar', race: 0, level: 0, experience: 0,
  vitality: 86400, lastVitalityUpdate: 1709900000, timeLock: 0,
  gear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  stats: { health: 3700, attack: 2000, defense: 450, dodge: 10, mastery: 10, speed: 10, luck: 0, faith: 0 },
};

function mockSuccess(data: unknown) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(data) });
}

describe('characters service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('listCharacters sends GET with token', async () => {
    mockSuccess([mockChar]);
    const result = await listCharacters('tk');
    expect(result).toEqual([mockChar]);
    expect(mockFetch.mock.calls[0]![0]).toContain('/characters');
    expect(mockFetch.mock.calls[0]![1].headers['Authorization']).toBe('Bearer tk');
  });

  it('getCharacter sends GET with id', async () => {
    mockSuccess(mockChar);
    const result = await getCharacter('tk', 1);
    expect(result).toEqual(mockChar);
    expect(mockFetch.mock.calls[0]![0]).toContain('/characters/1');
  });

  it('levelUp sends POST', async () => {
    mockSuccess({ ...mockChar, level: 1 });
    const result = await levelUp('tk', 1);
    expect(result.level).toBe(1);
    expect(mockFetch.mock.calls[0]![1].method).toBe('POST');
  });

  it('usePotion sends POST with potionIndex', async () => {
    mockSuccess(mockChar);
    await usePotion('tk', 1, 5);
    const body = JSON.parse(mockFetch.mock.calls[0]![1].body);
    expect(body).toEqual({ potionIndex: 5 });
  });

  it('equipGear sends PUT with gear array', async () => {
    const gear = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
    mockSuccess({ ...mockChar, gear });
    await equipGear('tk', 1, gear);
    expect(mockFetch.mock.calls[0]![1].method).toBe('PUT');
    const body = JSON.parse(mockFetch.mock.calls[0]![1].body);
    expect(body).toEqual({ gear });
  });
});
