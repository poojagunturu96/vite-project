import { $, $$ } from './utils/dom';

/**
 * Moves DOM elements around on the page based a breakpoint.
 *
 * Example:
 *
 * <div data-move-at="(min-width:768px)" data-move-to=".js-some-div">move me</div>
 *
 * will move the contents of the div into the data-move-to selector element.
 * It will move the contents BACK after going back under the given breakpoint.
 *
 * warning: does not work if contents requires javascript to function.
 * This is because the html is read and recreated which won't have its original event listeners.
 *
 * @todo: get rid of this and use css grid layout to move elements around on page
 */
class Mover {
  elem: HTMLElement;
  mediaQuery: string | null;
  targetSelector: string | null;
  targetEl?: HTMLElement | null;

  constructor(elem: HTMLElement) {
    this.elem = elem;

    this.mediaQuery = elem.getAttribute('data-move-at');
    this.targetSelector = elem.getAttribute('data-move-to');

    if (this.targetSelector) {
      this.targetEl = $(this.targetSelector);
    }

    this.init();
  }

  init() {
    if (!this.mediaQuery || !this.targetEl) {
      return;
    }

    const mql = window.matchMedia(this.mediaQuery);

    if (mql.matches) {
      this.handleMatch();
    }

    mql.addListener(this.handleMediaChange);
  }

  handleMediaChange = (event: MediaQueryListEvent) => {
    if (event.matches) {
      return this.handleMatch();
    }

    this.handleUnmatch();
  };

  handleMatch = () => {
    /**
     * Query all child nodes of elem.
     *
     * this.elem.childNodes[0] doesn't work since this.elem is cached when
     * the widget is first instantiated.
     *
     * TODO: wildcard selector is probably slow so we should optimize this.
     */
    const el = $$('*', this.elem)[0];

    this.targetEl?.appendChild(el);
  };

  handleUnmatch = () => {
    // Requery child nodes otherwise using the this.targetEl fetches the node which already has been moved.
    // Same problem as handleMatch.
    if (this.targetSelector) {
      const el = $(this.targetSelector);
      if (el) {
        const child = el.childNodes[0];
        this.elem.appendChild(child);
      }
    }
  };
}

const els = $$('[data-move-to]');

els.forEach((el: HTMLElement) => new Mover(el));

export default Mover;
