const express = require("express");
const {
  getAllExpos,
  getExpoById,
  createExpo,
  updateExpo,
  deleteExpo,
} = require("../controllers/expoController");

const authenticate = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");

const expoRouter = express.Router();

/**
 * @route   GET /expos
 * @desc    Get all expos
 * @access  Public
 */
expoRouter.get("/", getAllExpos);

/**
 * @route   GET /expos/:id
 * @desc    Get a single expo by ID
 * @access  Admin/Organizer only
 */
expoRouter.get("/:id", authenticate, authorizeRole("admin"), getExpoById); 

/**
 * @route   POST /expos
 * @desc    Create a new expo
 * @access  Admin/Organizer only
 */
expoRouter.post("/", authenticate, authorizeRole("admin"), createExpo);

/**
 * @route   PUT /expos/:id
 * @desc    Update an existing expo
 * @access  Admin/Organizer only
 */
expoRouter.put("/:id", authenticate, authorizeRole("admin"), updateExpo);

/**
 * @route   DELETE /expos/:id
 * @desc    Delete an expo
 * @access  Admin/Organizer only
 */
expoRouter.delete("/:id", authenticate, authorizeRole("admin"), deleteExpo);

module.exports = expoRouter;
