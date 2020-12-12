import ChartBuilder from './chartBuilder.js';

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
  .then((response) => {
    topDestinationsChart
      .setLabels(getValues(response.total, 'dest'))
      .addDataset('TOP 10 destinations', getValues(response.total, 'count'))
      .toggleProgressBar()
      .build();

    topDestinationsEwrChart
      .setLabels(getValues(response.airports['EWR'], 'dest'))
      .addDataset(
        'TOP 10 destinations',
        getValues(response.airports['EWR'], 'count')
      )
      .toggleProgressBar()
      .build();

    topDestinationsLgaChart
      .setLabels(getValues(response.airports['LGA'], 'dest'))
      .addDataset(
        'TOP 10 destinations',
        getValues(response.airports['LGA'], 'count')
      )
      .toggleProgressBar()
      .build();

    topDestinationsJfkChart
      .setLabels(getValues(response.airports['JFK'], 'dest'))
      .addDataset(
        'TOP 10 destinations',
        getValues(response.airports['JFK'], 'count')
      )
      .toggleProgressBar()
      .build();
  })
  .catch((err) => {
    console.log('An error occured when fetching data from the API:', err);
  });

function getValues(array, key) {
  return array.map((record) => record[key]);
}
