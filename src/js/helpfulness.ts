import { $, $$, on } from './utils/dom';

const INACTIVE_CLASS = 'helpfulness--unanswered';
const NO_CLASS = 'helpfulness--no';
const YES_CLASS = 'helpfulness--yes';

function addHelpfulnessToggles(elem: HTMLElement) {
  elem.classList.add(INACTIVE_CLASS);

  function toggleRadioContent(value: string) {
    elem.classList.remove(INACTIVE_CLASS);

    if (value === '1') {
      elem.classList.remove(NO_CLASS);
      elem.classList.add(YES_CLASS);
    } else if (value === '0') {
      elem.classList.remove(YES_CLASS);
      elem.classList.add(NO_CLASS);
    }
  }

  function handleRadioChange(event: Event) {
    event.preventDefault();
    const { value } = event.target as HTMLInputElement;
    toggleRadioContent(value);
  }

  const radioSelector = 'input[type=radio][name=helpfulness_rating]';

  // listen for changes on radios and toggle between labels and descriptions
  const radios = $$(radioSelector, elem) as HTMLInputElement[];
  radios.forEach((radio) => on(radio, 'change', handleRadioChange));

  // show already checked box on load
  const checkedRadio = $(`${radioSelector}:checked`, elem) as HTMLInputElement;

  if (checkedRadio) {
    toggleRadioContent(checkedRadio.value);
  }
}

const elem = $('.helpfulness');

if (elem) {
  addHelpfulnessToggles(elem);
}
