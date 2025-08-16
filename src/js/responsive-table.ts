import { $$ } from './utils/dom';

class ResponsiveTable {
  elem: HTMLTableElement;
  heads: HTMLTableHeaderCellElement[];
  rows: HTMLTableRowElement[];
  rowHeads: HTMLTableHeaderCellElement[];

  constructor(elem: HTMLTableElement) {
    this.elem = elem;
    this.heads = $$(
      'th:not(th:only-of-type)',
      elem
    ) as HTMLTableHeaderCellElement[];
    this.rows = $$('tr', elem) as HTMLTableRowElement[];
    this.rowHeads = $$('th:only-of-type', elem) as HTMLTableHeaderCellElement[];
    this.init();
  }

  init() {
    if (!this.heads || !this.rowHeads) {
      return;
    }

    this.rows.forEach((row: HTMLTableRowElement, rowIndex: number) => {
      const cells = row.querySelectorAll('td');
      const rowLabel =
        this.heads.length !== 0
          ? this.rowHeads[rowIndex - 1]
            ? this.rowHeads[rowIndex - 1].innerText
            : ''
          : this.rowHeads[rowIndex]
            ? this.rowHeads[rowIndex].innerText
            : '';

      cells.forEach((cell: HTMLTableCellElement, index: number) => {
        const label = this.heads[index]
          ? rowLabel
            ? `${this.heads[index + 1].innerText}, ${rowLabel}`
            : this.heads[index].innerText
          : rowLabel
            ? rowLabel
            : '';

        if (label) {
          cell.setAttribute('data-th', label);
        }
      });
    });
  }
}

const tables = $$('table:not(.js-omit-table)') as HTMLTableElement[];

tables.forEach((elem: HTMLTableElement) => new ResponsiveTable(elem));

export default ResponsiveTable;
