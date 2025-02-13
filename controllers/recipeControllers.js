const Recipe = require("../models/recipe");
const { getGfs } = require("../middleware/uploadMiddleware");
const mongoose = require("mongoose");

const recipe_index = (req, res) => {
  // we populate the field creator with the creator's username instead of their id
  Recipe.find()
    .populate("creator", "username")
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

const recipe_edit_get = (req, res) => {
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
};

const recipe_create_post = (req, res) => {
  const {
    title,
    description,
    ingredients,
    instructions,
    cookingTime,
    difficulty,
    category,
  } = req.body;

  let creator = null;
  let isGuest = false;

  if (req.userId) {
    // logged-in user
    creator = req.userId;
  } else {
    // mark as a guest user
    isGuest = true;
  }
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageId = req.file.id; // GridFS file ID
  const imageName = req.file.filename; // Uploaded file name

  // Create the recipe object
  const recipe = new Recipe({
    title,
    description,
    imageId,
    imageName,
    ingredients,
    instructions,
    cookingTime,
    difficulty,
    category,
    creator, //it'll be null if it's a guest
    isGuest, //it'll be true if it's a guest
  });
  recipe
    .save()
    .then((result) => {
      res.redirect("/recipes");
    })
    .catch((error) => {
      console.error("Error saving recipe:", error);
      res.status(500).json({ error: "Error saving recipe" });
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
        console.log("Error deleting image:", err);
      }
    }

    // Then delete the recipe
    await Recipe.findByIdAndDelete(id);
    res.json({ redirect: "/recipes" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting recipe" });
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
          console.log("Error deleting old image:", err);
        }
      }

      // Add new image details to formData
      formData.imageId = req.file.id;
      formData.imageName = req.file.filename;
    }

    const result = await Recipe.findByIdAndUpdate(id, formData, { new: true });
    if (!result) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json({ success: true, recipe: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating recipe" });
  }
};

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
    await review.save();
    res.json({ message: "Review updated successfully", recipe });
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
  const review = recipe.reviews.id(recipe.params.reviewId);
    if(!review){
      return res.status(404).json({ error: "Review not found" });
    }
    review.remove();
    await recipe.save();
    return res.status(200).json({ message: "Review deleted successfully",recipe });

  } catch (error) {
    return res.status(500).json({ error: "Error deleting review" });
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
  recipe_add_review,
  recipe_update_review,
  recipe_delete_review,
};
