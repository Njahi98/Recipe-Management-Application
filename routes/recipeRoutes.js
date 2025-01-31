const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeControllers')
const { upload,processImage } = require("../middleware/uploadMiddleware");
const auth = require('../middleware/auth')

router.get('/',recipeController.recipe_index);

router.post("/", upload.single("image"), processImage, recipeController.recipe_create_post);

router.get('/create',recipeController.recipe_create_get);

router.get('/:id',recipeController.recipe_details);

router.delete('/:id',recipeController.recipe_delete)

router.get('/:id/edit',recipeController.recipe_edit_get)

router.get("/image/:id", recipeController.recipe_image_get);

router.put('/:id', upload.single("image"), processImage, recipeController.recipe_update)

router.put('/:id/reviews',auth,recipeController.recipe_add_review)

module.exports=router;