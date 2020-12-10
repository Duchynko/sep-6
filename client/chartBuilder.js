export default class ChartBuilder {
  constructor(context, type) {
    this.config = {
      type: type,
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        scales: {
          xAxes: [{}],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    };
    this.chart = new Chart(context, this.config);
  }

  setLabels(labels) {
    this.config.data.labels = labels;
    return this;
  }

  setTitle(title) {
    this.config.options.title = title;
    return this;
  }

  setStacked() {
    this.config.options.scales.yAxes[0].stacked = true;
    this.config.options.scales.xAxes[0].stacked = true;
    return this;
  }

  setPercentage() {
    // Append % to ticks values in the y-axes
    this.config.options.scales.yAxes[0].ticks = {
      min: 0,
      max: 100,
      callback: function (value) {
        return value + "%";
      },
    };
    // Append % to a value in a tooltip
    this.config.options.tooltips = {
      callbacks: {
        label: function (item, _) {
          return item.value + "%";
        },
      },
    };
    return this;
  }

  addDataset(label, data) {
    const n = this.config.data.datasets.length;
    const dataset = {
      data: data,
      label: label,
      backgroundColor: backgroundColors[n],
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderWidth: 1,
    };
    this.config.data.datasets.push(dataset);
    return this;
  }

  build() {
    this.chart.update();
    return this.chart;
  }
}

const backgroundColors = [
  "rgba(255, 99, 132, 0.8)",
  "rgba(54, 162, 235, 0.8)",
  "rgba(255, 206, 86, 0.8)",
];
