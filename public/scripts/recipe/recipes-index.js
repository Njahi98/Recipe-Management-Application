import { createModal } from "../utils/modal.js";
import { createReviewModal } from "../utils/reviewModal.js";

/* delete buttons' function
  since we have multiple recipe cards,
  we need to select all delete buttons using querySelectorAll and attach the event listener to each one. */
const trashcans = document.querySelectorAll(".deleteRecipeBtn");

trashcans.forEach((trashcan) => {
  trashcan.addEventListener("click", (e) => {
    e.preventDefault();
    createModal(
      "Are you sure?",
      "Do you really want to delete this recipe? This action cannot be undone.",
      async() => {
        try {
        const recipeId = trashcan.dataset.doc;
        const endpoint = `/recipes/${recipeId}`;
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
              const recipeCard = document.querySelector(`.recipe-card[data-id="${recipeId}"]`);
              recipeCard.classList.remove('visible');
              recipeCard.classList.add('hidden');
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
});

//review Button and review Logic
const reviews = document.querySelectorAll('.reviewRecipeBtn');

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

//added a simple debounce function for the filters
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

//merged all filters in the same function
let filters = {
  title: "",
  category: "",
  difficulty: "",
  cookingTime: null,
};

function applyFilters() {
  recipeNames.forEach((recipeName) => {
    const parentCard = recipeName.parentElement;
    const matchesTitle =
      !filters.title ||  new RegExp(filters.title, "i").test(recipeName.textContent.trim());
    const matchesCategory =
      !filters.category || parentCard.querySelector(".recipe-category").textContent.trim().slice(3) === filters.category;
    const matchesDifficulty =
      !filters.difficulty || parentCard.querySelector(".recipe-difficulty").textContent.trim().slice(3) === filters.difficulty;
    const matchesTime =
      !filters.cookingTime || parseInt(parentCard.querySelector(".cooking-times").textContent.replace(/[^0-9]/g, "")) <= filters.cookingTime;

    if (matchesTitle && matchesCategory && matchesDifficulty && matchesTime) {
      parentCard.classList.remove("hidden");
      setTimeout(() => {
        parentCard.style.display = "";
      }, 500);
    } else {
      parentCard.classList.add("hidden");
      parentCard.classList.remove("visible");
      setTimeout(() => {
        parentCard.style.display = "none";
      }, 500);
    }
  });
}
//filter by title function
const searchBar = document.querySelector(".search-bar");
const recipeNames = document.querySelectorAll(
  ".recipe-container .recipe-title"
);
const debouncedApplyFilters = debounce(applyFilters, 200);

function filterByTitle() {
  filters.title = this.value.trim();
  debouncedApplyFilters();
}

searchBar.addEventListener("keyup", filterByTitle);
searchBar.addEventListener("change", filterByTitle);

//filter by category
const categorySelect = document.querySelector(".category-bar");

function filterByCategory() {
  filters.category = this.value.trim();
  applyFilters();
}
categorySelect.addEventListener("change", filterByCategory);

//filter by difficulty
const difficultySelect = document.querySelector(".difficulty-bar");

function filterByDifficulty() {
  filters.difficulty = this.value.trim();
  applyFilters();
}
difficultySelect.addEventListener("change", filterByDifficulty);

//filter by cooking time
const cookingTimeRange = document.querySelector(".cooking-time-range");
const timetext = document.querySelector(".cooking-times-range-text");

function ShowRangeValue() {
  let num = this.value;
  timetext.textContent = `Cooking Time(mins) ${num}`;
}
function filterbyTime() {
  filters.cookingTime = this.value.trim();
  applyFilters();
}

const debouncedShowRangeValue = debounce(ShowRangeValue, 100);
const debouncedFilterByTime = debounce(filterbyTime, 200);

cookingTimeRange.addEventListener("mousemove", debouncedShowRangeValue);
cookingTimeRange.addEventListener("change", debouncedShowRangeValue);
cookingTimeRange.addEventListener("change", debouncedFilterByTime);
