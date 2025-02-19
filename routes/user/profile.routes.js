const express = require("express");
const router = express.Router();
const { upload,processImage } = require("../../middleware/uploadMiddleware");
const profileControllers = require('../../controllers/user/profile.controller');
const isAuthenticated = require('../../middleware/isAuthenticated')

router.get("/:id", profileControllers.user_profile_index);

//we protect this route by adding auth
//only the logged in user should be able to update his profile
//this takes us to the edit page and it's protected by auth and by comparing the request id to the logged user's id
router.get("/:id/edit",isAuthenticated,profileControllers.user_profile_edit_get);

router.put("/:id",isAuthenticated,upload.single("image"), processImage, profileControllers.user_profile_update); 

router.get("/image/:id",profileControllers.user_profile_image_get);

router.get('/:id/reviewsRecipes', profileControllers.user_profile_reviewRecipes_get)

module.exports = router;
