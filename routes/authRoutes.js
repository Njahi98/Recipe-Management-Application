const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const rateLimit = require('express-rate-limit');
const {body,validationResult} = require('express-validator');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per 15 minutes
    message: { error: "Too many login/register attempts, please try again after 15 minutes" },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  });

//Register
router.post('/register',authLimiter,async(req,res)=>{
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
router.post('/login',
    //validated and sanitized data
[
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').not().isEmpty().withMessage('Password is required').trim().escape()
],
  authLimiter, async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).render('login', { 
            errors: errors.array() 
          });
        }
        
        // we extract validated/sanitized email and password from the body request
        const{email,password}=req.body;

        // for security reasons, to prevent timing attacks we do a password comparison
        // regardless if user exists or not
        const user = await User.findOne({email});
        let isMatch = false;
        
        //if the user doesn't exist we throw an invalid credentials error
        if(user){
            isMatch = await user.comparePassword(password);
        }

        if(!user || !isMatch){
            return res.status(400).json({error:'Invalid email or password'});
        }

        //we will generate a 15m token and a 7 days refreshToken
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

          // we store refresh token in DB
        user.refreshTokens.push({ token: refreshToken });
        await user.save();


        // we set the token in a cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        });
        
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 604800000,
        });
  
    return res.redirect('/');
  
    } catch (error) {
        res.status(500).json({errors: [{ msg: 'An error occurred during login. Please try again.' }]});
    }
})

//Logout
router.get('/logout', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken && req.userId) {
      const user = await User.findById(req.userId);
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
      await user.save();
    }
    
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.redirect('/');
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