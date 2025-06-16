import { $, $$ } from './utils/dom';

/**
 * Adds filtering capabilities to the course list component.
 *
 * Courses in the course list can have three states:
 *   1. Current course, taught this semester.
 *   2. Upcoming course, taught in the next semester.
 *   3. Neither current nor upcoming.
 *
 * It is possible for a course to be both current and upcoming. THe course
 * list has three radio buttons which allow the user to see all of the courses
 * at once, or just the current courses, or just the upcoming courses. This
 * class determines which radio button is selected and filters the course list
 * so that courses with the corresponding state(s) are shown.
 */
class CourseListFilter {
  /**
   * The radio buttons.
   */
  elem: HTMLElement;

  /**
   * The id of the course list with the button.
   *
   * There may be multiple course lists on a single page, so this will allow
   * us to determine whether a course is related to the radio button clicked.
   */
  listid: string;

  /**
   * The list of courses related to the radio button.
   */
  courses: HTMLElement[];

  /**
   * Class to add when the course is hidden.
   */
  hiddenClass: string;

  /**
   * The class name applied to accordion items of current courses.
   */
  currentClass: string;

  /**
   * The class name applied to accordion items of upcoming courses.
   */
  upcomingClass: string;

  /**
   * The class name applied to the radio button to show all courses.
   */
  allCoursesClass: string;

  /**
   * The class name applied to the radio button to show current courses.
   */
  currentCoursesClass: string;

  /**
   * The class name applied to the radio button to show upcoming courses.
   */
  upcomingCoursesClass: string;

  constructor(elem: HTMLElement) {
    this.elem = elem;
    this.listid = this.elem.getAttribute('data-course-filter');
    this.courses = $$('.js-filter-' + this.listid + ' .accordion-item');

    this.hiddenClass = 'course-hidden';
    this.currentClass = 'accordion-item-current';
    this.upcomingClass = 'accordion-item-upcoming';

    this.allCoursesClass = 'course-list-filter-all';
    this.currentCoursesClass = 'course-list-filter-current';
    this.upcomingCoursesClass = 'course-list-filter-upcoming';

    this.handleElemClick = this.handleElemClick.bind(this);

    this.init();
  }

  init() {
    if (!this.courses) {
      return;
    }

    this.addListeners();
  }

  addListeners() {
    this.elem.addEventListener('click', this.handleElemClick);
  }

  /**
   * Determine whether a course in the list is currently hidden.
   *
   * @param elem A course accordion item.
   * @returns true if the course is currently hidden, false otherwise.
   */
  isHidden(elem: HTMLElement) {
    return elem.classList.contains(this.hiddenClass);
  }

  /**
   * Determine whether a course in the list is currenlty taught.
   *
   * @param elem A course accordion item.
   * @returns true if the course is currently taught, false otherwise.
   */
  isCurrent(elem: HTMLElement) {
    return elem.classList.contains(this.currentClass);
  }

  /**
   * Determine whether a course in the list will be taught next semester.
   *
   * @param elem A course accordion item.
   * @returns true if the course will be taught next semester, false otherwise.
   */
  isUpcoming(elem: HTMLElement) {
    return elem.classList.contains(this.upcomingClass);
  }

  /**
   * Respond to a radio button being clicked.
   *
   * @param e The click event.
   */
  handleElemClick(e: Event) {
    this.toggle();
  }

  /**
   * Remove any class that hides a course in the list.
   *
   * @param elem A course accordion item.
   */
  show(elem: HTMLElement) {
    if (elem) {
      elem.classList.remove(this.hiddenClass);
    }
  }

  /**
   * Add a class to hide a course in the list.
   *
   * @param elem A course accordion item.
   */
  hide(elem: HTMLElement) {
    if (elem) {
      elem.classList.add(this.hiddenClass);
    }
  }

  /**
   * When a radio button is clicked, show or hide courses.
   */
  toggle() {
    if (this.elem.classList.contains(this.allCoursesClass)) {
      this.courses.forEach((elem) => {
        if (this.isHidden(elem as HTMLElement)) {
          this.show(elem as HTMLElement);
        }
      });
    } else if (this.elem.classList.contains(this.currentCoursesClass)) {
      this.courses.forEach((elem) => {
        if (this.isCurrent(elem as HTMLElement)) {
          this.show(elem as HTMLElement);
        } else {
          this.hide(elem as HTMLElement);
        }
      });
    } else if (this.elem.classList.contains(this.upcomingCoursesClass)) {
      this.courses.forEach((elem) => {
        if (this.isUpcoming(elem as HTMLElement)) {
          this.show(elem as HTMLElement);
        } else {
          this.hide(elem as HTMLElement);
        }
      });
    }
  }
}

const courseListFilters = $$('.course-list-filter');

courseListFilters.forEach((elem) => new CourseListFilter(elem));

export default CourseListFilter;
