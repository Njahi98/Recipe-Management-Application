const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  //  we get the token from the request header named 'Authorization'
  // The ?.replace removes the word 'Bearer' from the token if it exists
  // we add space after the word 'Bearer ' to avoid token extraction issue
  const token = req.header("Authorization")?.replace("Bearer ", "");

  //  If no token is found, return 401 (Unauthorized)
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // we verify the token using our JWT_SECRET in .env
    // If it's valid, it decodes the token that contains the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // we add the userId to the request so the next route can use it
    req.userId = decoded.userId;

    //we continue to the next middleware/route handler
    next();
  } catch (error) {
    //If the token is invalid, we return 400 (Bad Request)
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = auth;
