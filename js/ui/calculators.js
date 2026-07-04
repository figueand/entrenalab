/**
 * js/ui/calculators.js
 * Conecta los formularios del DOM con las funciones puras de js/formulas/.
 * No contiene lógica de cálculo propia: solo lectura de inputs, validación
 * de formulario y render de resultados.
 */

import { estimateOneRM, buildLoadTable } from '../formulas/oneRM.js';
import { calculateDOTS, calculateWilks, classifyScore } from '../formulas/strengthScore.js';
import { calculateBMR, calculateTDEE, calculateGoalCalories, calculateMacros, ACTIVITY_FACTORS } from '../formulas/energy.js';
import { maxHeartRateTanaka, maxHeartRateClassic, calculateHeartRateZones } from '../formulas/heartRate.js';
import { formulaTags, fmt, showError } from './refUtils.js';

function el(id) { return document.getElementById(id); }
function num(id) { return parseFloat(el(id).value); }
function checkedRadio(name) {
  const input = document.querySelector(`input[name="${name}"]:checked`);
  return input ? input.value : null;
}

/* ---------------------------- 1RM ---------------------------- */

function initOneRM() {
  const form = el('form-1rm');
  const result = el('result-1rm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const weight = num('1rm-weight');
      const reps = parseInt(el('1rm-reps').value, 10);
      const estimates = estimateOneRM(weight, reps);
      const table = buildLoadTable(estimates.average);

      result.classList.add('visible');
      result.innerHTML = `
        <div class="readout-label">1RM estimado (promedio de 5 fórmulas)</div>
        <div class="readout-value">${fmt(estimates.average, 1)}<span class="unit">kg</span></div>
        <div style="margin-bottom:0.6rem;">
          ${formulaTags(['Epley', 'Brzycki', 'Lander', 'Lombardi', 'Mayhew et al.'])}
        </div>
        <table class="data-table" style="color:${'var(--ink)'}; background:var(--paper-raised); font-family:var(--font-mono);">
          <thead><tr><th>Fórmula</th><th>1RM est.</th></tr></thead>
          <tbody>
            ${['epley', 'brzycki', 'lander', 'lombardi', 'mayhew'].map((k) => `
              <tr><td>${k}</td><td>${fmt(estimates[k], 1)} kg</td></tr>
            `).join('')}
          </tbody>
        </table>
      `;

      const tableContainer = el('table-1rm');
      tableContainer.innerHTML = `
        <table class="data-table">
          <thead><tr><th>Reps</th><th>% 1RM</th><th>Carga</th></tr></thead>
          <tbody>
            ${table.map((row) => `
              <tr><td>${row.reps}</td><td>${row.percent}%</td><td>${fmt(row.load, 1)} kg</td></tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (err) {
      showError(result, err.message);
    }
  });
}

/* ------------------------ DOTS / Wilks ------------------------ */

function initStrengthScore() {
  const form = el('form-strength');
  const result = el('result-strength');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const bodyWeight = num('strength-bw');
      const total = num('strength-total');
      const sex = checkedRadio('strength-sex');
      if (!sex) throw new RangeError('Seleccioná sexo biológico.');

      const dots = calculateDOTS(bodyWeight, total, sex);
      const wilks = calculateWilks(bodyWeight, total, sex);

      result.classList.add('visible');
      result.innerHTML = `
        <div class="readout-label">Puntuación de fuerza relativa</div>
        <div class="two-col" style="margin-top:0.4rem;">
          <div>
            <div class="readout-label">DOTS</div>
            <div class="readout-value" style="font-size:1.9rem;">${fmt(dots, 1)}</div>
            <div style="font-size:0.75rem; opacity:0.85;">${classifyScore(dots)}</div>
          </div>
          <div>
            <div class="readout-label">Wilks</div>
            <div class="readout-value" style="font-size:1.9rem;">${fmt(wilks, 1)}</div>
            <div style="font-size:0.75rem; opacity:0.85;">${classifyScore(wilks)}</div>
          </div>
        </div>
        <div style="margin-top:0.8rem;">${formulaTags(['DOTS (Konertz, 2019)', 'Wilks (1994)'])}</div>
      `;
    } catch (err) {
      showError(result, err.message);
    }
  });
}

