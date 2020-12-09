"use strict";

var url = "http://localhost:7071/api/Flights";
var flights = fetch(url).then(function (data) {
  return data.json();
}).then(function (data) {
  ewrFlightCount = data.filter(function (f) {
    return f.origin === "EWR";
  });
  jfkFlightCount = data.filter(function (f) {
    return f.origin === "JFK";
  });
  lgaFlighCount = data.filter(function (f) {
    return f.origin === "LGA";
  });
  console.log(ewrFlightCount);
  initChart(ewrFlightCount.length, jfkFlightCount.length, lgaFlighCount.length);
})["catch"](function (err) {
  console.log("Error:", err);
});

function initChart(ewrCount, jfkCount, lgaCount) {
  var ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["EWR", "LGA", "JFK"],
      datasets: [{
        label: "# of Flights per airport",
        data: [ewrCount, lgaCount, jfkCount],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
        borderWidth: 5
      }]
    }
  });
}