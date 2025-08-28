const { User } = require("../models/userModel");
const { Expo } = require("../models/expoModel");
const { Message } = require("../models/messageModel");
const { Feedback } = require("../models/feedbackModel");
const { Session } = require("../models/sessionModel");
const { Exhibitor } = require("../models/exhibitorModel");
const { Booth } = require("../models/boothModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");

// Controller for user registration
const register = asyncHandler(async (req, res) => {
  const { username, email, password, address, gender, profileImg, role } =
    req.body;

  if (!username || !email || !password || !address || !gender || !role) {
    return res.status(400).json({ message: "Input all fields." });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(401).json({ message: "Already have an account." });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
    address,
    gender,
    profileImg,
    role,
  });

  res.status(201).json({
    message: "user register",
    success: true,
    user: newUser,
  });
});

// Controller for user login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Input all fields.",
    });
  }

  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.status(404).json({
      message: "User not registered.",
    });
  }

  const matchPassword = await bcrypt.compare(password, userExists.password);

  if (!matchPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }

  res.status(200).json({
    message: "user login",
    success: true,
    user: userExists,
    token: generateToken(userExists._id),
  });
});

// Controller for initiating password reset
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  res.status(200).json({
    message: "Password reset token generated",
    success: true,
    resetToken: token,
  });
});

// Controller for resetting password using token
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.status(200).json({
    message: "Password reset successful",
    success: true,
  });
});

// Controller to retrieve authenticated user's profile
const profile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.status(200).json({
    message: "user profile",
    success: true,
    user,
  });
});

// Controller to update authenticated user's profile
const updateProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = ["username", "address", "gender", "profileImg"];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

// Controller to delete authenticated user's account
const deleteAccount = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only attendees can delete their own account
    if (user.role !== "attendee") {
      return res.status(403).json({
        success: false,
        message: "Only attendees are allowed to delete their account",
      });
    }

    // Remove attendee from any registered sessions
    if (user.registeredSessions && user.registeredSessions.length > 0) {
      await Session.updateMany(
        { _id: { $in: user.registeredSessions } },
        { $pull: { attendees: userId } }
      );
    }

    // Remove attendee from any registered expos
    if (user.registeredExpos && user.registeredExpos.length > 0) {
      await Expo.updateMany(
        { _id: { $in: user.registeredExpos } },
        { $pull: { exhibitors: userId } }
      );
    }

    // Delete feedbacks created by user
    await Feedback.deleteMany({ userId: userId });

    // Delete messages where user is sender or receiver
    await Message.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account and all related data deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting account",
    });
  }
});

// Controller for exhibitor registration to an expo
const registerForExpo = asyncHandler(async (req, res) => {
  const expoId = req.params.expoId;

  // Only exhibitors can register
  if (req.user.role !== "exhibitor") {
    return res
      .status(403)
      .json({ message: "Only exhibitors can register for expos" });
  }

  // Check if expo exists
  const expo = await Expo.findById(expoId);
  if (!expo) {
    return res.status(404).json({ message: "Expo not found" });
  }

  // Prevent duplicate registration
  if (req.user.registeredExpos.includes(expoId)) {
    return res
      .status(400)
      .json({ message: "Already registered for this expo" });
  }

  // Register exhibitor for the expo
  req.user.registeredExpos.push(expoId);
  await req.user.save();

  res.status(200).json({
    message: "Expo registration successful",
    success: true,
  });
});

// Controller for attendee registration to a session
const registerForSession = asyncHandler(async (req, res) => {
  const sessionId = req.params.sessionId;

  if (req.user.role !== "attendee") {
    return res
      .status(403)
      .json({ message: "Only attendees can register for sessions" });
  }

  const session = await Session.findById(sessionId);
  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  if (req.user.registeredSessions.includes(sessionId)) {
    return res
      .status(400)
      .json({ message: "Already registered for this session" });
  }

  req.user.registeredSessions.push(sessionId);
  await req.user.save();

  res.status(200).json({
    message: "Session registration successful",
    success: true,
  });
});

// Get the admin user
const getAdminUser = asyncHandler(async (req, res) => {
  // Find the first user with role 'admin'
  const admin = await User.findOne({ role: "admin" }).select("_id username email profileImg");

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }

  res.status(200).json({
    success: true,
    data: admin,
  });
});

// Controller to get all users (except admins)
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ role: "attendee" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
});

// Controller to get all exhibitors
const getAllExhibitors = asyncHandler(async (req, res) => {
  try {
    const exhibitors = await User.find({ role: "exhibitor" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Exhibitors retrieved successfully",
      data: exhibitors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching exhibitors",
    });
  }
});

// Delete user (Admin/Organizer only)
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  /// If the user is an exhibitor, delete their professional profile
  if (user.role === "exhibitor") {
    const exhibitor = await Exhibitor.findOne({ userId: user._id });

    if (exhibitor) {
      // Reset booths assigned to this exhibitor
      await Booth.updateMany(
        { exhibitorId: exhibitor._id },
        { $set: { exhibitorId: null, status: "available" } }
      );

      // Delete the exhibitor profile
      await exhibitor.deleteOne();
    }
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User and related data deleted successfully",
  });
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  profile,
  updateProfile,
  deleteAccount,
  registerForExpo,
  registerForSession,
  getAdminUser,
  getAllUsers,
  getAllExhibitors,
  deleteUser,
};
