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
  const id=req.params.id;
  Recipe.findByIdAndUpdate(id, req.body, { new: true })
  .then((result) => {
    res.render("recipes/details", {
      recipe: result,
      title: "Recipe Details",
    });
  })
  .catch((err) => {
    res.status(404).render("404", { title: "Recipe not found" });
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
