import { createModal } from "./modal.js";

  //get all the contacts
  const contactGrid = document.querySelector('.admin-contact-grid');

  function boss (){
    try {
    contactGrid.innerHTML=`<div class="wheel" style="display: flex; justify-content: center; display: none;">
              <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </div>`
  
      data.map(contact=>{
        const html = document.createElement('div');
        html.className='review-card'
        html.dataset.id=contact._id
        html.innerHTML=`
                          <div class="review-user">
               <p> ${contact.name} </p> 
               <p> ${contact.email} </p> 
  
                          </div>
                          <div class="review-content">
        
                              <p class="review-comment">${contact.message}</p>
                          </div>
                              <div class="review-btn-actions">
                               <button class="deleteRecipeBtn" data-contactdoc="${contact._id}">Delete</button>

                              </div>
        `;
        contactGrid.appendChild(html);
      });
  
    
    
  } catch (error) {
    showNotification(error,'var(--error-color)');
  }
  }
  boss();
  
  const deleteButtons = contactGrid.querySelectorAll('.deleteRecipeBtn');
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click',
        function () {
            createModal(
          "Are you sure?",
          "Do you really want to delete this contact mail? This action cannot be undone.",
          async() => {
            try {
            const contactId = deleteButton.dataset.contactdoc;
            const endpoint = `contact/${contactId}`;
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
                  modal.remove();
                  const card = document.querySelector(`.review-card[data-id="${contactId}"]`);
                  card.remove();
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
    })
  })
  
  