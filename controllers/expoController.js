const { Expo } = require("../models/expoModel");
const asyncHandler = require("express-async-handler");

// Controller to get all expos
const getAllExpos = asyncHandler(async (req, res) => {
  const expos = await Expo.find().sort({ createdAt:-1 });
  res.status(200).json({
    message: "All expos",
    success: true,
    expos,
  });
});

// Controller to get a single expo by ID
const getExpoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expo = await Expo.findById(id);

  if (!expo) {
    return res.status(404).json({ message: "Expo not found", success: false });
  }

  res.status(200).json({
    message: "Expo fetched successfully",
    success: true,
    expo,
  });
});


// Controller to create a new expo
const createExpo = asyncHandler(async (req, res) => {
  const { title, description, location, date, theme } = req.body;

  if (!title || !location || !date || !theme) {
    return res.status(400).json({ message: "Fill all required fields." });
  }

  const newExpo = await Expo.create({ title, description, location, date, theme });
  res.status(201).json({
    message: "Expo created",
    success: true,
    expo: newExpo,
  });
});

// Controller to update an existing expo by ID
const updateExpo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updated = await Expo.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: "Expo not found" });

  res.status(200).json({
    message: "Expo updated",
    success: true,
    expo: updated,
  });
});

// Controller to delete an expo by ID
const deleteExpo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await Expo.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "Expo not found" });

  res.status(200).json({
    message: "Expo deleted",
    success: true,
  });
});

module.exports = {
  getAllExpos,
  getExpoById,
  createExpo,
  updateExpo,
  deleteExpo,
};
