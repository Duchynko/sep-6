import ChartBuilder, { backgroundColors } from './chartBuilder.js';

// const URL = 'http://localhost:7071/api/Planes';
const URL = 'https://sep6api.azurewebsites.net/api/Planes';

const airbusModelPlanesChart = new ChartBuilder(
  document.getElementById('airbusModelPlanes')
)
  .setXAxesLabel('Airbus models')
  .setYAxesLabel('# of planes')
  .toggleProgressBar();

const flightsManufacturers200PlusPlanesChart = new ChartBuilder(
  document.getElementById('flightsManufacturers200PlusPlanes')
)
  .setXAxesLabel('Manufacturer')
  .setYAxesLabel('# of flights')
  .toggleProgressBar();

fetch(URL)
  .then((response) => {
    return response.json();
  })
  .then(
    ({
      manufaturers200PlusPlanes,
      airbusModelPlanes,
      flightsManufacturers200PlusPlanes,
    }) => {
      let ul = document.createElement('ul');
      ul.classList.add("p-0")
      document.getElementById('manufaturers200PlusPlanes').appendChild(ul);

      manufaturers200PlusPlanes.forEach(function (item) {
        let li = document.createElement('li');
        li.classList.add("list-group-item")
        ul.appendChild(li);

        li.innerHTML += item.manufacturer;
      });

      airbusModelPlanesChart
        .setLabels(getValues(airbusModelPlanes, 'model'))
        .addDataset(
          'Airbus model planes',
          getValues(airbusModelPlanes, 'number_of_planes')
        )
        .toggleProgressBar()
        .build();

      flightsManufacturers200PlusPlanesChart
        .setLabels(getValues(flightsManufacturers200PlusPlanes, 'manufacturer'))
        .addDataset(
          'Manufacturers with 200+ planes',
          getValues(flightsManufacturers200PlusPlanes, 'flights'),
          { backgroundColor: backgroundColors }
        )
        .toggleProgressBar()
        .build();
    }
  )
  .catch((err) => {
    console.log('An error occured when fetching data from the API:', err);
  });

function getValues(array, key) {
  return array.map((record) => record[key]);
}
