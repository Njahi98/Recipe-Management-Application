const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAuthenticated = async(req, res, next) => {
  //  we get the token from the request header 'Authorization' or we check for the token in cookies  
  // The ?.replace removes the word 'Bearer' from the token if it exists
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  //  If no token is found, the user is not authenticated
  // We attach `user = null` to `res.locals` so templates know no user is logged in
  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    // we verify the token using our JWT_SECRET in .env
    // If it's valid, it decodes the token that contains the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // we fetch the user from the database
    // we use the `userId` from the decoded token to find the user
    // if the user doesn't exist, treat it as an invalid token
    // we exclude password to guarantee security
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      // No user found
      res.locals.user = null; 
      return next();
    }
    //we attach the user to res.locals for use in templates
    res.locals.user=user;

    //we attach the userId to req for use in route handlers
    req.userId = decoded.userId;

    //we continue to the next middleware/route handler
    next();
  } catch (error) {
    // No user is logged in
    res.locals.user = null; 
    next();
  }
};

module.exports = isAuthenticated;
