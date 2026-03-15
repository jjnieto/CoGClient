import { describe, it, expect } from 'vitest';
import {
  computeCharacterStat,
  computeEquipmentStat,
  xpForNextLevel,
} from '../../lib/stats';

describe('stats', () => {
  it('computes character stat at level 0 (100%)', () => {
    expect(computeCharacterStat(2000, 0)).toBe(2000);
  });

  it('computes character stat at level 2 (280%)', () => {
    expect(computeCharacterStat(2000, 2)).toBe(5600);
  });

  it('computes character stat at level 4 (550%)', () => {
    expect(computeCharacterStat(2000, 4)).toBe(11000);
  });

  it('uses integer division (truncation)', () => {
    // 3 * 150 / 100 = 4.5 → should truncate to 4
    expect(computeCharacterStat(3, 1)).toBe(5); // 3 * 180 / 100 = 5.4 → 5
    expect(computeCharacterStat(1, 1)).toBe(1); // 1 * 180 / 100 = 1.8 → 1
  });

  it('computes equipment stat at level 0 (100%)', () => {
    expect(computeEquipmentStat(2000, 0)).toBe(2000);
  });

  it('computes equipment stat at level 3 (350%)', () => {
    expect(computeEquipmentStat(2000, 3)).toBe(7000);
  });

  it('xpForNextLevel returns correct values', () => {
    expect(xpForNextLevel(0)).toBe(10);
    expect(xpForNextLevel(1)).toBe(30);
    expect(xpForNextLevel(2)).toBe(80);
    expect(xpForNextLevel(3)).toBe(200);
    expect(xpForNextLevel(4)).toBeNull(); // max level
  });
});
