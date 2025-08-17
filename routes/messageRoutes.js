const express = require("express");
const {
  sendMessage,
  getAttendeeMessages,
} = require("../controllers/messageController");

const authenticate = require("../middlewares/authMiddleware");

const messageRouter = express.Router();

/**
 * @route   POST /message/send
 * @desc    Send a message to another user
 * @access  Authenticated users
 */
messageRouter.post("/send", authenticate, sendMessage);

/**
 * @route   GET /message/attendee-to-admin
 * @desc    Get all messages sent from attendees to admin
 * @access  Admin only
 */
messageRouter.get("/attendee-to-admin", authenticate, getAttendeeMessages);


module.exports = messageRouter;
