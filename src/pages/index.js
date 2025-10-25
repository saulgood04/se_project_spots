import "./index.css";
import logoSvg from "../images/logo.svg";
import avatarJpg from "../images/avatar.jpg";
import pencilSvg from "../images/pencil.svg";
import pencilLightSvg from "../images/pencil-light.svg";
import plusSvg from "../images/Plus.svg";
import closeIconSvg from "../images/CloseIcon.svg";
import trashIcon from "../images/delete1.svg";
import whiteCloseBtnSvg from "../images/whiteCloseBtn.svg";
let cardToDelete = null;
document.querySelector(".header__logo").src = logoSvg;
document.querySelector(".profile__avatar").src = avatarJpg;
document.querySelector(".profile__edit-btn img").src = pencilSvg;
document.querySelector(".profile__add-btn img").src = plusSvg;
document.querySelector(".profile__pencil-icon").src = pencilLightSvg;
document.querySelectorAll(".modal__close-btn img")[0].src = closeIconSvg;
document.querySelectorAll(".modal__close-btn img")[1].src = closeIconSvg;
document.querySelector(".modal__close-btn_type_preview img").src = whiteCloseBtnSvg;
document.querySelector(".modal__close-btn_type_delete img").src = closeIconSvg;

import {
  enableValidation,
  settings,
  resetValidation,
  toggleButtonState,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "fc057a31-8a4f-493d-9847-32e1e58f5172",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, users]) => {

    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileNameEl.textContent = users.name;
    profileDescriptionEl.textContent = users.about;
    document.querySelector(".profile__avatar").src = users.avatar;
  })
  .catch(console.error);

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const addCardFormElement = newPostModal.querySelector(".modal__form");
const cardCaptionInput = newPostModal.querySelector("#card-caption-input");
const linkInput = newPostModal.querySelector("#card-image-input");

const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarBtn = avatarModal.querySelector(".profile__add-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarElement = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");


const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseBtn = document.querySelector(
  "#delete-modal .modal__close-btn"
);

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  cardElement.dataset.cardId = data._id;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

  cardLikeBtnEl.addEventListener("click", () => {
    if (cardLikeBtnEl.classList.contains("card__like-btn_active")) {
      api
        .removeLike(data._id)
        .then(() => {
          cardLikeBtnEl.classList.remove("card__like-btn_active");
        })
        .catch(console.error);
    } else {
      api
        .addLike(data._id)
        .then(() => {
          cardLikeBtnEl.classList.add("card__like-btn_active");
        })
        .catch(console.error);
    }
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  const deleteIcon = cardElement.querySelector(".card__delete-icon");

  deleteIcon.src = trashIcon;
  cardDeleteBtnEl.addEventListener("click", (evt) => {
   if (evt.target.classList.contains("card__delete-button") || evt.target.parentElement.classList.contains("card__delete-button")){
      cardToDelete = cardElement;
      openModal(deleteModal);
    }
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      closeModal(avatarModal);
      avatarElement.reset();
    })
    .catch(console.error);
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  modal.addEventListener("click", handleOverlayClick);
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  modal.removeEventListener("click", handleOverlayClick);
  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    closeModal(openedModal);
  }
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(evt.target);
  }
}

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseBtn.addEventListener("click", (evt) => {
  closeModal(previewModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();


  const submitBtn = evt.submitter;

  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
    })

    .catch(console.error)
    .finally(() => {

      submitBtn.textContent = "Save";
    });



  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
  resetValidation(avatarElement, [avatarInput], settings);
});
avatarElement.addEventListener("submit", handleAvatarSubmit);
avatarCloseBtn.addEventListener("click", (evt) => {
  closeModal(avatarModal);
});

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const name = cardCaptionInput.value;
  const link = linkInput.value;

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Saving...", "Save");

  api
    .addCard({ name, link })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      closeModal(newPostModal);
      evt.target.reset();

      const inputList = [cardCaptionInput, linkInput];
      const buttonElement =
        addCardFormElement.querySelector(".modal__submit-btn");
      toggleButtonState(inputList, buttonElement, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Saving...", "Save");
    });
}

addCardFormElement.addEventListener("submit", handleAddCardSubmit);

document
  .querySelector("#delete-modal .modal__submit-btn")
  .addEventListener("click", (evt) => {
    if (cardToDelete) {
      const submitBtn = evt.target;
      setButtonText(submitBtn, true, "Delete", "Deleting...");

      api
        .deleteCard(cardToDelete.dataset.cardId)
        .then(() => {
          cardToDelete.remove();
          cardToDelete = null;
          closeModal(deleteModal);
        })
        .catch((error) => {
          console.error("Failed to delete card:", error);
        })
        .finally(() => {
          setButtonText(submitBtn, false, "Delete", "Deleting...");
        });
    }
  });


document.querySelector(".modal__cancel-btn").addEventListener("click", () => {
  cardToDelete = null;
  closeModal(deleteModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

enableValidation(settings);
