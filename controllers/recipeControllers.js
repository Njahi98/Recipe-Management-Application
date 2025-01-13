const Recipe = require("../models/recipe");

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
  const recipe = new Recipe(req.body);
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
  // Parse ingredients and instructions from the form data
  const formData = req.body;
  
  // Convert ingredients array format
  if (formData.ingredients) {
    formData.ingredients = Object.keys(formData.ingredients)
      .map(key => ({
        item: formData.ingredients[key].item,
        amount: formData.ingredients[key].amount,
        unit: formData.ingredients[key].unit
      }));
  }

  // Convert instructions array format
  if (formData.instructions) {
    formData.instructions = Object.keys(formData.instructions)
      .map(key => ({
        text: formData.instructions[key].text
      }));
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

module.exports = {
  recipe_index,
  recipe_create_get,
  recipe_create_post,
  recipe_edit_get,
  recipe_details,
  recipe_delete,
  recipe_update,
};
