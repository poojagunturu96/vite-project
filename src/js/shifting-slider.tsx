import { $, $$ } from './utils/dom';
import Superclamp from 'superclamp';
// import animation from './utils/animation';
import { PREFERS_REDUCED_MOTION } from './utils/prefers-reduced-motion';

/**
 * Adds functionality to the waveform component to make the shift left or right
 * on hovering on the leftmost or rightmost sections of the component work.
 * Adds functionality for showing labels on hover on the waveform bars that follow
 * the cursor as it moves on the bar.
 * Also adds functionality for clamping text that's too long in the cards using the
 * Superclamp library.
 */
class ShiftingSlider {
  /* Element which will be hovered over and will trigger the slide */
  elem: HTMLElement;

  wrapperElem: HTMLElement;

  /* Visible element width on the screen */
  visibleElemWidth: number;

  /* Total element width including the hidden width outside the viewport */
  totalElemWidth: number;

  /* Amount the element can scroll to the left or right */
  scrollWidth: number;

  /* Variable to incrementally shift element left or right */
  shift: number;

  /* Interval id of the current interval running for scroll on hover animation */
  intervalId: any;

  /* Element for the tooltip that appears on hovering over the bars */
  tooltipElem: any;

  /* Caching the previous direction to move waveform to the left if it was moving to the right and vice versa */
  prevDirection: string;

  /* Stores the bar elements of the waveform to make the tooltips work */
  waveformListItems: HTMLElement[];

  /* Stores the delay time in ms for the setTimeout function used by the resize event listener */
  delay: number;

  /* Stores the timeoutID returned by the setTimeout function, which is used clear the timeout */
  timeout: NodeJS.Timeout;

  constructor(elem: HTMLElement) {
    this.elem = elem;
    this.wrapperElem = $('.waveform__wrapper');
    this.shift = 0;
    this.delay = 250;
    this.prevDirection = '';
    this.waveformListItems = $$('.waveform__list-item');
    this.handleHover = this.handleHover.bind(this);
    this.removeTooltip = this.removeTooltip.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.addSuperclampListener = this.addSuperclampListener.bind(this);
    this.init();
  }

