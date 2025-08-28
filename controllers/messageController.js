const asyncHandler = require("express-async-handler");
const { Message } = require("../models/messageModel");
const { User } = require("../models/userModel");

// Controller to send a message from one user to another
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, message, senderName, senderEmail } = req.body;
  const senderId = req.user._id;

  if (!receiverId || !message || !senderName || !senderEmail) {
    return res.status(400).json({
      message: "receiverId, message, senderName, and senderEmail are all required",
      success: false,
    });
  }

  if (receiverId === senderId.toString()) {
    return res.status(400).json({ 
      message: "You cannot message yourself",
      success: false,
    });
  }

  const receiverExists = await User.findById(receiverId);
  if (!receiverExists) {
    return res.status(404).json({ 
      message: "Receiver not found",
      success: false,
    });
  }

  const newMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    message,
    senderName,
    senderEmail,
  });

  res.status(201).json({
    message: "Message sent successfully",
    success: true,
    data: newMessage,
  });
});

// Fetch all attendee → admin messages
const getAttendeeMessages = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  const messages = await Message.find({
    receiver: adminId,
  })
    .populate("sender", "username email role")
    .sort({ createdAt: -1 });

  const attendeeMessages = messages.filter(
    (msg) => msg.sender && msg.sender.role === "attendee"
  );

  res.status(200).json({
    message: "Messages from attendees retrieved successfully",
    success: true,
    data: attendeeMessages,
  });
});

// Delete a message by ID
const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await Message.findById(id);
  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Message not found",
    });
  }

  await message.deleteOne();

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});

module.exports = { sendMessage, getAttendeeMessages, deleteMessage };
