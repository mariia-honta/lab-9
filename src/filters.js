/** @typedef {import('./state.js').Filters} Filters */

/**
 * C3. Повертає поточні значення форми фільтрів #filters. Поки C3 не виконано, фільтрів немає,
 * і список показує всі серіали. Специфікація — ТЗ, C3.
 *
 * @returns {Filters}
 */
export function readFilters() {
  const form = document.querySelector("#filters");
  if (!(form instanceof HTMLFormElement))
    throw new Error("Не знайдено форму #filters");

  const query = form.querySelector("#filter-query");
  const genre = form.querySelector("#filter-genre");
  const mine = form.querySelector("#filter-mine");

  if (!(query instanceof HTMLInputElement))
    throw new Error("Не знайдено поле #filter-query");
  if (!(genre instanceof HTMLSelectElement))
    throw new Error("Не знайдено поле #filter-genre");
  if (!(mine instanceof HTMLInputElement))
    throw new Error("Не знайдено поле #filter-mine");

  return {
    query: query.value,
    genre: genre.value,
    mine: mine.checked,
  };
}

/**
 * C3. Підключає форму фільтрів: після кожної зміни — refresh(). main.js викликає цю функцію
 * один раз. Специфікація — ТЗ, C3.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initFilters(refresh) {
  const form = document.querySelector("#filters");
  if (!(form instanceof HTMLFormElement))
    throw new Error("Не знайдено форму #filters");

  const query = form.querySelector("#filter-query");
  const genre = form.querySelector("#filter-genre");
  const mine = form.querySelector("#filter-mine");

  if (!(query instanceof HTMLInputElement))
    throw new Error("Не знайдено поле #filter-query");
  if (!(genre instanceof HTMLSelectElement))
    throw new Error("Не знайдено поле #filter-genre");
  if (!(mine instanceof HTMLInputElement))
    throw new Error("Не знайдено поле #filter-mine");

  query.addEventListener("input", refresh);
  genre.addEventListener("change", refresh);
  mine.addEventListener("change", refresh);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  form.addEventListener("reset", (event) => {
    event.preventDefault();
    query.value = query.defaultValue;
    genre.selectedIndex = 0;
    mine.checked = mine.defaultChecked;
    refresh();
  });
}