  init() {
    // animation();
    this.onWindowResize();
    this.addSuperclampListener();
    window.addEventListener('resize', () => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.onWindowResize, this.delay);
    });

    this.elem.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.code === 'Tab') {
        this.handleKeydown(e);
      }
    });

    if (!PREFERS_REDUCED_MOTION) {
      // Adds intersection observer to make the waveform slide in when
      // it comes into view
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            this.checkElemPosition(entry);

            io.unobserve(this.elem);
          }
        });
      });

      io.observe(this.elem);
    }
  }

  /**
   * Adds event listeners to the waveform component's elements
   */
  addListeners() {
    this.elem.addEventListener('mouseover', this.handleHover);
    this.elem.addEventListener('mousemove', this.handleHover);
    this.elem.addEventListener('mouseout', this.removeTooltip);
    this.wrapperElem.addEventListener('mouseleave', this.handleMouseLeave);

    this.waveformListItems.forEach((listItem) => {
      listItem.addEventListener('mousemove', this.handleMouseMove);
    });
  }

  /**
   * Removes event listeners added to the waveform component's elements
   */
  destroy() {
    this.elem.removeEventListener('mouseover', this.handleHover);
    this.elem.removeEventListener('mousemove', this.handleHover);
    this.elem.removeEventListener('mouseout', this.removeTooltip);
    this.wrapperElem.addEventListener('mouseleave', this.handleMouseLeave);

    this.waveformListItems.forEach((listItem) => {
      listItem.removeEventListener('mousemove', this.handleMouseMove);
    });
  }

  /**
   * Updates the visibleElemWidth, totalElemWidth and scrollWidth on window resize
   * because the width of the waveform changes with the window size.
   * Also removes event listeners on mobile screen size, adds them on desktop screen sizes
   * i.e. > 1024px.
   */
  onWindowResize() {
    // Enable superclamp to clamp overflow text on cards
    Superclamp.register(
      document.querySelectorAll('.waveform__event-card__content--text')
    );

    this.visibleElemWidth = this.elem.offsetWidth;
    this.totalElemWidth = this.elem.scrollWidth;
    this.scrollWidth = this.totalElemWidth - this.visibleElemWidth + 12;

    // Reset the position of waveform from the left based on how much the waveform has been scrolled
    if (parseInt(this.elem.style.left, 10) < -this.scrollWidth) {
      this.elem.style.left = -this.scrollWidth + 'px';
    }

    if (window.innerWidth >= 1024 && !PREFERS_REDUCED_MOTION) {
      this.addListeners();
    } else {
      this.elem.style.left = 0 + 'px';
      this.destroy();
    }
  }

  /**
   * Enables superclamp on clicking on the waveformListItems
   */
  addSuperclampListener() {
    this.waveformListItems.forEach((elem) => {
      elem.addEventListener('click', Superclamp.reclampAll);
      elem.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter') {
          Superclamp.reclampAll();
        }
      });
    });
  }

  /**
   * Used by the intersection observer, adds the fade-in-element class
   * to the element in the entry variable which makes the element slide in
   *
   * @param entry Intersection Observer Entry that you want to add the
   * fade-in-element class to
   */
  checkElemPosition(entry: IntersectionObserverEntry) {
    entry.target.classList.add('fade-in-element');
  }

  /**
   * Updates the left attribute of the waveform based on which section the cursor
   * is hovering on, indicated by the direction variable, which makes the waveform
   * animate.
   *
   * @param direction Direction in which the waveform should move which is either
   * left or right
   */
  scroll(direction: string) {
    var shift =
      this.elem.style.left === '' ? 0 : parseInt(this.elem.style.left, 10);

    this.totalElemWidth = this.elem.scrollWidth;
    this.scrollWidth = this.totalElemWidth - this.visibleElemWidth + 12;

    if (direction === 'right' && shift > -this.scrollWidth) {
      shift--;
    } else if (direction === 'left' && shift < 0) {
      shift++;
    }

    if (shift === 0 || shift <= -this.scrollWidth) {
      this.intervalId = window.cancelAnimationFrame(this.intervalId);
    }

    this.elem.style.left = shift + 'px';
    this.shift = shift;
    this.intervalId = window.requestAnimationFrame(() =>
      this.scroll(direction)
    );
  }

  /**
   * Starts the interval to start the animation
   *
   * @param speed Sets the interval duration which determines how fast or slow
   * the waveform animates
   * @param direction Direction in which the waveform should move which is either
   * left or right
   */
  animate(speed: number, direction: string) {
    // this.intervalId = setInterval(() => this.scroll(direction), speed);
    this.intervalId = window.requestAnimationFrame(() =>
      this.scroll(direction)
    );
  }

  /**
   * Builds the tooltip element and appends it to the bar element the cursor
   * is hovering on
   *
   * @param e the Mouse Event
   * @returns Exits the functipn if there's no data-tooltip attribute set
   */
  handleTooltip(e: MouseEvent | UIEvent) {
    let target = e.target as HTMLElement;

    // if we have tooltip HTML...
    let tooltipHtml = target.dataset.tooltip;
    if (!tooltipHtml) return;

    // ...create the tooltip element
    this.tooltipElem = document.createElement('div');
    this.tooltipElem.className = 'waveform__list-item--tooltip';
    this.tooltipElem.innerHTML = tooltipHtml;
    this.tooltipElem.setAttribute('role', 'tooltip');
    target.appendChild(this.tooltipElem);
  }

  /**
   * Removes the tooltip element when the cursor leaves the bar
   */
  removeTooltip() {
    if (this.tooltipElem) {
      this.tooltipElem.remove();
      this.tooltipElem = null;
    }
  }

  /**
   * Clears the current interval to stop the waveform animation
   */
  handleMouseLeave() {
    if (this.intervalId) {
      this.intervalId = window.cancelAnimationFrame(this.intervalId);
      this.setDirection('');
    }
  }

  /**
   * Caches the current direction in the prevDirection variable for using
   *
   * @param direction Current direction of movement
   */
  setDirection(direction: string) {
    this.prevDirection = direction;
  }

  /**
   * Function to handle shifting the waveform left or right based
   * on where you hover on the waveform.
   *
   * @param e The Mouse Event
   */
  handleHover(e: MouseEvent) {
    if (e.type == 'mouseover') {
      this.handleTooltip(e);
    }

    if (this.elem.style.overflow === 'scroll') {
      this.elem.style.overflow = 'initial';
      this.elem.style.left = this.shift + 'px';
    }

    var x = e.clientX;
    var direction = '';

    var el = this.wrapperElem;
    var viewportOffset = el.getBoundingClientRect();
    var left = viewportOffset.left;

    if (x - left < this.visibleElemWidth * 0.125) {
      direction = 'left';
    } else if (x - left > this.visibleElemWidth * 0.875) {
      direction = 'right';
    } else {
      direction = '';
    }

    if (direction !== this.prevDirection) {
      if (this.intervalId) {
        this.intervalId = window.cancelAnimationFrame(this.intervalId);
      }
      if (direction !== '') {
        this.animate(10, direction);
      }
    }
    this.setDirection(direction);
  }

  handleKeydown(e: KeyboardEvent) {
    this.elem.style.left = 0 + 'px';
    this.elem.style.overflow = 'scroll';
    this.shift = -this.elem.scrollLeft;
  }

  /**
   * Function to handle making the tooltip appear on hover and follow the cursor
   * while it is on the bar of the waveform.
   *
   * @param e The Mouse Event
   */
  handleMouseMove(e: MouseEvent) {
    if (this.tooltipElem) {
      var rightSpace = document.body.clientWidth - e.pageX;

      if (rightSpace <= this.tooltipElem.offsetWidth) {
        this.tooltipElem.style.left =
          -(this.tooltipElem.offsetWidth - rightSpace) + e.clientX + 'px';
      } else {
        this.tooltipElem.style.left = -20 + e.clientX + 'px';
      }
      this.tooltipElem.style.top = -50 + e.clientY + 'px';
    }
  }
}

const shiftingSliders = $$('.shifting-slider');

shiftingSliders.forEach((elem) => new ShiftingSlider(elem));

export default ShiftingSlider;
