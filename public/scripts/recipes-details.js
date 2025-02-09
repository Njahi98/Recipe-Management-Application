import { createModal } from "./modal.js";
const trashcan = document.querySelector(".delete-btn");


trashcan.addEventListener("click", (e) => {
  e.preventDefault();
  createModal(
    "Are you sure?",
    "Do you really want to delete this recipe? This action cannot be undone.",
    async() => {
      try {
      const endpoint = `/recipes/${trashcan.dataset.doc}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
      });
      const modal = document.querySelector('.modal-backdrop')
        if(response.ok){
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
            window.location.href = '/recipes'
          }, 2000);
        }else{
          modal.remove();
          const errorData = await response.json();
          showNotification(errorData.error,'var(--error-color)');
        }
      } catch (error) {
        showNotification(error,'var(--error-color)');
      }
    }
  );
});





