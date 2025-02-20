const Recipe = require("../../models/recipe")
const { getGfs } = require("../../middleware/uploadMiddleware");
const mongoose = require("mongoose");
const admin_recipe_index = async(req,res)=>{
    try {
        const recipes = await Recipe.find().populate('creator','username');
        if(recipes.length === 0){
            return res.status(404).json({error:'no recipes available'})
        }
        return res.status(200).json({message:'recipes fetched successfully',recipes})
    } catch (error) {
        return res.status(500).json({error:'error Fetching recipes'})
    }
}

const admin_recipe_details = async(req,res)=>{
    try {
        const recipeId = req.params.recipeId;
        const recipe = await Recipe.findById(recipeId)
        .populate({
          path: "reviews.userId",
          select: "username imageId imageName" 
        });                                                                                     
    
        if(!recipe){
            return res.status(404).json({error:'Recipe not found'});
        }
        return res.status(200).json({message:'Recipe fetched successfully',recipe})
    
    } catch (error) {
        return res.status(500).json({error:'Error fetching Recipe details'});

    }




}


const admin_recipe_delete = async(req,res)=>{
    try {
        const recipeId = req.params.recipeId;
        const recipe = await Recipe.findById(recipeId);

        if(!recipe){
            return res.status(404).json({error:'Recipe not found'});
        }

        if (recipe && recipe.imageId) {
            const gfs = await getGfs();
            try {
              await gfs.delete(new mongoose.Types.ObjectId(recipe.imageId));
            } catch (err) {
              console.log("Error deleting image:", err);
            }
          }

            await Recipe.findByIdAndDelete(recipeId);
            res.json({ redirect: "/admin/recipes" });

    } catch (error) {
        return res.status(500).json({error:'Error deleting Recipe'});

    }


}


const recipe_image_get = async (req, res) => {
  try {
    const gfs = await getGfs(); // Ensure gfs is initialized
    const fileId = req.params.id;

    const file = await gfs
      .find({ _id: new mongoose.Types.ObjectId(fileId) })
      .toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const readStream = gfs.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );
    readStream.pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};






module.exports={
admin_recipe_index,
admin_recipe_details,
admin_recipe_delete,
recipe_image_get,
}