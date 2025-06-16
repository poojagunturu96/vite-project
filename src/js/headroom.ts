import Headroom from 'headroom.js';

import { $, $$ } from './utils/dom';

const headerElem = $('.js-headroom');

const curriculumHeaderElems = $$('.js-curriculum-headroom');

let offset: number;

if (headerElem && !$('#toolbar-administration')) {
  offset = headerElem.offsetHeight;

  const headerInstance = new Headroom(headerElem, {
    offset,
    tolerance: {
      up: 10,
      down: 0
    },
    // $('#midd-journey-overlay') is for the modal header on the institutional homepage,
    // If it is present, we make the modal div the scrolling context
    scroller: $('#midd-journey-overlay') || window
  });

  document.body.style.paddingTop = offset + 'px';

  headerInstance.init();

  // hide sticky header if user navigated to page via anchor hash link
  // fixes https://github.com/middlebury/midd-frontend/issues/241
  if (window.location.hash && !$('#midd-journey-overlay')) {
    // unpin after a delay so user is given some context as
    // to where they are via header
    setTimeout(function () {
      headerInstance.unpin();
    }, 1000);
  }

  if (curriculumHeaderElems.length > 0) {
    curriculumHeaderElems.forEach((curriculumHeaderElem) => {
      const curriculumHeaderInstance = new Headroom(curriculumHeaderElem, {
        offset,
        tolerance: {
          up: 10,
          down: 0
        }
      });

      curriculumHeaderInstance.init();
    });
  }
}
