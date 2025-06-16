import { h, render } from 'preact';
import AnchorJS from 'anchor-js';
import SmoothScroll from './smooth-scroll';

import { $, $$ } from './utils/dom';
import MenuSpy from './menu-spy';
import { head } from 'lodash';

const isSelectorValid = (selector: string) => {
  const queryCheck = (s: string) =>
    document.createDocumentFragment().querySelector(s);

  try {
    queryCheck(selector);
  } catch {
    return false;
  }

  return true;
};

const DigestNav = ({ items = [] }) => {
  return (
    <nav className="digest" aria-labelledby="midd-digest-label">
      <h2 className="digest__title" id="midd-digest-label">
        On this page
      </h2>
      <ol className="digest__list">
        {items.map((item: HTMLElement, i: number) => {
          return (
            <li key={i} className="digest__item">
              <a href={`#${item.id}`} className="digest__link">
                {item.textContent}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

function addHeadingAnchors(): HTMLElement[] | null {
  // Store the selector since we need to manually update headings
  // as well as apply AnochrJS to them.
  // first-child gets section__titles and > h2 gets children of text components
  const headingSelector =
    '[data-digest-content] h2:not(:empty):first-child, [data-digest-content] > h2:not(:empty)';

  // Get all headings in the data-digest-content
  const headings = $$(headingSelector);

  if (!headings.length) {
    return null;
  }

  // create a new instance of anchorjs which creates the anchor links within each heading
  const anchors = new AnchorJS();
  anchors.add(headingSelector);

  headings.forEach((heading) => {
    // Replace nbsps in heading id caused by d8 typogrify module.
    // These nonbreaking spaces are intended to prevent typographic widows.
    let id = heading.id
      // replace spaces e.g. nbsp
      .replace(/\s/g, '-')
      // replace single/double curly quotes and degree character
      .replace(/[\u201C\u201D\u2018\u2019°]/g, '')
      // replace double hyphens with one
      .replace(/-+/g, '-');

    // if heading text begins with a number or if it's not an alphabet, we need to prefix some a-z text
    // so selectors in digest nav are valid
    if (!isNaN(Number(id.charAt(0))) || !/[a-zA-Z]/.test(id.charAt(0))) {
      id = 'section-' + id.replace(/^-/g, '');
    }

    const anchor = $('.anchorjs-link', heading);
    anchor.href = '#' + id;

    heading.id = id;
  });

  return headings;
}

function renderDigestNav(elem: HTMLElement, headings: HTMLElement[]) {
  render(
    <DigestNav
      // convert nodelist into array for items prop
      items={[].slice.call(headings)}
    />,
    elem
  );

  const menuSpy = new MenuSpy(elem);

  // TODO: don't tie the js-headroom to this widget as the element.
  // we should allow for a custom selector
  const headroom = $('.js-headroom') as HTMLElement;

  // Offset by sticky header on schools or base offset on office site.
  // This is a function call instead of static value since header height
  // changes across breakpoints.
  const baseOffset = 50;
  const getOffset = () => (headroom ? headroom.offsetHeight : baseOffset);

  const smoothScroll = new SmoothScroll('.digest__link', {
    offset: getOffset,
    replaceState: true
  });

  const { hash } = window.location;

  if (!isSelectorValid(hash)) {
    console.warn('Invalid selector', hash);
    return;
  }

  if (hash) {
    const el = $(hash);

    // fake jump to elem since headings don't have IDs until js is loaded
    if (el) {
      setTimeout(() => {
        el.scrollIntoView();
      }, 300);
    }
  }
}

const headings = addHeadingAnchors();

const elems = $$('[data-digest-nav]');

elems.forEach((elem) => {
  if (!headings) {
    return;
  }

  renderDigestNav(elem, headings);
});
