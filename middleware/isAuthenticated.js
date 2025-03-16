const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAuthenticated = async(req, res, next) => {
  //  we we check for the token & refreshToken in cookies  
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  //  If no token is found, the user is not authenticated
  // We attach `user = null` to `res.locals` so templates know no user is logged in
  if (!token && !refreshToken) {
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
    return next();
  } catch (error) {

    if (error.name === 'TokenExpiredError' && refreshToken) {
      try {
        // we attempt token refresh
        const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(refreshDecoded.userId);
        
        if (!user || !user.refreshTokens.some(t => t.token === refreshToken)) {
          throw new Error('Invalid refresh token');
        }

        // we issue new access token
        const newToken = jwt.sign(
          { userId: user._id }, 
          process.env.JWT_SECRET, 
          { expiresIn: '15m' }
        );

        // we set new token cookie
        res.cookie('token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 900000 // 
        });

        res.locals.user = user;
        req.userId = user._id;
        return next();
      } catch (refreshError) {
        // if the Refresh attempt fails we clear cookies
        res.clearCookie('token');
        res.clearCookie('refreshToken');
      }
    }

    // No user is logged in
    res.locals.user = null; 
    next();
  }
};

module.exports = isAuthenticated;
