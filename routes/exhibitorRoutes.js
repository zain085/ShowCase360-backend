const express = require("express");
const {
  getAllExhibitors,
  getExhibitorById,
  getExhibitorByUserId,
  createExhibitorProfile,
  updateOwnExhibitorProfile,
  updateExhibitor,
  deleteExhibitor,
  approveExhibitor,
  rejectExhibitor,
} = require("../controllers/exhibitorController");

const authenticate = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");

const exhibitorRouter = express.Router();

/**
 * @route   GET /exhibitors
 * @desc    Get all exhibitor profiles
 * @access  Public
 */
exhibitorRouter.get("/", getAllExhibitors);

/**
 * @route   GET /exhibitors/:id
 * @desc    Get a single exhibitor by Mongo _id
 * @access  Public
 */
exhibitorRouter.get("/:id", getExhibitorById);

/**
 * @route   GET /exhibitors/user/:userId
 * @desc    Get an exhibitor by associated userId
 * @access  Public
 */
exhibitorRouter.get("/user/:userId", getExhibitorByUserId);

/**
 * @route   POST /exhibitors
 * @desc    Create exhibitor profile (self)
 * @access  Exhibitor only
 */
exhibitorRouter.post("/", authenticate, authorizeRole("exhibitor"), createExhibitorProfile);

/**
 * @route   PUT /exhibitors/profile/update
 * @desc    Update exhibitor's own profile
 * @access  Exhibitor only
 */
exhibitorRouter.put("/profile/update", authenticate, authorizeRole("exhibitor"), updateOwnExhibitorProfile);

/**
 * @route   PUT /exhibitors/:id
 * @desc    Update any exhibitor (by admin)
 * @access  Admin only
 */
exhibitorRouter.put("/:id", authenticate, authorizeRole("admin"), updateExhibitor);

/**
 * @route   DELETE /exhibitors/:id
 * @desc    Delete an exhibitor
 * @access  Admin only
 */
exhibitorRouter.delete("/:id", authenticate, authorizeRole("admin"), deleteExhibitor);

/**
 * @route   PUT /exhibitors/:id/approve
 * @desc    Approve an exhibitor application
 * @access  Admin only
 */
exhibitorRouter.put("/:id/approve", authenticate, authorizeRole("admin"), approveExhibitor);

/**
 * @route   PUT /exhibitors/:id/reject
 * @desc    Reject an exhibitor application
 * @access  Admin only
 */
exhibitorRouter.put("/:id/reject", authenticate, authorizeRole("admin"), rejectExhibitor);

module.exports = exhibitorRouter;
