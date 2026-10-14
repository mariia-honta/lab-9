import { openDetails } from './details.js';
import { toggle } from './state.js';

/**
 * C2. Підключає кнопки карток у списку #results: «До списку» додає серіал до мого списку або
 * прибирає з нього, «Детальніше» відкриває діалог (openDetails з details.js). main.js викликає
 * цю функцію один раз, після першого показу списку. Специфікація — ТЗ, C2.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initList(refresh) {
  const results = document.querySelector('#results');
  if (!(results instanceof HTMLUListElement)) throw new Error('Не знайдено список #results');

  results.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('button[data-action]');
    const card = button?.closest('.card');
    if (!button || !(card instanceof HTMLLIElement)) return;

    const id = Number(card.dataset.id);
    if (button.dataset.action === 'toggle') {
      toggle(id);
      refresh();
    } else if (button.dataset.action === 'details') {
      openDetails(id);
    }
  });
}
