"use strict";

var _chartBuilder = _interopRequireDefault(require("./chartBuilder.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// const URL = 'http://localhost:7071/api/Destinations';
var URL = 'https://sep6api.azurewebsites.net/api/Origins';
var originMeanAirTime = new _chartBuilder["default"](document.getElementById('originMeanAirTime')).toggleProgressBar();
var originMeanDepartureAndArrivalDelay = new _chartBuilder["default"](document.getElementById('originMeanDepartureAndArrivalDelay')).toggleProgressBar(); // const topDestinationsLgaChart = new ChartBuilder(
//   document.getElementById('topDestinationsLga')
// ).toggleProgressBar();
// const topDestinationsJfkChart = new ChartBuilder(
//   document.getElementById('topDestinationsJfk')
// ).toggleProgressBar();

fetch(URL).then(function (response) {
  return response.json();
}).then(function (_ref) {
  var total = _ref.total,
      airports = _ref.airports;
  originMeanAirTime.setLabels(getValues(total, 'dest')).addDataset('TOP 10', getValues(total, 'count')).toggleProgressBar().build();
  originMeanDepartureAndArrivalDelay.setLabels(getValues(airports['EWR'], 'dest')).addDataset('TOP 10', getValues(airports['EWR'], 'count')).toggleProgressBar().build(); // topDestinationsLgaChart
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