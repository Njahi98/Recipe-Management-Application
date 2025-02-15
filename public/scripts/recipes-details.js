import { createModal } from "./modal.js";
import { createReviewModal } from "./reviewModal.js";
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

// delete review
const deleteRecipeBtn=document.querySelector('.deleteRecipeBtn');

deleteRecipeBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  createModal('Are you sure?',
      "Do you really want to delete this review? This action cannot be undone.",
      async() => {
        try {
          const response = await fetch(`/recipes/${deleteRecipeBtn.dataset.recipedoc}/reviews/${deleteRecipeBtn.dataset.reviewdoc}`,{
            method:'DELETE',
          });
          const modal = document.querySelector('.modal-backdrop');
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
            const result = await response.json();
            setTimeout(() => {
              modal.remove();
              showNotification(result.message,'var(--success-color)')
            }, 1500);
            setTimeout(() => {
              window.location.href=`/recipes/${deleteRecipeBtn.dataset.recipedoc}`
            }, 3000);
          }else{
            modal.remove();
            const errorData = await response.json();
            showNotification(errorData.error,'var(--error-color)');
          }  
        } catch (error) {
          const modal = document.querySelector('.modal-backdrop'); 
          modal.remove();
          showNotification(error,'var(--error-color)')
        }
      }
)})


//edit review
const reviewRecipeBtns = document.querySelectorAll('.reviewRecipeBtn');

reviewRecipeBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // we ²²²² the existing review data from the button's data attributes
    const existingReview = {
      rating: parseInt(btn.dataset.ratingdoc),
      comment: btn.dataset.commentdoc
    };
    
    //we create modal with existing review data
    createReviewModal(async (reviewData) => {
      try {
        const response = await fetch(
          `/recipes/${btn.dataset.recipedoc}/reviews/${btn.dataset.reviewdoc}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update review');
        }
        const modal = document.querySelector('.modal-backdrop'); 
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
          showNotification('Review added successfully. redirecting to Recipe page','var(--success-color)');
        }, 1500);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        showNotification(error.message, 'var(--error-color)');
      }
      // we pass the existing review data to the modal
    }, existingReview);
  });
});



