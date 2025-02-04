const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.get('/:id',async(req,res)=>{
    try {
        const profileId=req.params.id;
        const profile = await User.findById(profileId).select('-password');
        if(!profile){
            return res.status(404).json({error:'user does not exist'});
        }
        console.log(profile)
        res.render('profile/profile',{title:"Profile",profile:profile})
    } catch (error) {
        return res.status(500).json({error});
    }
})


module.exports=router;