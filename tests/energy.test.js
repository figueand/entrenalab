import { describe, it, expect } from 'vitest';
import { calculateBMR, calculateTDEE, calculateGoalCalories, calculateMacros } from '../js/formulas/energy.js';

describe('energy formulas', () => {
  it('calculateBMR matches Mifflin-St Jeor for a known case (male)', () => {
    // 80kg, 180cm, 30 años → 10*80 + 6.25*180 - 5*30 + 5 = 1780
    expect(calculateBMR(80, 180, 30, 'male')).toBe(1780);
  });

  it('calculateBMR matches Mifflin-St Jeor for a known case (female)', () => {
    // 60kg, 165cm, 25 años → 10*60 + 6.25*165 - 5*25 - 161 = 1345.25 → 1345
    expect(calculateBMR(60, 165, 25, 'female')).toBe(1345);
  });

  it('calculateTDEE applies the activity multiplier', () => {
    expect(calculateTDEE(1780, 'sedentary')).toBe(Math.round(1780 * 1.2));
    expect(calculateTDEE(1780, 'moderate')).toBe(Math.round(1780 * 1.55));
  });

  it('calculateGoalCalories adjusts for the selected goal', () => {
    expect(calculateGoalCalories(2500, 'loss')).toBe(2000);
    expect(calculateGoalCalories(2500, 'maintenance')).toBe(2500);
    expect(calculateGoalCalories(2500, 'gain')).toBe(2750);
  });

  it('calculateMacros splits calories consistently with the total', () => {
    const macros = calculateMacros(2500, 80);
    const sum = macros.protein.kcal + macros.fat.kcal + macros.carbs.kcal;
    expect(sum).toBe(macros.totalKcal);
    expect(macros.protein.grams).toBe(144); // 1.8 * 80
  });

  it('rejects invalid inputs', () => {
    expect(() => calculateBMR(0, 180, 30, 'male')).toThrow();
    expect(() => calculateTDEE(1800, 'invalid')).toThrow();
  });
});
