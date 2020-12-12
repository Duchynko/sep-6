import ChartBuilder from './chartBuilder.js';

// const URL = 'http://localhost:7071/api/Destinations';
const URL = 'https://sep6api.azurewebsites.net/api/Origins';

const originMeanAirTime = new ChartBuilder(
  document.getElementById('originMeanAirTime')
).toggleProgressBar();

const originMeanDepartureAndArrivalDelay = new ChartBuilder(
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
  .then(({ total, airports }) => {
    originMeanAirTime
      .setLabels(getValues(total, 'dest'))
      .addDataset('TOP 10', getValues(total, 'count'))
      .toggleProgressBar()
      .build();

    originMeanDepartureAndArrivalDelay
      .setLabels(getValues(airports['EWR'], 'dest'))
      .addDataset('TOP 10', getValues(airports['EWR'], 'count'))
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
