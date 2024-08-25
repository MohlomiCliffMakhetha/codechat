class Calculator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const contentContainer = document.createElement('div');
    fetch('calculator.html')
      .then(response => response.text())
      .then(htmlContent => {
        contentContainer.innerHTML = htmlContent;
        shadow.appendChild(contentContainer);
        //js code starts here action event driven 
        var box = shadow.getElementById("display-box");
        const calculatorButtons = shadow.querySelectorAll('.keys');
        calculatorButtons.forEach(button => {
          button.addEventListener('click', function () {
            const value = button.value;

            switch (value) {
              case "=":
                answer();
                break;
              case "DEL":
                backspace();
                break;
              case "AC":
                box.value = "";
                break;
              case "X":
                addToScreen('*');
                break;
              case "%":
                addToScreen(value);
                var x = box.value;
                x = eval(x.replace('\%', '/100'));
                box.value = x;
                break;
              default:
                addToScreen(value);
                break;
            }
          });
        });
        function showTime() {
          var time = new Date();
          var hour = time.getHours();
          var minutes = time.getMinutes();
          var seconds = time.getSeconds();
          var completeTime = hour + ':' + minutes + ':' + seconds;
          shadow.getElementById('timer').innerHTML = completeTime;
        }

        setInterval(showTime, 1000);

        function addToScreen(x) {
          box.value += x;
          if (x == "c" || x == "C") {
            box.value = "";
          }
        }

        function answer() {
          x = box.value;
          x = eval(x.replace('\%', '/100'));
          box.value = x;
        }

        function backspace() {
          var x = box.value;
          var lengthAfterDeletion = x.length - 1;
          var newNumbers = x.substring(0, lengthAfterDeletion);
          box.value = newNumbers;

        }
        //js code ends here action event driven 
      });
  }
}



customElements.define('calculator-cc', Calculator);
