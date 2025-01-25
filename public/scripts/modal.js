export function createModal(title, message, confirmCallback) {
    const modal = document.createElement("div");
    modal.classList.add("modal-backdrop");
    modal.innerHTML = `
    <div class="modal-container">
    <h3>${title}</h3>
    <p>${message}</p>
  <div class="modal-actions">
    <button class="modal-confirm-action">Confirm</button>
    <button class="modal-cancel-action">Cancel</button>
  </div>
  </div>
    `;
    document.body.appendChild(modal);
    const confirmBtn=modal.querySelector('.modal-confirm-action');
    const cancelBtn=modal.querySelector('.modal-cancel-action');
  
  
    confirmBtn.addEventListener('click',confirmCallback);
  
    cancelBtn.addEventListener('click',()=>{
    confirmBtn.removeEventListener('click',confirmCallback);
  
      modal.remove();
    },{ once: true })
  
  }