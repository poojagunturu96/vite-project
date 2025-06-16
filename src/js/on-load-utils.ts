import { $ } from './utils/dom';

// Adds functionality for toggling accordion item if it's link is openend
// in new tab or window, by checking if it's ID exists in the URL
if (location.hash.includes('#midd-accordion-item-label')) {
  let jsClass = location.hash.replace(
    '#midd-accordion-item-label',
    '.js-accordion-item'
  );
  $(jsClass)?.classList.add('is-toggled');
  $(`[data-toggle-target="${jsClass}"]`)?.classList.add('is-toggled');
}

// Add role="list" to ul elements in text component for accessibility
// https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html
const typoUlElements = document.querySelectorAll(
  '.paragraph--text ul, .paragraph--text ol'
);

typoUlElements.forEach((el) => el.setAttribute('role', 'list'));
