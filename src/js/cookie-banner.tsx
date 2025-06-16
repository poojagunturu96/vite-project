import { $, $$ } from './utils/dom';

/**
 * Sets up a cookie when the cookie banner is closed, by 
 * checking if the cookie is already set or not.
 */
class CookieBanner {
  /** 
   * The cookie banner
   */
  elem: HTMLElement;

  /**
   * The name of the cookie 
   */
  cookieName: string;

  /**
   * The close button on the cookie banner component
   */
  cookieBannerButton: HTMLElement;

  constructor(elem: HTMLElement) {
    this.elem = elem; 
    this.cookieName = 'MiddCookieBannerAlertClosed';
    this.cookieBannerButton = $('.cookie-banner__button', elem);

    this.setCookie = this.setCookie.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.init();
  }

  init() {
    if(!this.getCookie()) {
      this.elem.classList.remove('is-toggled');
      this.addEventListeners();
    }
  }

  /**
   * Add the click event listener to the close button
   */
  addEventListeners() {
    this.cookieBannerButton.addEventListener('click', this.handleClick);
  }

  /**
   * Sets a cookie with the name of the cookie, expiry date, SameSite attribute and path.
   * 
   * @param duration The duration of time after which the cookie expires
   */
  setCookie(duration: number) {
    const d = new Date();
    const ed = new Date(d.getTime() + (duration * 24 * 60 * 60 * 1000));
    document.cookie = `${this.cookieName}=${d.toUTCString()}; expires=${ed.toUTCString()}; SameSite=Lax; path=/`;
  }
  
  /**
   * Checks if the cookie is set or not.
   * 
   * @returns Value of the cookie if it is set and null if cookie is not set
   */
  getCookie() {
    const cookies = document.cookie.split(';');
  
    const cookieValue = cookies.find(cookie => cookie.includes(this.cookieName));
    
    return cookieValue;
  }
  
  /**
   * Click event handler function that sets a cookie if its not set yet
   */
  handleClick() {
    if(!this.getCookie()) {
      // Set cookie expiration to 1 year after the date and time it was created
      this.setCookie(365);
    }
  }
}

const cookieBanner = $$('.js-cookie-banner');

cookieBanner.forEach(banner => new CookieBanner(banner));