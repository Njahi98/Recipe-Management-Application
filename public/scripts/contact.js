import {createModal} from './utils/modal.js'
// simple input field validation
const nameInput = document.querySelector(".contact-name input");
const emailInput = document.querySelector(".contact-email input");
const messageInput = document.querySelector(".contact-message textarea");
const form = document.querySelector(".contact-form");
//function to clear the error class from the inputs as soon as the validation starts
const clearErrors = () => {
  document.querySelectorAll(".error").forEach((error) => error.remove());
};
//on submit we will focus on the input with error but first we initialize it as false
let focusApplied = false;
//we add a paragraph tag under the input containing the corresponding error message
function displayError(input, message) {
  const errorElement = document.createElement("p");
  errorElement.textContent = message;
  errorElement.style.color = "red";
  errorElement.classList.add("error");
  input.parentElement.appendChild(errorElement);
  // if the user commits an error !focusApplied will be equal to True and that will focus the corresponding input
  if (!focusApplied) {
    input.focus();
    focusApplied = true;
  }
}
// regex needed to test the provided email by the user against the typical email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
// we use async await because we're using e.preventDefault() so we
// have to manually pass the input data into the request to be fetched to the backend
async function ValidateAndSubmit(e) {
  e.preventDefault();
  //at the beginning of a validation we need to reset the state of focus and we need to clear errors
  focusApplied = false;
  clearErrors();

  const nameValidation = () => {
    try {
      //we use the method trim() so the white space doesn't count as a word itself
      if (!nameInput.value.trim()) {
        displayError(nameInput, "Name cannot be empty.");
        return false;
      }
      if (nameInput.value.trim().split(" ").length < 2) {
        displayError(nameInput, "Please provide a name with at least 2 words");
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  };

  const emailValidation = () => {
    try {
      if (!validateEmail(emailInput.value)) {
        displayError(emailInput, "Please provide a valid email");
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  };
  const messageValidation = () => {
    try {
      if (messageInput.value.trim().split(" ").length < 3) {
        displayError(
          messageInput,
          "you need to provide a message with at least three words"
        );

        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  };
  if (nameValidation() && emailValidation() && messageValidation()) {
    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
    };
    createModal(
      "Are you sure?",
      "This action cannot be cancelled.",
      async() => {
        try {
          const response = await fetch("/contact", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          if (response.ok) {
            const modal = document.querySelector('.modal-backdrop'); 
            setTimeout(() => {
              modal.innerHTML = `
                      <div class="modal-container">
                          <div style="display: flex; justify-content: center;">
                        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/> <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                      </svg>
                      </div>
                        `;
            }, 1000);
            setTimeout(() => {
              form.reset();
              modal.remove();
              showNotification('Message sent successfully. redirecting to Home Page.','var(--success-color)');
            }, 1500);
            setTimeout(() => {
              window.location.href = '/'
            }, 3000);
          } else {
            modal.remove();
            form.reset();
            showNotification("Failed to send your message. Please try again later.",'var(--error-color)');
          }
        } catch (error) {
          showNotification(error,'var(--error-color)');
        }
      })
    //await method to pass formData into the POST request and into the backend
  
  }
}

form.addEventListener("submit", ValidateAndSubmit);
