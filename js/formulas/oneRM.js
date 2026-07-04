/**
 * js/formulas/oneRM.js
 * Fórmulas de estimación de 1RM (una repetición máxima) a partir de
 * peso levantado y repeticiones realizadas hasta el fallo técnico.
 *
 * Todas las fórmulas son válidas aproximadamente entre 1 y 10-12 repeticiones;
 * por encima de ese rango el error de estimación crece considerablemente
 * porque empieza a pesar más la resistencia muscular que la fuerza máxima.
 *
 * Fuentes (ver REFERENCIAS.md para detalle completo):
 * - Epley, B. (1985). Poundage Chart. Boyd Epley Workout.
 * - Brzycki, M. (1993). Strength Testing—Predicting a One-Rep Max from
 *   Reps-to-Fatigue. Journal of Physical Education, Recreation & Dance, 64(1).
 * - Lander, J. (1985). Maximums Based on Reps. NSCA Journal, 6(6).
 * - Lombardi, V.P. (1989). Beginning Weight Training. Wm. C. Brown Publishers.
 * - Mayhew, J.L. et al. (1992). Muscular endurance repetitions to predict
 *   bench press strength in men of different training levels.
 *   Journal of Sports Medicine and Physical Fitness, 32(1).
 */

/** Valida los inputs comunes a todas las fórmulas de 1RM. */
function validate(weight, reps) {
  if (!Number.isFinite(weight) || weight <= 0) {
    throw new RangeError('El peso debe ser un número mayor a 0.');
  }
  if (!Number.isFinite(reps) || reps < 1 || !Number.isInteger(reps)) {
    throw new RangeError('Las repeticiones deben ser un entero mayor o igual a 1.');
  }
}

export function epley(weight, reps) {
  validate(weight, reps);
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

export function brzycki(weight, reps) {
  validate(weight, reps);
  if (reps === 1) return weight;
  // La fórmula diverge a partir de 37 repeticiones (denominador <= 0).
  if (reps >= 37) return NaN;
  return weight * (36 / (37 - reps));
}

export function lander(weight, reps) {
  validate(weight, reps);
  if (reps === 1) return weight;
  const denom = 101.3 - 2.67123 * reps;
  if (denom <= 0) return NaN;
  return (100 * weight) / denom;
}

export function lombardi(weight, reps) {
  validate(weight, reps);
  if (reps === 1) return weight;
  return weight * Math.pow(reps, 0.1);
}

export function mayhew(weight, reps) {
  validate(weight, reps);
  if (reps === 1) return weight;
  const denom = 52.2 + 41.9 * Math.exp(-0.055 * reps);
  return (100 * weight) / denom;
}

/**
 * Calcula las 5 estimaciones y su promedio.
 * @returns {{epley:number, brzycki:number, lander:number, lombardi:number, mayhew:number, average:number}}
 */
export function estimateOneRM(weight, reps) {
  validate(weight, reps);
  const results = {
    epley: epley(weight, reps),
    brzycki: brzycki(weight, reps),
    lander: lander(weight, reps),
    lombardi: lombardi(weight, reps),
    mayhew: mayhew(weight, reps),
  };
  const valid = Object.values(results).filter((v) => Number.isFinite(v));
  results.average = valid.length
    ? valid.reduce((a, b) => a + b, 0) / valid.length
    : NaN;
  return results;
}

/**
 * Tabla de referencia %1RM vs. repeticiones esperadas (tabla estándar
 * usada en literatura NSCA, coherente con la curva de Epley/Brzycki).
 */
export const PERCENT_1RM_TABLE = [
  { reps: 1, percent: 100 },
  { reps: 2, percent: 95 },
  { reps: 3, percent: 93 },
  { reps: 4, percent: 90 },
  { reps: 5, percent: 87 },
  { reps: 6, percent: 85 },
  { reps: 7, percent: 83 },
  { reps: 8, percent: 80 },
  { reps: 9, percent: 77 },
  { reps: 10, percent: 75 },
  { reps: 11, percent: 70 },
  { reps: 12, percent: 67 },
  { reps: 15, percent: 65 },
];

/** Genera la tabla de cargas de trabajo a partir de un 1RM dado. */
export function buildLoadTable(oneRM) {
  if (!Number.isFinite(oneRM) || oneRM <= 0) {
    throw new RangeError('El 1RM debe ser un número mayor a 0.');
  }
  return PERCENT_1RM_TABLE.map(({ reps, percent }) => ({
    reps,
    percent,
    load: Math.round(oneRM * (percent / 100) * 10) / 10,
  }));
}
