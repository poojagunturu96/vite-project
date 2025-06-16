import { $, $$, on } from './utils/dom';

/**
 * Accessible tabs widget
 *
 * Adapted from https://inclusive-components.design/tabbed-interfaces/
 *
 * @example
 * ```html
 * <div class="tabs" data-tabs>
 *   <div class="tabs__nav">
 *     <ul class="tabs__list" data-tabs-list>
 *       <li class="tabs__item" data-tabs-item>
 *         <a href="#tab-1" class="tabs__button" data-tabs-tab>Tab 1</a>
 *       </li>
 *       <li class="tabs__item" data-tabs-item>
 *         <a href="#tab-2" class="tabs__button" data-tabs-tab>Tab 2</a>
 *       </li>
 *     </ul>
 *   </div>
 *   <section class="tabs__panel" id="tab-1" data-tabs-panel>
 *     tab 1
 *   </section>
 *   <section class="tabs__panel" id="tab-2" data-tabs-panel>
 *     tab 2
 *   </section>
 * </div>
 * ```
 */
class Tabs {
  elem: HTMLElement;
  id: number;
  panels: HTMLElement[];
  tablist: HTMLElement | null;
  tabs: HTMLElement[];

  constructor(el: HTMLElement, index: number) {
    this.elem = el;

    this.id = index;

    this.tablist = $('[data-tabs-list]', el);
    this.tabs = $$('[data-tabs-tab]', el);
    this.panels = $$('[data-tabs-panel]', el);

    this.init();
  }

  getTabId = (index: number) => `tabs-${this.id}-${index}`;

  init() {
    // Add the tablist role to the first <ul> in the .tabbed container
    this.tablist?.setAttribute('role', 'tablist');

    // Add semantics are remove user focusability for each tab
    this.tabs.forEach((tab: HTMLElement, i: number) => {
      tab.setAttribute('role', 'tab');
      // TODO: ids need to be unique on page
      tab.setAttribute('id', this.getTabId(i));
      tab.setAttribute('tabindex', '-1');
      tab.parentElement?.setAttribute('role', 'presentation');
    });

    // Add tab panel semantics and hide them all
    this.panels.forEach((panel: HTMLElement, i: number) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('tabindex', '-1');
      panel.setAttribute('aria-labelledby', this.tabs[i].id);
      panel.hidden = true;
    });

    this.addListeners();

    // Initially activate the first tab and reveal the first tab panel
    this.showTab(0);
  }

  showTab(index: number) {
    // Make the active tab focusable by the user (Tab key)
    this.tabs[index].removeAttribute('tabindex');
    this.tabs[index].setAttribute('aria-selected', 'true');
    this.panels[index].hidden = false;
  }

  addListeners() {
    this.tabs.forEach((tab: HTMLElement, i: number) => {
      // Handle clicking of tabs for mouse users
      on(tab, 'click', this.handleTabClick);

      // Handle keydown events for keyboard users
      on(tab, 'keydown', (e: KeyboardEvent) => this.handleTabKeyDown(e, i));
    });
  }

  handleTabClick = (e: Event) => {
    e.preventDefault();

    if (!this.tablist) return;

    const nextTab = e.currentTarget as HTMLElement;
    const currentTab = $('[aria-selected]', this.tablist);

    // do nothing if tab already shown
    if (nextTab === currentTab || !currentTab) {
      return;
    }

    this.switchTab(currentTab, nextTab);
  };

  handleTabKeyDown = (e: KeyboardEvent, i: number) => {
    // Get the index of the current tab in the tabs node list
    const target = e.currentTarget as HTMLElement;
    const index = this.tabs.indexOf(target);

    e.preventDefault();

    // If the down key is pressed, move focus to the open panel,
    // otherwise switch to the adjacent tab
    if (e.which === 40) {
      return this.panels[i].focus();
    }

    // Work out which key the user is pressing and
    // Calculate the new tab's index where appropriate
    let dir: number | null =
      // left key
      e.which === 37
        ? index - 1
        : // right key
          e.which === 39
          ? index + 1
          : null;

    // check for null instead of !dir since dir can be index 0
    if (dir === null) {
      return;
    }

    const nextTab = e.currentTarget as HTMLElement;

    // loop tabs if on first tab or last
    if (dir > this.tabs.length - 1) {
      dir = 0;
    } else if (dir === -1) {
      dir = this.tabs.length - 1;
    }

    if (this.tabs[dir]) {
      this.switchTab(nextTab, this.tabs[dir]);
    }
  };

  switchTab = (oldTab: HTMLElement, newTab: HTMLElement) => {
    // Get the indices of the new and old tabs to find the correct
    // tab panels to show and hide
    const index = this.tabs.indexOf(newTab);
    const oldIndex = this.tabs.indexOf(oldTab);

    oldTab.removeAttribute('aria-selected');
    oldTab.setAttribute('tabindex', '-1');
    this.panels[oldIndex].hidden = true;

    this.showTab(index);
    newTab.focus();
  };
}

const tabs = $$('[data-tabs]');
tabs.forEach((el, i) => new Tabs(el, i));

export default Tabs;
