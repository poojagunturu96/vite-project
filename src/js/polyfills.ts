/**
 * Common polyfills to support ie11 and other old browsers
 */

// used in  lozad, micromodal
import 'mdn-polyfills/Object.assign';

// used in micromodal
import 'mdn-polyfills/Array.from';

// for document.querySelectorAll('.thing).forEach()
import 'mdn-polyfills/NodeList.prototype.forEach';

// Intersection observer for IE and Safari.
// Used in menu-spy, chart animations plugin, lightbox gallery, and lozad package.
// https://caniuse.com/intersectionobserver
import 'intersection-observer';

// polyfill :focus-within for tab accessible menus
// https://caniuse.com/css-focus-within
import 'focus-within-polyfill';

// Lightweight ES6 Promise polyfill for the browser and node
import 'promise-polyfill/src/polyfill';

// requestAnimationFrame polyfill
import './utils/animation-polyfill';

// Vite module preload polyfill
// https://vite.dev/config/build-options.html#build-modulepreload
import 'vite/modulepreload-polyfill';
