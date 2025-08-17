const express = require("express");
const {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
} = require("../controllers/sessionController");

const authenticate = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");

const sessionRouter = express.Router();

/**
 * @route   GET /sessions
 * @desc    Retrieve all sessions
 * @access  Public
 */
sessionRouter.get("/", getAllSessions);

/**
 * @route   GET /sessions/:id
 * @desc    Get a session by ID
 * @access  Public
 */
sessionRouter.get("/:id", getSessionById);

/**
 * @route   POST /sessions
 * @desc    Create a new session
 * @access  Admin/Organizer only
 */
sessionRouter.post("/", authenticate, authorizeRole("admin"), createSession);

/**
 * @route   PUT /sessions/:id
 * @desc    Update an existing session
 * @access  Admin/Organizer only
 */
sessionRouter.put("/:id", authenticate, authorizeRole("admin"), updateSession);

/**
 * @route   DELETE /sessions/:id
 * @desc    Delete a session by ID
 * @access  Admin/Organizer only
 */
sessionRouter.delete("/:id", authenticate, authorizeRole("admin"), deleteSession);

module.exports = sessionRouter;
