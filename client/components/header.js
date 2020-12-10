class Header extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-light bg-light mb-5">
        <div class="container-fluid">
          <a class="navbar-brand" href="index.html">
            <img src="public/control-tower.png" alt="" width="50" height="50" />
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="index.html"
                  >Home</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="flights.html"
                  >Flights</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Destinations</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Weather</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Miscellaneous</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      `;
    }
  }
  
  customElements.define('header-component', Header);