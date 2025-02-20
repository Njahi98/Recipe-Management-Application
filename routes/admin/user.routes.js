const express = require('express');
const router = express.Router();
const adminUserController = require('../../controllers/admin/user.controller');
const isAuthenticated = require('../../middleware/isAuthenticated');
const isAdmin = require('../../middleware/isAdmin');

router.get('/',isAuthenticated, isAdmin, adminUserController.admin_user_index);

router.get('/:userId', isAuthenticated, isAdmin,adminUserController.admin_user_details);

router.put('/:userId', isAuthenticated, isAdmin, adminUserController.admin_user_update);

router.delete('/:userId', isAuthenticated, isAdmin, adminUserController.admin_user_delete)

module.exports=router;