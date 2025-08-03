const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formEl, inputElement, errorMsg, config) => {
  const errorMsgID = inputElement.id + "-error";
  const errorMsgEl = formEl.querySelector("#" + errorMsgID);
  errorMsgEl.textContent = errorMsg;
  inputElement.classList.add(config.inputErrorClass);
  errorMsgEl.classList.add(config.errorClass);
};

const hideInputError = (formEl, inputElement, config) => {
  const errorMsgID = inputElement.id + "-error";
  const errorMsgEl = formEl.querySelector("#" + errorMsgID);
  errorMsgEl.textContent = "";
  inputElement.classList.remove(config.inputErrorClass);
  errorMsgEl.classList.remove(config.errorClass);
};
const resetValidation = (formElement, inputList, settings) => {
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

const checkInputValidity = (formEl, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formEl,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formEl, inputElement, config);
  }
};

const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

enableValidation(settings);
