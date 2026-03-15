import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getRewardStatus, claimReward } from '../../services/rewards';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function mockSuccess(data: unknown) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(data) });
}

describe('rewards service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getRewardStatus sends GET with characterId', async () => {
    mockSuccess({
      characterId: 1, characterLevel: 2, race: 0,
      claims: [true, true, false, false, false, false, false, false, false, false],
    });

    const result = await getRewardStatus('tk', 1);

    expect(result.characterId).toBe(1);
    expect(result.claims[0]).toBe(true);
    expect(result.claims[2]).toBe(false);
    expect(mockFetch.mock.calls[0]![0]).toContain('/rewards/1');
  });

  it('claimReward sends POST with characterId and level', async () => {
    mockSuccess({ chest: { id: 10, questIndex: 2, questLevel: 0, percentage: 100, mintNFT: 1 } });

    const result = await claimReward('tk', { characterId: 1, level: 0 });

    expect(result.chest.id).toBe(10);
    expect(result.chest.percentage).toBe(100);
    const body = JSON.parse(mockFetch.mock.calls[0]![1].body);
    expect(body).toEqual({ characterId: 1, level: 0 });
  });

  it('claimReward throws on already claimed', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false, status: 400,
      json: () => Promise.resolve({ error: 'Already claimed' }),
    });
    await expect(claimReward('tk', { characterId: 1, level: 0 })).rejects.toThrow('Already claimed');
  });

  it('claimReward throws on level not reached', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false, status: 400,
      json: () => Promise.resolve({ error: 'Character has not reached this level' }),
    });
    await expect(claimReward('tk', { characterId: 1, level: 9 })).rejects.toThrow('Character has not reached this level');
  });
});
