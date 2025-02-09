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
            confirmCallback();
  });

  const closesModal = () => {
    confirmBtn.removeEventListener("click", confirmCallback);
    modal.remove();
  };

  cancelBtn.addEventListener("click", closesModal, { once: true });
  closeModal.addEventListener("click", closesModal, { once: true });
}
