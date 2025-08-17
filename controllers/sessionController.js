const { Session } = require("../models/sessionModel");
const asyncHandler = require("express-async-handler");

// Controller to fetch all sessions with populated expo information
const getAllSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find().populate("expoId").sort({ createdAt:-1 });
  res.status(200).json({
    message: "All sessions",
    success: true,
    sessions,
  });
});

// Controller to fetch a single session by ID
const getSessionById = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id).populate("expoId");
  if (!session) {
    return res.status(404).json({
      message: "Session not found",
      success: false,
    });
  }

  res.status(200).json({
    message: "Session fetched successfully",
    success: true,
    session,
  });
});


// Controller to create a new session
const createSession = asyncHandler(async (req, res) => {
  const { topic, speaker, time, expoId, location, description, category, capacity, status } = req.body;

  if (!topic || !speaker || !time || !time.start || !time.end || !expoId || !location) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  const existingSession = await Session.findOne({
    expoId,
    topic,
    speaker,
    location,
    "time.start": time.start,
  });

  if (existingSession) {
    return res.status(409).json({
      message: "A session with the same topic, speaker, location, and start time already exists in this expo.",
    });
  }

  const session = await Session.create({
    topic,
    speaker,
    time,
    expoId,
    location,
    description,
    category,
    capacity,
    status,
  });

  res.status(201).json({
    message: "Session created",
    success: true,
    session,
  });
});

// Controller to update an existing session
const updateSession = asyncHandler(async (req, res) => {
  const updated = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: "Session not found" });

  res.status(200).json({
    message: "Session updated",
    success: true,
    session: updated,
  });
});

// Controller to delete a session by ID
const deleteSession = asyncHandler(async (req, res) => {
  const deleted = await Session.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Session not found" });

  res.status(200).json({
    message: "Session deleted",
    success: true,
  });
});

module.exports = {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
};
