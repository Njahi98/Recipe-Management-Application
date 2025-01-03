const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: [{
        item: String,
        amount: String,
        unit: String
    }],
    instructions: [{
        step: Number,
        text: String
    }],
    cookingTime: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    category: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'],
        required: true
    }
}, { timestamps: true });

const Recipe = mongoose.model('Recipe',recipeSchema);

module.exports=Recipe;