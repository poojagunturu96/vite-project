import { $, $$ } from './utils/dom';

class ToggleAnimation {
  elem: HTMLElement;

  triggers: HTMLElement[];

  targets: HTMLElement[];

  finalState: Element;

  playButtonClass: string;

  pauseButtonClass: string;

  replayButtonClass: string;

  activeClass: string;

  transitionStateClass: string;

  playButton: HTMLElement;

  pauseButton: HTMLElement;

  replayButton: HTMLElement;

  transitionState: HTMLElement[];

  constructor(elem: HTMLElement) {
    this.elem = elem;
    this.triggers = $$('[data-animation-trigger]', this.elem);
    this.targets = $$('[data-animation-target]', this.elem);
    this.finalState =
      this.targets[0].children[this.targets[0].children.length - 1];

    this.activeClass = 'run-animation';

    this.playButtonClass = 'homepage-title--play-button';
    this.pauseButtonClass = 'homepage-title--pause-button';
    this.replayButtonClass = 'homepage-title--replay-button';
    this.transitionStateClass = 'homepage-title--transition-state';

    this.playButton = $(`.${this.playButtonClass}`);
    this.pauseButton = $(`.${this.pauseButtonClass}`);
    this.replayButton = $(`.${this.replayButtonClass}`);
    this.transitionState = $$(`.${this.transitionStateClass}`);

    this.handleClick = this.handleClick.bind(this);
    this.handleFinalAnimationEnd = this.handleFinalAnimationEnd.bind(this);
    this.init();
  }

  init() {
    this.addListeners();
  }

  addListeners() {
    this.triggers.forEach((trigger) => {
      trigger.addEventListener('click', this.handleClick);
    });

    this.transitionState.splice(-1, 1);
    this.transitionState.forEach((target) => {
      target.addEventListener(
        'animationstart',
        this.handleIntermittentAnimationEnd
      );
      target.addEventListener(
        'animationend',
        this.handleIntermittentAnimationEnd
      );
    });

    this.finalState.addEventListener(
      'animationstart',
      this.handleFinalAnimationEnd
    );
    this.finalState.addEventListener(
      'animationend',
      this.handleFinalAnimationEnd
    );
  }

  hideElement(elem: HTMLElement) {
    elem.style.display = 'none';
    elem.setAttribute('aria-hidden', 'true');
  }

  displayElement(elem: HTMLElement) {
    elem.style.display = 'block';
    elem.setAttribute('aria-hidden', 'false');
  }

  handleClick(e: Event) {
    const eventTarget = e.target as HTMLElement;

    if (eventTarget.classList.contains(this.pauseButtonClass)) {
      this.targets.forEach((elem) => {
        elem.classList.add('pause-animation');
      });

      this.hideElement(eventTarget);
      this.displayElement(this.playButton);
    } else if (eventTarget.classList.contains(this.playButtonClass)) {
      this.targets.forEach((elem) => {
        elem.classList.remove('pause-animation');
      });

      this.hideElement(eventTarget);
      this.displayElement(this.pauseButton);
    } else if (eventTarget.classList.contains(this.replayButtonClass)) {
      this.elem.classList.remove('run-animation');
      void this.elem.offsetWidth;
      this.elem.classList.add('run-animation');

      this.hideElement(eventTarget);
      this.displayElement(this.pauseButton);
    }
  }

  handleFinalAnimationEnd(e: AnimationEvent) {
    const eventTarget = e.target as HTMLElement;

    if (e.type == 'animationend') {
      this.hideElement(this.playButton);
      this.hideElement(this.pauseButton);
      this.displayElement(this.replayButton);
    } else if (e.type == 'animationstart') {
      eventTarget.setAttribute('aria-hidden', 'false');
    }
  }

  handleIntermittentAnimationEnd(e: AnimationEvent) {
    const eventTarget = e.target as HTMLElement;

    if (e.type == 'animationend') {
      eventTarget.setAttribute('aria-hidden', 'true');
    } else if (e.type == 'animationstart') {
      eventTarget.setAttribute('aria-hidden', 'false');
    }
  }
}

const animationTogglers = $$('[data-animation-container]');

animationTogglers.forEach((elem) => new ToggleAnimation(elem));

export default ToggleAnimation;
