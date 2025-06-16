import { $, $$, on } from './utils/dom';

function isValidUrl(testUrl: string): boolean {
  try {
    new URL(testUrl);
  } catch (_) {
    return false;
  }

  return true;
}

/**
 * Updates the window url from another input value after clicking the button (or other) element.
 *
 * @example
 * ```html
 * <select class="js-dropdown">
 *   <option value="http://middlebury.edu">Middlebury</option>
 * </select>
 * <button data-select-url=".js-dropdown">go</button>
 * ```
 *
 * After a user changes the select option, they can click the go button to navigate to that select option value.
 *
 * Basically, this is a bad way to recreate a native anchor link.
 */
function createUrlSelector(elem: HTMLElement) {
  function handleElemClick(event: Event) {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const selector = target.getAttribute('data-select-url');

    if (!selector) {
      return;
    }

    const select = $(selector) as HTMLSelectElement;

    if (!select || !isValidUrl(select.value)) {
      return;
    }

    window.location.assign(select.value);
  }

  on(elem, 'click', handleElemClick);
}

const els = $$('[data-select-url]');
els.forEach(createUrlSelector);
