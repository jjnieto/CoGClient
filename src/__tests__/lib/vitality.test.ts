import { describe, it, expect } from 'vitest';
import { computeCurrentVitality, formatVitality, MAX_VITALITY } from '../../lib/vitality';

describe('vitality', () => {
  it('computes vitality with elapsed time', () => {
    const stored = 50000;
    const lastUpdate = 1000;
    const now = 1100; // 100 seconds later
    expect(computeCurrentVitality(stored, lastUpdate, now)).toBe(50100);
  });

  it('caps vitality at MAX_VITALITY', () => {
    expect(computeCurrentVitality(86000, 1000, 2000)).toBe(MAX_VITALITY);
  });

  it('returns stored vitality when no time elapsed', () => {
    expect(computeCurrentVitality(50000, 1000, 1000)).toBe(50000);
  });

  it('handles full regen from 0', () => {
    // 86400 seconds = full regen
    expect(computeCurrentVitality(0, 0, 86400)).toBe(MAX_VITALITY);
  });

  it('does not go below stored vitality', () => {
    // Even with lastUpdate in the future, elapsed should be 0
    expect(computeCurrentVitality(50000, 2000, 1000)).toBe(50000);
  });

  it('formatVitality formats correctly', () => {
    expect(formatVitality(3661)).toBe('1h 1m 1s');
    expect(formatVitality(0)).toBe('0h 0m 0s');
    expect(formatVitality(86400)).toBe('24h 0m 0s');
  });
});
