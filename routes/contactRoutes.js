const express = require('express');
const router = express.Router();
const contactControllers = require('../controllers/contactControllers')

router.get('/',contactControllers.contact_index)
router.post('/',contactControllers.contact_post)

module.exports=router;