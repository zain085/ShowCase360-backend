const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

// Middleware to authenticate requests using JWT
const authenticate = asyncHandler(async (req, res, next) => {
  let token = "";

  // Check if Authorization header with Bearer token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract token from header
    token = req.headers.authorization.split(" ")[1];

    // Verify and decode the token
    let decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach the authenticated user to the request object
    req.user = await User.findById(decoded._id);

    next();
  }

  // If no token is provided
  if (!token) {
    res.status(401).json({ message: "No token provided." });
  }
});

module.exports = authenticate;
