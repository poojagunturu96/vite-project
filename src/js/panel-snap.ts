import { $, $$ } from './utils/dom';
import { PREFERS_REDUCED_MOTION } from './utils/prefers-reduced-motion';
import { VALID_ASPECT_RATIO } from './utils/check-aspect-ratio';

// Check if section height is less than the viewport height. If it is less than the viewport height,
// then set the directionThreshold as the difference to prevent scroll issues.
let deltaY =
  window.innerHeight - $('.journey section').getBoundingClientRect().height;

let defaultOptions = {
  container: document.body,
  panelSelector: '.journey section',
  directionThreshold: deltaY > 0 ? deltaY : 50,
  delay: 0,
  duration: 600,
  easing: function (t: any) {
    return t;
  }
};

async function lazyLoadPanelSnap() {
  if (VALID_ASPECT_RATIO && !PREFERS_REDUCED_MOTION) {
    const { default: PanelSnap } = await import(
      /* webpackChunkName: "panelsnap" */ 'panelsnap'
    );

    journey.forEach(() => new PanelSnap(defaultOptions));
  }
}

const journey = $$('.journey');

if (journey.length !== 0) {
  lazyLoadPanelSnap().catch(
    (error) => 'An error occurred while loading panelsnap'
  );
}
