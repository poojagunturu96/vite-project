import { animate, createSpring } from 'animejs';

import { $, $$, on, off, removeClass, addClass, hasClass } from './utils/dom';
import { PREFERS_REDUCED_MOTION } from './utils/prefers-reduced-motion';

/**
 * Creates a flowchart of question and answers a user can click through
 * to resolve on a final answer to the user based on their questions.
 *
 * @example
 * ```html
 * <div data-flowchart>
 *  <div id="flowchart-item-1" data-flowchart-item>
 *    <h2>Do you like oranges?</h2>
 *    <a href="#flowchart-item-2" data-flowchart-btn>Yes</a>
 *    <a href="#flowchart-item-3" data-flowchart-btn>No</a>
 *  </div>
 *  <div id="flowchart-item-2" data-flowchart-item>
 *    <p>You like oranges.</p>
 *  </div>
 *  <div id="flowchart-item-3" data-flowchart-item>
 *    <p>You don't like oranges.</p>
 *  </div>
 * </div>
 * ```
 */
class Flowchart {
  btnActiveClass: string;
  btns: HTMLElement[];
  elem: HTMLElement;
  itemActiveClass: string;
  items: HTMLElement[];
  shownIds: string[];

  constructor(el: HTMLElement) {
    this.elem = el;

    this.items = $$('[data-flowchart-item]', el);
    this.btns = $$('[data-flowchart-btn]', el);

    this.btnActiveClass = 'radio__label--checked';
    this.itemActiveClass = 'flowchart__item--active';

    // Store the ids of answered questions so we can backtrack
    // if the user changes their answer to a given question
    this.shownIds = [];

    this.init();
  }

  init() {
    this.elem.setAttribute('aria-live', 'polite');

    // Hide all items except first question.
    this.items.forEach((el: HTMLElement, i: number) => {
      el.setAttribute('tabindex', '-1');

      // Do nothing if iterating on the first item e.g. do not hide it
      if (i === 0) {
        // Add the first item to list of shown ids
        this.shownIds.push(el.id);
        addClass(el, this.itemActiveClass);
        return;
      }

      // hide other items
      el.hidden = true;
    });

    this.addListeners();
  }

  addListeners() {
    this.btns.forEach((btn: HTMLElement) =>
      on(btn, 'click', this.handleBtnClick)
    );
  }

  handleBtnClick = (event: Event) => {
    event.preventDefault();

    const btn = event.target as HTMLElement;
    const btnParent = btn.closest('[data-flowchart-item]');
    const targetId = btn.getAttribute('href')?.replace('#', '');
    const target = $('#' + targetId, this.elem);

    if (!btnParent) return;

    const itemIdIndex = this.shownIds.indexOf(btnParent.id);

    if (!target || !targetId) {
      console.warn('no target or target ID for flowchart', btn);
      return;
    }

    this.items.forEach((item: HTMLElement) =>
      removeClass(item, this.itemActiveClass)
    );

    // remove active state style from other answers in the chosen question
    const btns = $$(
      `[data-flowchart-item][hidden] [data-flowchart-btn],
      #${btnParent.id} [data-flowchart-btn]`,
      this.elem
    );

    // remove active state style from necessary buttons
    btns.forEach((el) => removeClass(el, this.btnActiveClass));

    // set the chosen answer as active
    addClass(btn, this.btnActiveClass);

    // if the button being clicked is in a previous question
    if (itemIdIndex >= 0) {
      // get all the ids after the question with an answer being modified
      const afterCurrentItemIds = this.shownIds.filter(
        (id: string, index: number) => index > itemIdIndex
      );

      const beforeCurrentItemIds = this.shownIds.filter(
        (id: string, index: number) => index <= itemIdIndex
      );

      this.shownIds = beforeCurrentItemIds;

      // hide all items shown after the updated question
      afterCurrentItemIds.forEach((id: string) => {
        const el = $('#' + id);
        if (el) {
          el.hidden = true;
        }
      });
    }

    // show the next target
    this.shownIds.push(targetId);

    target.removeAttribute('hidden');

    const duration = PREFERS_REDUCED_MOTION ? 0 : 400;

    animate([target], {
      translateX: [-40, 0],
      ease: 'outElastic(1, 0.5)',
      duration
    });

    target.focus();
    if (!hasClass(target, 'flowchart__item--answer')) {
      addClass(target, this.itemActiveClass);
    }

    // // scroll the target to the center of the viewport
    const rect = target.getBoundingClientRect();
    const scrollPosition = window.pageYOffset;
    const scrollTop = rect.top + scrollPosition - window.innerHeight / 2;

    animate([document.documentElement, document.body], {
      scrollTop,
      duration
    });
  };
}

const els = $$('[data-flowchart]');

els.forEach((el) => new Flowchart(el));
