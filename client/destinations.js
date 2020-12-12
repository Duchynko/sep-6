import ChartBuilder from './chartBuilder.js';

// const URL = 'http://localhost:7071/api/Destinations';
const URL = 'https://sep6api.azurewebsites.net/api/Destinations';

const topDestinationsChart = new ChartBuilder(
  document.getElementById('topDestinations')
).toggleProgressBar();

const topDestinationsEwrChart = new ChartBuilder(
  document.getElementById('topDestinationsEwr')
).toggleProgressBar();

const topDestinationsLgaChart = new ChartBuilder(
  document.getElementById('topDestinationsLga')
).toggleProgressBar();

const topDestinationsJfkChart = new ChartBuilder(
  document.getElementById('topDestinationsJfk')
).toggleProgressBar();

fetch(URL)
  .then((response) => {
    return response.json();
  })
  .then(({ total, airports }) => {
    topDestinationsChart
      .setLabels(getValues(total, 'dest'))
      .addDataset('TOP 10', getValues(total, 'count'))
      .toggleProgressBar()
      .build();

    topDestinationsEwrChart
      .setLabels(getValues(airports['EWR'], 'dest'))
      .addDataset('TOP 10', getValues(airports['EWR'], 'count'))
      .toggleProgressBar()
      .build();

    topDestinationsLgaChart
      .setLabels(getValues(airports['LGA'], 'dest'))
      .addDataset('TOP 10', getValues(airports['LGA'], 'count'))
      .toggleProgressBar()
      .build();

    topDestinationsJfkChart
      .setLabels(getValues(airports['JFK'], 'dest'))
      .addDataset('TOP 10', getValues(airports['JFK'], 'count'))
      .toggleProgressBar()
      .build();
  })
  .catch((err) => {
    console.log('An error occured when fetching data from the API:', err);
  });

function getValues(array, key) {
  return array.map((record) => record[key]);
}
