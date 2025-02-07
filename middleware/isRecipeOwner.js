const { json } = require("express");
const Recipe = require("../models/recipe")

const isRecipeOwner= async(req,res,next) => {
    try {
        const userId= req.userId;
        const recipe = await Recipe.findById(req.params.id);
        if (recipe.creator !== userId){
            return json.status(401).json({error:'you are not the recipe owner'})
        }
        next();

    } catch (error) {
        
    }

}


module.exports=isRecipeOwner;