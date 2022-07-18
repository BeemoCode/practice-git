// Это новый файл, новое переосмысление всего.

// 1. Функция получения пути до картинки. На вход получает картинку, возвращает относительный путь. По сути работает так, теперь туда можно передать либо превью картинки, и он вернет путь без нее, либо просто относительный путь до картинки.
const getImgPath = function (img) {
  const imgSrc = img.getAttribute("src");
  return imgSrc.includes("-thumbnail")
    ? imgSrc.replace("-thumbnail", "")
    : imgSrc;
};

// ? Можно сделать эту функцию еще проще, исключительно меняя стиль? Либо же вынести в нее больше функционала.
const changeBigImg = function (clickedImg, isModal, src) {
  let selectedImg;
  let selectedImgBox;

  if (isModal) {
    selectedImgBox = document.querySelector(".gallery__selected--modal");
    selectedImg = selectedImgBox.querySelector(".gallery__selected-img");
  } else {
    selectedImgBox = clickedImg
      .closest(".gallery")
      .querySelector(".gallery__selected");
    selectedImg = clickedImg
      .closest(".gallery")
      .querySelector(".gallery__selected-img");
  }
  selectedImg.style.opacity = 0;
  selectedImgBox.style.background = `no-repeat url(${src}) center/100% `;
};

// 2. Что происходит когда мы жмем на большую картинку? Открывается лайтбокс(правда при условии, что экран шире 800px пожалуй), надо добавить проверку на размер экрана. Дальше. По идее при клике на картинку, в модалке должна быть точно такая же картинка, поэтому нам нужно либо брать путь ближайшего активного элемента, либо src большой картинки. На текущий момент, изображение меняется через background, и поэтому после первого же изменения, мы не можем получить именно при клике на большую картинку. Можно тогда всегда брать из ближайшего активного. Дальше нам нужно взять и вставить в модальное окно.
// 3. Помимо прочего, теперь надо чтобы еще и выбранный в основной галереи активный селект стал таким же и в мадалке.

const openLightBox = function (e) {
  const activeSelect = e.target
    .closest(".gallery")
    .querySelector(".gallery__select--active");
  const activeSelectImg = activeSelect.querySelector(".gallery__select-img");
  changeBigImg(undefined, true, getImgPath(activeSelectImg));
  modalEL.classList.add("modal--open");

  const modalSelects = document
    .querySelector(".gallery--modal")
    .querySelectorAll(".gallery__select-img");
  modalSelects.forEach((el) => {
    if (el.src === activeSelectImg.src) {
      const matchSelect = el.closest(".gallery__select");
      changeSelectActive(matchSelect);
    }
  });
};

// Попробуем написать другую функцию которая делает изображение активным. Если передавать элемент, тогда мы можем избавиться от проблемы с событиями и переиспользовать код.

const changeSelectActive = function (elem) {
  const selectEL = elem;
  const closestSelects = selectEL
    .closest(".gallery__select-list")
    .querySelectorAll(".gallery__select");
  closestSelects.forEach((el) =>
    el.classList.remove("gallery__select--active")
  );
  selectEL.classList.add("gallery__select--active");
};
