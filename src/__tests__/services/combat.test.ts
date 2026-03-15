import { describe, it, expect, beforeEach, vi } from 'vitest';
import { startCombat, submitAction, autoCombat, getCombatStatus } from '../../services/combat';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function mockSuccess(data: unknown) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(data) });
}

describe('combat service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('startCombat sends POST with quest params', async () => {
    mockSuccess({ combatId: 42, status: 'active', initiative: 'player' });
    const result = await startCombat('tk', { questIndex: 0, characterId: 1, questLevel: 0, ambush: false });
    expect(result.combatId).toBe(42);
    const body = JSON.parse(mockFetch.mock.calls[0]![1].body);
    expect(body).toEqual({ questIndex: 0, characterId: 1, questLevel: 0, ambush: false });
  });

  it('submitAction sends POST with combatId and action', async () => {
    mockSuccess({ combatId: 42, round: 2, status: 'active', turnResult: {} });
    await submitAction('tk', 42, 'attack_normal');
    const body = JSON.parse(mockFetch.mock.calls[0]![1].body);
    expect(body).toEqual({ combatId: 42, action: 'attack_normal', potionIndex: 0 });
  });

  it('submitAction with potion sends potionIndex', async () => {
    mockSuccess({ combatId: 42, round: 2, status: 'active', turnResult: {} });
    await submitAction('tk', 42, 'potion', 1);
    const body = JSON.parse(mockFetch.mock.calls[0]![1].body);
    expect(body.potionIndex).toBe(1);
  });

  it('autoCombat sends POST with combatId', async () => {
    mockSuccess({ combatId: 42, rounds: [], status: 'won', result: {} });
    const result = await autoCombat('tk', 42);
    expect(result.status).toBe('won');
    expect(mockFetch.mock.calls[0]![0]).toContain('/combat/auto');
  });

  it('getCombatStatus sends GET', async () => {
    mockSuccess({ combatId: 42, status: 'active' });
    await getCombatStatus('tk', 42);
    expect(mockFetch.mock.calls[0]![0]).toContain('/combat/status?combatId=42');
  });

  it('startCombat throws on locked character', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false, status: 423,
      json: () => Promise.resolve({ error: 'Character is locked' }),
    });
    await expect(startCombat('tk', { questIndex: 0, characterId: 1, questLevel: 0, ambush: false }))
      .rejects.toThrow('Character is locked');
  });
});
