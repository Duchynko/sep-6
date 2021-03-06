import ChartBuilder from './chartBuilder.js';

// const URL = 'http://localhost:7071/api/Flights';
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
  .setXAxesLabel('months')
  .setYAxesLabel('# of flights')
  .toggleProgressBar();

const flightsByAirportChart = new ChartBuilder(
  document.getElementById('flightsByAirport')
)
  .setLabels(months)
  .setXAxesLabel('months')
  .setYAxesLabel('# of flights')
  .toggleProgressBar();

const flightsByAirportStackedChart = new ChartBuilder(
  document.getElementById('flightsByAirportStacked')
)
  .setLabels(months)
  .setXAxesLabel('months')
  .setYAxesLabel('# of flights')
  .setStacked()
  .toggleProgressBar();

const percentageByAiportStackedChart = new ChartBuilder(
  document.getElementById('flightsByAirportPercentage')
)
  .setLabels(months)
  .setXAxesLabel('months')
  .setYAxesLabel('proportion')
  .setStacked()
  .setPercentage()
  .toggleProgressBar();

fetch(URL)
  .then((response) => {
    return response.json();
  })
  .then(({ total, airports }) => {
    const totalFlights = Object.values(total);
    const ewrFlights = Object.values(airports['EWR'])
    const lgaFlights = Object.values(airports['LGA']);
    const jfkFlights = Object.values(airports['JFK']);

    totalFlightsChart
      .addDataset('Flights 2013', totalFlights)
      .toggleProgressBar()
      .build();

    flightsByAirportChart
      .addDataset('EWR Flights 2013', ewrFlights)
      .addDataset('LGA Flights 2013', lgaFlights)
      .addDataset('JFK Flights 2013', jfkFlights)
      .toggleProgressBar()
      .build();

    flightsByAirportStackedChart
      .addDataset('EWR Flights 2013', ewrFlights)
      .addDataset('LGA Flights 2013', lgaFlights)
      .addDataset('JFK Flights 2013', jfkFlights)
      .toggleProgressBar()
      .build();

    percentageByAiportStackedChart
      .addDataset(
        'EWR Flights 2013',
        __datasetToPercentage(airports[origins[0]], total)
      )
      .addDataset(
        'LGA Flights 2013',
        __datasetToPercentage(airports[origins[1]], total)
      )
      .addDataset(
        'JFK Flights 2013',
        __datasetToPercentage(airports[origins[2]], total)
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
