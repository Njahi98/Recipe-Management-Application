const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeControllers')
const { upload,processImage } = require("../middleware/uploadMiddleware");
const auth = require('../middleware/auth');
const isRecipeOwner = require('../middleware/isRecipeOwner');

router.get('/',recipeController.recipe_index);

router.post("/", upload.single("image"), processImage, recipeController.recipe_create_post);

router.get('/create',recipeController.recipe_create_get);

router.get('/:id',recipeController.recipe_details);

router.delete('/:id',auth,isRecipeOwner,recipeController.recipe_delete)

router.get('/:id/edit',recipeController.recipe_edit_get)

router.get("/image/:id", recipeController.recipe_image_get);

router.put('/:id',auth,isRecipeOwner,upload.single("image"), processImage, recipeController.recipe_update)

router.put('/:id/reviews',auth,isRecipeOwner,recipeController.recipe_add_review)

router.put(':id1/reviews/:id2',auth,isRecipeOwner,recipeController.recipe_update_review)

router.delete('/:id1/reviews/:id2',auth,isRecipeOwner,recipeController.recipe_delete_review)

module.exports=router;