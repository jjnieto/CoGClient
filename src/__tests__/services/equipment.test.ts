import { describe, it, expect, beforeEach, vi } from 'vitest';
import { listEquipment, upgradeEquipment } from '../../services/equipment';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function mockSuccess(data: unknown) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(data) });
}

const mockEq = {
  id: 12, class: 8, level: 0, equippedIn: 0, timeLock: 0,
  stats: { health: 0, attack: 2000, defense: 0, dodge: 0, mastery: 0, speed: 0, luck: 0, faith: 0 },
  definition: { name: 'Wooden Sword', slot: 7, rarity: 0, gearset: 1, icon: '' },
};

describe('equipment service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('listEquipment sends GET with token', async () => {
    mockSuccess([mockEq]);
    const result = await listEquipment('tk');
    expect(result).toEqual([mockEq]);
    expect(mockFetch.mock.calls[0]![0]).toContain('/equipment');
    expect(mockFetch.mock.calls[0]![1].headers['Authorization']).toBe('Bearer tk');
  });

  it('upgradeEquipment sends POST', async () => {
    mockSuccess({ ...mockEq, level: 1 });
    const result = await upgradeEquipment('tk', 12);
    expect(result.level).toBe(1);
    expect(mockFetch.mock.calls[0]![0]).toContain('/equipment/12/upgrade');
    expect(mockFetch.mock.calls[0]![1].method).toBe('POST');
  });

  it('upgradeEquipment throws on insufficient materials', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false, status: 402,
      json: () => Promise.resolve({ error: 'Insufficient materials' }),
    });
    await expect(upgradeEquipment('tk', 12)).rejects.toThrow('Insufficient materials');
  });
});
