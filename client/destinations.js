import ChartBuilder from './chartBuilder.js';

const URL =
  'https://https://sep6client.z6.web.core.windows.net/api/Destinations';

const topDestinationsChart = new ChartBuilder(
  document.getElementById('topDestinations')
).toogleProgressBar();

const topDestinationsEwrChart = new ChartBuilder(
  document.getElementById('topDestinationsEwr')
).toogleProgressBar();

const topDestinationsLgaChart = new ChartBuilder(
  document.getElementById('topDestinationsLga')
).toogleProgressBar();

const topDestinationsJfkChart = new ChartBuilder(
  document.getElementById('topDestinationsJfk')
).toogleProgressBar();

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
      .toogleProgressBar()
      .build();

    topDestinationsEwrChart
      .setLabels(response.airports['EWR'].map((record) => record.dest))
      .addDataset(
        'TOP 10 destinations',
        response.airports['EWR'].map((record) => record.count)
      )
      .toogleProgressBar()
      .build();

    topDestinationsLgaChart
      .setLabels(response.airports['LGA'].map((record) => record.dest))
      .addDataset(
        'TOP 10 destinations',
        response.airports['LGA'].map((record) => record.count)
      )
      .toogleProgressBar()
      .build();

    topDestinationsJfkChart
      .setLabels(response.airports['JFK'].map((record) => record.dest))
      .addDataset(
        'TOP 10 destinations',
        response.airports['JFK'].map((record) => record.count)
      )
      .toogleProgressBar()
      .build();
  })
  .catch((err) => {
    console.log('Error:', err);
  });
