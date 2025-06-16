import debounce from 'lodash/debounce';

import { $, $$, on, hide, show } from './utils/dom';

/**
 * handles on-page search of middlebury.edu/office listing
 */
(function () {
  const elem = $('.js-offices');

  if (!elem) {
    return;
  }

  const button = $('.js-offices-button', elem);
  const input = $('.js-offices-input', elem);
  const items = $$('.js-offices-item', elem);
  const region = $('.js-offices-region', elem);
  const toc = $('[data-digest-nav]');

  const alertTemplate = 'No results found for &ldquo;{term}&rdquo;';
  const alert = document.createElement('div');
  alert.classList.add('alert', 'alert--status', 'js-offices-alert');

  function setNoResultsValue(value: string) {
    const msg = alertTemplate.replace('{term}', value);
    alert.innerHTML = msg;
  }

  function hideAlert() {
    hide(alert);
  }

  function showAlert() {
    show(alert);
  }

  function showAll(items: HTMLElement[]) {
    items.forEach((item: HTMLElement) => {
      // unsets hide so inline-block class shows it
      item.style.display = '';

      const parent = item.closest('.js-offices-group') as HTMLElement;
      if (parent) show(parent);
    });
  }

  function hideAll(items: any) {
    items.forEach((item: any) => {
      hide(item);

      const parent = item.closest('.js-offices-group');
      hide(parent);
    });
  }

  function findResults(value: any) {
    const matchedItems: any = [];

    items.forEach((item: HTMLElement) => {
      const titleElem = $('.js-offices-title', item);
      if (titleElem) {
        const title = titleElem.textContent || '';

        const pattern = new RegExp(`${value}`, 'gi');
        const matches = title.match(pattern);

        if (matches) {
          matchedItems.push(item);
        }
      }
    });

    return matchedItems;
  }

  function handleInputChange(event: Event) {
    const { value } = event.target as HTMLInputElement;

    hideAlert();

    if (!value || !value.trim()) {
      showToc();
      if (items.length) {
        showAll(items);
      }
      return;
    }

    hideAll(items);

    const matchedItems = findResults(value);

    if (matchedItems.length === 0) {
      setNoResultsValue(value);
      showAlert();
      hideToc();
      return;
    }

    hideToc();
    showAll(matchedItems);
  }

  function hideToc() {
    if (toc) hide(toc);
  }

  function showToc() {
    if (toc) show(toc);
  }

  function init() {
    let id = region?.getAttribute('id') || '';

    if (input) {
      on(input, 'input', debounce(handleInputChange, 200));
      input.setAttribute('aria-controls', id);
    }

    if (button) {
      button.setAttribute('disabled', 'true');
      button.style.opacity = '1';
    }

    hideAlert();

    if (region) {
      region.appendChild(alert);
      region.setAttribute('aria-live', 'polite');
    }
  }

  init();
})();
