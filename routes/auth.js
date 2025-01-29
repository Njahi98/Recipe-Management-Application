const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const auth = require('../middleware/auth')
//Register
router.post('/register',async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        const user = new User({username,email,password});
        await user.save();
        res.status(201).json({message:'User registered successfully'});
    } catch (error) {
        res.status(500).json({error:'Error registering user'});
    }
});

//Login
router.post('/login',async(req,res)=>{
    try {
        const{email,password}=req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({error:'Invalid credentials'});
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({error:'Invalid credentials'});
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({token});

    } catch (error) {
        res.status(500).json({error:'Error logging in'});
    }
})

router.get('/protected',auth,(req,res)=>{
    res.json({message:'This is a protected Route',userId:req.userId});
});


module.exports=router;