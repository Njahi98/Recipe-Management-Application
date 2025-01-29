const Recipe = require("../models/recipe");
const { getGfs } = require("../middleware/uploadMiddleware");
const mongoose = require("mongoose");


const recipe_index = (req, res) => {
  Recipe.find()
    .then((result) => {
      res.render("recipes/index", { title: "recipes", recipes: result });
    })
    .catch((error) => {
      console.log(error);
    });
};

const recipe_create_get = (req, res) => {
  res.render("recipes/create", { title: "create a new recipe" });
};

const recipe_edit_get = ((req,res)=>{
  const id = req.params.id;
  Recipe.findById(id)
    .then((result) => {
      res.render("recipes/edit", {
        recipe: result,
        title: "recipe details",
      });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "recipe not found" });
    });
})

const recipe_create_post = (req, res) => {
  const recipeData = {
    ...req.body,
    imageId: req.file.id, // GridFS file ID
    imageName: req.file.filename, // Uploaded file name
  };
  const recipe = new Recipe(recipeData);
  recipe
    .save()
    .then((result) => {
      res.redirect("/recipes");
    })
    .catch((error) => {
      console.log(error);
    });
};

const recipe_details = async (req, res) => {
  const id = req.params.id;
  Recipe.findById(id)
    .then((result) => {
      res.render("recipes/details", {
        recipe: result,
        title: "recipe details",
      });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "recipe not found" });
    });
};

const recipe_delete = async (req, res) => {
    const id = req.params.id;
    try {
        // First get the recipe to access the imageId
        const recipe = await Recipe.findById(id);
        
        // If recipe has an image, delete it from GridFS
        if (recipe && recipe.imageId) {
            const gfs = await getGfs();
            try {
                await gfs.delete(new mongoose.Types.ObjectId(recipe.imageId));
            } catch (err) {
                console.log('Error deleting image:', err);
            }
        }

        // Then delete the recipe
        await Recipe.findByIdAndDelete(id);
        res.json({ redirect: '/recipes' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error deleting recipe' });
    }
};

const recipe_update = async (req, res) => {
  const id = req.params.id;
  const formData = req.body;

  try {
    // Handle arrays
    if (formData.ingredients) {
      formData.ingredients = Object.values(formData.ingredients);
    }
    if (formData.instructions) {
      formData.instructions = Object.values(formData.instructions);
    }

    // If new image was uploaded
    if (req.file) {
      // Delete old image if exists
      const oldRecipe = await Recipe.findById(id);
      if (oldRecipe.imageId) {
        const gfs = await getGfs();
        try {
          await gfs.delete(new mongoose.Types.ObjectId(oldRecipe.imageId));
        } catch (err) {
          console.log('Error deleting old image:', err);
        }
      }

      // Add new image details to formData
      formData.imageId = req.file.id;
      formData.imageName = req.file.filename;
    }

    const result = await Recipe.findByIdAndUpdate(id, formData, { new: true });
    if (!result) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ success: true, recipe: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error updating recipe' });
  }
};

const recipe_image_get = async (req, res) => {
  try {
    const gfs = await getGfs(); // Ensure gfs is initialized
    const fileId = req.params.id;

    const file = await gfs.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const readStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    readStream.pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const recipe_add_review = async(req,res)=>{
  try {
    const {rating,comment}=req.body;
    const recipe = await Recipe.findById(req.params.id);

    if(!recipe){
      return res.status(404).json({error:'Recipe not found'});
    }

    //add review
    recipe.reviews.push({userId:req.userId,rating,comment});
    await recipe.save();

    res.json({message:'Review added successfully',recipe});
  } catch (error) {
    res.status(500).json({error:'Error adding review'});
  }
}




module.exports = {
  recipe_index,
  recipe_create_get,
  recipe_create_post,
  recipe_edit_get,
  recipe_details,
  recipe_delete,
  recipe_update,
  recipe_image_get,
  recipe_add_review,
};
