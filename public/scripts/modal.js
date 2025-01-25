export function createModal(title, message, confirmCallback) {
  const modal = document.createElement("div");
  modal.classList.add("modal-backdrop");
  modal.innerHTML = `
    <div class="modal-container">
    <div style="display: flex; justify-content: flex-end;">
         <button class="modal-close-action">×</button>  
    </div>
    <h3>${title}</h3>
    <p>${message}</p>
  <div class="modal-actions">
    <button class="modal-confirm-action">Confirm</button>
    <button class="modal-cancel-action">Cancel</button>
  </div>
  </div>
    `;
  document.body.appendChild(modal);
  const closeModal = modal.querySelector(".modal-close-action");
  const confirmBtn = modal.querySelector(".modal-confirm-action");
  const cancelBtn = modal.querySelector(".modal-cancel-action");

  confirmBtn.addEventListener("click", () => {
    modal.innerHTML = `
          <div class="modal-container">
              <div style="display: flex; justify-content: center;">
            <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div></div>
            `;
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
      confirmCallback();
    }, 2000);

  });

  const closesModal = () => {
    confirmBtn.removeEventListener("click", confirmCallback);
    modal.remove();
  };

  cancelBtn.addEventListener("click", closesModal, { once: true });
  closeModal.addEventListener("click", closesModal, { once: true });
}
