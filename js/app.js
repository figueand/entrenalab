/**
 * js/app.js
 * Navegación entre pestañas y arranque de la app.
 */
import { initCalculators } from './ui/calculators.js';
import { renderReferences } from './ui/references.js';

function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const views = document.querySelectorAll('.view');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      buttons.forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
      views.forEach((v) => v.classList.toggle('active', v.id === target));
      history.replaceState(null, '', `#${target}`);
    });
  });

  const hashTarget = window.location.hash.replace('#', '');
  const initialBtn = [...buttons].find((b) => b.dataset.target === hashTarget) || buttons[0];
  initialBtn.click();
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCalculators();
  renderReferences(document.getElementById('view-referencias'));
});
