"use strict";

var _chartBuilder = _interopRequireDefault(require("./chartBuilder.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var URL = 'http://localhost:7071/api/Origins'; // const URL = 'https://sep6api.azurewebsites.net/api/Origins';

var meanAirTime = new _chartBuilder["default"](document.getElementById('originMeanAirTime')).toggleProgressBar();
var meanDepartureAndArrivalDelay = new _chartBuilder["default"](document.getElementById('originMeanDepartureAndArrivalDelay')).toggleProgressBar(); // const topDestinationsLgaChart = new ChartBuilder(
//   document.getElementById('topDestinationsLga')
// ).toggleProgressBar();
// const topDestinationsJfkChart = new ChartBuilder(
//   document.getElementById('topDestinationsJfk')
// ).toggleProgressBar();

fetch(URL).then(function (response) {
  return response.json();
}).then(function (_ref) {
  var originMeanAirTime = _ref.originMeanAirTime,
      originMeanDepartureAndArrivalDelay = _ref.originMeanDepartureAndArrivalDelay;
  meanAirTime.setLabels(getValues(originMeanAirTime, 'origin')).addDataset('Mean Air Time', getValues(originMeanAirTime, 'MEAN AIR TIME')).toggleProgressBar().build();
  meanDepartureAndArrivalDelay.setLabels(getValues(originMeanDepartureAndArrivalDelay, 'origin')).addDataset('Mean Departure Delay', getValues(originMeanDepartureAndArrivalDelay, 'MEAN DEP DELAY')).addDataset('Mean Arrival Delay', getValues(originMeanDepartureAndArrivalDelay, 'MEAN ARR DELAY')).toggleProgressBar().build(); // topDestinationsLgaChart
  //   .setLabels(getValues(airports['LGA'], 'dest'))
  //   .addDataset('TOP 10', getValues(airports['LGA'], 'count'))
  //   .toggleProgressBar()
  //   .build();
  // topDestinationsJfkChart
  //   .setLabels(getValues(airports['JFK'], 'dest'))
  //   .addDataset('TOP 10', getValues(airports['JFK'], 'count'))
  //   .toggleProgressBar()
  //   .build();
})["catch"](function (err) {
  console.log('An error occured when fetching data from the API:', err);
});

function getValues(array, key) {
  return array.map(function (record) {
    return record[key];
  });
}