const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  profile,
  updateProfile,
  deleteAccount,
  registerForExpo,
  registerForSession,
  getAllUsers,
  getAllExhibitors,
  deleteUser,
} = require("../controllers/authController");

const authenticate = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");

const userRouter = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
userRouter.post("/register", register);

/**
 * @route   POST /auth/login
 * @desc    Login user and return token
 * @access  Public
 */
userRouter.post("/login", login);

/**
 * @route   POST /auth/forgotPassword
 * @desc    Request a password reset token
 * @access  Public
 */
userRouter.post("/forgotPassword", forgotPassword);

/**
 * @route   POST /auth/resetPassword/:token
 * @desc    Reset password using token
 * @access  Public
 */
userRouter.post("/resetPassword/:token", resetPassword);

/**
 * @route   GET /auth/profile
 * @desc    Get user profile
 * @access  Private (Authenticated users only)
 */
userRouter.get("/profile", authenticate, profile);

/**
 * @route   PUT /auth/update-profile
 * @desc    Update user profile
 * @access  Private (Authenticated users only)
 */
userRouter.put("/update-profile", authenticate, updateProfile);

/**
 * @route   DELETE /auth/delete-account
 * @desc    Delete the authenticated attendee's account
 * @access  Attendee only
 */
userRouter.delete("/delete-account", authenticate, authorizeRole("attendee"), deleteAccount);


/**
 * @route   POST /auth/register-expo/:expoId
 * @desc    Register an exhibitor for an expo
 * @access  Exhibitor only
 */
userRouter.post(
  "/register-expo/:expoId", authenticate, authorizeRole("exhibitor"), registerForExpo);

/**
 * @route   POST /auth/register-session/:sessionId
 * @desc    Register an attendee for a session
 * @access  Attendee only
 */
userRouter.post("/register-session/:sessionId", authenticate, authorizeRole("attendee"), registerForSession);

/**
 * @route   GET /auth/users
 * @desc    Get all users (non-admins)
 * @access  Admin only
 */
userRouter.get("/users", authenticate, authorizeRole("admin"), getAllUsers);

/**
 * @route   GET /auth/exhibitors
 * @desc    Get all exhibitors
 * @access  Admin only
 */
userRouter.get("/exhibitors", authenticate, authorizeRole("admin"), getAllExhibitors);

/**
 * @route   DELETE /auth/users/:id
 * @desc    Delete a user (works for both exhibitors + attendees)
 * @access  Admin only
 */
userRouter.delete("/users/:id", authenticate, authorizeRole("admin"), deleteUser);

module.exports = userRouter;
