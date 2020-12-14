import ChartBuilder from './chartBuilder.js';

//const URL = 'http://localhost:7071/api/Weather';
const URL = 'https://sep6api.azurewebsites.net/api/Weather';

const origins = ['EWR', 'LGA', 'JFK'];

const observationChart = new ChartBuilder(
  document.getElementById('observation')
)
.toggleProgressBar();

const temperatureChart = new ChartBuilder(
  document.getElementById('temperature')
)
.setType("line")
.toggleProgressBar();

fetch(URL)
  .then((response) => {
    return response.json();
  })
  .then(({ observations, temperature }) => {
    const temp = Object.values(temperature);

    observationChart
      .addDataset('EWR', [observations['EWR']])
      .addDataset('LGA', [observations['LGA']])
      .addDataset('JFK', [observations['JFK']])
      .toggleProgressBar()
      .build();

    temperatureChart
      .addDataset('EWR', temp[0])
      .addDataset('LGA', temp[1])
      .addDataset('JFK', temp[2])
      .setLabels(temp[3])
      .toggleProgressBar()
      .build();

  })
  .catch((err) => {
    console.log('Error:', err);
  });

/**
 * Converts dictionary in form { label: value } to an array of percentage
 * values. It calculates percentage by dividing {dataset[label]} with
 * {totals[label]} and multiplying the result (ratio) by 100.
 *
 * @example
 * ```
 * const dataset = { 'a': 1, 'b': 2, 'c': 6 }
 * const totals = { 'a': 10, 'b': 10, 'c': 12 }
 * const result = __datasetToPercentage(dataset, totals);
 * // result = [ 10, 20, 50 ]
 * ```
 *
 * @param {object} dataset Dictionary in the form label:value
 * @param {object} totals Dictionary in the form label:total
 * @returns {Array<number>} Array of percentage values corresponding to {totals}
 */
function __datasetToPercentage(dataset, totals) {
  const arrayDataset = [];
  Object.keys(dataset).forEach((month) => {
    const ratio = parseInt(dataset[month]) / parseInt(totals[month]);
    const percentage = ratio * 100;
    arrayDataset.push(percentage.toFixed(1));
  });
  return arrayDataset;
}
