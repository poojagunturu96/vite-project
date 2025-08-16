import { $, $$ } from './utils/dom';

class CostCalculator {
  form: HTMLFormElement;
  tables: HTMLElement[];
  chargesSum: number;
  creditsSum: number;
  totalSum: number;

  constructor(form: HTMLFormElement) {
    this.form = form;
    this.tables = $$('.table', form);
    this.chargesSum = this.creditsSum = this.totalSum = 0;

    this.validateInput = this.validateInput.bind(this);

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners = () => {
    const inputElems = $$('input:not(input[disabled="disabled"])', this.form);
    console.log;
    inputElems.forEach((el) => {
      el.addEventListener('change', (e) => this.validateInput(e));
    });
  };

  isEmpty(str: String) {
    if (str == null || str == '') return true;
    return false;
  }

  validateInput(e: Event) {
    let value = (e.target as HTMLInputElement).value;
    let isNumber = /^\d+$/.test(value);
    let floatValue = parseFloat(value);

    if (
      !isNumber ||
      this.isEmpty(value) ||
      value.indexOf(',') != -1 ||
      floatValue < 0
    ) {
      alert(
        'Please enter a valid amount that is greater than 0 and does not contain a letter or symbol.'
      );

      (e.target as HTMLInputElement).focus();
      (e.target as HTMLInputElement).select();
    } else this.calculateTotal();
  }

  calcSum(els: HTMLElement[]) {
    let sum = 0;
    els.forEach((el) => {
      sum += parseFloat((el as HTMLInputElement).value);
    });

    return sum;
  }

  calculateTotal() {
    this.totalSum = 0;
    this.tables.slice(0, -1).forEach((table) => {
      let charges = $$('.js-charges', table);
      let credits = $$('.js-credits', table);

      this.chargesSum = this.calcSum(charges);
      this.creditsSum = this.calcSum(credits);
      this.totalSum += this.chargesSum - this.creditsSum;

      $('[name="total-charges"]', table).value = this.chargesSum;
      $('[name="total-credits"]', table).value = this.creditsSum;
    });

    if (this.totalSum < 0) {
      alert(
        'If your total credits are greater than your total charges, you have no annual charges due.'
      );
      $('[name="annual-amount"]', this.form).value = 0;
    } else {
      $('[name="annual-amount"]', this.form).value = this.totalSum;
    }
  }
}

const form = $('.js-cost-calculator');

if (form) {
  new CostCalculator(form);
}
