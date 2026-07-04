/**
 * js/formulas/heartRate.js
 * Frecuencia cardíaca máxima (FCmáx) y zonas de entrenamiento por el
 * método de Karvonen (frecuencia cardíaca de reserva).
 *
 * Fuentes (ver REFERENCIAS.md):
 * - Tanaka, H., Monahan, K.D., Seals, D.R. (2001). Age-predicted maximal
 *   heart rate revisited. Journal of the American College of Cardiology,
 *   37(1), 153-156. → FCmáx = 208 - 0.7 × edad (más precisa en adultos).
 * - Fox, S.M., Naughton, J.P., Haskell, W.L. (1971). Physical activity
 *   and the prevention of coronary heart disease. → FCmáx = 220 - edad
 *   (fórmula "clásica", ampliamente usada pero con mayor margen de error).
 * - Karvonen, M.J., Kentala, E., Mustala, O. (1957). The effects of
 *   training on heart rate: a longitudinal study. Annales Medicinae
 *   Experimentalis et Biologiae Fenniae, 35(3), 307-315.
 *
 * Límite de aplicación: estimaciones poblacionales con desviación estándar
 * de ±7-10 lpm; no reemplazan una prueba de esfuerzo con medición directa.
 */

function validateAge(age) {
  if (!Number.isFinite(age) || age <= 0) {
    throw new RangeError('La edad debe ser un número mayor a 0.');
  }
}

/** FCmáx según Tanaka et al. (2001). */
export function maxHeartRateTanaka(age) {
  validateAge(age);
  return Math.round(208 - 0.7 * age);
}

/** FCmáx según fórmula clásica de Fox et al. (1971). */
export function maxHeartRateClassic(age) {
  validateAge(age);
  return Math.round(220 - age);
}

/** Zonas de intensidad (% de frecuencia cardíaca de reserva) por método Karvonen. */
export const HR_ZONES = [
  { zone: 1, label: 'Muy ligera / recuperación', min: 0.5, max: 0.6 },
  { zone: 2, label: 'Ligera / resistencia base', min: 0.6, max: 0.7 },
  { zone: 3, label: 'Moderada / aeróbica', min: 0.7, max: 0.8 },
  { zone: 4, label: 'Intensa / umbral', min: 0.8, max: 0.9 },
  { zone: 5, label: 'Máxima / anaeróbica', min: 0.9, max: 1.0 },
];

/**
 * Calcula las 5 zonas de FC de entrenamiento por el método de Karvonen:
 * FC objetivo = ((FCmáx - FCreposo) × %intensidad) + FCreposo
 */
export function calculateHeartRateZones(maxHR, restingHR) {
  if (!Number.isFinite(maxHR) || maxHR <= 0) {
    throw new RangeError('La FCmáx debe ser un número mayor a 0.');
  }
  if (!Number.isFinite(restingHR) || restingHR <= 0) {
    throw new RangeError('La FC de reposo debe ser un número mayor a 0.');
  }
  if (restingHR >= maxHR) {
    throw new RangeError('La FC de reposo debe ser menor a la FCmáx.');
  }
  const reserve = maxHR - restingHR;
  return HR_ZONES.map(({ zone, label, min, max }) => ({
    zone,
    label,
    minBpm: Math.round(reserve * min + restingHR),
    maxBpm: Math.round(reserve * max + restingHR),
  }));
}
