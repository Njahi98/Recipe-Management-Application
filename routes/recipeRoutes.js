const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeControllers')
const { upload,processImage } = require("../middleware/uploadMiddleware");
const auth = require('../middleware/auth');
const isRecipeOwner = require('../middleware/isRecipeOwner');
const isReviewOwner = require('../middleware/isReviewOwner');

router.get('/',recipeController.recipe_index);

router.post("/", upload.single("image"), processImage, recipeController.recipe_create_post);

router.get('/create',recipeController.recipe_create_get);

router.get('/:id',recipeController.recipe_details);

router.delete('/:id',auth,isRecipeOwner,recipeController.recipe_delete)

router.get('/:id/edit',recipeController.recipe_edit_get)

router.get("/image/:id", recipeController.recipe_image_get);

router.put('/:id',auth,isRecipeOwner,upload.single("image"), processImage, recipeController.recipe_update)

// router.get('/:id/reviews/',auth,recipeController.get_reviews_by_user);

router.post('/:id/reviews',auth,recipeController.recipe_add_review)

router.put(':recipeId/reviews/:reviewId',auth,isReviewOwner,recipeController.recipe_update_review)

router.delete('/:recipeId/reviews/:reviewId',auth,isReviewOwner,recipeController.recipe_delete_review)

module.exports=router;