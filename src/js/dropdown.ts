import { $, $$, on, off } from './utils/dom';

import { ESC_KEY } from './constants';

/**
 * Creates a basic dropdown widget that has a button to toggle an active class on an element.
 *
 * Handles aria-expanded and focusing the first link in the data-dropdown-menu.
 *
 * Different from toggler.js since we watch for clicks outside the element to close the dropdown
 * Could probably be merged with toggler somehow.
 *
 * @example
 * ```html
 * <div data-dropdown>
 *   <button data-dropdown-button>open dropdown</button>
 *   <ul data-dropdown-menu>
 *     ...
 *   </ul>
 * </div>
 * ```
 */
class Dropdown {
  activeClass: string;
  btn: HTMLElement;
  elem: HTMLElement;
  menu: HTMLElement;
  isOpen: boolean;

  constructor(elem: HTMLElement) {
    this.elem = elem;

    this.btn = $('[data-dropdown-button]', elem);
    this.menu = $('[data-dropdown-menu]', elem);

    this.activeClass = 'is-active';
    this.isOpen = false;

    this.init();
  }

  init() {
    this.addListeners();
  }

  addListeners() {
    /**
     * listen for window clicks/touch so we can close the dropdown on clicks outside
     * dropdown and button.
     */
    on(window, 'click', this.handleWindowClick);
    on(window, 'touchstart', this.handleWindowClick);

    on(this.elem, 'keyup', this.handleElemKeyup);
    on(this.btn, 'click', this.toggle);
  }

  destroy() {
    off(window, 'click', this.handleWindowClick);
    off(window, 'touchstart', this.handleWindowClick);

    off(this.elem, 'keyup', this.handleElemKeyup);

    off(this.btn, 'click', this.toggle);

    this.hide();
  }

  handleElemKeyup = (e: KeyboardEvent) => {
    if (e.keyCode === ESC_KEY) {
      this.hide();
      this.focusBtn();
    }
  };

  focusBtn() {
    this.btn?.focus();
  }

  handleWindowClick = (event: MouseEvent) => {
    const node = this.elem;

    const target = event.target as HTMLElement;

    // if the target isn't the button or contains the button, the click is outside
    // the data-dropdown element
    if (event.target !== node && !node.contains(target)) {
      this.hide();
    }
  };

  toggle = () => {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();

      this.focusFirst();
    }
  };

  focusFirst() {
    const el = $('a', this.menu);
    if (el) el.focus();
  }

  hide() {
    this.elem.classList.remove(this.activeClass);
    this.btn.setAttribute('aria-expanded', 'false');
    this.isOpen = false;
  }

  show() {
    this.elem.classList.add(this.activeClass);
    this.btn.setAttribute('aria-expanded', 'true');
    this.isOpen = true;
  }
}

const elems = $$('[data-dropdown]');

elems.forEach((elem) => new Dropdown(elem));

export default Dropdown;
