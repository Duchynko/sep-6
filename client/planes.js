import ChartBuilder from './chartBuilder.js';

const URL = 'http://localhost:7071/api/Planes';
// const URL = 'https://sep6api.azurewebsites.net/api/Planes';

const manufaturers200PlusPlanes = new ChartBuilder(
    document.getElementById('manufaturers200PlusPlanes')
).toggleProgressBar();

const planesAirbusModel = new ChartBuilder(
    document.getElementById('planesAirbusModel')
).toggleProgressBar();

const flightsManufacturers200PlusPlanes = new ChartBuilder(
    document.getElementById('flightsManufacturers200PlusPlanes')
).toggleProgressBar();

fetch(URL)
    .then((response) => {
        return response.json();
    })
    .then(({ manufaturers_200PlusPlanes, planes_AirbusModel, flights_Manufacturers200PlusPlanes }) => {
        manufaturers200PlusPlanes
            .setLabels(getValues(manufaturers_200PlusPlanes, 'manufacturer'))
            .toggleProgressBar()
            .build();

        planesAirbusModel
            .setLabels(getValues(planes_AirbusModel, 'model'))
            .addDataset('planes Airbus Model', getValues(planes_AirbusModel, 'number_of_planes'))
            .toggleProgressBar()
            .build();

        flightsManufacturers200PlusPlanes
            .setLabels(getValues(flights_Manufacturers200PlusPlanes, 'manufacturer'))
            .addDataset('flights Manufacturers 200+ Planes', getValues(flights_Manufacturers200PlusPlanes, 'flights'))
            .toggleProgressBar()
            .build();
    })
    .catch((err) => {
        console.log('An error occured when fetching data from the API:', err);
    });

function getValues(array, key) {
    return array.map((record) => record[key]);
}