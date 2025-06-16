import { $, $$ } from './utils/dom';

const SPACE_BAR = 32;

class GroupToggler {
  /** Element which will be clicked/enter key/space key press to trigger a toggle */
  elem: HTMLElement;

  openTrigger: HTMLElement;

  closeTrigger: HTMLElement;

  /**
   * Class to add when the toggler is enabled on the elements.
   * For closing things with css by default until they are toggled, which turns on the active class.
   */
  enabledClass: string;

  /** class to add when toggle has happened */
  activeClass: string;

  /** selector for group items */
  group: HTMLElement[];

  constructor(elem: HTMLElement) {
    this.elem = elem;

    this.openTrigger = $('[data-toggle-open-all]', elem);
    this.closeTrigger = $('[data-toggle-close-all]', elem);

    this.activeClass = 'is-toggled';
    this.enabledClass = 'has-toggler';

    this.group = $$('[data-toggle-target]', elem);

    this.handleElemClick = this.handleElemClick.bind(this);

    this.init();
  }

  init() {
    this.elem.classList.add(this.enabledClass);
    this.addListeners();
  }

  // destroy method is not currently called in our apps but could be if you want to disable a toggler
  destroy() {
    this.elem.classList.remove(this.enabledClass);
    this.elem.classList.remove(this.activeClass);
    this.openTrigger.removeEventListener('click', (e) =>
      this.handleElemClick(e, 'open')
    );
    this.openTrigger.removeEventListener('keydown', (e) =>
      this.handleElemKeyDown(e, 'open')
    );
    this.closeTrigger.removeEventListener('click', (e) =>
      this.handleElemClick(e, 'close')
    );
    this.closeTrigger.removeEventListener('keydown', (e) =>
      this.handleElemKeyDown(e, 'close')
    );
  }

  addListeners() {
    this.openTrigger.addEventListener('click', (e) =>
      this.handleElemClick(e, 'open')
    );
    this.openTrigger.addEventListener('keydown', (e) =>
      this.handleElemKeyDown(e, 'open')
    );
    this.closeTrigger.addEventListener('click', (e) =>
      this.handleElemClick(e, 'close')
    );
    this.closeTrigger.addEventListener('keydown', (e) =>
      this.handleElemKeyDown(e, 'close')
    );
  }

  handleElemKeyDown = (e: KeyboardEvent, state: string) => {
    if (e.keyCode === SPACE_BAR) {
      e.preventDefault();
      if (state === 'open') {
        if (!this.isToggled(this.elem)) {
          this.openAll();
        }
      } else {
        this.closeAll();
      }
    }
  };

  handleElemClick(e: Event, state: string) {
    e.preventDefault();

    if (state === 'open') {
      if (!this.isToggled(this.elem)) {
        this.openAll();
      }
    } else {
      this.closeAll();
    }
  }

  // use query selector each time we need the target otherwise its classes are cached
  // if we stored it in the constructor
  getTarget(elem: HTMLElement) {
    const target = elem.getAttribute('data-toggle-target');
    if (target) {
      return $(target);
    }
  }

  setAriaExpanded(elem: HTMLElement, state: boolean) {
    if (elem.hasAttribute('aria-expanded')) {
      elem.setAttribute('aria-expanded', String(state));
    }
  }

  openAll() {
    this.elem.classList.add(this.activeClass);

    this.group.forEach((elem) => {
      const target = this.getTarget(elem);
      target.classList.add(this.activeClass);
      this.setAriaExpanded(elem, true);
    });
  }

  closeAll() {
    this.elem.classList.remove(this.activeClass);
    this.group.forEach((elem) => {
      const target = this.getTarget(elem);
      target.classList.remove(this.activeClass);
      this.setAriaExpanded(elem, false);
    });
  }

  // if the element has the active toggle class we can assume it's active
  isToggled(elem: HTMLElement) {
    return elem.classList.contains(this.activeClass);
  }
}

const groupTogglers = $$('[data-toggle-all-group]');

groupTogglers.forEach((elem) => new GroupToggler(elem));

export default GroupToggler;
