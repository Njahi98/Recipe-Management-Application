export function createReviewModal(confirmCallback) {
  const modal = document.createElement("div");
  modal.classList.add("modal-backdrop");
  modal.innerHTML = `
    <div class="review-modal-container">
    <div style="display: flex; justify-content: flex-end;">
         <button class="modal-close-action">×</button>  
    </div>
    <h3>Review</h3>
    <p>Please fill in the review below.</p>
    <div class="review-modal-group">
    <p>Rating:</p>
    </div>
    <div class="review-modal-group">
    <p style="margin-top:0.75rem;">Comment:</p>
    <textarea name="comment" id="comment" rows="4" placeholder="Your Comment"></textarea>
    </div>

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
