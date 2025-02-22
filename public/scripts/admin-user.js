import { createModal } from "./modal.js";


//view user details
const viewButtons = document.querySelectorAll('button[class="admin-btn admin-btn-view"]');
viewButtons.forEach(viewButton => 
    viewButton.addEventListener('click',async function() {
        try {
        const userId = viewButton.dataset.userdata;
          const response = await fetch(`/admin/users/${userId}`);
          const data = await response.json();
          
          if (data.user) {
            const user = data.user;
            const modal = document.createElement("div");
            modal.classList.add("modal-backdrop");
            modal.innerHTML = `
            <div class="admin-modal-container">
    <div style="display: flex; justify-content: flex-end;">
         <button class="modal-close-action">×</button>  
    </div>
      <div class="user-header" style="margin-bottom:0;">
      <h2 >${user.username}</h2>
                        <div class="user-meta" style="margin-bottom:0;">
                      <span>⚙️   ${user.role} </span>
                      <span>🎯  ${user.location} </span>
                      <span>📑  ${user.website} </span>
                      <span>📑  ${user.email} </span>

                  </div></div>
             <img 
                src="users/image/${user.imageId}" 
                alt="${user.title}" 
                style="max-width: 100%; max-height:180px; margin: 1rem 0;"
                onerror="this.src='/images/default-profile.png'"
              >
             <div class="user-section" style="margin-bottom:0;">
                  <h3>Bio</h3>
                  <p>${user.bio}</p>
              </div>
              <div class="user-section" style="margin-bottom:0;">
                  <h3>Website:</h3>
                  <p>${user.website}</p>
              </div>
                      <div class="user-section" style="margin-bottom:0;">
                  <h3>Social media links:</h3>
               
              </div>
        <a href="/profile/${user._id}"><button class="admin-btn admin-btn-view">View more details</button></a>       
    </div>
    `;
    document.body.appendChild(modal);
    const closeModal = modal.querySelector(".modal-close-action");
    
    closeModal.addEventListener("click", ()=>{modal.remove();
    }, { once: true });
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      })
)

//delete user

const deleteButtons = document.querySelectorAll('button[class="admin-btn admin-btn-delete"]');
deleteButtons.forEach(deleteButton=>
    deleteButton.addEventListener('click',
        function () {
            createModal(
          "Are you sure?",
          "Do you really want to delete this user? This action cannot be undone.",
          async() => {
            try {
            const userId = deleteButton.dataset.userdata;
            const endpoint = `users/${userId}`;
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
                  const card = document.querySelector(`.admin-user-card[data-id="${userId}"]`);
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
         
          }
        
    )
)

//update user role
const roleButtons = document.querySelectorAll('button[class="admin-btn admin-btn-update-role"]');
roleButtons.forEach(roleButton => {
    roleButton.addEventListener('click',(e)=>{
        e.preventDefault();
        try {
            const userRole = roleButton.dataset.userrole
            const modal = document.createElement('div');
            modal.className="modal-backdrop";
            modal.innerHTML=`
            <div class="modal-container">
        <div style="display: flex; justify-content: flex-end;">
             <button class="modal-close-action">×</button>  
        </div>
    
            <h3>Please Select a User Role</h3>
        <p>Select a user role from the list down below:</p>

              <select class="difficulty-bar">
                <option value="">Role</option>
                <option ${userRole === 'USER' ? 'selected' : ''} value="USER">user</option>
                <option ${userRole === 'ADMIN' ? 'selected' : ''} value="ADMIN">admin</option>
              </select>

      <div class="modal-actions">
        <button class="modal-confirm-action">Confirm</button>
        <button class="modal-cancel-action">Cancel</button>
      </div>
      </div>
            `;
        document.body.appendChild(modal);
        const closeModal = modal.querySelector(".modal-close-action");
        const cancelBtn = modal.querySelector(".modal-cancel-action");
        const confirmBtn = modal.querySelector(".modal-confirm-action");
        const roleSelect = modal.querySelector('.difficulty-bar');

        closeModal.addEventListener("click", ()=>{modal.remove();
        }, { once: true });
        cancelBtn.addEventListener("click",()=>{modal.remove();
        }, { once: true });

        confirmBtn.addEventListener('click',async()=>{
            try {
                modal.innerHTML = `
                <div class="modal-container">
                    <div style="display: flex; justify-content: center;">
                  <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                  </div></div>
                  `;
                const formData={role:roleSelect.value}             
                const response = await fetch(`users/${roleButton.dataset.userdata}`, {
                    method: 'PUT',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(formData)
                });
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
                            showNotification('Role updated successfully','var(--success-color)');
                            const userCard = document.querySelector(`.admin-user-card[data-id="${roleButton.dataset.userdata}"]`);
                            const role = userCard.querySelector('#roleParagraph');
                            role.textContent=`Role: ${roleSelect.value}`
                          }, 2000);
                        }else{
                          modal.remove();
                          const errorData = await response.json();
                          showNotification(errorData.error,'var(--error-color)');
                        }
            } catch (error) {
                showNotification(error,'var(--error-color)');                
            }
        })


        } catch (error) {
            showNotification(error,'var(--error-color)');
        }
    })
})