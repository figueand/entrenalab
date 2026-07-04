import { describe, it, expect } from 'vitest';
import { maxHeartRateTanaka, maxHeartRateClassic, calculateHeartRateZones } from '../js/formulas/heartRate.js';

describe('heartRate formulas', () => {
  it('maxHeartRateTanaka matches known formula', () => {
    // 208 - 0.7*30 = 187
    expect(maxHeartRateTanaka(30)).toBe(187);
  });

  it('maxHeartRateClassic matches known formula', () => {
    expect(maxHeartRateClassic(30)).toBe(190);
  });

  it('calculateHeartRateZones returns 5 increasing zones within range', () => {
    const zones = calculateHeartRateZones(190, 60);
    expect(zones).toHaveLength(5);
    expect(zones[0].minBpm).toBe(125); // (190-60)*0.5+60 = 125
    expect(zones[4].maxBpm).toBe(190);
    for (let i = 1; i < zones.length; i++) {
      expect(zones[i].minBpm).toBeGreaterThanOrEqual(zones[i - 1].minBpm);
    }
  });

  it('rejects resting HR >= max HR', () => {
    expect(() => calculateHeartRateZones(150, 160)).toThrow();
  });
});
