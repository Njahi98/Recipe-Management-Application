const express = require('express');
const isAuthenticated = require('../../middleware/isAuthenticated');
const isAdmin = require('../../middleware/isAdmin');
const router = express.Router();
const adminRecipeController = require('../../controllers/admin/recipe.controller')

router.get('/', isAuthenticated, isAdmin,adminRecipeController.admin_recipe_index);

router.get('/:recipeId', isAuthenticated, isAdmin, adminRecipeController.admin_recipe_details);

router.delete('/:recipeId', isAuthenticated, isAdmin, adminRecipeController.admin_recipe_delete)

//decided to remove the two authentication middlewares for faster image fetching, because these images are public data anyway
router.get("/image/:id", adminRecipeController.recipe_image_get);













module.exports=router;