import ChartBuilder, { backgroundColors } from './chartBuilder.js';

// const URL = 'http://localhost:7071/api/Destinations';
const URL = 'https://sep6api.azurewebsites.net/api/Destinations';

const topDestinationsChart = new ChartBuilder(
  document.getElementById('topDestinations')
)
  .setXAxesLabel('airport')
  .setYAxesLabel('# of flights')
  .toggleProgressBar();

const topDestinationsEwrChart = new ChartBuilder(
  document.getElementById('topDestinationsEwr')
)
  .setXAxesLabel('airport')
  .setYAxesLabel('# of flights')
  .toggleProgressBar();

const topDestinationsLgaChart = new ChartBuilder(
  document.getElementById('topDestinationsLga')
)
  .setXAxesLabel('airport')
  .setYAxesLabel('# of flights')
  .toggleProgressBar();

const topDestinationsJfkChart = new ChartBuilder(
  document.getElementById('topDestinationsJfk')
)
  .setXAxesLabel('airport')
  .setYAxesLabel('# of flights')
  .toggleProgressBar();

fetch(URL)
  .then((response) => {
    return response.json();
  })
  .then(({ total, airports }) => {
    topDestinationsChart
      .setLabels(getValues(total, 'dest'))
      .addDataset('Flights 2013', getValues(total, 'count'), {
        backgroundColor: backgroundColors,
      })
      .toggleProgressBar()
      .build();

    topDestinationsEwrChart
      .setLabels(getValues(airports['EWR'], 'dest'))
      .addDataset('EWR Flights 2013', getValues(airports['EWR'], 'count'), {
        backgroundColor: backgroundColors,
      })
      .toggleProgressBar()
      .build();

    topDestinationsLgaChart
      .setLabels(getValues(airports['LGA'], 'dest'))
      .addDataset('LGA Flights 2013', getValues(airports['LGA'], 'count'), {
        backgroundColor: backgroundColors,
      })
      .toggleProgressBar()
      .build();

    topDestinationsJfkChart
      .setLabels(getValues(airports['JFK'], 'dest'))
      .addDataset('JFK Flights 2013', getValues(airports['JFK'], 'count'), {
        backgroundColor: backgroundColors,
      })
      .toggleProgressBar()
      .build();
  })
  .catch((err) => {
    console.log('An error occured when fetching data from the API:', err);
  });

function getValues(array, key) {
  return array.map((record) => record[key]);
}
