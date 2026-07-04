/**
 * js/ui/references.js
 * Bibliografía completa mostrada en la pestaña "Referencias" de la app.
 * Debe mantenerse sincronizada con REFERENCIAS.md.
 */

export const REFERENCES = [
  {
    group: '1RM (una repetición máxima)',
    items: [
      { formula: 'Epley', citation: 'Epley, B. (1985). Poundage Chart. Boyd Epley Workout.', note: 'Válida aprox. hasta 10-12 reps; sobreestima levemente a reps altas.' },
      { formula: 'Brzycki', citation: 'Brzycki, M. (1993). Strength Testing—Predicting a One-Rep Max from Reps-to-Fatigue. JOPERD, 64(1).', note: 'Diverge matemáticamente a partir de 37 repeticiones.' },
      { formula: 'Lander', citation: 'Lander, J. (1985). Maximums Based on Reps. NSCA Journal, 6(6).', note: 'Similar precisión a Epley en rangos de 1-10 reps.' },
      { formula: 'Lombardi', citation: 'Lombardi, V.P. (1989). Beginning Weight Training. Wm. C. Brown Publishers.', note: 'Tiende a subestimar a reps bajas, sobreestimar a reps altas.' },
      { formula: 'Mayhew et al.', citation: 'Mayhew, J.L. et al. (1992). Muscular endurance repetitions to predict bench press strength. J Sports Med Phys Fitness, 32(1).', note: 'Desarrollada específicamente para press de banca.' },
    ],
  },
  {
    group: 'Fuerza relativa',
    items: [
      { formula: 'DOTS', citation: 'Konertz, T. (2019). DOTS Formula, adoptada por USAPL/USPA/GPC.', note: 'Polinomio de 4º grado, calibrado con datos 2010-2018; más preciso en pesos extremos que Wilks.' },
      { formula: 'Wilks', citation: 'Wilks, R. (1994). Wilks Coefficient.', note: 'Estándar 1994-2019. Sesgo conocido hacia pesos medios.' },
    ],
  },
  {
    group: 'Gasto energético',
    items: [
      { formula: 'BMR (Mifflin-St Jeor)', citation: 'Mifflin, M.D., St Jeor, S.T., et al. (1990). A new predictive equation for resting energy expenditure. Am J Clin Nutr, 51(2), 241-247.', note: 'Mejor validación en población general que Harris-Benedict; margen de error individual ±10-15%.' },
    ],
  },
  {
    group: 'Frecuencia cardíaca',
    items: [
      { formula: 'FCmáx (Tanaka)', citation: 'Tanaka, H., Monahan, K.D., Seals, D.R. (2001). Age-predicted maximal heart rate revisited. JACC, 37(1), 153-156.', note: 'Más precisa en adultos que la fórmula clásica 220-edad.' },
      { formula: 'FCmáx (clásica)', citation: 'Fox, S.M., Naughton, J.P., Haskell, W.L. (1971). Physical activity and the prevention of coronary heart disease.', note: 'Ampliamente usada pero con mayor margen de error (±10-12 lpm).' },
      { formula: 'Zonas (Karvonen)', citation: 'Karvonen, M.J., Kentala, E., Mustala, O. (1957). The effects of training on heart rate. Ann Med Exp Biol Fenn, 35(3), 307-315.', note: 'Método de frecuencia cardíaca de reserva (HRR).' },
    ],
  },
];

export function renderReferences(container) {
  container.innerHTML = REFERENCES.map((group) => `
    <div class="panel">
      <h2>${group.group}</h2>
      <div class="stack" style="gap:0.9rem;">
        ${group.items.map((item) => `
          <div>
            <strong>${item.formula}</strong>
            <p style="margin:0.2rem 0; font-size:0.88rem;">${item.citation}</p>
            <p class="field-help" style="margin:0;">${item.note}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}
