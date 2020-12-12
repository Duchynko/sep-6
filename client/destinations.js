import ChartBuilder from './chartBuilder.js';

const URL =
  'https://sep6api.azurewebsites.net/api/Destinations';

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
    console.log('Total:', response.total);
    topDestinationsChart
      .setLabels(response.total.map((record) => record.dest))
      .addDataset(
        'TOP 10 destinations',
        response.total.map((record) => record.count)
      )
      .toggleProgressBar()
      .build();

    topDestinationsEwrChart
      .setLabels(response.airports['EWR'].map((record) => record.dest))
      .addDataset(
        'TOP 10 destinations',
        response.airports['EWR'].map((record) => record.count)
      )
      .toggleProgressBar()
      .build();

    topDestinationsLgaChart
      .setLabels(response.airports['LGA'].map((record) => record.dest))
      .addDataset(
        'TOP 10 destinations',
        response.airports['LGA'].map((record) => record.count)
      )
      .toggleProgressBar()
      .build();

    topDestinationsJfkChart
      .setLabels(response.airports['JFK'].map((record) => record.dest))
      .addDataset(
        'TOP 10 destinations',
        response.airports['JFK'].map((record) => record.count)
      )
      .toggleProgressBar()
      .build();
  })
  .catch((err) => {
    console.log('Error:', err);
  });
