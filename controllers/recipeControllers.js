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

const recipe_delete = (req, res) => {
    const id=req.params.id;
    Recipe.findByIdAndDelete(id)
    .then(result=>{
        res.json({redirect:'/recipes'})
    }).catch(err=>console.log(err))
};

const recipe_update = (req,res) => {
  const id = req.params.id;
  const formData = req.body;

  // Ensure ingredients and instructions are arrays
  if (formData.ingredients) {
    formData.ingredients = Object.values(formData.ingredients);
  }
  if (formData.instructions) {
    formData.instructions = Object.values(formData.instructions);
  }

  Recipe.findByIdAndUpdate(id, formData, { new: true })
    .then(result => {
      if (!result) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      res.json({ success: true, recipe: result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Error updating recipe' });
    });
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




module.exports = {
  recipe_index,
  recipe_create_get,
  recipe_create_post,
  recipe_edit_get,
  recipe_details,
  recipe_delete,
  recipe_update,
  recipe_image_get,
};
