# Referencias bibliográficas

Bibliografía completa de las fórmulas implementadas en EntrenaLab. Sincronizada con `js/ui/references.js` (pestaña "Referencias" de la app).

## 1RM (una repetición máxima)

| Fórmula | Cita | Alcance / limitaciones |
|---|---|---|
| Epley | Epley, B. (1985). *Poundage Chart*. Boyd Epley Workout. | Válida aprox. hasta 10-12 reps; sobreestima levemente a reps altas. |
| Brzycki | Brzycki, M. (1993). Strength Testing—Predicting a One-Rep Max from Reps-to-Fatigue. *Journal of Physical Education, Recreation & Dance*, 64(1). | Diverge matemáticamente a partir de 37 repeticiones (denominador ≤ 0). |
| Lander | Lander, J. (1985). Maximums Based on Reps. *NSCA Journal*, 6(6). | Similar precisión a Epley en rangos de 1-10 reps. |
| Lombardi | Lombardi, V.P. (1989). *Beginning Weight Training*. Wm. C. Brown Publishers. | Tiende a subestimar a reps bajas, sobreestimar a reps altas. |
| Mayhew et al. | Mayhew, J.L. et al. (1992). Muscular endurance repetitions to predict bench press strength in men of different training levels. *Journal of Sports Medicine and Physical Fitness*, 32(1). | Desarrollada específicamente para press de banca. |

## Fuerza relativa

| Fórmula | Cita | Alcance / limitaciones |
|---|---|---|
| DOTS | Konertz, T. (2019). *DOTS Formula*. Adoptada por USAPL, USPA, GPC. | Polinomio de 4º grado calibrado con datos de competencia 2010-2018. Más preciso que Wilks en pesos corporales extremos (<56 kg o >125 kg). |
| Wilks (clásico) | Wilks, R. (1994). *Wilks Coefficient*. | Estándar en powerlifting entre 1994 y ~2019. Sesgo conocido hacia lifters de peso medio. |

## Gasto energético

| Fórmula | Cita | Alcance / limitaciones |
|---|---|---|
| BMR — Mifflin-St Jeor | Mifflin, M.D., St Jeor, S.T., et al. (1990). A new predictive equation for resting energy expenditure in healthy individuals. *American Journal of Clinical Nutrition*, 51(2), 241-247. | Mejor validación en población general moderna que Harris-Benedict. Margen de error individual estimado ±10-15%. |

## Frecuencia cardíaca

| Fórmula | Cita | Alcance / limitaciones |
|---|---|---|
| FCmáx — Tanaka | Tanaka, H., Monahan, K.D., Seals, D.R. (2001). Age-predicted maximal heart rate revisited. *Journal of the American College of Cardiology*, 37(1), 153-156. | Más precisa en adultos que la fórmula clásica; desviación estándar ±7-10 lpm. |
| FCmáx — clásica | Fox, S.M., Naughton, J.P., Haskell, W.L. (1971). Physical activity and the prevention of coronary heart disease. | Ampliamente usada pero con mayor margen de error (±10-12 lpm). |
| Zonas — Karvonen | Karvonen, M.J., Kentala, E., Mustala, O. (1957). The effects of training on heart rate: a longitudinal study. *Annales Medicinae Experimentalis et Biologiae Fenniae*, 35(3), 307-315. | Método de frecuencia cardíaca de reserva (HRR); no reemplaza una prueba de esfuerzo directa. |

---

**Nota general:** todas estas ecuaciones son estimaciones poblacionales. Ninguna reemplaza una evaluación médica, un test de laboratorio (ergoespirometría, DEXA) o el criterio de un profesional certificado en ciencias del deporte.

## Pendiente de documentar (módulos aún no implementados en esta versión)

Los siguientes módulos están descritos en el README como parte del alcance completo del proyecto pero todavía no están implementados en el código: tests de campo de resistencia (Cooper, Course Navette, VAM-EVAL, 6MWT, step tests, Ruffier-Dickson, UKK Walk Test), generador de rutinas semanales (MEV/MAV/MRV, Israetel et al., 2019), herramienta de entrenador y exportación de informes PDF.
