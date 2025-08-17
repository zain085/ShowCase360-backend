// Global error handling middleware for catching exceptions and sending error responses
const errorHandler = (err, req, res, next) => {
  // Log the full error stack for debugging
  console.error("Error:", err.stack);

  // Set the appropriate status code; default to 500 if response code is 200
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Send a structured error response
  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
