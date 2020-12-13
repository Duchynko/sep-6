class Graph extends HTMLElement {
  static get observedAttributes() {
    return [`chartId`, `title`];
  }

  constructor() {
    super();
    this.innerHTML = `
    <h4>${this.getAttribute('title')}</h4>
    <div class="card text-center p-2">
      <canvas id="${this.getAttribute('chartId')}"></canvas>
      <div class="d-flex justify-content-center align-items-center" style="display:none !important">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"></div>
      </div>
    </div>
    `;
  }
}

customElements.define('graph-component', Graph);
