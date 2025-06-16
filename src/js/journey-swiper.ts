import { $, $$, checkElement } from './utils/dom';
import VideoSwap from './video';
import lozad from 'lozad';
import { animate } from 'animejs';

class JourneySwiper {
  swiperEl: any;
  elem: HTMLElement;
  modalElem: HTMLElement;
  swiperClass: string;
  paginationEl: HTMLElement;
  paginationClass: string;
  paginationDotEls: HTMLElement[];
  currentEl: HTMLElement;
  swiperParentEl: HTMLElement;
  swiperParentWrapperEl: HTMLElement;
  swiperConfig: Object;
  translate: number;
  halfWindowWidth: number;
  hiddenWidth: number;
  timeout: NodeJS.Timeout;
  activeVideoClass: string;
  closeBtn: HTMLElement;
  loadingEls: HTMLElement[];

  constructor(el: HTMLElement) {
    this.elem = el;
    this.modalElem = $('.journey-modal--block');
    this.swiperClass = '.journey-swiper';
    this.paginationClass = '.swiper-pagination';
    this.paginationEl = $(this.paginationClass);
    this.swiperParentEl = $('.journey-modal__pagination');
    this.swiperParentWrapperEl = $('.journey-modal__pagination-wrapper');
    this.activeVideoClass = 'has-video';
    this.translate = 0;
    this.halfWindowWidth = window.innerWidth / 2;
    this.closeBtn = $('[data-journey-overlay-close]');
    this.loadingEls = $$('[data-loading]');

    this.swiperInit = this.swiperInit.bind(this);
    this.swiperUpdate = this.swiperUpdate.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.handleHashChange = this.handleHashChange.bind(this);
    this.resetNavigation = this.resetNavigation.bind(this);
    this.init();
  }

  elementOnLoad(cn: string, cb: (...args: any[]) => void) {
    checkElement(cn).then((selector) => {
      cb(selector);
    });
  }

  init() {
    this.swiperInit();
    this.addListeners();
  }

  async getSwiper() {
    return import(/* webpackChunkName: "swiper" */ 'swiper')
      .then(({ default: Swiper }) => {
        import(/* webpackChunkName: "swiper" */ 'swiper/modules').then(
          ({ Navigation, Pagination, HashNavigation, A11y }) => {
            this.loadingEls.forEach((el) => el.classList.add('has-loaded'));

            this.swiperEl = new Swiper(this.swiperClass, {
              modules: [Navigation, Pagination, HashNavigation, A11y],
              autoHeight: true,
              hashNavigation: {
                replaceState: true,
                watchState: true
              },
              navigation: {
                nextEl: '.js-journey-next-button',
                prevEl: '.js-journey-prev-button'
              },
              pagination: {
                el: this.paginationClass,
                bulletClass: 'journey-modal__cb-link',
                clickable: true,
                renderBullet: function (index, className) {
                  const labels = [
                    'Why Middlebury',
                    'Immersive Environments',
                    'The Undergraduate Experience',
                    'Alumni in the World',
                    'Middlebury in the News',
                    'Students in Action',
                    'Connected Middlebury',
                    'Middlebury College',
                    'Graduate and Professional Schools'
                  ];
                  return `
                  <a class="journey-modal__cb-link ${className}" href="#" role="button">
                    <span class="cb-link__text">
                      ${labels[index]}
                    </span>
                    <span class="cb-link__circle-wrapper">
                      <span class="cb-link__circle inner"></span>
                      <span class="cb-link__circle outer"></span>
                    </span>
                  </a>`;
                }
              },
              on: {
                slideNextTransitionStart: (swiper) => {
                  swiper.allowSlideNext = false;
                },
                slideNextTransitionEnd: (swiper) => {
                  swiper.allowSlideNext = true;
                },
                slidePrevTransitionStart: (swiper) => {
                  swiper.allowSlidePrev = false;
                },
                slidePrevTransitionEnd: (swiper) => {
                  swiper.allowSlidePrev = true;
                },
                transitionStart: () => {
                  this.swiperUpdate();
                  this.scrollToTop();
                }
              }
            });
          }
        );
      })
      .catch((error) => 'An error occurred while loading Swiper');
  }

