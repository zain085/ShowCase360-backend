const { User } = require("../models/userModel");
const { Expo } = require("../models/expoModel");
const { Session } = require("../models/sessionModel");
const { Booth } = require("../models/boothModel");
const { Feedback } = require("../models/feedbackModel");
const { Message } = require("../models/messageModel");
const asyncHandler = require("express-async-handler");

// Controller to analyze popularity of expos based on registered attendees
const expoAnalytics = asyncHandler(async (req, res) => {
  const data = await Expo.find().lean();

  const result = await Promise.all(
    data.map(async (expo) => {
      const count = await User.countDocuments({ registeredExpos: expo._id });
      return {
        expoId: expo._id,
        title: expo.title,
        attendeeCount: count,
      };
    })
  );

  res.status(200).json({
    success: true,
    message: "Expo analytics retrieved successfully",
    data: result,
  });
});

// Controller to analyze popularity of sessions based on registered attendees
const sessionAnalytics = asyncHandler(async (req, res) => {
  const data = await Session.find().lean();

  const result = await Promise.all(
    data.map(async (session) => {
      const count = await User.countDocuments({
        registeredSessions: session._id,
      });
      return {
        sessionId: session._id,
        topic: session.topic,
        attendeeCount: count,
      };
    })
  );

  res.status(200).json({
    success: true,
    message: "Session analytics retrieved successfully",
    data: result,
  });
});

// Controller to get overall dashboard stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalExpos = await Expo.countDocuments();
  const totalExhibitors = await User.countDocuments({ role: "exhibitor" });
  const totalAttendees = await User.countDocuments({ role: "attendee" });
  const totalSessions = await Session.countDocuments();
  const totalBooths = await Booth.countDocuments();
  const totalFeedbacks = await Feedback.countDocuments();

  // Count messages from attendees and exhibitors
  const totalAttendeeMessages = await Message.countDocuments({
    sender: { $in: await User.find({ role: "attendee" }).distinct("_id") },
  });

  const totalExhibitorMessages = await Message.countDocuments({
    sender: { $in: await User.find({ role: "exhibitor" }).distinct("_id") },
  });
  const totalMessages = totalAttendeeMessages + totalExhibitorMessages;

  res.status(200).json({
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: {
      totalExpos,
      totalExhibitors,
      totalAttendees,
      totalSessions,
      totalBooths,
      totalFeedbacks,
      totalAttendeeMessages,
      totalExhibitorMessages,
      totalMessages,
    },
  });
});

module.exports = {
  expoAnalytics,
  sessionAnalytics,
  getDashboardStats,
};
