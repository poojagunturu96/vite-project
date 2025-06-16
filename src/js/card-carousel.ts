// import { Swiper, Navigation, A11y, SwiperOptions } from 'swiper';

import { $, $$ } from './utils/dom';
import config from './config';

// ie11 polyfill
// https://github.com/nolimits4web/swiper/issues/3698
Number.isNaN =
  Number.isNaN ||
  function (value) {
    return typeof value === 'number' && isNaN(value);
  };

export function randomizeChildren(elem: HTMLElement) {
  for (let i = elem.children.length; i >= 0; i--) {
    elem.appendChild(elem.children[(Math.random() * i) | 0]);
  }
}

const carousels = $$('.js-card-carousel');

carousels.forEach((el: HTMLElement) => {
  import(/* webpackChunkName: "swiper" */ 'swiper').then(
    ({ default: Swiper }) => {
      import(/* webpackChunkName: "swiper" */ 'swiper/modules').then(
        ({ Navigation, A11y }) => {
          function createCardCarousel(elem: HTMLElement, swiperConfig: {}) {
            const swiperWrapper = $('.js-swiper-wrapper', elem);
            const swiperContainer = $('.js-swiper-container', elem);
            const randomize = elem.hasAttribute('data-randomize');

            // do nothing if no swiper elements
            if (
              !swiperWrapper ||
              !swiperWrapper.firstChild ||
              !swiperContainer
            ) {
              return;
            }

            if (randomize) {
              randomizeChildren(swiperWrapper);
            }

            return new Swiper(swiperContainer, swiperConfig);
          }

          const carouselSwiperConfig = {
            modules: [Navigation, A11y],
            a11y: {},
            slidesPerView: 1,
            grabCursor: true,
            breakpoints: {
              [config.breakpoints.lg]: {
                slidesPerView: 2
              },
              [config.breakpoints.xl]: {
                slidesPerView: 3
              }
            },
            navigation: {
              nextEl: $('.js-card-carousel-next-button', el) as HTMLElement,
              prevEl: $('.js-card-carousel-prev-button', el) as HTMLElement,
              disabledClass: 'button--disabled'
            }
          };

          createCardCarousel(el, carouselSwiperConfig);
        }
      );
    }
  );
});
