import { describe, it, expect } from 'vitest';
import { calculateDOTS, calculateWilks, classifyScore } from '../js/formulas/strengthScore.js';

describe('strengthScore formulas', () => {
  it('calculateDOTS returns a plausible score for a mid-weight male lifter', () => {
    // 90kg BW, 700kg total → alrededor de 460-480 DOTS
    const score = calculateDOTS(90, 700, 'male');
    expect(score).toBeGreaterThan(400);
    expect(score).toBeLessThan(520);
  });

  it('calculateWilks returns a plausible score for the same lifter', () => {
    const score = calculateWilks(90, 700, 'male');
    expect(score).toBeGreaterThan(400);
    expect(score).toBeLessThan(520);
  });

  it('DOTS and Wilks stay in the same ballpark for mid bodyweights', () => {
    const dots = calculateDOTS(80, 600, 'female');
    const wilks = calculateWilks(80, 600, 'female');
    expect(Math.abs(dots - wilks)).toBeLessThan(60);
  });

  it('rejects invalid sex', () => {
    expect(() => calculateDOTS(80, 500, 'other')).toThrow();
  });

  it('classifyScore maps ranges to labels', () => {
    expect(classifyScore(150)).toBe('Principiante');
    expect(classifyScore(550)).toBe('World Class');
  });
});
