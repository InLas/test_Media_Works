function testWebP(callback) {
  var webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
};
  
testWebP(function (support) {
  if (support == true) {
    document.querySelector('body').classList.add('webp');
  } else {
  document.querySelector('body').classList.add('no-webp');
  }
});

let page = document.querySelector('.page');
let popupShowButton = document.querySelector('.main-nav__link--log-in');
let popup = document.querySelector('.popup');
let popupCloseButton = popup.querySelector('.popup__close');

popupShowButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  popup.classList.add('popup--show');
  page.classList.add('page--popup');
});

popupCloseButton.addEventListener('click', function () {
  popup.classList.remove('popup--show');
  page.classList.remove('page--popup');
});

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
    popup.classList.remove('popup--show');
    page.classList.remove('page--popup');
  }
});