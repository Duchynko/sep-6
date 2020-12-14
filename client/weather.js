import ChartBuilder, { backgroundColors } from './chartBuilder.js';

//const URL = 'http://localhost:7071/api/Weather';
const URL = 'https://sep6api.azurewebsites.net/api/Weather';

const origins = ['EWR', 'LGA', 'JFK'];

const observationChart = new ChartBuilder(
  document.getElementById('observation')
)
  .setType('doughnut')
  .setLabels(origins)
  .toggleProgressBar();

const meanTemprature = new ChartBuilder(
  document.getElementById('meanTemprature')
)
  .setLabels([''])
  .setXAxesLabel('date')
  .setYAxesLabel('°C')
  .setType('line')
  .toggleProgressBar();

const JFKmean = new ChartBuilder(document.getElementById('JFKmean'))
  .setXAxesLabel('date')
  .setYAxesLabel('°C')
  .setType('line')
  .toggleProgressBar();

fetch(URL)
  .then((response) => {
    return response.json();
  })
  .then(({ observations, temperature }) => {
    const temp = Object.values(temperature);

    observationChart
      .addDataset(
        'Observations',
        [observations['EWR'], observations['LGA'], observations['JFK']],
        { backgroundColor: backgroundColors.slice(4, 7) }
      )
      .toggleProgressBar()
      .build();

    JFKmean.addDataset('JFK 2013', calculateMeanTemprature(temp[2]))
      .setLabels(reduceToDate(temp[3]))
      .toggleProgressBar()
      .build();

    meanTemprature
      .addDataset('EWR 2013', calculateMeanTemprature(temp[0]), {
        backgroundColor: backgroundColors[0],
      })
      .addDataset('LGA 2013', calculateMeanTemprature(temp[1]), {
        backgroundColor: backgroundColors[5],
      })
      .addDataset('JFK 2013', calculateMeanTemprature(temp[2]), {
        backgroundColor: backgroundColors[9],
      })
      .setLabels(reduceToDate(temp[3]))
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

  data.forEach((temprature) => {
    holder += parseFloat(temprature);
    i++;
    if (i >= 24) {
      means.push((holder / 24).toFixed(2));
      i = 0;
      holder = 0;
    }
  });

  return means;
}

function reduceToDate(data) {
  let dates = [];
  data = data.filter(function (_, index, __) {
    return index % 24 == 0;
  });

  data.forEach((value) => {
    dates.push(value.split('T')[0]);
  });

  return dates;
}
