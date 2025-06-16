import { h, FunctionComponent } from 'preact';

import { DataSet } from '../charts';

interface LegendProps {
  items: HTMLElement[];
  colors: string[];
}

const Legend: FunctionComponent<LegendProps> = ({ items, colors }) => {
  return (
    <div className="chart-legend chart-legend--inline justify-content-start">
      <ul className="chart-legend__list">
        {items.map((item: any, i: any) => (
          <li className="chart-legend__item">
            <span
              className="chart-legend__icon"
              style={{
                background: colors[i]
              }}
            ></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const toPercent = (value: number, total: number): number =>
  (value / total) * 100;

interface PercentBarProps {
  labels: string[];
  datasets: DataSet[];
  colors: string[];
  title?: string;
}

const PercentBarChart: FunctionComponent<PercentBarProps> = ({
  labels,
  datasets,
  colors,
  title
}) => {
  // reconstruct a data array with the first dataset since the component only supports
  // rendering one dataset.
  const firstDataSet = datasets[0];

  const data = firstDataSet.data.map((value: number, idx: number) => ({
    label: labels[idx],
    value
  }));

  const total = data.reduce(
    (total: number, datum: any) => (total += datum.value),
    0
  );

  const preparedData = data
    // sort the data from lowest to greatest
    .sort((a: any, b: any) => a.value - b.value)
    // add the percentage for the value to the data object
    .map((d: any) => {
      const percent = toPercent(d.value, total);
      return {
        ...d,
        percent,
        // change the label to include the value as a percent
        label: `${Math.ceil(percent)}% ${d.label}`
      };
    });

  // create the custom legend from the sorted data
  const sortedLabels = preparedData.map((data: any) => data.label);

  return (
    <figure className='chart--percentage-bar'>
      {title && <figcaption>{title}</figcaption>}
      <div
        style={{
          display: 'flex',
          width: '100%'
        }}
      >
        {preparedData.map((data: any, i: any) => {
          const width = data.percent.toFixed(2);
          return (
            <div
              key={i}
              style={{
                width: width + '%',
                height: 32
              }}
            >
              <div
                style={{
                  background: colors[i],
                  height: '100%'
                }}
              ></div>
            </div>
          );
        })}
      </div>
      <Legend items={sortedLabels} colors={colors} />
    </figure>
  );
};

export default PercentBarChart;
