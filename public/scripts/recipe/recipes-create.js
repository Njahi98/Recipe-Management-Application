let ingredientCount = 0;
const ingredientsContainer = document.getElementById('ingredients-container');
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

let instructionCount = 0;
const instructionsContainer = document.getElementById('instructions-container');
const addInstructionBtn = document.getElementById('add-instruction');

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
