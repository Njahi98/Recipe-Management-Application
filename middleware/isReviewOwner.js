const Recipe = require("../models/recipe");

const isReviewOwner = async(req,res,next)=>{
    try {
        const userId = req.userId;
        const recipeId=req.params.recipeId;
        const reviewId=req.params.reviewId;
        const recipe = await Recipe.findById(recipeId)
        if(!recipe){
            return res.status(404).json({error:'Recipe not found'});
        }
        const review = recipe.reviews.id(reviewId);
        if(!review){
            return res.status(404).json({error:'Review not found'});
        }
        if(review.userId.toString() !== userId){
            return res.status(403).json({error:'unauthorized to update/delete review'});
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while checking review ownership' });
    }

}


module.exports=isReviewOwner;