import MicroModal from 'micromodal';
import { animate, JSAnimation } from 'animejs';
import { $, $$, addClass } from './utils/dom';
import JourneySwiper from './journey-swiper';
import onscroll from './utils/onscroll';
import { PREFERS_REDUCED_MOTION } from './utils/prefers-reduced-motion';

class Journey {
  elem: HTMLElement;
  pathEl: SVGGeometryElement;
  animPauseThreshold: number;
  totalPathLength: number;
  journeyLineAnimInstance: JSAnimation;
  journeySections: HTMLElement[];
  firstSection: HTMLElement;
  io: IntersectionObserver;
  deviceType: string;
  timeout: NodeJS.Timeout;
  scrollRef: object;
  sectionNames: string[];
  sectionIndex: number;
  sectionLinksElems: {
    [key: number]: HTMLElement;
  };
  deviceInfo: {
    [key: string]: {
      [key: string]: number[];
    };
  };

  constructor(el: HTMLElement) {
    this.elem = el;
    this.journeySections = $$('.js-journey-section');
    this.firstSection = this.journeySections.shift();
    this.animPauseThreshold = 0;
    this.sectionIndex = 0;
    this.sectionNames = ['learning', 'thinking', 'opportunity'];
    this.sectionLinksElems = {};
    this.deviceInfo = {
      desktop: {
        dotsAnimBreaks: [0, 34, 70],
        lineAnimBreaks: [25, 60, 101]
      },
      tablet: {
        dotsAnimBreaks: [0, 39, 77],
        lineAnimBreaks: [29, 67, 101]
      },
      mobile: {
        dotsAnimBreaks: [0, 32, 70],
        lineAnimBreaks: [28, 65, 101]
      }
    };

    this.handleIntersection = this.handleIntersection.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.deviceInit = this.deviceInit.bind(this);
    this.init();
  }

  init() {
    window.location.hash = '';
    this.deviceInit();
    this.addListeners();

    if (!PREFERS_REDUCED_MOTION) {
      this.svgInit();
      this.animInit();
      this.sectionInit();
    }
  }

  deviceInit() {
    this.handleScroll();
    if (window.matchMedia('(min-width: 1024px)').matches) {
      this.deviceType = 'desktop';
    } else if (window.matchMedia('(min-width: 512px)').matches) {
      this.deviceType = 'tablet';
    } else {
      this.deviceType = 'mobile';
    }

    this.pathEl = $(`.journey-line--${this.deviceType} path`, this.elem);
    for (let i = 0; i < 3; i++) {
      this.sectionLinksElems[i] = $(
        `.journey-links--${this.deviceType} .${this.sectionNames[i]}`
      );
    }
  }

  addListeners() {
    window.addEventListener('resize', (e) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.handleScroll, 250);
    });

    this.scrollRef = onscroll(this.handleScroll);

    Object.values(this.sectionLinksElems).forEach((el) =>
      $('.journey--link:last-child', el).addEventListener(
        'animationend',
        () => {
          addClass(el, 'disable-animate');
        }
      )
    );
  }

  handleScroll() {
    if (
      this.firstSection.clientHeight - window.innerHeight >
      -this.firstSection.getBoundingClientRect().top
    ) {
      $('.school-picker').classList.remove('not-fixed');
    } else {
      $('.school-picker').classList.add('not-fixed');
    }
  }

  svgInit() {
    this.totalPathLength = this.pathEl.getTotalLength();
    const dashing = '4, 4';

    const dashLength = dashing
      .split(/[\s,]/)
      .map((a) => parseFloat(a) || 0)
      .reduce((a, b) => a + b, 0);

    const dashCount = Math.ceil(this.totalPathLength / dashLength) + 1;
    const newDashes = new Array(dashCount).join(dashing + ' ');
    const dashArray = newDashes + ' 0, ' + this.totalPathLength;

    this.pathEl.setAttribute('stroke-dashoffset', `${this.totalPathLength}`);

    this.pathEl.setAttribute('stroke-dasharray', dashArray);
  }

  animInit() {
    this.journeyLineAnimInstance = animate(this.pathEl, {
      strokeDashoffset: [this.totalPathLength, 0],
      duration: 10000,
      ease: 'linear',
      autoplay: false,
      onUpdate: (self: JSAnimation) => {
        this.animUpdate(self);
      }
    });
  }

  getAnimationThreshold(index: number, type: string) {
    if (type === 'line') {
      return this.deviceInfo[this.deviceType].lineAnimBreaks[index];
    } else {
      return this.deviceInfo[this.deviceType].dotsAnimBreaks[index];
    }
  }

  animUpdate(anim: JSAnimation) {
    const animProgress = Math.round(anim.progress * 100);

    // Logic for the dots to animate
    for (let i = 0; i < this.sectionNames.length; i++) {
      if (animProgress >= this.getAnimationThreshold(i, 'dots')) {
        this.sectionIndex = i;
      }
    }

    addClass(this.sectionLinksElems[this.sectionIndex], 'animate');

    if (
      animProgress >= this.animPauseThreshold - 0.5 &&
      animProgress <= this.animPauseThreshold + 0.5
    ) {
      this.journeyLineAnimInstance.pause();
    }
  }

  sectionInit() {
    this.io = new IntersectionObserver(this.handleIntersection, {
      threshold: 0.4 // add class when elem is half in view
    });

    this.journeySections.forEach((section) => this.io.observe(section));
  }

  loadVideo(section: HTMLElement) {
    let videoElem = $('.journey-section__video', section);
    let source = $('source', videoElem);
    source.src = source.dataset.src;
    videoElem.load();
  }

  handleIntersection(entries: any) {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        // entry.target.classList.add('active');
        let entryId = 0;
        const currentSection = entry.target.id;

        if (currentSection === this.sectionNames[0]) {
          entryId = 0;
        } else if (currentSection === this.sectionNames[1]) {
          entryId = 1;
        } else if (currentSection === this.sectionNames[2]) {
          entryId = 2;
        }

        if (
          window.matchMedia('(min-width: 512px)').matches &&
          !PREFERS_REDUCED_MOTION
        ) {
          this.loadVideo(entry.target);
        }
        // console.log(
        //   this.getAnimationThreshold(entryId, 'line'),
        //   this.animPauseThreshold
        // );
        if (
          this.getAnimationThreshold(entryId, 'line') > this.animPauseThreshold
        ) {
          this.animPauseThreshold = this.getAnimationThreshold(entryId, 'line');
          this.journeyLineAnimInstance.play();
        }

        this.io.unobserve(entry.target);
      }
    });
  }
}

MicroModal.init({
  openTrigger: 'data-journey-overlay-open',
  closeTrigger: 'data-journey-overlay-close',
  onShow: (modal: any) => {
    if (!modal.swiper) {
      const swiper = $('.journey-swiper');
      modal.swiper = new JourneySwiper(swiper);
    }
    if (modal.swiper) {
      modal.swiper.scrollToTop();
    }

    $$('[data-journey-overlay-close]', modal).forEach((el) => el.focus());
  },
  disableScroll: true
});

const journey = $$('.journey');

journey.forEach((item: HTMLElement) => new Journey(item));
