const User = require("../models/user");
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');



const register = async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: errors.array()[0].msg,
                 details: errors.array()
            });
          }
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
        return res.status(201).json({message:'User registered successfully'});
    } catch (error) {
        res.status(500).json({error:'Error registering user'});
    }
}

const login = async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: errors.array()[0].msg,
                details: errors.array() 
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
            return res.status(400).json({error:'Invalid credentials'});
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
        res.status(500).json({ error: 'An error occurred during login. Please try again.' });
    }
}

const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken && req.userId) {
      const user = await User.findById(req.userId);
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
      await user.save();
    }
    
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.redirect('/');
}

const login_index = (req,res)=>{
    if(req.userId){
       return res.redirect('/');
    }
   return res.render('auth/login',{title:'Login Page'}); 
}

const register_index = (req,res)=>{
    if(req.userId){
       return res.redirect('/');
    }
   return res.render('auth/register',{title:'Register Page'}) ; 
}


module.exports={
    register,
    login,
    logout,
    login_index,
    register_index
}