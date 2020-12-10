import ChartBuilder from "./chartBuilder.js";

const URL = "https://sep6api.azurewebsites.net/api/Flights";
const ORIGINS = ["EWR", "LGA", "JFK"];
const LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const totalFlightsChart = new ChartBuilder(
  document.getElementById("totalFlights").getContext("2d"),
  "bar"
).setLabels(LABELS);

const flightsByAirportChart = new ChartBuilder(
  document.getElementById("flightsByAirport").getContext("2d"),
  "bar"
).setLabels(LABELS);

const flightsByAirportStackedChart = new ChartBuilder(
  document.getElementById("flightsByAirportStacked").getContext("2d"),
  "bar"
)
  .setStacked(true)
  .setLabels(LABELS);

const percentageByAiportStackedChart = new ChartBuilder(
  document.getElementById("flightsByAirportPercentage").getContext("2d"),
  "bar"
)
  .setStacked(true)
  .setPercentage(true)
  .setLabels(LABELS);

fetch(URL)
  .then((data) => {
    return data.json();
  })
  .then(({ data }) => {
    const ewrFlights = __getFlightsPerMonthFromAirport(data, ORIGINS[0]);
    const lgaFlights = __getFlightsPerMonthFromAirport(data, ORIGINS[1]);
    const jfkFlights = __getFlightsPerMonthFromAirport(data, ORIGINS[2]);

    totalFlightsChart
      .addDataset("Total", __getTotalFlightsPerMonth(data))
      .build();

    flightsByAirportChart
      .addDataset("JFK", jfkFlights)
      .addDataset("EWR", ewrFlights)
      .addDataset("LGA", lgaFlights)
      .build();

    flightsByAirportStackedChart
      .addDataset("JFK", jfkFlights)
      .addDataset("EWR", ewrFlights)
      .addDataset("LGA", lgaFlights)
      .build();

    percentageByAiportStackedChart
      .addDataset("JFK", jfkFlights)
      .addDataset("EWR", ewrFlights)
      .addDataset("LGA", lgaFlights)
      .build();
  })
  .catch((err) => {
    console.log("Error:", err);
  });

// function __datasetsToPercentage(...datasets, sums) {
//   const areEqualSize = datasets.every((next, _, dataset) => {
//     return dataset[0].length === next.length;
//   });

//   if (areEqualSize) {
//     const n = datasets.length;
//     for (let i = 0; i < datasets[0].length; i++) {
//       for (let k = 0; k < datasets.length; k++) {
//         datasets[k][i] = ((100.0 * datasets[k][i]) / sum).toFixed(2);
//       }
//     }
//   }
//   return datasets;
// }

function __getFlightsPerMonthFromAirport({ airports }, airport) {
  const months = [];
  Object.values(airports[airport]).forEach((month) => months.push(month));
  return months;
}

function __getTotalFlightsPerMonth(data) {
  const months = [];
  Object.values(data.months).forEach((month) => {
    months.push(month);
  });
  return months;
}
