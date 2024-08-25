class Error404 extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      const contentContainer = document.createElement('div');
      contentContainer.id = 'componants'
      fetch('error404.html')
        .then(response => response.text())
        .then(htmlContent => {
          contentContainer.innerHTML = htmlContent;
          shadow.appendChild(contentContainer);
          //js code starts here action event driven 
  
  
          //js code ends here action event driven 
        });
    }
  }
  
  customElements.define('error404-cc', Error404);
  