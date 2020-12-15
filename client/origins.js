import ChartBuilder from './chartBuilder.js';

// const URL = 'http://localhost:7071/api/Origins';
const URL = 'https://sep6api.azurewebsites.net/api/Origins';

const meanAirTimeChart = new ChartBuilder(
  document.getElementById('originMeanAirTime')
)
  .setXAxesLabel('airports')
  .setYAxesLabel('minutes')
  .toggleProgressBar();

const meanDepartureAndArrivalDelayChart = new ChartBuilder(
  document.getElementById('originMeanDepartureAndArrivalDelay')
)
  .setXAxesLabel('airports')
  .setYAxesLabel('minutes')
  .toggleProgressBar();

fetch(URL)
  .then((response) => {
    return response.json();
  })
  .then(({ originMeanAirTime, originMeanDepartureAndArrivalDelay }) => {
    meanAirTimeChart
      .setLabels(getStringValues(originMeanAirTime, 'origin'))
      .addDataset(
        'Mean Air-time 2013',
        getNumberValues(originMeanAirTime, 'meanAirTime')
      )
      .toggleProgressBar()
      .build();

    meanDepartureAndArrivalDelayChart
      .setLabels(getStringValues(originMeanDepartureAndArrivalDelay, 'origin'))
      .addDataset(
        'Departure delays 2013',
        getNumberValues(
          originMeanDepartureAndArrivalDelay,
          'meanDepartureDelay'
        )
      )
      .addDataset(
        'Arrival delays 2013',
        getNumberValues(originMeanDepartureAndArrivalDelay, 'meanArrivalDelay')
      )
      .toggleProgressBar()
      .build();
  })
  .catch((err) => {
    console.log('An error occured when fetching data from the API:', err);
  });

function getStringValues(array, key) {
  return array.map((record) => record[key]);
}

function getNumberValues(array, key) {
  return array.map((record) => parseFloat(record[key]).toFixed(2));
}
