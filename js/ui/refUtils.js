/**
 * js/ui/refUtils.js
 * Helpers de UI compartidos para mostrar citas de fórmulas ("formula-tags")
 * junto a cada resultado, y para formatear números de forma consistente.
 */

/** Crea el HTML de una o varias etiquetas de fórmula citada. */
export function formulaTags(labels) {
  const list = Array.isArray(labels) ? labels : [labels];
  return list
    .map((label) => `<span class="formula-tag">${label}</span>`)
    .join('');
}

/** Formatea un número con separador decimal y unidad opcional. */
export function fmt(value, decimals = 1, unit = '') {
  if (!Number.isFinite(value)) return '—';
  const n = value.toFixed(decimals);
  return unit ? `${n} ${unit}` : n;
}

/** Muestra un mensaje de error dentro de un contenedor de resultado. */
export function showError(container, message) {
  container.innerHTML = `<p style="color:#b5502f; font-family: var(--font-mono); font-size:0.85rem;">⚠ ${message}</p>`;
  container.classList.remove('readout');
  container.classList.add('visible');
}
