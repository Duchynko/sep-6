import ChartBuilder from './chartBuilder.js';

// const URL = 'http://localhost:7071/api/Origins';
const URL = 'https://sep6api.azurewebsites.net/api/Origins';

const meanAirTimeChart = new ChartBuilder(
  document.getElementById('originMeanAirTime')
).toggleProgressBar();

const meanDepartureAndArrivalDelayChart = new ChartBuilder(
  document.getElementById('originMeanDepartureAndArrivalDelay')
).toggleProgressBar();

fetch(URL)
  .then((response) => {
    return response.json();
  })
  .then(({ originMeanAirTime, originMeanDepartureAndArrivalDelay }) => {
    meanAirTimeChart
      .setLabels(getValues(originMeanAirTime, 'origin'))
      .addDataset('Minutes', getValues(originMeanAirTime, 'MEAN AIR TIME'))
      .toggleProgressBar()
      .build();

    meanDepartureAndArrivalDelayChart
      .setLabels(getValues(originMeanDepartureAndArrivalDelay, 'origin'))
      .addDataset('Minutes Departure', getValues(originMeanDepartureAndArrivalDelay, 'MEAN DEP DELAY'))
      .addDataset('Minutes Arrival', getValues(originMeanDepartureAndArrivalDelay, 'MEAN ARR DELAY'))
      .toggleProgressBar()
      .build();
  })
  .catch((err) => {
    console.log('An error occured when fetching data from the API:', err);
  });

function getValues(array, key) {
  return array.map((record) => record[key]);
}