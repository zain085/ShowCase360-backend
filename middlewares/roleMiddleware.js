const asyncHandler = require("express-async-handler");

// Middleware to authorize access based on user roles
const authorizeRole = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    const userRole = req.user.role;

    // Check if the user's role is included in the list of allowed roles
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied." });
    }

    next();
  });
};

module.exports = { authorizeRole };
