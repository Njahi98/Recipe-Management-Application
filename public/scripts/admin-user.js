import { createModal } from "./modal.js";

//view user details
const viewButtons = document.querySelectorAll(
  'button[class="admin-btn admin-btn-view"]'
);
viewButtons.forEach((viewButton) =>
  viewButton.addEventListener("click", async function () {
    try {
      const userId = viewButton.dataset.userdata;
      const response = await fetch(`/admin/users/${userId}`);
      const data = await response.json();

      if (data.user) {
        const user = data.user;
        const modal = document.createElement("div");
        modal.classList.add("modal-backdrop");
        modal.innerHTML = `
            <div class="admin-modal-container" style="width:900px">
    <div style="display: flex; justify-content: flex-end;">
         <button class="modal-close-action">×</button>  
    </div>
      <div class="user-header" style="margin-bottom:0;">
      <h2 >${user.username}</h2>
                  <div class="user-meta" style="margin-bottom:0;">
                      <span>⚙️   ${user.role} </span>
                      <span>🌎  ${user.location} </span>
                      <span>🌐  ${user.website} </span>
                      <span>✉️  ${user.email} </span>
                  </div>
        </div>
        <div style="display:flex; gap:1rem">
              <img 
                src="users/image/${user.imageId}" 
                alt="${user.title}" 
                style="max-width: 100%; max-height:180px; margin: 1rem 0;"
                onerror="this.src='/images/default-profile.png'"
              >
             <div class="user-section" style="margin-bottom:0;">
                  <h3>Bio</h3>
                  <p>${user.bio ? user.bio : "(User did not add a bio Yet)"}</p>
              </div>
        </div>
                <div class="user-section">
                  <h3>Social media links:</h3>
                      <div class="user-meta">
                      <span><svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15V13.9999H17.0762C17.5066 13.9999 17.8887 13.7245 18.0249 13.3161L18.4679 11.9871C18.6298 11.5014 18.2683 10.9999 17.7564 10.9999H15V8.99992C15 8.49992 15.5 7.99992 16 7.99992H18C18.5523 7.99992 19 7.5522 19 6.99992V6.31393C19 5.99091 18.7937 5.7013 18.4813 5.61887C17.1705 5.27295 16 5.27295 16 5.27295C13.5 5.27295 12 6.99992 12 8.49992V10.9999H10C9.44772 10.9999 9 11.4476 9 11.9999V12.9999C9 13.5522 9.44771 13.9999 10 13.9999H12V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z" fill="var(--emoji-color)"/>
</svg>   ${user.socialMedia.facebook ? user.socialMedia.facebook : "not added yet"} </span>
                      <span><svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="var(--emoji-color)"/>
<path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="var(--emoji-color)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="var(--emoji-color)"/>
</svg>  ${user.socialMedia.instagram ? user.socialMedia.instagram : "not added yet"} </span>
                      <span><svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.7828 3.91825C20.1313 3.83565 20.3743 3.75444 20.5734 3.66915C20.8524 3.54961 21.0837 3.40641 21.4492 3.16524C21.7563 2.96255 22.1499 2.9449 22.4739 3.11928C22.7979 3.29366 23 3.6319 23 3.99986C23 5.08079 22.8653 5.96673 22.5535 6.7464C22.2911 7.40221 21.9225 7.93487 21.4816 8.41968C21.2954 11.7828 20.3219 14.4239 18.8336 16.4248C17.291 18.4987 15.2386 19.8268 13.0751 20.5706C10.9179 21.3121 8.63863 21.4778 6.5967 21.2267C4.56816 20.9773 2.69304 20.3057 1.38605 19.2892C1.02813 19.0108 0.902313 18.5264 1.07951 18.109C1.25671 17.6916 1.69256 17.4457 2.14144 17.5099C3.42741 17.6936 4.6653 17.4012 5.6832 16.9832C5.48282 16.8742 5.29389 16.7562 5.11828 16.6346C4.19075 15.9925 3.4424 15.1208 3.10557 14.4471C2.96618 14.1684 2.96474 13.8405 3.10168 13.5606C3.17232 13.4161 3.27562 13.293 3.40104 13.1991C2.04677 12.0814 1.49999 10.5355 1.49999 9.49986C1.49999 9.19192 1.64187 8.90115 1.88459 8.71165C1.98665 8.63197 2.10175 8.57392 2.22308 8.53896C2.12174 8.24222 2.0431 7.94241 1.98316 7.65216C1.71739 6.3653 1.74098 4.91284 2.02985 3.75733C2.1287 3.36191 2.45764 3.06606 2.86129 3.00952C3.26493 2.95299 3.6625 3.14709 3.86618 3.50014C4.94369 5.36782 6.93116 6.50943 8.78086 7.18568C9.6505 7.50362 10.4559 7.70622 11.0596 7.83078C11.1899 6.61019 11.5307 5.6036 12.0538 4.80411C12.7439 3.74932 13.7064 3.12525 14.74 2.84698C16.5227 2.36708 18.5008 2.91382 19.7828 3.91825ZM10.7484 9.80845C10.0633 9.67087 9.12171 9.43976 8.09412 9.06408C6.7369 8.56789 5.16088 7.79418 3.84072 6.59571C3.86435 6.81625 3.89789 7.03492 3.94183 7.24766C4.16308 8.31899 4.5742 8.91899 4.94721 9.10549C5.40342 9.3336 5.61484 9.8685 5.43787 10.3469C5.19827 10.9946 4.56809 11.0477 3.99551 10.9046C4.45603 11.595 5.28377 12.2834 6.66439 12.5135C7.14057 12.5929 7.49208 13.0011 7.49986 13.4838C7.50765 13.9665 7.16949 14.3858 6.69611 14.4805L5.82565 14.6546C5.95881 14.7703 6.103 14.8838 6.2567 14.9902C6.95362 15.4727 7.65336 15.6808 8.25746 15.5298C8.70991 15.4167 9.18047 15.6313 9.39163 16.0472C9.60278 16.463 9.49846 16.9696 9.14018 17.2681C8.49626 17.8041 7.74425 18.2342 6.99057 18.5911C6.63675 18.7587 6.24134 18.9241 5.8119 19.0697C6.14218 19.1402 6.48586 19.198 6.84078 19.2417C8.61136 19.4594 10.5821 19.3126 12.4249 18.6792C14.2614 18.0479 15.9589 16.9385 17.2289 15.2312C18.497 13.5262 19.382 11.1667 19.5007 7.96291C19.51 7.71067 19.6144 7.47129 19.7929 7.29281C20.2425 6.84316 20.6141 6.32777 20.7969 5.7143C20.477 5.81403 20.1168 5.90035 19.6878 5.98237C19.3623 6.04459 19.0272 5.94156 18.7929 5.70727C18.0284 4.94274 16.5164 4.43998 15.2599 4.77822C14.6686 4.93741 14.1311 5.28203 13.7274 5.89906C13.3153 6.52904 13 7.51045 13 8.9999C13 9.28288 12.8801 9.5526 12.6701 9.74221C12.1721 10.1917 11.334 9.92603 10.7484 9.80845Z" fill="var(--emoji-color)"/>
</svg>  ${user.socialMedia.twitter ? user.socialMedia.twitter : "not added yet"} </span>
                  </div>
                  
              </div>
        <a href="/profile/${user._id}"><button class="admin-btn admin-btn-view">View more details</button></a>       
    </div>
    `;
        document.body.appendChild(modal);
        const closeModal = modal.querySelector(".modal-close-action");

        closeModal.addEventListener(
          "click",
          () => {
            modal.remove();
          },
          { once: true }
        );
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  })
);

//delete user

const deleteButtons = document.querySelectorAll(
  'button[class="admin-btn admin-btn-delete"]'
);
deleteButtons.forEach((deleteButton) =>
  deleteButton.addEventListener("click", function () {
    createModal(
      "Are you sure?",
      "Do you really want to delete this user? This action cannot be undone.",
      async () => {
        try {
          const userId = deleteButton.dataset.userdata;
          const endpoint = `users/${userId}`;
          const response = await fetch(endpoint, {
            method: "DELETE",
          });
          const modal = document.querySelector(".modal-backdrop");
          if (response.ok) {
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
              const card = document.querySelector(
                `.admin-user-card[data-id="${userId}"]`
              );
              card.remove();
            }, 2000);
          } else {
            modal.remove();
            const errorData = await response.json();
            showNotification(errorData.error, "var(--error-color)");
          }
        } catch (error) {
          showNotification(error, "var(--error-color)");
        }
      }
    );
  })
);

