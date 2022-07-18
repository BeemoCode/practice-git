"use strict";

const bodyEL = document.querySelector("body");
const priceEL = document.querySelector(".price__current-value");
const quantityEL = document.querySelector(".purchase__quantity");
const articleEL = document.querySelector(".about__article-name");
const cartBadgeEL = document.querySelector(".cart__quantity");
const cartBtnEL = document.querySelector(".cart__btn");
const cartBoxContentEL = document.querySelector(".cart__box-content");
const galleryListsEL = document.querySelectorAll(".gallery__select-list");
const galleryPreviewsEL = document.querySelectorAll(".gallery__select");
const mainImgEL = document.querySelector(".gallery__selected-img");
const modalEL = document.querySelector(".modal");
const nextImgBtnEL = document.querySelector(".modal__icon-box--next");
const previousImgBtnEL = document.querySelector(".modal__icon-box--previous");

const price = priceEL.textContent.slice(1);
const quantity = quantityEL.textContent;
const article = articleEL.textContent;

const addItem = document.getElementById("addItem");
const reduceItem = document.getElementById("reduceItem");
const addToCart = document.getElementById("addToCart");

const state = {
  quantity,
  price,
  article,
  orderCount: 0,
  curImg: 0,
};

const changeQuantity = function (sign) {
  sign === "+" ? state.quantity++ : state.quantity--;
  quantityEL.innerText = state.quantity;
};
const render = function () {
  cartBadgeEL.innerText = state.orderCount;
  state.orderCount == 0
    ? (cartBadgeEL.style.opacity = 0)
    : (cartBadgeEL.style.opacity = 1);
};

const closeLightBox = function (e) {
  const clickedIconClose = e.target.closest(".modal__icon-box--close");
  const clickedGalleryEL = e.target.closest(".gallery--modal");
  if (clickedIconClose || !clickedGalleryEL) {
    modalEL.classList.remove("modal--open");
  }
};

const getImgPath = function (img) {
  const imgSrc = img.getAttribute("src");
  return imgSrc.includes("-thumbnail")
    ? imgSrc.replace("-thumbnail", "")
    : imgSrc;
};
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

const changeImg = function (e) {
  const clickedSelect = e.target.closest(".gallery__select");
  if (!clickedSelect) return;
  const clickedImg = clickedSelect.querySelector(".gallery__select-img");

  changeSelectActive(clickedSelect);
  changeBigImg(clickedImg, false, getImgPath(clickedImg));

  // update current image
  const listImgs = clickedSelect
    .closest(".gallery")
    .querySelectorAll(".gallery__select-img");
  listImgs.forEach((el, i) => {
    el.src === clickedImg.src && (state.curImg = i);
  });
};
const changeActiveImg = function (e, type) {
  const closestActiveSelect = e.target
    .closest(".gallery")
    .querySelector(".gallery__select--active");

  const selects = closestActiveSelect
    .closest(".gallery")
    .querySelectorAll(".gallery__select");

  const lastImg = selects.length;

  const goToActive = function (pos) {
    selects.forEach((select, i) => {
      const selectImg = select.querySelector(".gallery__select-img");
      if (i === pos) {
        changeSelectActive(select);
        changeBigImg(selectImg, false, getImgPath(selectImg));
      } else {
        select.classList.remove("gallery__select--active");
      }
    });
  };
  const nextImg = function () {
    if (state.curImg === lastImg - 1) {
      state.curImg = 0;
    } else {
      state.curImg++;
    }
    goToActive(state.curImg);
  };
  const prevImg = function () {
    if (state.curImg === 0) {
      state.curImg = lastImg - 1;
    } else {
      state.curImg--;
    }

    goToActive(state.curImg);
  };

  type === "next" ? nextImg() : prevImg();
};

/* * Обработчики событий */

nextImgBtnEL.addEventListener("click", (e) => {
  changeActiveImg(e, "next");
});
previousImgBtnEL.addEventListener("click", (e) => {
  changeActiveImg(e, "prev");
});

cartBoxContentEL.addEventListener("click", (e) => {
  e.stopPropagation();
  const deleteBtn = e.target.closest(".order__btn--delete");
  if (!deleteBtn) return;

  deleteBtn.closest(".order").querySelector(".order__btn--checkout")
    ? deleteBtn.closest(".order__preview").remove()
    : deleteBtn.closest(".order").remove();
  state.orderCount--;

  if (state.orderCount == 0) {
    document.querySelectorAll(".order").forEach((el) => {
      el.remove();
    });
    cartBoxContentEL.classList.add("cart__box-content--empty");
    document.querySelector(".cart__box-default-text").style.display = "block";
  }
  render();
});

addItem.addEventListener("click", () => {
  changeQuantity("+");
});

reduceItem.addEventListener("click", () => {
  if (state.quantity == 0) return;
  changeQuantity("-");
});

addToCart.addEventListener("click", () => {
  const markup = `
  <div class="order">
    <div class="order__preview">
      <img
        class="order__img"
        src="./images/image-product-1-thumbnail.jpg"
        alt="thumbnail"
      />

      <div class="order__description">
        <p class="order__text">${state.article}</p>
        <p class="order__price">
          $${state.price} x ${state.quantity}
          <span class="order__price--total">$${
            state.price * state.quantity
          }.00</span>
        </p>
      </div>

      <button class="order__btn--delete">
        <svg class="order__icon">
          <use href="./images/sprite.svg#icon-delete"></use>
        </svg>
      </button>
    </div>
    ${
      state.orderCount > 0
        ? ""
        : '<button class="order__btn--checkout">Checkout</button>'
    }
    
  </div>
    `;

  if (state.quantity == 0) return;

  cartBoxContentEL.classList.remove("cart__box-content--empty");
  document.querySelector(".cart__box-default-text").style.display = "none";
  cartBoxContentEL.insertAdjacentHTML("afterbegin", markup);
  state.orderCount++;
  render();

  // document.querySelectorAll(".order__btn--checkout");
});

bodyEL.addEventListener("click", (e) => {
  const clickedCartIcon = e.target.closest(".cart__btn");
  const clickedCartBox = e.target.closest(".cart__box");

  if (clickedCartIcon) {
    document.querySelector(".cart__box").classList.toggle("cart__box--open");
  }

  if (!clickedCartIcon && state.orderCount == 0 && !clickedCartBox) {
    document.querySelector(".cart__box").classList.remove("cart__box--open");
  }
});

modalEL.addEventListener("click", (e) => {
  closeLightBox(e);
});

galleryListsEL.forEach((el) => {
  el.addEventListener("click", (e) => {
    changeImg(e);
    // changeSelectActive(e);
  });
});

mainImgEL.addEventListener("click", (e) => {
  openLightBox(e);
});
