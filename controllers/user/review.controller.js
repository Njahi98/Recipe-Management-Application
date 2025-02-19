const Recipe = require("../../models/recipe");

const recipe_add_review = async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const recipe = await Recipe.findById(req.params.id);
  
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      const userAlreadyReviewed = recipe.reviews.find(review=>review.userId.toString() === req.userId);
      if(userAlreadyReviewed){
        return res.status(403).json({ error: "you have already reviewed this recipe",redirect:`/recipes/${recipe._id}` });
      }
  
      //add review
      recipe.reviews.push({ userId: req.userId, rating, comment });
      await recipe.save();
  
      res.json({ message: "Review added successfully", recipe });
    } catch (error) {
      res.status(500).json({ error: "Error adding review" });
    }
  };
  
  const recipe_update_review = async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const recipe = await Recipe.findById(req.params.recipeId);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      /*
  I tried to do this using manual array operations
      const index = recipe.reviews.findIndex(review=>{return review._id.toString()===reviewId  });
      if (index !== -1) {
       // recipe.reviews.splice(index, 1,formData);
       //we are replacing the entire review object with formData, but it might not contain ._id and other necessary fields.
       // so instead we update specific fields instead of replacing the whole object.
       Object.assign(recipe.reviews[index], formData);
       //Object.assign() copies its own properties from a source (formData) and return the new object (review with modified values)
        await recipe.save();
        return res.status(200).json({ message: 'Review updated successfully' });
  
        Now i will do it with mongoose methods which is way simpler
  */
      const review = recipe.reviews.id(req.params.reviewId);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      review.rating = rating;
      review.comment = comment;
      await recipe.save();
      res.status(200).json({ message: "Review updated successfully", recipe });
    } catch (error) {
      return res.status(500).json({ error: "Error updating review" });
    }
  };
  
  const recipe_delete_review = async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.recipeId);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
  /*
  same thing we will simplify this logic by using mongoose methods instead of manual array methods
      const index = recipe.reviews.findIndex((review) => {
        return review._id.toString() === reviewId;
      });
      if (index !== -1) {
        recipe.reviews.splice(index, 1);
        await recipe.save();
        return res.status(200).json({ message: "Review deleted successfully" });
  */
    const review = recipe.reviews.id(req.params.reviewId);
      if(!review){
        return res.status(404).json({ error: "Review not found" });
      }
      recipe.reviews.pull({_id:req.params.reviewId})
      await recipe.save();
      return res.status(200).json({ message: "Review deleted successfully",recipe });
  
    } catch (error) {
      return res.status(500).json({ error: "Error deleting review" });
    }
  };

  module.exports={
    recipe_add_review,
    recipe_update_review,
    recipe_delete_review,
}