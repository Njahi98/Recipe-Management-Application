import { createModal } from "./modal.js";
import { createReviewModal } from "./reviewModal.js";
const trashcan = document.querySelector(".delete-btn");

if(trashcan){
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
}


// delete review
const deleteRecipeBtn=document.querySelector('.deleteRecipeBtn');
if(deleteRecipeBtn){
try {
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
                showNotification(result.message,'var(--success-color)');
                const reviewCard = document.querySelector(`.review-card[data-id="${deleteRecipeBtn.dataset.reviewdoc}"]`);
                reviewCard.remove();
              }, 1500);
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
} catch (error) {
  const modal = document.querySelector('.modal-backdrop'); 
  modal.remove();
  showNotification(error,'var(--error-color)');  
}
}

//add a review
const reviews = document.querySelectorAll('.newReviewRecipeBtn');

reviews.forEach(review=>{
  review.addEventListener('click',(e)=>{
    e.preventDefault();
    createReviewModal(async(reviewData) => {
            try {
              const formData={
                rating:reviewData.rating,
                comment:reviewData.comment}
              const response = await fetch(`/recipes/${review.dataset.doc}/reviews`,{
                method:'POST',
                headers:{'content-type':'application/json'},
                body: JSON.stringify(formData),
              },
            );
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
              setTimeout(() => {
                modal.remove();
                showNotification('Review added successfully. redirecting to Recipe page','var(--success-color)');
              }, 1500);
              setTimeout(() => {
                window.location.href = `/recipes/${review.dataset.doc}`
              }, 3000);
            }else{
              modal.remove();
              const errorData = await response.json();
              showNotification(errorData.error,'var(--error-color)');
              if(errorData.redirect){
                setTimeout(() => {
                  window.location.href=errorData.redirect
                }, 1500);
              }
            }
            } catch (error) {
              const modal = document.querySelector('.modal-backdrop'); 
              modal.remove();
              showNotification(error,'var(--error-color)');
            }
          
  });
  })
})

//edit review
const reviewRecipeBtns = document.querySelectorAll('.reviewRecipeBtn');

reviewRecipeBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // we pull the existing review data from the button's data attributes
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
          showNotification('Review updated successfully.','var(--success-color)');
          const reviewCard = document.querySelector(`.review-card[data-id="${btn.dataset.reviewdoc}"]`);
          const stars = reviewCard.querySelector('.stars');
          const comment = reviewCard.querySelector('.review-comment');
          stars.textContent= "⭐".repeat(reviewData.rating);
          comment.textContent=reviewData.comment;
        }, 1500);
      } catch (error) {
        showNotification(error.message, 'var(--error-color)');
      }
      // we pass the existing review data to the modal
    }, existingReview);
  });
});

      //if user tries to enter the edit page of a recipe he doesn't own we'll redirect him to the recipe with an error
      document.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error === 'unauthorized') {
            showNotification("You don't have permission to edit this recipe.", 'var(--error-color)');
        }
      });