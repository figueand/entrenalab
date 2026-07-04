/**
 * js/formulas/strengthScore.js
 * Puntuaciones de fuerza relativa en powerlifting: DOTS y Wilks (clásico).
 * Ambas normalizan un total levantado (o un solo levantamiento) respecto
 * al peso corporal, para poder comparar atletas de distinto tamaño.
 *
 * Fuentes (ver REFERENCIAS.md):
 * - Konertz, T. (2019). DOTS Formula. Adoptada por USAPL/USPA/GPC.
 *   Polinomio de 4º grado ajustado con datos de competencia 2010-2018.
 * - Wilks, R. (1994). Wilks Coefficient. Fórmula clásica, polinomio de
 *   5º grado, estándar en powerlifting entre 1994 y ~2019.
 *
 * Límite de aplicación: ambas fórmulas fueron ajustadas con datos de
 * powerlifters adultos entrenados; fuera de ese rango de peso corporal
 * y nivel de entrenamiento, la estimación pierde precisión.
 */

const DOTS_COEFFICIENTS = {
  male: { a: -307.75076, b: 24.0900756, c: -0.1918759221, d: 0.0007391293, e: -0.000001093 },
  female: { a: -57.96288, b: 13.6175032, c: -0.1126655495, d: 0.0005158568, e: -0.0000010706 },
};

const WILKS_COEFFICIENTS = {
  male: {
    a: -216.0475144,
    b: 16.2606339,
    c: -0.002388645,
    d: -0.00113732,
    e: 7.01863e-6,
    f: -1.291e-8,
  },
  female: {
    a: 594.31747775582,
    b: -27.23842536447,
    c: 0.82112226871,
    d: -0.00930733913,
    e: 4.731582e-5,
    f: -9.054e-8,
  },
};

function validate(bodyWeight, total, sex) {
  if (!Number.isFinite(bodyWeight) || bodyWeight <= 0) {
    throw new RangeError('El peso corporal debe ser un número mayor a 0.');
  }
  if (!Number.isFinite(total) || total <= 0) {
    throw new RangeError('El total levantado debe ser un número mayor a 0.');
  }
  if (sex !== 'male' && sex !== 'female') {
    throw new RangeError('sex debe ser "male" o "female".');
  }
}

/** Puntuación DOTS. bodyWeight y total en kg. */
export function calculateDOTS(bodyWeight, total, sex) {
  validate(bodyWeight, total, sex);
  const { a, b, c, d, e } = DOTS_COEFFICIENTS[sex];
  const bw = bodyWeight;
  const denominator =
    a + b * bw + c * bw ** 2 + d * bw ** 3 + e * bw ** 4;
  return Math.round(((total * 500) / denominator) * 100) / 100;
}

/** Puntuación Wilks (clásica). bodyWeight y total en kg. */
export function calculateWilks(bodyWeight, total, sex) {
  validate(bodyWeight, total, sex);
  const { a, b, c, d, e, f } = WILKS_COEFFICIENTS[sex];
  const bw = bodyWeight;
  const denominator =
    a + b * bw + c * bw ** 2 + d * bw ** 3 + e * bw ** 4 + f * bw ** 5;
  const coefficient = 500 / denominator;
  return Math.round(total * coefficient * 100) / 100;
}

/** Niveles de referencia orientativos (no oficiales) para contextualizar un score. */
export const SCORE_LEVELS = [
  { max: 200, label: 'Principiante' },
  { max: 300, label: 'Novato' },
  { max: 400, label: 'Intermedio' },
  { max: 450, label: 'Avanzado' },
  { max: 500, label: 'Elite' },
  { max: Infinity, label: 'World Class' },
];

export function classifyScore(score) {
  const level = SCORE_LEVELS.find((l) => score < l.max);
  return level ? level.label : SCORE_LEVELS[SCORE_LEVELS.length - 1].label;
}
