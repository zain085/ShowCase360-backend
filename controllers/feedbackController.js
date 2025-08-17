const { Feedback } = require("../models/feedbackModel");
const asyncHandler = require("express-async-handler");

// Controller to submit feedback from an authenticated user (attendee only)
const submitFeedback = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthorized. No user found in request." });
  }

  // Allow only 'attendee' role to submit feedback
  if (req.user.role !== "attendee") {
    return res.status(403).json({ message: "Only attendees are allowed to submit feedback." });
  }

  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ message: "Feedback message is required" });
  }

  const feedback = await Feedback.create({
    userId: req.user._id,
    message,
  });

  res.status(201).json({
    message: "Feedback submitted",
    success: true,
    feedback,
  });
});

// Controller to retrieve all submitted feedback (admin only)
const getAllFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find().populate("userId", "username email").sort({ createdAt:-1 });

  res.status(200).json({
    message: "All feedback",
    success: true,
    feedbacks,
  });
});

module.exports = {
  submitFeedback,
  getAllFeedback,
};
