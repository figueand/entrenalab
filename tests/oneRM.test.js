import { describe, it, expect } from 'vitest';
import { epley, brzycki, lander, lombardi, mayhew, estimateOneRM, buildLoadTable } from '../js/formulas/oneRM.js';

describe('oneRM formulas', () => {
  it('returns the weight itself when reps = 1', () => {
    expect(epley(100, 1)).toBe(100);
    expect(brzycki(100, 1)).toBe(100);
    expect(lander(100, 1)).toBe(100);
    expect(lombardi(100, 1)).toBe(100);
    expect(mayhew(100, 1)).toBe(100);
  });

  it('epley(100, 10) matches known value', () => {
    // 100 * (1 + 10/30) = 133.33
    expect(epley(100, 10)).toBeCloseTo(133.33, 1);
  });

  it('brzycki(100, 10) matches known value', () => {
    // 100 * 36/27 = 133.33
    expect(brzycki(100, 10)).toBeCloseTo(133.33, 1);
  });

  it('brzycki diverges gracefully at reps >= 37', () => {
    expect(Number.isNaN(brzycki(100, 37))).toBe(true);
  });

  it('rejects invalid inputs', () => {
    expect(() => epley(0, 5)).toThrow();
    expect(() => epley(100, 0)).toThrow();
    expect(() => epley(100, 5.5)).toThrow();
  });

  it('estimateOneRM returns all 5 formulas plus an average', () => {
    const result = estimateOneRM(100, 8);
    expect(result).toHaveProperty('epley');
    expect(result).toHaveProperty('brzycki');
    expect(result).toHaveProperty('lander');
    expect(result).toHaveProperty('lombardi');
    expect(result).toHaveProperty('mayhew');
    expect(result.average).toBeGreaterThan(100);
  });

  it('buildLoadTable scales correctly off a 100kg 1RM', () => {
    const table = buildLoadTable(100);
    const row1 = table.find((r) => r.reps === 1);
    expect(row1.load).toBe(100);
    const row10 = table.find((r) => r.reps === 10);
    expect(row10.load).toBe(75);
  });
});
