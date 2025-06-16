import { $, $$ } from './utils/dom';

class SingleToggler {
  /** Element which will be clicked to trigger a toggle */
  elem: HTMLElement;

  /**
   * Class to add when the toggler is enabled on the elements.
   * For closing things with css by default until they are toggled, which turns on the active class.
   */
  enabledClass: string;

  /** class to add when toggle has happened */
  activeClass: string;

  /** target element to toggle */
  target: HTMLElement;

  singleTarget: HTMLElement;

  parentElement: HTMLElement;

  constructor(elem: HTMLElement) {
    this.elem = elem;
    this.target = this.getSingleTarget(this.elem);

    this.singleTarget = this.getSingleTarget(this.elem);

    this.parentElement = this.singleTarget.parentElement;

    this.activeClass = 'is-toggled';
    this.enabledClass = 'has-toggler';

    this.handleElemClick = this.handleElemClick.bind(this);

    this.init();
  }

  init() {
    if (!this.target) {
      return;
    }

    this.addListeners();
    this.elem.classList.add(this.enabledClass);
    this.target.classList.add(this.enabledClass);
  }

  addListeners() {
    this.elem.addEventListener('click', this.handleElemClick);
    this.elem.addEventListener('keydown', this.handleElemKeyDown);
  }

  handleElemKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      this.toggle();
    }
  };

  getSingleTarget(elem: HTMLElement) {
    const singleTarget = elem.getAttribute('data-toggle-single-target');
    if (singleTarget) {
      return $(singleTarget);
    }
  }

  handleElemClick(e: Event) {
    this.toggle();
  }

  setAriaExpanded(elem: HTMLElement, state: boolean) {
    if (elem.hasAttribute('aria-expanded')) {
      elem.setAttribute('aria-expanded', String(state));
    }
  }

  open(elem: HTMLElement, target: HTMLElement) {
    if (target) {
      target.classList.add(this.activeClass);
    }

    if (elem) {
      elem.classList.add(this.activeClass);
      this.setAriaExpanded(elem, true);
    }
  }

  close(elem: HTMLElement, target: HTMLElement) {
    if (target) {
      target.classList.remove(this.activeClass);
    }

    if (elem) {
      elem.classList.remove(this.activeClass);
      this.setAriaExpanded(elem, false);
    }
  }

  isToggled(elem: HTMLElement) {
    return elem.classList.contains(this.activeClass);
  }

  toggle() {
    let toggledNodes = Array.from(this.parentElement.children).filter(
      (elem) => {
        return elem.classList.contains('is-toggled');
      }
    );

    if (toggledNodes.length !== 0) {
      toggledNodes.forEach((elem) =>
        this.close(elem as HTMLElement, this.target)
      );
    }

    if (!this.isToggled(this.target)) {
      return this.open(this.elem, this.target);
    }

    this.close(this.elem, this.target);
  }
}

const singleTogglers = $$('[data-toggle-single-target]');

singleTogglers.forEach((elem) => new SingleToggler(elem));

export default SingleToggler;
