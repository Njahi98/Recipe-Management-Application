const express = require('express');
const router = express.Router();
const recipeController = require('../../controllers/user/recipe.controller')
const { upload,processImage } = require("../../middleware/uploadMiddleware");
const isAuthenticated = require('../../middleware/isAuthenticated');
const isRecipeOwner = require('../../middleware/isRecipeOwner');

router.get('/',recipeController.recipe_index);

router.post("/", upload.single("image"), processImage, recipeController.recipe_create_post);

router.get('/create',recipeController.recipe_create_get);

router.get('/:id',recipeController.recipe_details);

router.delete('/:id',isAuthenticated,isRecipeOwner,recipeController.recipe_delete)

router.get('/:id/edit',isAuthenticated,recipeController.recipe_edit_get)

router.get("/image/:id", recipeController.recipe_image_get);

router.put('/:id',isAuthenticated,isRecipeOwner,upload.single("image"), processImage, recipeController.recipe_update)


module.exports=router;