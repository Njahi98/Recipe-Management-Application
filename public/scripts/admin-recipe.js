import { createModal } from "./modal.js";

const viewButtons = document.querySelectorAll('button[class="admin-btn admin-btn-view"]');
viewButtons.forEach(viewButton => 
    viewButton.addEventListener('click',async function() {
        try {
        const recipeId = viewButton.dataset.recipedata;
          const response = await fetch(`/admin/recipes/${recipeId}`);
          const data = await response.json();
          
          if (data.recipe) {
            
            const recipe = data.recipe;
            const modal = document.createElement("div");
            modal.classList.add("modal-backdrop");
            modal.innerHTML = `
            <div class="admin-modal-container">
    <div style="display: flex; justify-content: flex-end;">
         <button class="modal-close-action">×</button>  
    </div>
      <div class="recipe-header" style="margin-bottom:0;">
      <h2 >${recipe.title}</h2>
                        <div class="recipe-meta" style="margin-bottom:0;">
                      <span>🕒  ${recipe.cookingTime} minutes</span>
                      <span>🎯  ${recipe.difficulty} </span>
                      <span>📑  ${recipe.category} </span>
                  </div></div>
             <img 
                src="/recipes/image/${recipe.imageId}" 
                alt="${recipe.title}" 
                style="max-width: 100%; max-height:180px; margin: 1rem 0;"
                onerror="this.src='/images/default-recipe.png'"
              >
             <div class="recipe-section" style="margin-bottom:0;">
                  <h3>Description</h3>
                  <p>${recipe.description}</p>
              </div>
              <div class="recipe-section" style="margin-bottom:0;">
                  <h3>Created by:</h3>
                  <p>${recipe.creator ? recipe.creator.username : 'Guest'}</p>
              </div>
        <a href="/recipes/${recipe._id}"><button class="admin-btn admin-btn-view">View more details</button></a>       
    </div>
    `;
    document.body.appendChild(modal);
    const closeModal = modal.querySelector(".modal-close-action");
    
    closeModal.addEventListener("click", ()=>{modal.remove();
    }, { once: true });
          }
        } catch (error) {
          console.error('Error fetching recipe details:', error);
        }
      })
)

const deleteButtons = document.querySelectorAll('button[class="admin-btn admin-btn-delete"]');
deleteButtons.forEach(deleteButton=>
    deleteButton.addEventListener('click',
        function () {
            createModal(
          "Are you sure?",
          "Do you really want to delete this recipe? This action cannot be undone.",
          async() => {
            try {
            const recipeId = deleteButton.dataset.recipedata;
            const endpoint = `recipes/${recipeId}`;
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
                  const card = document.querySelector(`.admin-recipe-card[data-id="${recipeId}"]`);
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