/* --------------------------- TDEE ------------------------------ */

function populateActivityOptions() {
  const select = el('tdee-activity');
  if (!select) return;
  select.innerHTML = Object.entries(ACTIVITY_FACTORS)
    .map(([key, { label }]) => `<option value="${key}">${label}</option>`)
    .join('');
}

function initEnergy() {
  const form = el('form-tdee');
  const result = el('result-tdee');
  if (!form) return;
  populateActivityOptions();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const weight = num('tdee-weight');
      const height = num('tdee-height');
      const age = num('tdee-age');
      const sex = checkedRadio('tdee-sex');
      if (!sex) throw new RangeError('Seleccioná sexo biológico.');
      const activity = el('tdee-activity').value;
      const goal = checkedRadio('tdee-goal') || 'maintenance';

      const bmr = calculateBMR(weight, height, age, sex);
      const tdee = calculateTDEE(bmr, activity);
      const goalCalories = calculateGoalCalories(tdee, goal);
      const macros = calculateMacros(goalCalories, weight);

      result.classList.add('visible');
      result.innerHTML = `
        <div class="readout-label">Calorías objetivo diarias</div>
        <div class="readout-value">${fmt(goalCalories, 0)}<span class="unit">kcal</span></div>
        <div style="font-size:0.78rem; opacity:0.85; margin-bottom:0.6rem;">
          BMR ${fmt(bmr, 0)} kcal · TDEE ${fmt(tdee, 0)} kcal
        </div>
        <table class="data-table">
          <thead><tr><th>Macro</th><th>Gramos</th><th>Kcal</th></tr></thead>
          <tbody>
            <tr><td>Proteína</td><td>${macros.protein.grams} g</td><td>${macros.protein.kcal}</td></tr>
            <tr><td>Grasa</td><td>${macros.fat.grams} g</td><td>${macros.fat.kcal}</td></tr>
            <tr><td>Carbohidratos</td><td>${macros.carbs.grams} g</td><td>${macros.carbs.kcal}</td></tr>
          </tbody>
        </table>
        <div style="margin-top:0.8rem;">${formulaTags(['Mifflin-St Jeor (1990)'])}</div>
      `;
    } catch (err) {
      showError(result, err.message);
    }
  });
}

/* ------------------------ FC y zonas ---------------------------- */

function initHeartRate() {
  const form = el('form-hr');
  const result = el('result-hr');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const age = num('hr-age');
      const resting = num('hr-resting');
      const method = checkedRadio('hr-method') || 'tanaka';
      const maxHR = method === 'tanaka' ? maxHeartRateTanaka(age) : maxHeartRateClassic(age);
      const zones = calculateHeartRateZones(maxHR, resting);

      result.classList.add('visible');
      result.innerHTML = `
        <div class="readout-label">FCmáx estimada (${method === 'tanaka' ? 'Tanaka' : 'clásica 220-edad'})</div>
        <div class="readout-value">${maxHR}<span class="unit">lpm</span></div>
        <table class="data-table">
          <thead><tr><th>Zona</th><th>Intensidad</th><th>Rango lpm</th></tr></thead>
          <tbody>
            ${zones.map((z) => `
              <tr><td>Z${z.zone}</td><td>${z.label}</td><td>${z.minBpm}–${z.maxBpm}</td></tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top:0.8rem;">${formulaTags(['Karvonen (1957)'])}</div>
      `;
    } catch (err) {
      showError(result, err.message);
    }
  });
}

export function initCalculators() {
  initOneRM();
  initStrengthScore();
  initEnergy();
  initHeartRate();
}
