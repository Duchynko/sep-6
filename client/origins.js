import ChartBuilder from './chartBuilder.js';

const URL = 'http://localhost:7071/api/Origins';
// const URL = 'https://sep6api.azurewebsites.net/api/Origins';

const meanAirTime = new ChartBuilder(
  document.getElementById('originMeanAirTime')
).toggleProgressBar();

const meanDepartureAndArrivalDelay = new ChartBuilder(
  document.getElementById('originMeanDepartureAndArrivalDelay')
).toggleProgressBar();

// const topDestinationsLgaChart = new ChartBuilder(
//   document.getElementById('topDestinationsLga')
// ).toggleProgressBar();

// const topDestinationsJfkChart = new ChartBuilder(
//   document.getElementById('topDestinationsJfk')
// ).toggleProgressBar();

fetch(URL)
  .then((response) => {
    return response.json();
  })
  .then(({ originMeanAirTime, originMeanDepartureAndArrivalDelay }) => {
    meanAirTime
      .setLabels(getValues(originMeanAirTime, 'origin'))
      .addDataset('Mean Air Time', getValues(originMeanAirTime, 'MEAN AIR TIME'))
      .toggleProgressBar()
      .build();

    meanDepartureAndArrivalDelay
      .setLabels(getValues(originMeanDepartureAndArrivalDelay, 'origin'))
      .addDataset('Mean Departure Delay', getValues(originMeanDepartureAndArrivalDelay, 'MEAN DEP DELAY'))
      .addDataset('Mean Arrival Delay', getValues(originMeanDepartureAndArrivalDelay, 'MEAN ARR DELAY'))
      .toggleProgressBar()
      .build();

    // topDestinationsLgaChart
    //   .setLabels(getValues(airports['LGA'], 'dest'))
    //   .addDataset('TOP 10', getValues(airports['LGA'], 'count'))
    //   .toggleProgressBar()
    //   .build();

    // topDestinationsJfkChart
    //   .setLabels(getValues(airports['JFK'], 'dest'))
    //   .addDataset('TOP 10', getValues(airports['JFK'], 'count'))
    //   .toggleProgressBar()
    //   .build();
  })
  .catch((err) => {
    console.log('An error occured when fetching data from the API:', err);
  });

function getValues(array, key) {
  return array.map((record) => record[key]);
}