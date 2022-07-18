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
const openLightBox = function () {
  modalEL.classList.add("modal--open");
};
const closeLightBox = function (e) {
  const clickedIconClose = e.target.closest(".modal__icon-box--close");
  const clickedGalleryEL = e.target.closest(".gallery--modal");
  if (clickedIconClose || !clickedGalleryEL) {
    modalEL.classList.remove("modal--open");
  }
};

// ! Вроде работает корректно
const changeBigImg = function (clickedImg, src) {
  const selectedImgBox = clickedImg
    .closest(".gallery")
    .querySelector(".gallery__selected");
  const selectedImg = clickedImg
    .closest(".gallery")
    .querySelector(".gallery__selected-img");

  selectedImg.style.opacity = 0;
  selectedImgBox.style.background = `no-repeat url(${src}) center/100% `;
};
const getImgPath = function (img) {
  const imgSrc = img.querySelector(".gallery__select-img").getAttribute("src");
  return imgSrc.replace("-thumbnail", "");
};
const getSelectList = function (e) {
  return e.target.closest(".gallery").querySelectorAll(".gallery__select");
};

const changeImg = function (e) {
  const clickedImg = e.target.closest(".gallery__select");
  if (!clickedImg) return;
  const selectImgs = getSelectList(e);
  selectImgs.forEach((el) => {
    el.classList.remove("gallery__select--active");
  });
  clickedImg.classList.add("gallery__select--active");
  changeBigImg(clickedImg, getImgPath(clickedImg));
};

const changeActiveImg = function (e, type) {
  const selectImgs = getSelectList(e);
  const lastImg = selectImgs.length;

  const goToActive = function (img) {
    selectImgs.forEach((selectImg, i) => {
      if (i === img) {
        selectImg.classList.add("gallery__select--active");
        changeBigImg(selectImg, getImgPath(selectImg));
      } else {
        selectImg.classList.remove("gallery__select--active");
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
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevImg();
    if (e.key === "ArrowRight") nextImg();
  });
  type === "next" ? nextImg() : prevImg();
};

// * test
// const changeActiveImg = function (e, type) {
//   // При клике
//   const clickedImg = e.target.closest(".gallery__select");
//   // Для кнопок
//   const selectImgs = e.target
//     .closest(".gallery")
//     .querySelectorAll(".gallery__select");
//   const lastImg = selectImgs.length;

//   if (clickedImg) {
//     const imgSrc = clickedImg
//       .querySelector(".gallery__select-img")
//       .getAttribute("src");
//     const fullImgSrcPath = imgSrc.replace("-thumbnail", "");
//     selectImgs.forEach((el) => {
//       el.classList.remove("gallery__select--active");
//     });
//     clickedImg.classList.add("gallery__select--active");

//     const selectedImgBox = clickedImg
//       .closest(".gallery")
//       .querySelector(".gallery__selected");
//     const selectedImg = clickedImg
//       .closest(".gallery")
//       .querySelector(".gallery__selected-img");
//     console.log(selectedImg);

//     selectedImg.style.opacity = 0;
//     selectedImgBox.style.background = `no-repeat url(${fullImgSrcPath}) center/100% `;
//   }

//   const goToActive = function (img) {
//     selectImgs.forEach((el, i) => {
//       i === img
//         ? el.classList.add("gallery__select--active")
//         : el.classList.remove("gallery__select--active");
//     });
//   };
//   const nextImg = function () {
//     if (state.curImg === lastImg - 1) {
//       state.curImg = 0;
//     } else {
//       state.curImg++;
//     }
//     goToActive(state.curImg);
//   };
//   const prevImg = function () {
//     if (state.curImg === 0) {
//       state.curImg = lastImg - 1;
//     } else {
//       state.curImg--;
//     }

//     goToActive(state.curImg);
//   };
//   document.addEventListener("keydown", (e) => {
//     if (e.key === "ArrowLeft") prevImg();
//     e.key === "ArrowRight" && nextImg();
//   });
//   type === "next" ? nextImg() : prevImg();
// };

/* 

* Обработчики событий 

*/

nextImgBtnEL.addEventListener("click", (e) => {
  changeActiveImg(e, "next");
});
previousImgBtnEL.addEventListener("click", (e) => {
  changeActiveImg(e, "prev");
});

////
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
    // changeActiveImg(e);
    changeImg(e);
  });
});

mainImgEL.addEventListener("click", openLightBox);
