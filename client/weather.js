import ChartBuilder from './chartBuilder.js';

const URL = 'http://localhost:7071/api/Weather';
//const URL = 'https://sep6api.azurewebsites.net/api/Weather';

const origins = ['EWR', 'LGA', 'JFK'];

const observationChart = new ChartBuilder(
  document.getElementById('observation')
)
  .toggleProgressBar();

const temperatureChart = new ChartBuilder(
  document.getElementById('temperature')
)
  .setType("line")
  .toggleProgressBar();

const meanTemprature = new ChartBuilder(
  document.getElementById('meanTemprature')
)
  .setType("line")
  .toggleProgressBar();

const JFKLastTemp = document.getElementById('JFKtemp');

const JFKmean = new ChartBuilder(
  document.getElementById('JFKmean')
)
  .setType("line")
  .toggleProgressBar();

fetch(URL)
  .then((response) => {
    return response.json();
  })
  .then(({ observations, temperature }) => {
    const temp = Object.values(temperature);

    observationChart
      .addDataset('EWR', [observations['EWR']])
      .addDataset('LGA', [observations['LGA']])
      .addDataset('JFK', [observations['JFK']])
      .toggleProgressBar()
      .build();

    temperatureChart
      .addDataset('EWR', temp[0])
      .addDataset('LGA', temp[1])
      .addDataset('JFK', temp[2])
      .setLabels(ReduceToDate(temp[3]))
      .toggleProgressBar()
      .build();

    JFKLastTemp.append(
      "Temperature at JFK: " +
      "Latest reading " + temp[2].slice(-1)
    );

    JFKmean
      .addDataset('JFK', calculateMeanTemprature(temp[2]))
      .setLabels(ReduceToDate(temp[3]))
      .toggleProgressBar()
      .build();

    meanTemprature
      .addDataset('EWR', calculateMeanTemprature(temp[0]))
      .addDataset('LGA', calculateMeanTemprature(temp[1]))
      .addDataset('JFK', calculateMeanTemprature(temp[2]))
      .setLabels(ReduceToDate(temp[3]))
      .toggleProgressBar()
      .build();
  })
  .catch((err) => {
    console.log('Error:', err);
  });

function calculateMeanTemprature(data) {
  let i = 0;
  let holder = 0;
  let means = [];

  data.forEach(temprature => {
    holder += parseFloat(temprature);
    i++;
    if (i >= 24) {
      means.push(holder / 24);
      i = 0;
      holder = 0;
    }
  });

  return means;
}

function ReduceToDate(data) {
  let dates = [];
  data = data.filter(function (value, index, Arr) {
    return index % 24 == 0;
  });

  data.forEach(value => {
    dates.push(value.split('T')[0]);
  });

  return dates;
}
