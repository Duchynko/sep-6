const url = "http://localhost:7071/api/Flights";

const flights = fetch(url)
  .then((data) => {
    return data.json();
  })
  .catch((err) => {
    console.log("Error:", err);
  });



var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Flights per airport",
        data: flights,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    parsing: {
      xAxisKey: 'origin',
      // yAxisKey: 'nested.value'
    }
  },
});
