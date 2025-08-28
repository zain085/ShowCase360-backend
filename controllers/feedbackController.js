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
  const feedbacks = await Feedback.find()
    .populate("userId", "username email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "All feedback",
    success: true,
    feedbacks,
  });
});

// Controller to delete feedback (admin only)
const deleteFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feedback = await Feedback.findById(id);
  if (!feedback) {
    return res.status(404).json({ message: "Feedback not found", success: false });
  }

  await feedback.deleteOne();

  res.status(200).json({
    message: "Feedback deleted successfully",
    success: true,
  });
});

module.exports = {
  submitFeedback,
  getAllFeedback,
  deleteFeedback,
};
