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
    imageId: {
        type: String
    },
    imageName: {
        type: String
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
    },
    reviews: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          rating: { type: Number, required: true, min: 1, max: 5 },
          comment: { type: String },
        }],
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        // we track if the creator is a guest
        isGuest: { type: Boolean, default: false }, 
        }, { timestamps: true });

//Virtual for average rating
recipeSchema.virtual('averageRating').get(function(){
    if(this.reviews.length === 0 )return 0; //no reviews yet
    const total = this.reviews.reduce((sum,review)=>sum+review.rating,0);
    return total/this.reviews.length;
});

/* we created a schema for the recipes then created a model based on the schema
 the 'recipe' name must be singular as mongoose will automatically pluralize it and 
look for the collection recipes inside */

const Recipe = mongoose.model('Recipe',recipeSchema);

module.exports=Recipe;