const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeControllers')

router.get('/',recipeController.recipe_index);

router.post('/',recipeController.recipe_create_post);

router.get('/create',recipeController.recipe_create_get);

router.get('/:id',recipeController.recipe_details);

router.delete('/:id',recipeController.recipe_delete)

router.get('/:id/edit',recipeController.recipe_edit_get)

router.put('/:id',recipeController.recipe_update)

module.exports=router;