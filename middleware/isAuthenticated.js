const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAuthenticated = async(req, res, next) => {
  //  we check for the token & refreshToken in cookies  
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  // we clear any existing authentication
  res.locals.user = null;
  req.userId = null;

  //  if no tokens at all, user is not authenticated
  if (!token && !refreshToken) {
    return next();
  }

  try {
    // try to verify the access token first
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        
        if (user) {
          // we set authentication data
          res.locals.user = user;
          req.userId = user._id.toString(); 
          return next();
        }
      } catch (tokenError) {
        // token verification failed, will try refresh token
        console.log('Access token invalid, trying refresh token');
      }
    }

    // If we get here, either no token or token verification failed
    // Try refresh token if available
    if (refreshToken) {
      try {
        const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(refreshDecoded.userId);
        
        if (!user || !user.refreshTokens.some(t => t.token === refreshToken)) {
          throw new Error('Invalid refresh token');
        }

        // we generate new access token
        const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // we set new access token cookie
        res.cookie('token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000 // 15mins
        });


        // we set authentication data
        res.locals.user = user;
        req.userId = user._id.toString();
        return next();
      } catch (refreshError) {
        // refresh token is invalid, clear both cookies
        console.log('Refresh token invalid, clearing cookies');
        res.clearCookie('token');
        res.clearCookie('refreshToken');
      }
    }

    // If we get here, authentication failed
    return next();
  } catch (error) {
    // Handle any unexpected errors
    console.error('Authentication error:', error);
    return next();
  }
};

module.exports = isAuthenticated;
