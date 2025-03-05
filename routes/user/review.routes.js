const express = require('express');
const isAuthenticated = require('../../middleware/isAuthenticated');
const isReviewOwner = require('../../middleware/isReviewOwner');
const reviewControllers = require('../../controllers/user/review.controller')

const router = express.Router();


router.post('/:id/reviews',reviewControllers.recipe_add_review)

router.put('/:recipeId/reviews/:reviewId',isAuthenticated,isReviewOwner,reviewControllers.recipe_update_review)

router.delete('/:recipeId/reviews/:reviewId',isAuthenticated,isReviewOwner,reviewControllers.recipe_delete_review)

module.exports=router; 