import { LAT_CENTER_TOKYO, LNG_CENTER_TOKYO } from './map.js';
import { showSuccessAlert, showErrorAlert } from './popup-messages.js';
import { sendData } from './api.js';
import { resetPreviews } from './previews.js';

const COORDINATES_TOKYO = '35.681700, 139.753882';
const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const MIN_PRICE_FOR_BUNGALOW = '0';
const MIN_PRICE_FOR_FLAT = '1000';
const MIN_PRICE_FOR_HOUSE = '5000';
const MIN_PRICE_FOR_PALACE = '10000';

const adForm = document.querySelector('.ad-form')
const selectTypeHousing = adForm.querySelector('#type');
const inputPrice = adForm.querySelector('#price');
const inputTitle = adForm.querySelector('#title');
const selectTimeIn = adForm.querySelector('#timein');
const selectTimeOut = adForm.querySelector('#timeout');
const fieldsetTime = adForm.querySelector('.ad-form__element--time');
const inputAddress = adForm.querySelector('#address');
const selectRooms = adForm.querySelector('#room_number');
const selectCapacity = adForm.querySelector('#capacity');
const selectCapacityOptions = selectCapacity.querySelectorAll('option');
const textareaDescription = adForm.querySelector('#description');
const checkboxesFeatures = adForm.querySelectorAll('.feature__checkbox');

const defaultOptionTypeHousing = selectTypeHousing.querySelector('[selected]');
const defaultOptionRooms = selectRooms.querySelector('[selected]');
const defaultOptionTimeIn = selectTimeIn.querySelector('[selected]');
const defaultOptionTimeOut = selectTimeOut.querySelector('[selected]');


const setInputPrice = () => {
  switch (selectTypeHousing.value) {
    case 'bungalow':
      inputPrice.placeholder = MIN_PRICE_FOR_BUNGALOW;
      inputPrice.min = MIN_PRICE_FOR_BUNGALOW;
      break;

    case 'flat':
      inputPrice.placeholder = MIN_PRICE_FOR_FLAT;
      inputPrice.min = MIN_PRICE_FOR_FLAT;
      break;

    case 'house':
      inputPrice.placeholder = MIN_PRICE_FOR_HOUSE;
      inputPrice.min = MIN_PRICE_FOR_HOUSE;
      break;

    case 'palace':
      inputPrice.placeholder = MIN_PRICE_FOR_PALACE;
      inputPrice.min = MIN_PRICE_FOR_PALACE;
      break;

    default:
      inputPrice.placeholder = 'Неизвестное значение';
      inputPrice.min = null;
  }
}


const setSelectCapacity = () => {
  const maxNumberRooms = 100;
  const specialCapacity = 0;

  for (let i = 0; i < selectCapacityOptions.length; i++) {
    selectCapacityOptions[i].style.display = 'none';

    if (+selectCapacityOptions[i].value <= +selectRooms.value && +selectCapacityOptions[i].value !== specialCapacity && +selectRooms.value !== maxNumberRooms) {
      selectCapacityOptions[i].style.display = 'block';
    }

    if (+selectCapacityOptions[i].value === specialCapacity && +selectRooms.value >= maxNumberRooms) {
      selectCapacityOptions[i].style.display = 'block';
      selectCapacityOptions[i].selected = true;
    }

    if (+selectCapacityOptions[i].value === +selectRooms.value) {
      selectCapacityOptions[i].selected = true;
    }
  }
};


const setInputAddress = (lat, lng) => {
  inputAddress.value = `${lat}, ${lng}`;
};


inputAddress.readOnly = true;


document.addEventListener('DOMContentLoaded', () => {
  setInputPrice();
  setSelectCapacity();
  setInputAddress(LAT_CENTER_TOKYO, LNG_CENTER_TOKYO);
});


inputTitle.addEventListener('input', () => {
  const valueLength = inputTitle.value.length;

  if (valueLength < MIN_TITLE_LENGTH) {
    inputTitle.setCustomValidity('Ещё ' + (MIN_TITLE_LENGTH - valueLength) + ' симв.');
  } else if (valueLength > MAX_TITLE_LENGTH) {
    inputTitle.setCustomValidity('Удалите лишние ' + (valueLength - MAX_TITLE_LENGTH) + ' симв.');
  } else {
    inputTitle.setCustomValidity('');
  }

  inputTitle.reportValidity();
});


selectTypeHousing.addEventListener('change', () => {
  setInputPrice();
});


fieldsetTime.addEventListener('change', (evt) => {
  if (evt.target.name === 'timein') {
    selectTimeOut.value = evt.target.value;
  }

  if (evt.target.name === 'timeout') {
    selectTimeIn.value = evt.target.value;
  }
});


selectRooms.addEventListener('change', () => {
  setSelectCapacity();
});


const setDefaultAdForm = () => {
  inputTitle.value = '';
  selectTypeHousing.value = defaultOptionTypeHousing.value;
  setInputPrice();
  inputPrice.value = '';
  selectRooms.value = defaultOptionRooms.value;
  setSelectCapacity();
  textareaDescription.value = '';
  inputAddress.value = COORDINATES_TOKYO;
  selectTimeIn.value = defaultOptionTimeIn.value;
  selectTimeOut.value = defaultOptionTimeOut.value;
  resetPreviews();

  for (let checkbox of checkboxesFeatures) {
    checkbox.checked = false;
  }
};


const setAdFormSubmit = (onSuccess) => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    sendData(new FormData(evt.target))
      .then(() => {
        showSuccessAlert();
        onSuccess();
      })
      .catch(showErrorAlert);
  });
};


export { setInputAddress, setDefaultAdForm, setAdFormSubmit, inputAddress };
