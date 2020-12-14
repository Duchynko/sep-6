import ChartBuilder from './chartBuilder.js';

const URL = 'http://localhost:7071/api/Planes';
// const URL = 'https://sep6api.azurewebsites.net/api/Planes';

const manufaturers200PlusPlanesChart = new ChartBuilder(
    document.getElementById('manufaturers200PlusPlanes')
).setType('pie').toggleProgressBar();

const airbusModelPlanesChart = new ChartBuilder(
    document.getElementById('airbusModelPlanes')
).toggleProgressBar();

const flightsManufacturers200PlusPlanesChart = new ChartBuilder(
    document.getElementById('flightsManufacturers200PlusPlanes')
).toggleProgressBar();

fetch(URL)
    .then((response) => {
        return response.json();
    })
    .then(({ manufaturers200PlusPlanes, airbusModelPlanes, flightsManufacturers200PlusPlanes }) => {
        manufaturers200PlusPlanesChart
            .setLabels(getValues(manufaturers200PlusPlanes, 'manufacturer'))
            .toggleProgressBar()
            .build();

        airbusModelPlanesChart
            .setLabels(getValues(airbusModelPlanes, 'model'))
            .addDataset('planes Airbus Model', getValues(airbusModelPlanes, 'number_of_planes'))
            .toggleProgressBar()
            .build();

        flightsManufacturers200PlusPlanesChart
            .setLabels(getValues(flightsManufacturers200PlusPlanes, 'manufacturer'))
            .addDataset('flights Manufacturers 200+ Planes', getValues(flightsManufacturers200PlusPlanes, 'flights'))
            .toggleProgressBar()
            .build();
    })
    .catch((err) => {
        console.log('An error occured when fetching data from the API:', err);
    });

function getValues(array, key) {
    return array.map((record) => record[key]);
}