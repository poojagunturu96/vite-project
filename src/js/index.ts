// used in flowchart, offices, lightbox
import 'mdn-polyfills/Element.prototype.closest';

// Polyfill object fit images for easier responsive images.
// Used in card-carousel and more.
import 'object-fit-images';

// Shared imports
import './shared';

/**
 * Custom JS imports
 */

import './single-toggler';
import './group-toggler';
import './shifting-slider'; // slider utility used to slide components on hover
import './video'; // for lazy loading iframes until a video thumbnail is clicked
import './digest'; // table of contents creator
import './responsive-table'; // adds data-th attributes for responsive tables
import './events-datepicker'; // make the events datepicker accessible
import './audio-player'; // custom Preact audio player
import './offices'; // middlebury.edu/office homepage script for filtering items shown
import './mover'; // mover util for moving an element from one element to another at a breakpoint. Doesn't work if event listeners are on any of the elements that are moved.TODO: remove me and use css-grid to move layout around
import './on-load-utils';
import './lightbox';
import './card-carousel';
import './dropdown';
import './drawer';
import './sticky';
import './tabs';
import './select-url';
import './charts';
import './countup';
import './flowchart';
import './helpfulness';
import './homepage-grid';
import './course-list';
import './toggle-animation';
import './dispatches';
import './cookie-banner';
import './quicksearch';
import './utils/chosen';
