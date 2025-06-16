import { $, $$ } from './utils/dom';

/**
 * Takes a list of anchor links and watches each of their targets to see if they're
 * within the center of the viewport, so their active class can be added. Use in table of contents and
 * highlighting the current section viewed on the page.
 *
 * Commonly used in combination with anchor-js (which auto adds the ids to any headings on the page)
 * and digest.js (which creates the menu of links FROM those newly created headings with ids)
 *
 *
 * @example
 * ```html
 * <ul data-spyme>
 *   <li><a href="#target-1">target 1</a></li>
 *   <li><a href="#target-2">target 2</a></li>
 *   <li><a href="#target-2">target 3</a></li>
 * </ul>
 * ```
 *
 * ```js
 * const spy = new MenuSpy('[data-spyme]');
 * ```
 */
class MenuSpy {
  activeClass: string;
  elem: HTMLElement;
  links: HTMLAnchorElement[];

  constructor(elem: string | HTMLElement) {
    this.activeClass = 'active';

    this.elem = typeof elem === 'string' ? $(elem) : elem;

    this.links = $$(
      'a[href^="#"]:not([href="#"])',
      this.elem
    ) as HTMLAnchorElement[];

    this.init();
  }

  // start observing each anchor link target to watch
  init() {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0% 0% -50% 0%', // center of viewport
      threshold: [0, 1]
    };

    const observer = new IntersectionObserver(this.onChange, options);

    this.links.forEach((link: HTMLElement) => {
      const selector = link.getAttribute('href');

      if (!selector) {
        console.warn('no selector for ', link);
        return;
      }

      const el = $(selector);

      if (!el) {
        console.warn('no element found for selector', el);
        return;
      }

      observer.observe(el);
    });
  }

  removeActiveClass() {
    const activeLink = $(`.${this.activeClass}`, this.elem);

    if (activeLink) {
      activeLink.classList.remove(this.activeClass);
    }
  }

  // handle intersection observer events
  onChange = (changes: any) => {
    // reverse the changes else the last item becomes highlighted
    // due to it being out of view and triggering the else if
    changes.reverse().forEach((change: any) => {
      const { id } = change.target;
      const link = $(`a[href="#${id}"]`, this.elem);

      if (!link) return;

      // if the element is fully in view, add the active class
      if (change.intersectionRatio === 1) {
        this.removeActiveClass();

        link.parentElement?.classList.add(this.activeClass);
      }
      // highlights the previous item after a heading moves just under center of viewport
      else if (
        // when section goes out
        change.intersectionRatio === 0 &&
        // check if positive number i.e. below the center of viewport
        change.boundingClientRect.y > 0
      ) {
        // get the index of the current active item
        const idx = this.links.indexOf(link);

        // do nothing if there's no previous items
        if (idx === 0) {
          return;
        }

        // find the previous section link
        const prevLink = this.links[idx - 1];

        const item = prevLink.parentElement;

        item?.classList.add(this.activeClass);

        this.removeActiveClass();
      }
    });
  };
}

export default MenuSpy;
