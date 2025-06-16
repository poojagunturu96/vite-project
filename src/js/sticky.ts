import stickybits from 'stickybits';

import { $, $$ } from './utils/dom';

/**
 * Initalizes [stickybits](https://github.com/dollarshaveclub/stickybits) onto an element.
 *
 * Optionally can set a custom offset as a number or by another element's height (like a sticky header).
 *
 *
 * @example
 * ```html
 * <nav data-sticky data-sticky-offset="300">...</nav>
 * ```
 *
 * Or sticky by an element selector
 * @example
 * ```html
 * <nav data-sticky data-sticky-offset=".sticky-header">...</nav>
 * ```
 *
 * @param elem - element to make sticky
 */
function createStickyElem(elem: HTMLElement) {
  // allow for custom offset based on data attribute selector
  const offsetAttr = elem.getAttribute('data-sticky-offset');

  let offset = Number(offsetAttr) || 0;

  // If the attribute selector is not a number, we can assume it's a selector of an element to get the offset height from.
  if (offsetAttr && isNaN(Number(offsetAttr))) {
    const el = $(offsetAttr);
    offset = el ? el.offsetHeight : 0;
  }

  const options = {
    stickyBitStickyOffset: offset
  };

  stickybits(elem, options);
}

const elems = $$('[data-sticky]');
elems.forEach(createStickyElem);
