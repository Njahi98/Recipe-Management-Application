
const trashcan = document.querySelector(".delete-btn");

const modal = document.createElement('div');
modal.classList.add('modal-backdrop')
trashcan.addEventListener("click", (e) => {
  modal.innerHTML=
  `
  <div class="modal-container">
  <h3>Are you sure?</h3>
  <p>Do you really want to delete this recipe? This action cannot be undone.</p>
<div class="modal-actions">
  <button class="modal-confirm-action">Confirm</button>
  <button class="modal-cancel-action">Cancel</button>
</div>
</div>
  `
  document.body.appendChild(modal);
  const confirmBtn=document.querySelector('.modal-confirm-action');
  const cancelBtn=document.querySelector('.modal-cancel-action');
  confirmBtn.addEventListener('click',()=>{
    const endpoint = `/recipes/${trashcan.dataset.doc}`;
  
    fetch(endpoint, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => (window.location.href = data.redirect))
      .catch((err) => console.log(err));
  
  })
  cancelBtn.addEventListener('click',()=>{
    modal.remove();
  })
  
});




