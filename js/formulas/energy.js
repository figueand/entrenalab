/**
 * js/formulas/energy.js
 * Gasto energético basal (BMR), gasto energético total (TDEE) y
 * reparto de macronutrientes según objetivo.
 *
 * Fuente BMR (ver REFERENCIAS.md):
 * - Mifflin, M.D., St Jeor, S.T., et al. (1990). A new predictive equation
 *   for resting energy expenditure in healthy individuals.
 *   American Journal of Clinical Nutrition, 51(2), 241-247.
 *   Es la ecuación con mejor validación en población general moderna,
 *   más precisa que Harris-Benedict para la mayoría de los casos.
 *
 * Límite de aplicación: estas fórmulas son estimaciones poblacionales;
 * no reemplazan una medición directa (calorimetría indirecta) y su
 * margen de error individual puede ser de ±10-15%.
 */

export const ACTIVITY_FACTORS = {
  sedentary: { value: 1.2, label: 'Sedentario (poco o nada de ejercicio)' },
  light: { value: 1.375, label: 'Actividad ligera (1-3 días/semana)' },
  moderate: { value: 1.55, label: 'Actividad moderada (3-5 días/semana)' },
  active: { value: 1.725, label: 'Muy activo (6-7 días/semana)' },
  veryActive: { value: 1.9, label: 'Extremadamente activo (entreno intenso + trabajo físico)' },
};

const GOAL_ADJUSTMENTS = {
  loss: { factor: 0.8, label: 'Déficit para pérdida de grasa (~20%)' },
  maintenance: { factor: 1.0, label: 'Mantenimiento' },
  gain: { factor: 1.1, label: 'Superávit para ganancia muscular (~10%)' },
};

function validatePersonInputs(weightKg, heightCm, age) {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError('El peso debe ser un número mayor a 0.');
  }
  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new RangeError('La altura debe ser un número mayor a 0.');
  }
  if (!Number.isFinite(age) || age <= 0) {
    throw new RangeError('La edad debe ser un número mayor a 0.');
  }
}

/** BMR según Mifflin-St Jeor. sex: 'male' | 'female'. */
export function calculateBMR(weightKg, heightCm, age, sex) {
  validatePersonInputs(weightKg, heightCm, age);
  if (sex !== 'male' && sex !== 'female') {
    throw new RangeError('sex debe ser "male" o "female".');
  }
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === 'male' ? base + 5 : base - 161);
}

/** TDEE = BMR * factor de actividad. activityKey debe ser una clave de ACTIVITY_FACTORS. */
export function calculateTDEE(bmr, activityKey) {
  if (!Number.isFinite(bmr) || bmr <= 0) {
    throw new RangeError('El BMR debe ser un número mayor a 0.');
  }
  const activity = ACTIVITY_FACTORS[activityKey];
  if (!activity) {
    throw new RangeError(`activityKey inválido: ${activityKey}`);
  }
  return Math.round(bmr * activity.value);
}

/**
 * Calorías objetivo según meta. goalKey: 'loss' | 'maintenance' | 'gain'.
 */
export function calculateGoalCalories(tdee, goalKey) {
  if (!Number.isFinite(tdee) || tdee <= 0) {
    throw new RangeError('El TDEE debe ser un número mayor a 0.');
  }
  const goal = GOAL_ADJUSTMENTS[goalKey];
  if (!goal) {
    throw new RangeError(`goalKey inválido: ${goalKey}`);
  }
  return Math.round(tdee * goal.factor);
}

/**
 * Reparto de macronutrientes.
 * Proteína fijada en g/kg de peso corporal (default 1.8, rango habitual
 * de referencia 1.6-2.2 g/kg para personas entrenadas, Morton et al. 2018).
 * Grasa como % de las calorías totales (default 25%).
 * El resto de las calorías se asigna a carbohidratos.
 */
export function calculateMacros(goalCalories, weightKg, {
  proteinPerKg = 1.8,
  fatPercent = 25,
} = {}) {
  if (!Number.isFinite(goalCalories) || goalCalories <= 0) {
    throw new RangeError('Las calorías objetivo deben ser un número mayor a 0.');
  }
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError('El peso debe ser un número mayor a 0.');
  }
  const proteinG = Math.round(proteinPerKg * weightKg);
  const proteinKcal = proteinG * 4;
  const fatKcal = Math.round(goalCalories * (fatPercent / 100));
  const fatG = Math.round(fatKcal / 9);
  const carbsKcal = Math.max(0, goalCalories - proteinKcal - fatKcal);
  const carbsG = Math.round(carbsKcal / 4);
  return {
    protein: { grams: proteinG, kcal: proteinKcal },
    fat: { grams: fatG, kcal: fatKcal },
    carbs: { grams: carbsG, kcal: carbsKcal },
    totalKcal: proteinKcal + fatKcal + carbsKcal,
  };
}
