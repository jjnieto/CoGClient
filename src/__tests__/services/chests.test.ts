import { describe, it, expect, beforeEach, vi } from 'vitest';
import { listChests, openChest } from '../../services/chests';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function mockSuccess(data: unknown) {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(data) });
}

describe('chests service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('listChests sends GET with token', async () => {
    const chests = [{ id: 5, questIndex: 0, questLevel: 0, percentage: 85, timeLock: 0 }];
    mockSuccess(chests);
    const result = await listChests('tk');
    expect(result).toEqual(chests);
    expect(mockFetch.mock.calls[0]![0]).toContain('/chests');
    expect(mockFetch.mock.calls[0]![1].headers['Authorization']).toBe('Bearer tk');
  });

  it('openChest sends POST and returns drops', async () => {
    const response = { drops: [{ class: 1, index: 9, amount: 1 }] };
    mockSuccess(response);
    const result = await openChest('tk', 5);
    expect(result.drops).toHaveLength(1);
    expect(result.drops[0]!.class).toBe(1);
    expect(mockFetch.mock.calls[0]![0]).toContain('/chests/5/open');
    expect(mockFetch.mock.calls[0]![1].method).toBe('POST');
  });

  it('openChest throws on locked chest', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false, status: 423,
      json: () => Promise.resolve({ error: 'Chest is locked' }),
    });
    await expect(openChest('tk', 5)).rejects.toThrow('Chest is locked');
  });
});
