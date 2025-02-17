const Recipe = require("../models/recipe")

const isRecipeOwner= async(req,res,next) => {
    try {
        const userId= req.userId;
        const recipe = await Recipe.findById(req.params.id);
        if(!recipe){
            return res.status(404).json({error:'Recipe not found'});
        }
        //we make sure that the userId stored in creator is the same as the userId in the incoming request
        // we make sure that the user isn't a guest (recipe.isGuest shouldn't be true)
        if (recipe.isGuest){
            return res.status(401).json({error:'This recipe is made by a guest user.'})
        }
        if (recipe.creator.toString() !== userId && !recipe.isGuest){
            return res.status(401).json({error:'you are not the recipe owner'})
        }
        //the user requesting changes to Recipe is the creator so we can proceed to next operation
        next();

    } catch (error) {
        return res.status(500).json({error:'Error checking recipe ownership'});
    }

}


module.exports=isRecipeOwner;