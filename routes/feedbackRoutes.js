const express = require("express");
const {
  submitFeedback,
  getAllFeedback,
} = require("../controllers/feedbackController");

const authenticate = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");

const feedbackRouter = express.Router();

/**
 * @route   POST /feedback
 * @desc    Submit feedback
 * @access  Authenticated users
 */
feedbackRouter.post("/", authenticate, submitFeedback);

/**
 * @route   GET /feedback
 * @desc    Get all submitted feedback
 * @access  Admin/Organizer only
 */
feedbackRouter.get("/", authenticate, authorizeRole("admin"), getAllFeedback);

module.exports = feedbackRouter;
