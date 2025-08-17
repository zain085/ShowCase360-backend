const jwt = require("jsonwebtoken");


//Generates a JWT token using the user's ID.
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "24h" });
};

module.exports = generateToken;
