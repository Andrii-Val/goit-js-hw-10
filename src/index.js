
import API from './js/cat-api';

import Notiflix from 'notiflix';
const refs = {
    select: document.querySelector('.breed-select'),
    catContainer: document.querySelector('.cat-info'),
    loading: document.querySelector('.loader'),
    errorMessage: document.querySelector('.error'),
    
};

refs.select.addEventListener('change', onSelectView);

// API Fetch & Add options in select
getOptions();

function getOptions() {
  API.fetchBreeds()
  .then(getAllIds)
  .catch(error => {
    if (error) {
      showErrorFailure();

    }
  });
}
function getAllIds(arr) {
  const breedSelect = document.querySelector('.breed-select');

  for (let i = 0; i < arr.length; i += 1) {
    let value = arr[i].id;
    let text = arr[i].name;

    const optionsElement = document.createElement('option');
    optionsElement.value = value;
    optionsElement.textContent = text;
    breedSelect.appendChild(optionsElement);
  }
}

function onSelectView() {
  const breedId = selectedBreeds();

  const isContent = document.querySelector('.img-cat');

  if (isContent) {
    clearCatContainer();
  }
 
  showLoadingMessage();

  API.fetchCatByBreed(breedId)
    .then(markUp)
    .catch(showError)
    .finally(hideLoadingMessage);

  
  refs.container.classList.add('is-active');
}

 function showError() {
  Notiflix.Notify.failure(
    ' Oops! Something went wrong! Try reloading the page!'
  );
}


 function showErrorFailure() {
  Notiflix.Report.failure(
    'Oops! Something went wrong! Try reloading the page!',
    
  );
}


function selectedBreeds() {
  const selectedValue = refs.select.options[refs.select.selectedIndex];
  const selectedText = selectedValue.textContent;

  const selectedId = selectedValue.value;

  return selectedId;
}


function markUp(arr) {
  
  let imgUrl = arr.map(link => link.url);

 
  let catDesc = arr.map(link => link.breeds[0].description);

  
  let catTemp = arr.map(link => link.breeds[0].temperament);

  const markUp = `
  
    <img class="img-cat" src="${imgUrl}" width="500" height="400" loading="lazy">
    <div class="intro">
      <p class="cat-info"><b>Description: </b>${catDesc}</p>
      <p class="cat-info"><b>Temperament: </b>${catTemp}</p>
    </div>
  `;

  refs.catContainer.insertAdjacentHTML('beforeend', markUp);
}

function showLoadingMessage() {
  refs.loading.style.display = 'block';
}
function hideLoadingMessage() {
  refs.loading.style.display = 'none';
}
function clearCatContainer() {
  const children = Array.from(refs.catContainer.children);

  children.forEach(child => {
    if (child !== refs.closeButton) {
      refs.catContainer.removeChild(child);
    }
  });
}
