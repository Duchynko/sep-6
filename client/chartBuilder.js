export default class ChartBuilder {
  constructor(canvas) {
    this.chart = undefined;
    this.canvas = canvas;
    this.config = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        scales: {
          xAxes: [
            {
              gridLines: { display: false },
              scaleLabel: {
                display: false,
                labelString: '',
              },
            },
          ],
          yAxes: [
            {
              gridLines: { drawBorder: false },
              scaleLabel: {
                display: false,
                labelString: '',
              },
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    };
  }

  setType(type) {
    if (type === 'pie' || type === 'doughnut') {
      this.config.options.scales = {};
    }
    this.config.type = type;
    return this;
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

  setXAxesLabel(label) {
    this.config.options.scales.xAxes[0].scaleLabel.display = true;
    this.config.options.scales.xAxes[0].scaleLabel.labelString = label;
    return this;
  }

  setYAxesLabel(label) {
    this.config.options.scales.yAxes[0].scaleLabel.display = true;
    this.config.options.scales.yAxes[0].scaleLabel.labelString = label;
    return this;
  }

  setPercentage() {
    // Append % to ticks values in the y-axes
    this.config.options.scales.yAxes[0].ticks = {
      min: 0,
      max: 100,
      callback: function (value) {
        return value + '%';
      },
    };
    // Append % to a value in a tooltip
    this.config.options.tooltips = {
      callbacks: {
        label: function (item, _) {
          return item.value + '%';
        },
      },
    };
    return this;
  }

  addDataset(
    label,
    data,
    { backgroundColor } = { backgroundColor: undefined }
  ) {
    const n = this.config.data.datasets.length;
    const dataset = {
      data: data,
      label: label,
      backgroundColor: backgroundColor ? backgroundColor : backgroundColors[n],
      borderColor: 'rgba(0, 0, 0, 0.2)',
      borderWidth: 1,
    };
    this.config.data.datasets.push(dataset);
    return this;
  }

  toggleProgressBar() {
    if (this.canvas.parentElement.lastElementChild.style.display !== 'none') {
      this.canvas.parentElement.lastElementChild.style.cssText =
        'display:none !important';
    } else {
      this.canvas.parentElement.lastElementChild.style.cssText =
        'display:flex !important';
      this.canvas.parentElement.lastElementChild.style.cssText =
        'position:absolute; left:0; right:0; top:0; bottom:0;';
    }
    return this;
  }

  build() {
    this.chart = new Chart(this.canvas.getContext('2d'), this.config);
    return this.chart;
  }
}

export const backgroundColors = [
  '#00876c',
  '#439a6d',
  '#6dad6d',
  '#98bf6e',
  '#c4cf72',
  '#f1dd7c',
  '#f1bf64',
  '#f0a154',
  '#eb814c',
  '#e2604c',
  '#d43d51',
];
