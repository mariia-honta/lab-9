import { getShow, notes, saveNote } from "./state.js";

let currentId;

/**
 * C4. Відкриває діалог #details для серіалу: назва, опис, посилання на сторінку TVmaze і форма
 * з моєю оцінкою й нотаткою. Специфікація — ТЗ, C4.
 *
 * @param {number} id
 */
export function openDetails(id) {
  const show = getShow(id);
  const dialog = document.querySelector("#details");
  const title = document.querySelector("#details-title");
  const summary = document.querySelector("#details-summary");
  const link = document.querySelector("#details-link");
  const form = document.querySelector("#note-form");
  const rating = form?.elements.namedItem("rating");
  const text = form?.elements.namedItem("note");
  const error = document.querySelector("#note-rating-error");
  if (!(dialog instanceof HTMLDialogElement))
    throw new Error("Не знайдено діалог #details");
  if (!title || !summary || !(link instanceof HTMLAnchorElement)) {
    throw new Error("Не знайдено вміст діалогу #details");
  }
  if (
    !(rating instanceof HTMLInputElement) ||
    !(text instanceof HTMLTextAreaElement)
  ) {
    throw new Error("Не знайдено поля форми #note-form");
  }
  if (!(error instanceof HTMLElement))
    throw new Error("Не знайдено повідомлення #note-rating-error");

  currentId = id;
  title.textContent = show.name;
  const parsedSummary = new DOMParser().parseFromString(
    show.summary ?? "",
    "text/html",
  );
  summary.textContent = parsedSummary.body.textContent ?? "";
  link.href = show.url;

  const note = notes.get(id);
  rating.value = note ? String(note.rating) : "";
  text.value = note?.text ?? "";
  rating.removeAttribute("aria-invalid");
  error.textContent = "";

  if (!dialog.open) dialog.showModal();
}

/**
 * C4. Підключає діалог #details: закриття й форму «Моя оцінка й нотатка». main.js викликає цю
 * функцію один раз. Специфікація — ТЗ, C4.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initDetails(refresh) {
  const dialog = document.querySelector("#details");
  const form = document.querySelector("#note-form");
  const cancel = form?.querySelector('button[type="button"]');
  const rating = form?.elements.namedItem("rating");
  const text = form?.elements.namedItem("note");
  const error = document.querySelector("#note-rating-error");
  if (!(dialog instanceof HTMLDialogElement))
    throw new Error("Не знайдено діалог #details");
  if (!(form instanceof HTMLFormElement))
    throw new Error("Не знайдено форму #note-form");
  if (!(cancel instanceof HTMLButtonElement))
    throw new Error("Не знайдено кнопку скасування");
  if (
    !(rating instanceof HTMLInputElement) ||
    !(text instanceof HTMLTextAreaElement)
  ) {
    throw new Error("Не знайдено поля форми #note-form");
  }
  if (!(error instanceof HTMLElement))
    throw new Error("Не знайдено повідомлення #note-rating-error");

  const validateRating = () => {
    const value = Number(rating.value);
    const isValid =
      rating.value !== "" &&
      Number.isInteger(value) &&
      value >= 1 &&
      value <= 10;
    if (isValid) {
      rating.removeAttribute("aria-invalid");
    } else {
      rating.setAttribute("aria-invalid", "true");
    }
    error.textContent = isValid ? "" : "Введіть ціле число від 1 до 10.";
    return isValid;
  };

  cancel.addEventListener("click", () => dialog.close());

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateRating()) {
      rating.focus();
      return;
    }

    if (currentId === undefined)
      throw new Error("Не вибрано серіал для нотатки");

    const id = currentId;
    const showName = getShow(id).name;

    saveNote(id, { rating: Number(rating.value), text: text.value });

    dialog.close();
    refresh();
    const status = document.querySelector("#status");
    if (status instanceof HTMLElement) {
      status.textContent = `Нотатку до ${showName} збережено`;
    }

    const detailsButton = document.querySelector(
      `#results [data-id="${id}"] button[data-action="details"]`,
    );
    if (detailsButton instanceof HTMLButtonElement) detailsButton.focus();
  });

  rating.addEventListener("input", () => {
    if (rating.getAttribute("aria-invalid") === "true") {
      validateRating();
    }
  });
}
