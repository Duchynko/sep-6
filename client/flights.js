import ChartBuilder from './chartBuilder.js';

const URL = 'https://sep6api.azurewebsites.net/api/Flights';
const origins = ['EWR', 'LGA', 'JFK'];
// prettier-ignore
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const totalFlightsChart = new ChartBuilder(
  document.getElementById('totalFlights')
)
  .setLabels(months)
  .toggleProgressBar();

const flightsByAirportChart = new ChartBuilder(
  document.getElementById('flightsByAirport')
)
  .setLabels(months)
  .toggleProgressBar();

const flightsByAirportStackedChart = new ChartBuilder(
  document.getElementById('flightsByAirportStacked')
)
  .setLabels(months)
  .setStacked()
  .toggleProgressBar();

const percentageByAiportStackedChart = new ChartBuilder(
  document.getElementById('flightsByAirportPercentage')
)
  .setStacked()
  .setPercentage()
  .setLabels(months)
  .toggleProgressBar();

fetch(URL)
  .then((response) => {
    return response.json();
  })
  .then(({ data }) => {
    const totalFlights = __datasetToArrayOfValues(data.months);
    const ewrFlights = __datasetToArrayOfValues(
      data.airports[origins[0]]
    );
    const lgaFlights = __datasetToArrayOfValues(
      data.airports[origins[1]]
    );
    const jfkFlights = __datasetToArrayOfValues(
      data.airports[origins[2]]
    );

    totalFlightsChart
      .addDataset('Total', totalFlights)
      .toggleProgressBar()
      .build();

    flightsByAirportChart
      .addDataset(origins[0], ewrFlights)
      .addDataset(origins[1], lgaFlights)
      .addDataset(origins[2], jfkFlights)
      .toggleProgressBar()
      .build();

    flightsByAirportStackedChart
      .addDataset(origins[0], ewrFlights)
      .addDataset(origins[1], lgaFlights)
      .addDataset(origins[2], jfkFlights)
      .toggleProgressBar()
      .build();

    percentageByAiportStackedChart
      .addDataset(
        origins[0],
        __datasetToPercentage(data.airports[origins[0]], data.months)
      )
      .addDataset(
        origins[1],
        __datasetToPercentage(data.airports[origins[1]], data.months)
      )
      .addDataset(
        origins[2],
        __datasetToPercentage(data.airports[origins[2]], data.months)
      )
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

/**
 * Converts dictionary in form { label: value } to an array of values
 * 
 * @example
 * ```
 * const dataset = { 'a': 1, 'b': 2, 'c': 6 }
 * const result = __datasetToArrayOfValues(dataset);
 * // result = [ 1, 2, 6 ]
 * ```
 *
 * @param {object} dataset Dictionary in the form label:value
 * @returns {Array<number>} Array of values from the {dataset} dictionary
 */
function __datasetToArrayOfValues(dataset) {
  const arrayDataset = [];
  Object.values(dataset).forEach((month) => arrayDataset.push(month));
  return arrayDataset;
}
