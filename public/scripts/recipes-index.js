import { createModal } from "./modal.js";

/* delete buttons' function
  since we have multiple recipe cards,
  we need to select all delete buttons using querySelectorAll and attach the event listener to each one. */

const trashcans = document.querySelectorAll(".deleteRecipeBtn");
trashcans.forEach((trashcan) => {
  trashcan.addEventListener("click", () => {
    createModal(
      "Are you sure?",
      "Do you really want to delete this recipe? This action cannot be undone.",
      () => {
        const endpoint = `/recipes/${trashcan.dataset.doc}`;
        fetch(endpoint, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => (window.location.href = data.redirect))
          .catch((err) => console.log(err));
      }
    );
  });
});

//added a simple debounce function
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
      !filters.title ||
      new RegExp(filters.title, "i").test(recipeName.textContent.trim());
    const matchesCategory =
      !filters.category ||
      parentCard.querySelector(".recipe-category").textContent.trim() ===
        filters.category;
    const matchesDifficulty =
      !filters.difficulty ||
      parentCard.querySelector(".recipe-difficulty").textContent.trim() ===
        filters.difficulty;
    const matchesTime =
      !filters.cookingTime ||
      parseInt(
        parentCard
          .querySelector(".cooking-times")
          .textContent.replace(/[^0-9]/g, "")
      ) <= filters.cookingTime;

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
