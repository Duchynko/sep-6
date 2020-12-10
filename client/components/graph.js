class Graph extends HTMLElement {
  static get observedAttributes() {
    return [`chartId`, `title`];
  }

  constructor() {
    super();
    this.innerHTML = `
    <h4>${this.getAttribute('title')}</h4>
    <div class="card">
      <canvas id="${this.getAttribute('chartId')}"></canvas>
    </div>
    `;
  }
}

customElements.define("graph-component", Graph);
