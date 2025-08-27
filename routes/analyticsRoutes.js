const express = require("express");
const { 
  expoAnalytics, 
  sessionAnalytics, 
  getDashboardStats 
} = require("../controllers/analyticsController");
const authenticate = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");

const analyticsRouter = express.Router();

/**
 * @route   GET /analytics/expos
 * @desc    Get attendee count per expo (expo engagement)
 * @access  Admin only
 */
analyticsRouter.get("/expos", authenticate, authorizeRole("admin"), expoAnalytics);

/**
 * @route   GET /analytics/sessions
 * @desc    Get attendee count per session (session popularity)
 * @access  Admin only
 */
analyticsRouter.get("/sessions", authenticate, authorizeRole("admin"), sessionAnalytics);

/**
 * @route   GET /analytics/dashboard
 * @desc    Get overall dashboard stats (counts of expos, exhibitors, attendees, booths, sessions, feedbacks)
 * @access  Admin only
 */
analyticsRouter.get("/dashboard", authenticate, authorizeRole("admin"), getDashboardStats);

module.exports = analyticsRouter;
