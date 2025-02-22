const express = require('express');
const router = express.Router();
const adminUserController = require('../../controllers/admin/user.controller');
const isAuthenticated = require('../../middleware/isAuthenticated');
const isAdmin = require('../../middleware/isAdmin');

router.get('/',isAuthenticated, isAdmin, adminUserController.admin_user_index);

router.get('/:userId', isAuthenticated, isAdmin,adminUserController.admin_user_details);

router.put('/:userId', isAuthenticated, isAdmin, adminUserController.admin_user_update);

router.delete('/:userId', isAuthenticated, isAdmin, adminUserController.admin_user_delete);
//decided to remove the two authentication middlewares for faster image fetching, because these images are public data anyway
router.get("/image/:id", adminUserController.user_image_get);


module.exports=router;