//update user role
const roleButtons = document.querySelectorAll(
  'button[class="admin-btn admin-btn-update-role"]'
);
roleButtons.forEach((roleButton) => {
  roleButton.addEventListener("click", (e) => {
    e.preventDefault();
    try {
      const userRole = roleButton.dataset.userrole;
      const modal = document.createElement("div");
      modal.className = "modal-backdrop";
      modal.innerHTML = `
            <div class="modal-container">
        <div style="display: flex; justify-content: flex-end;">
             <button class="modal-close-action">×</button>  
        </div>
    
            <h3>Please Select a User Role</h3>
        <p>Select a user role from the list down below:</p>

              <select class="difficulty-bar">
                <option value="">Role</option>
                <option ${
                  userRole === "USER" ? "selected" : ""
                } value="USER">user</option>
                <option ${
                  userRole === "ADMIN" ? "selected" : ""
                } value="ADMIN">admin</option>
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
      const roleSelect = modal.querySelector(".difficulty-bar");

      closeModal.addEventListener(
        "click",
        () => {
          modal.remove();
        },
        { once: true }
      );
      cancelBtn.addEventListener(
        "click",
        () => {
          modal.remove();
        },
        { once: true }
      );

      confirmBtn.addEventListener("click", async () => {
        try {
          modal.innerHTML = `
                <div class="modal-container">
                    <div style="display: flex; justify-content: center;">
                  <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                  </div></div>
                  `;
          if(roleSelect.value === ""){
            modal.remove();
            throw new Error('You did not choose a Role, please pick up a proper role.')
          }
          const formData = { role: roleSelect.value };
          const response = await fetch(`users/${roleButton.dataset.userdata}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (response.ok) {
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
              showNotification(
                "Role updated successfully",
                "var(--success-color)"
              );
              const userCard = document.querySelector(
                `.admin-user-card[data-id="${roleButton.dataset.userdata}"]`
              );
              const role = userCard.querySelector("#roleParagraph");
              role.textContent = `Role: ${roleSelect.value}`;
            }, 2000);
          } else {
            modal.remove();
            const errorData = await response.json();
            showNotification(errorData.error, "var(--error-color)");
          }
        } catch (error) {
          showNotification(error, "var(--error-color)");
        }
      });
    } catch (error) {
      showNotification(error, "var(--error-color)");
    }
  });
});
