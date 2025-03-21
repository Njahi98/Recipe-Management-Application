async function getRecipeData() {
  try {
    const pathParts = window.location.pathname.split("/"); 
    const recipeId = pathParts[2];
    const response = await fetch(`/recipes/recipe/${recipeId}`);
    const data = await response.json();

      recipeData = {
      category: data.recipe.category,
      difficulty: data.recipe.difficulty,
      ingredients: JSON.stringify(data.recipe.ingredients),
      instructions:JSON.stringify(data.recipe.instructions),
    }
    updateForm();

  } catch (error) {
    showNotification(error,'var(--error-color)');
    console.log(error); 
  }
}

getRecipeData();

function updateForm(){
//choose default value for select tags from the fetched recipe
document.getElementById('category').value=recipeData.category;
document.getElementById('difficulty').value=recipeData.difficulty;

const ingredientsContainer = document.getElementById('ingredients-container');
const ingredients = recipeData.ingredients;

let ingredientsHTML=document.createElement('div');
let ingredientCount = -1;

JSON.parse(ingredients).forEach((ingredient) => {
  ingredientCount++;
const newRow = document.createElement('div');
newRow.className = 'ingredient-row';
newRow.innerHTML = `
  <input type="text" name="ingredients[${ingredientCount}][item]" placeholder="Item"   value="${ingredient.item}" required>
  <input type="text" name="ingredients[${ingredientCount}][amount]" placeholder="amount" value="${ingredient.amount}" required>
  <input type="text" name="ingredients[${ingredientCount}][unit]" placeholder="unit"   value="${ingredient.unit}" required>
  <button type="button" class="remove-ingredient">×</button>
`;
ingredientsContainer.appendChild(newRow);
});

const addIngredientBtn = document.getElementById('add-ingredient');
addIngredientBtn.addEventListener('click', () => {
ingredientCount++;
const newRow = document.createElement('div');
newRow.className = 'ingredient-row';
newRow.innerHTML = `
  <input type="text" name="ingredients[${ingredientCount}][item]" placeholder="Item" required>
  <input type="text" name="ingredients[${ingredientCount}][amount]" placeholder="Amount" required>
  <input type="text" name="ingredients[${ingredientCount}][unit]" placeholder="Unit" required>
  <button type="button" class="remove-ingredient">×</button>
`;
ingredientsContainer.appendChild(newRow);
});

let instructionCount = -1;
const instructionsContainer = document.getElementById('instructions-container');
const addInstructionBtn = document.getElementById('add-instruction');

const instructions = recipeData.instructions;
JSON.parse(instructions).forEach((instruction)=>{
  instructionCount++;

const newRow = document.createElement('div');
newRow.className = 'instruction-row';
newRow.innerHTML = `
  <span class="step-number">${instructionCount + 1}</span>
  <textarea name="instructions[${instructionCount}][text]" placeholder="Enter instruction step" required>${instruction.text}</textarea>
  <button type="button" class="remove-instruction">×</button>
`;
instructionsContainer.appendChild(newRow);

})

addInstructionBtn.addEventListener('click', () => {
instructionCount++;
const newRow = document.createElement('div');
newRow.className = 'instruction-row';
newRow.innerHTML = `
  <span class="step-number">${instructionCount + 1}</span>
  <textarea name="instructions[${instructionCount}][text]" placeholder="Enter instruction step" required></textarea>
  <button type="button" class="remove-instruction">×</button>
`;
instructionsContainer.appendChild(newRow);
});

document.addEventListener('click', (e) => {
if (e.target.classList.contains('remove-ingredient')) {
  e.target.parentElement.remove();
  updateIngredientIndices();
}
if (e.target.classList.contains('remove-instruction')) {
  e.target.parentElement.remove();
  updateInstructionIndices();
}
});

function updateIngredientIndices() {
const rows = ingredientsContainer.getElementsByClassName('ingredient-row');
Array.from(rows).forEach((row, index) => {
  row.querySelectorAll('input').forEach(input => {
    const fieldName = input.name.match(/\[(item|amount|unit)\]/)[1];
    input.name = `ingredients[${index}][${fieldName}]`;
  });
});
ingredientCount = rows.length - 1;
}

function updateInstructionIndices() {
const rows = instructionsContainer.getElementsByClassName('instruction-row');
Array.from(rows).forEach((row, index) => {
  row.querySelector('.step-number').textContent = index + 1;
  row.querySelector('textarea').name = `instructions[${index}][text]`;
});
instructionCount = rows.length - 1;
}

document.getElementById('editForm').addEventListener('submit', function(e) {
e.preventDefault();
const formData = new FormData(this);

// Create arrays to store ingredients and instructions
const ingredients = [];
const instructions = [];

// Group form data into proper objects
const formEntries = Array.from(formData.entries());
formEntries.forEach(([key, value]) => {
if (key.startsWith('ingredients[')) {
    const matches = key.match(/ingredients\[(\d+)\]\[(\w+)\]/);
    if (matches) {
        const [_, index, field] = matches;
        if (!ingredients[index]) {
            ingredients[index] = {};
        }
        ingredients[index][field] = value;
    }
} else if (key.startsWith('instructions[')) {
    const matches = key.match(/instructions\[(\d+)\]\[(\w+)\]/);
    if (matches) {
        const [_, index, field] = matches;
        if (!instructions[index]) {
            instructions[index] = {};
        }
        instructions[index][field] = value;
    }
}
});

// Filter out any empty slots in arrays
const cleanIngredients = ingredients.filter(Boolean);
const cleanInstructions = instructions.filter(Boolean);

// If there's a file, use FormData
if (formData.get('image').size > 0) {
// Create new FormData with cleaned arrays
const cleanFormData = new FormData();

// Add non-array fields
formEntries.forEach(([key, value]) => {
    if (!key.startsWith('ingredients[') && !key.startsWith('instructions[')) {
        cleanFormData.append(key, value);
    }
});

// Add cleaned arrays
cleanIngredients.forEach((ing, index) => {
    cleanFormData.append(`ingredients[${index}][item]`, ing.item);
    cleanFormData.append(`ingredients[${index}][amount]`, ing.amount);
    cleanFormData.append(`ingredients[${index}][unit]`, ing.unit);
});

cleanInstructions.forEach((inst, index) => {
    cleanFormData.append(`instructions[${index}][text]`, inst.text);
});

// Send request
fetch(`/recipes/${this.dataset.id}`, {
    method: 'PUT',
    body: cleanFormData
})
.then(response => response.json())
.then(handleResponse)
.catch(handleError);
} else {
// No new image, send as JSON
const jsonData = {
    title: formData.get('title'),
    description: formData.get('description'),
    cookingTime: formData.get('cookingTime'),
    category: formData.get('category'),
    difficulty: formData.get('difficulty'),
    ingredients: cleanIngredients,
    instructions: cleanInstructions
};

fetch(`/recipes/${this.dataset.id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonData)
})
.then(response => response.json())
.then(handleResponse)
.catch(handleError);
}
});

function handleResponse(data) {
if(data.success) {
window.location.href = '/recipes';
} else {
  showNotification(data.error,'var(--error-color)');
}
}

function handleError(error) {
showNotification(error,'var(--error-color)');
}
}

