const express = require("express");
const {
  sendMessage,
  getAttendeeMessages,
  getExhibitorMessages,
  deleteMessage, 
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

/**
 * @route   GET /message/exhibitor-to-admin
 * @desc    Get all messages sent from exhibitors to admin
 * @access  Admin only
 */
messageRouter.get("/exhibitor-to-admin", authenticate, getExhibitorMessages);


/**
 * @route   DELETE /message/:id
 * @desc    Delete a message by ID
 * @access  Admin only
 */
messageRouter.delete("/:id", authenticate, deleteMessage);

module.exports = messageRouter;