  swiperInit() {
    this.getSwiper().then(() => {
      this.closeBtn.focus();
      // init lazy loaded gallery images
      const lazyGalleryImages = lozad('[data-journey-gallery-item] img');
      lazyGalleryImages.observe();

      this.swiperParentEl.style.transform = `translateX(${this.translate}px)`;

      // Initialize video elements with VideoSwap class to enable showing/hiding videos
      this.initVideoElems();
    });
  }

  addListeners() {
    this.elementOnLoad('.journey-modal__cb-link', (selector) => {
      this.paginationDotEls = $$(selector);
      this.paginationDotEls.forEach((el) => {
        if (window.matchMedia('(min-width: 1024px)').matches) {
          el.addEventListener('mouseenter', (e) => {
            this.handleMouseEvent(e);
          });
          el.addEventListener('mouseleave', (e) => {
            this.handleMouseEvent(e);
          });
        }
      });
    });

    // Adjust slide height when transcript button is opened or closed
    $$('.transcript__button').forEach((el) => {
      el.addEventListener('click', (e) => {
        this.swiperEl?.updateAutoHeight(50);
      });
    });

    // Adding resize event listener only on tablet and desktop because resize event fires on scroll on mobile
    if (window.matchMedia('(min-width: 512px)').matches) {
      window.addEventListener('resize', (e) => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.resetNavigation, 250);
      });
    }

    window.addEventListener('hashchange', (e) => {
      this.elementOnLoad(
        '.journey-modal--block.is-open',
        this.handleHashChange
      );
    });
  }

  scrollToTop() {
    if (this.modalElem.scrollTop > 0) {
      animate(this.modalElem, {
        scrollTop: 0,
        ease: 'inSine',
        autoplay: true,
        duration: 300
      });
    }
  }

  handleHashChange() {
    const hash = parseInt(window.location.hash.replace('#slide', ''));
    const { MicroModal } = window;
    if (isNaN(hash)) {
      MicroModal?.close();
    } else if (hash !== this.swiperEl?.activeIndex) {
      this.swiperEl?.slideTo(hash, 300, false);
    } else if (hash == this.swiperEl?.activeIndex) {
      this.swiperUpdate();
    }
  }

  resetNavigation() {
    this.halfWindowWidth = window.innerWidth / 2;
    this.swiperUpdate();
  }

  handleMouseEvent(e: MouseEvent) {
    const parentElem = (e.target as HTMLInputElement).parentElement;
    if (e.type === 'mouseenter') {
      parentElem.classList.add('show-label');
    } else if (e.type === 'mouseleave') {
      parentElem.classList.remove('show-label');
    }
  }

  initVideoElems() {
    $$('.js-expand-video', this.elem).forEach((elem) => new VideoSwap(elem));
  }

  swiperUpdate() {
    this.currentEl = $('.swiper-pagination-bullet-active', this.paginationEl);
    let scrollWidth = this.swiperParentEl.scrollWidth;

    // Check if the scrolling distance exceeds the element width,
    // if it does set it to the element width so that it doesn't
    // scroll past the width
    if (scrollWidth > this.swiperParentEl.offsetWidth) {
      scrollWidth = this.swiperParentEl.offsetWidth;
    }

    this.hiddenWidth = scrollWidth - this.swiperParentWrapperEl.offsetWidth;

    const currentElLeft = this.currentEl?.getBoundingClientRect().left;

    if (this.currentEl) {
      this.translate =
        this.translate + (this.halfWindowWidth - currentElLeft - 16);

      if (this.translate > 0) {
        this.translate = 0;
      }

      if (Math.abs(this.translate) > this.hiddenWidth) {
        this.translate = -this.hiddenWidth;
      }

      if (this.translate <= 0 && Math.abs(this.translate) <= this.hiddenWidth) {
        this.swiperParentEl.style.transform = `translateX(${this.translate}px)`;
      }
    }
  }
}

export default JourneySwiper;
