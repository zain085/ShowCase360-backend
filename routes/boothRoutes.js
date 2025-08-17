const express = require("express");
const {
  getAvailableBooths,
  getReservedBooths,
  getBoothById,
  getMyBooth,
  updateBooth,
  createBooth,
  deleteBooth,
} = require("../controllers/boothController");

const authenticate = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");

const boothRouter = express.Router();

/**
 * @route   GET /booths
 * @desc    Get all available booths
 * @access  Public
 */
boothRouter.get("/available", getAvailableBooths);

/**
 * @route   GET /booths/reserved
 * @desc    Get all reserved booths
 * @access  Public
 */
boothRouter.get("/reserved", getReservedBooths);

/**
 * @route   GET /booths/my
 * @desc    Get booth assigned to the currently logged-in exhibitor
 * @access  Exhibitor only
 */
boothRouter.get('/my', authenticate, authorizeRole("exhibitor"), getMyBooth);

/**
 * @route   GET /booths/:id
 * @desc    Get booth details by ID
 * @access  Public
 */
boothRouter.get("/:id", getBoothById);

/**
 * @route   PUT /booths/:id/assign
 * @desc    Assign a booth to an exhibitor
 * @access  Admin or Exhibitor
 */
boothRouter.put("/:id", authenticate, authorizeRole("admin", "exhibitor"), updateBooth);

/**
 * @route   POST /booths
 * @desc    Create new booth information
 * @access  Admin only
 */
boothRouter.post("/", authenticate, authorizeRole("admin"), createBooth);

/**
 * @route   DELETE /booths/:id
 * @desc    Delete a booth
 * @access  Admin only
 */
boothRouter.delete("/:id", authenticate, authorizeRole("admin"), deleteBooth);

module.exports = boothRouter;
