class Loading extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      const contentContainer = document.createElement('div');
      fetch('loading.html')
        .then(response => response.text())
        .then(htmlContent => {
          contentContainer.innerHTML = htmlContent;
          shadow.appendChild(contentContainer);
          //js code starts here action event driven 
  
          //js code ends here action event driven 
        });
    }
  }
  
  customElements.define('loading-cc', Loading);
  