const searchBarInput = document.querySelector(".search-input");
var loadingTime = 3000;

searchBarInput.addEventListener("focus", function () {
  document.querySelector(".header").classList.add("wide");
});

searchBarInput.addEventListener("blur", function () {
  document.querySelector(".header").classList.remove("wide");
});

function updateSelectedElementDisplay(selector, container, elementClassName, loadClass, loadingTime) {
  const selectedOption = selector.value;
  const elements = container.getElementsByClassName(elementClassName);

  for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
  }

  document.getElementById(loadClass).style.display = "block";
  
  setTimeout(function () {
      for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = "none";
      }
      
      if (selectedOption) {
          const selectedElement = document.getElementById(selectedOption);
          if (selectedElement) {
              selectedElement.style.display = "block";
          }else{
            var err
            elementClassName==='p-elements' ? err='p-err':err='s-err'
            document.getElementById(err).style.display = "block";
          }
      }
  }, loadingTime);
}

const primarySelector = document.getElementById("primary_selector");
const primaryDisplay = document.getElementById("primary_display");
const primaryElementClassName = "p-elements";

const primaryLoadClass = '0-ccp'
const primaryLoadingTime = 1000;

updateSelectedElementDisplay(primarySelector, primaryDisplay, primaryElementClassName, primaryLoadClass, primaryLoadingTime);

primarySelector.addEventListener("change", function () {
  updateSelectedElementDisplay(primarySelector, primaryDisplay, primaryElementClassName, primaryLoadClass, primaryLoadingTime);
});

const secondarySelector = document.getElementById("secondary_selector");
const secondaryDisplay = document.getElementById("secondary_display");
const secondaryElementClassName = "s-elements";

const secondaryLoadClass = '0-ccs'
const secondaryLoadingTime = 1500;

updateSelectedElementDisplay(secondarySelector, secondaryDisplay, secondaryElementClassName,secondaryLoadClass, secondaryLoadingTime);

secondarySelector.addEventListener("change", function () {
  updateSelectedElementDisplay(secondarySelector, secondaryDisplay, secondaryElementClassName, secondaryLoadClass, secondaryLoadingTime);
});





