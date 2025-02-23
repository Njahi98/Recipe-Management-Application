const express = require('express');
const isAuthenticated = require('../../middleware/isAuthenticated');
const isAdmin = require('../../middleware/isAdmin');
const router = express.Router();
const adminController = require('../../controllers/admin/admin.controller');

router.get('/',isAuthenticated, isAdmin,adminController.admin_index);

router.get('/contact',isAuthenticated,isAdmin,adminController.admin_contact_index);

router.delete('/contact/:id',isAuthenticated,isAdmin,adminController.admin_contact_delete);





module.exports = router;