class KanbanBoard extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      
      const contentContainer = document.createElement('div');
      contentContainer.id = 'components';
      
      fetch('kanbanboard.html')
        .then(response => response.text())
        .then(htmlContent => {
          contentContainer.innerHTML = htmlContent;
          shadow.appendChild(contentContainer);
  
          // Add external script
          const jqueryScript = shadow.createElement('script');
          jqueryScript.src = "https://cdpn.io/cpe/boomboom/pen.js?key=pen.js-d54afee8-1e2f-4ca1-4bb8-83c41e48eec0";
          jqueryScript.onload = function() {
            // Your code that relies on the external script can go here
          };
          shadow.appendChild(jqueryScript);
  
          // Access elements in the shadow DOM
          const canvas = shadow.querySelector('#canvas');
          const radiusPoint = shadow.querySelector('#radiusPoint');
          const radiusBlur = shadow.querySelector('#radiusBlur');
          const radTextRadius = shadow.querySelector('#radTextRadius');
          const radTextBlur = shadow.querySelector('#radTextBlur');
          const radioColors = shadow.querySelectorAll('input[name="radioColors"]');
          const saveCanvas = shadow.querySelector('#saveCanvas');
          const clearCanvas = shadow.querySelector('#clearCanvas');
  
          // Variable for touch mobile
          const arr_touches = [];
  
          // Set variables for color brush
          const colorsLength = radioColors.length;
          let i = 0;
  
          // Default radio brush and blur
          let radius = 10;
          let blur = 0;
  
          // Get the canvas context
          const ctx = canvas.getContext('2d');
  
          // Set canvas size
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          ctx.lineWidth = radius * 2;
          ctx.strokeStyle = '#111111';
          ctx.fillStyle = '#111111';
          ctx.shadowColor = '#111111';
  
          // Set radius brush
          const setRadiusPoint = function(newRadius) {
            radius = newRadius;
            ctx.lineWidth = radius * 2;
          };
  
          // Set radius blur
          const setRadiusBlur = function(newBlur) {
            blur = newBlur;
            ctx.shadowBlur = blur;
          };
  
          // Set colors brush and blur
          const changeColor = function(newColor) {
            ctx.strokeStyle = newColor;
            ctx.fillStyle = newColor;
            ctx.shadowColor = newColor;
          };
  
          const selectColors = function(e) {
            const selectColor = e.target;
            changeColor(selectColor.value);
          };
  
          // Save canvas
          function saveImage() {
            const data = canvas.toDataURL();
            window.open(data, '_blank', 'location=0, menubar=0');
          }
  
          // Clear canvas
          function clearImage() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
  
          // Drawing canvas
          const engage = function(e) {
            draggin = true;
            putPoint(e);
          };
  
          const disengage = function() {
            draggin = false;
            ctx.beginPath();
          };
  
          const putPoint = function(e) {
            if (draggin) {
              ctx.lineTo(e.clientX, e.clientY);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(e.clientX, e.clientY, radius, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(e.clientX, e.clientY);
            }
          };
  
          // Functions for canvas mobile touch
          function handleStart(evt) {
            const touches = evt.changedTouches;
            for (let i = 0; i < touches.length; i++) {
              if (isValidTouch(touches[i])) {
                evt.preventDefault();
                arr_touches.push(copyTouch(touches[i]));
                ctx.beginPath();
                ctx.fill();
              }
            }
          }
  
          function handleTouchMove(evt) {
            const touches = evt.changedTouches;
            const offset = findPos(canvas);
            for (let i = 0; i < touches.length; i++) {
              if (isValidTouch(touches[i])) {
                evt.preventDefault();
                const idx = ongoingTouchIndexById(touches[i].identifier);
                if (idx >= 0) {
                  ctx.lineTo(touches[i].clientX - offset.x, touches[i].clientY - offset.y);
                  ctx.stroke();
                  ctx.beginPath();
                  ctx.arc(touches[i].clientX - offset.x, touches[i].clientY - offset.y, radius, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.beginPath();
                  ctx.moveTo(arr_touches[idx].clientX - offset.x, arr_touches[idx].clientY - offset.y);
                  arr_touches.splice(idx, 1, copyTouch(touches[i]));
                }
              }
            }
          }
  
          function handleEnd(evt) {
            const touches = evt.changedTouches;
            const offset = findPos(canvas);
            for (let i = 0; i < touches.length; i++) {
              if (isValidTouch(touches[i])) {
                evt.preventDefault();
                const idx = ongoingTouchIndexById(touches[i].identifier);
                if (idx >= 0) {
                  ctx.beginPath();
                  ctx.moveTo(arr_touches[idx].clientX - offset.x, arr_touches[idx].clientY - offset.y);
                  ctx.lineTo(touches[i].clientX - offset.x, touches[i].clientY - offset.y);
                  arr_touches.splice(i, 1);
                }
              }
            }
          }
  
          function handleCancel(evt) {
            evt.preventDefault();
            const touches = evt.changedTouches;
            for (let i = 0; i < touches.length; i++) {
              arr_touches.splice(i, 1);
            }
          }
  
          function copyTouch(touch) {
            return { identifier: touch.identifier, clientX: touch.clientX, clientY: touch.clientY };
          }
  
          function ongoingTouchIndexById(idToFind) {
            for (let i = 0; i < arr_touches.length; i++) {
              const id = arr_touches[i].identifier;
              if (id == idToFind) {
                return i;
              }
            }
            return -1;
          }
  
          function isValidTouch(touch) {
            let curleft = 0, curtop = 0;
            let offset = 0;
            if (canvas.offsetParent) {
              do {
                curleft += canvas.offsetLeft;
                curtop += canvas.offsetTop;
              } while (touch == canvas.offsetParent);
              offset = { x: curleft - shadow.body.scrollLeft, y: curtop - shadow.body.scrollTop };
            }
            if (touch.clientX - offset.x > 0 &&
                touch.clientX - offset.x < parseFloat(canvas.width) &&
                touch.clientY - offset.y > 0 &&
                touch.clientY - offset.y < parseFloat(canvas.height)) {
              return true;
            } else {
              return false;
            }
          }
  
          function findPos(obj) {
            let curleft = 0, curtop = 0;
            if (obj.offsetParent) {
              do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
              } while (obj == obj.offsetParent);
              return { x: curleft - shadow.body.scrollLeft, y: curtop - shadow.body.scrollTop };
            }
          }
  
          // Handling events listeners
          radiusPoint.addEventListener('input', function() {
            radTextRadius.innerHTML = radiusPoint.value;
            setRadiusPoint(this.value);
          });
  
          radiusBlur.addEventListener('input', function() {
            radTextBlur.innerHTML = radiusBlur.value;
            setRadiusBlur(this.value);
          });
  
          for (i = 0; i < colorsLength; i++) {
            radioColors[i].addEventListener('change', selectColors);
          }
          
          saveCanvas.addEventListener('click', saveImage);
          clearCanvas.addEventListener('click', clearImage);
          canvas.addEventListener('mousedown', engage);
          canvas.addEventListener('mouseup', disengage);
          canvas.addEventListener('mousemove', putPoint);
  
          // Handling mobile touch events
          canvas.addEventListener("touchstart", handleStart, false);
          canvas.addEventListener("touchend", handleEnd, false);
          canvas.addEventListener("touchcancel", handleCancel, false);
          canvas.addEventListener("touchleave", handleEnd, false);
          canvas.addEventListener("touchmove", handleTouchMove, false);
        });
    }
  }
  
  customElements.define('kanbanboard-cc', KanbanBoard);
  