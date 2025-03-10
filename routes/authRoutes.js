const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const isAuthenticated = require('../middleware/isAuthenticated');
//Register
router.post('/register',async(req,res)=>{
    try {
        /* we used array destructuring so the new user object only gets username, email, and password from the request's body
         we could have used this direct approach : const user = new User(req.body);
         but the user will get ALL properties, including hidden ones we don't want, like isAdmin for example */
        const {username,email,password}=req.body;

        //we check the existence of the retrieved information before we pass to the next step
        const emailExists = await User.findOne({ email: email });
        const usernameExists = await User.findOne({ username: username });
        if (emailExists || usernameExists) {
            return res.status(400).json({ error: 'Email or username already in use' });
        }

        //if the user doesn't exist we create our new user object and save it
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
        // we extract email and password from the body request
        const{email,password}=req.body;

        // we find the user by email
        const user = await User.findOne({email});
        
        //if the user doesn't exist we throw an invalid credentials error
        if(!user){
            return res.status(400).json({error:'Invalid credentials'});
        }

        // if the user exists we hash the provided password and compare it to the hashed password saved in mongodb
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({error:'Invalid credentials'});
        }

        //if the password match we create a JWT token valid for one hour
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});

        // we set the token in a cookie
        res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        maxAge: 3600000, // 1 hour
      });
  
    return res.redirect('/');
  
    } catch (error) {
        res.status(500).json({error:'Error logging in'});
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
  });

router.get('/login',(req,res)=>{
    if(req.userId){
       return res.redirect('/');
    }
   return res.render('auth/login',{title:'Login Page'}); 
})
router.get('/register',(req,res)=>{
    if(req.userId){
       return res.redirect('/');
    }
   return res.render('auth/register',{title:'Register Page'}) ; 
})




module.exports=router;