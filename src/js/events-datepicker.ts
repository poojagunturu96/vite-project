import Pikaday from 'pikaday';

const pad = (n: number): string => (n >= 10 ? String(n) : `0${n}`);

const getDateObj = (
  dateStr: string
): {
  day: number;
  month: number;
  year: number;
} => {
  const dateParts = dateStr.split('-');
  const [year, month, day] = dateParts;

  return {
    year: parseInt(year, 10),
    month: parseInt(month, 10) - 1,
    day: parseInt(day, 10)
  };
};

const dateToStr = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  const padDay = pad(day);
  const paddedMonth = pad(month);

  const year = date.getFullYear();

  const dateStr = `${year}-${paddedMonth}-${padDay}`;

  return dateStr;
};

let searchParams = new URLSearchParams(window.location.search);
const dateStr = searchParams.get('start-date');

let defaultDate = null;

if (dateStr) {
  const { year, month, day } = getDateObj(dateStr);

  // have to pass date object instead of string
  // https://github.com/dbushell/Pikaday/issues/764#issuecomment-360286792
  defaultDate = new Date(year, month, day);
}

const datePicker = document.querySelector(
  '.js-events-datepicker'
) as HTMLElement;

if (datePicker) {
  const picker = new Pikaday({
    field: datePicker,
    bound: false,
    defaultDate,
    setDefaultDate: Boolean(defaultDate),
    format: 'YYYY-MM-DD',
    toString(date, format) {
      // you should do formatting based on the passed format,
      // but we will just return 'D/M/YYYY' for simplicity
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    parse(dateString, format) {
      // dateString is the result of `toString` method
      const parts = dateString.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    },
    onSelect(date: Date) {
      searchParams.set('start-date', dateToStr(date));
      searchParams.delete('page');
      window.location.search = searchParams.toString();
    }
  });

  datePicker.style.display = 'none';
}

const selects = ['month', 'year'];

selects.forEach((name: string, i: number) => {
  const select = 'pika-select-' + name;
  const selectElem = document.querySelector('.' + select);

  if (!selectElem) {
    return;
  }

  selectElem.setAttribute('id', select);

  const labelElem = document.createElement('label');
  labelElem.setAttribute('class', 'sr-only');
  labelElem.setAttribute('for', select);
  labelElem.innerText =
    selects[i].charAt(0).toUpperCase() + selects[i].slice(1);

  const parentElem = selectElem.parentNode;
  parentElem.insertBefore(labelElem, selectElem);
});

const pikaTitle = document.querySelector('.pika-title');

if (pikaTitle) {
  pikaTitle.setAttribute('aria-atomic', 'true');
  pikaTitle.setAttribute('aria-level', '3');
}

const pikaTable = document.querySelector('.pika-table');

if (pikaTable) {
  pikaTable.removeAttribute('cellpadding');
  pikaTable.removeAttribute('cellspacing');
}

const pikaRowTd = document.querySelectorAll('.pika-row td');

pikaRowTd.forEach((td: HTMLElement) => {
  td.setAttribute('role', 'gridcell');
});
