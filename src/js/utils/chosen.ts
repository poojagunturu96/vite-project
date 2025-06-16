import { $, $$ } from './dom';

// add and update aria attributes on forms added by the Chosen library
// in Drupal on the study abroad courses and cmrs courses sites
const form =
  $('#views-exposed-form-courses-study-abroad-courses') ||
  $('#views-exposed-form-courses-cmrs-courses');

if (form) {
  window.onload = () => {
    const searchInputs = $$('.chosen-search-input', form);

    searchInputs.forEach((input) => {
      let formLabelId = input.getAttribute('aria-labelledby');
      let chosenResultsId = input.getAttribute('aria-owns');
      let chosenResultsElem = $(`#${chosenResultsId}`);

      chosenResultsElem.setAttribute('aria-labelledby', formLabelId);
      input.setAttribute('aria-controls', chosenResultsId);
      input.removeAttribute('aria-owns');
    });
  };
}
