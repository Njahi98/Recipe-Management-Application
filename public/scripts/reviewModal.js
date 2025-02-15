// Star rating implementation with modal
export function createReviewModal(confirmCallback, existingReview = null) {
  const modal = document.createElement("div");
  modal.classList.add("modal-backdrop");
  
  modal.innerHTML = `
    <div class="review-modal-container">
      <div style="display: flex; justify-content: flex-end;">
        <button class="modal-close-action">×</button>
      </div>
      <h3>${existingReview ? 'Edit Review' : 'New Review'}</h3>
      <p>Please fill in the review below.</p>
      <div class="review-modal-group">
        <p>Rating:</p>
        <div class="star-rating">
          <span class="star" data-rating="1">★</span>
          <span class="star" data-rating="2">★</span>
          <span class="star" data-rating="3">★</span>
          <span class="star" data-rating="4">★</span>
          <span class="star" data-rating="5">★</span>
        </div>
        <p class="rating-text">0 out of 5</p>
      </div>
      <div class="review-modal-group">
        <p style="margin-top:0.75rem;">Comment:</p>
        <textarea name="comment" id="comment" rows="4" placeholder="Your Comment"></textarea>
      </div>
      <div class="modal-actions">
        <button class="modal-confirm-action">${existingReview ? 'Update' : 'Confirm'}</button>
        <button class="modal-cancel-action">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = modal.querySelector(".modal-close-action");
  const confirmBtn = modal.querySelector(".modal-confirm-action");
  const cancelBtn = modal.querySelector(".modal-cancel-action");
  const stars = modal.querySelectorAll(".star");
  const ratingText = modal.querySelector(".rating-text");
  const commentInput = modal.querySelector("#comment");

  // Initialize rating
  let currentRating = existingReview ? parseInt(existingReview.rating) : 0;
  
  // If editing, pre-fill the form with existing data
  if (existingReview) {
    highlightStars(currentRating);
    updateRatingText(currentRating);
    commentInput.value = existingReview.comment || '';
  }

  stars.forEach(star => {
    // Hover effect
    star.addEventListener("mouseover", () => {
      const rating = parseInt(star.dataset.rating);
      highlightStars(rating);
    });

    star.addEventListener("click", () => {
      currentRating = parseInt(star.dataset.rating);
      highlightStars(currentRating);
      updateRatingText(currentRating);
    });
  });

  // Remove highlight when mouse leaves star rating container
  const starContainer = modal.querySelector(".star-rating");
  starContainer.addEventListener("mouseleave", () => {
    highlightStars(currentRating);
  });

  // Function to highlight stars
  function highlightStars(rating) {
    stars.forEach(star => {
      const starRating = parseInt(star.dataset.rating);
      star.classList.toggle("active", starRating <= rating);
    });
  }

  // Function to update rating text
  function updateRatingText(rating) {
    ratingText.textContent = `${rating} out of 5`;
  }

  // Modified confirm button handler
  confirmBtn.addEventListener("click", () => {
    if (currentRating === 0) {
      const notification = document.querySelector('.notification');
      notification.style.zIndex=1500;
      showNotification("Please select a rating before submitting.",'var(--error-color)'); 
      return;
    }
    if(currentRating < 3 && !commentInput.value.trim()){
      const notification = document.querySelector('.notification');
      notification.style.zIndex=1500;
      showNotification("You chose less than three stars, please provide a comment.",'var(--error-color)'); 
      return;
    }

    const reviewData = {
      rating: currentRating,
      comment: commentInput.value.trim()
    };

    modal.innerHTML = `
      <div class="modal-container">
        <div style="display: flex; justify-content: center;">
          <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    `;
    
    // Pass the review data to the callback
    confirmCallback(reviewData);
  });

  const closesModal = () => {
    modal.remove();
  };

  cancelBtn.addEventListener("click", closesModal, { once: true });
  closeModal.addEventListener("click", closesModal, { once: true });
}