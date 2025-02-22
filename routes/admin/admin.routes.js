const express = require('express');
const isAuthenticated = require('../../middleware/isAuthenticated');
const isAdmin = require('../../middleware/isAdmin');
const router = express.Router();

router.get('/',isAuthenticated, isAdmin, async(req,res)=>{
    try {
        return res.render('admin/admin',{title:'Admin Panel'});
    } catch (error) {
        return res.status(500).render('500',{error:'Something went wrong. Please try again later.'});
        
    }
})





module.exports = router;