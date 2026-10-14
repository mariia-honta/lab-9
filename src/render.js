/** @typedef {import('./state.js').Show} Show */
import { notes, shows, watchlist } from './state.js';

/**
 * C1. Показує серіали в списку #results — по картці з шаблону #show-card на кожен, у тому
 * самому порядку, — і оновлює рядок статусу #status. Специфікація — ТЗ, C1.
 *
 * @param {readonly Show[]} list серіали, які треба показати
 */
export function renderShows(list) {
  const results = document.querySelector('#results');
  const status = document.querySelector('#status');
  const count = document.querySelector('#watchlist-count');
  const template = document.querySelector('#show-card');
  if (!(results instanceof HTMLUListElement)) throw new Error('Не знайдено список #results');
  if (!status) throw new Error('Не знайдено рядок статусу #status');
  if (!(template instanceof HTMLTemplateElement)) throw new Error('Не знайдено шаблон #show-card');

  const cards = document.createDocumentFragment();
  for (const show of list) {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector('.card');
    if (!(card instanceof HTMLLIElement)) throw new Error('У шаблоні #show-card немає картки <li>');
    card.dataset.id = String(show.id);

    const fields = {
      name: show.name,
      year: show.year ?? '—',
      genres: show.genres.length ? show.genres.join(', ') : '—',
      rating: show.rating ?? '—',
    };
    for (const [name, value] of Object.entries(fields)) {
      for (const field of card.querySelectorAll(`[data-field="${name}"]`)) {
        field.textContent = String(value);
      }
    }

    const isListed = watchlist.has(show.id);
    card.querySelector('[data-action="toggle"]')?.setAttribute('aria-pressed', String(isListed));
    const note = notes.get(show.id);
    const myRating = card.querySelector('[data-field="my-rating"]');
    const noteText = card.querySelector('[data-field="note"]');
    if (note && myRating && noteText) {
      myRating.textContent = String(note.rating);
      noteText.textContent = note.text;
      myRating.closest('.card__mine')?.removeAttribute('hidden');
      noteText.hidden = !note.text;
    }

    cards.append(fragment);
  }

  results.replaceChildren(cards);
  if (count) count.textContent = String(watchlist.size);
  status.textContent = list.length
    ? `Знайдено: ${list.length} з ${shows.length}`
    : 'Нічого не знайдено';
}
