const { Exhibitor } = require("../models/exhibitorModel");
const { Booth } = require("../models/boothModel");
const asyncHandler = require("express-async-handler");

// Controller to retrieve all exhibitors (public)
const getAllExhibitors = asyncHandler(async (req, res) => {
  const { search, category, product } = req.query;

  let filter = {};

  if (search) {
    // Search in name, description, products fields (case insensitive)
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { products: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (product) {
    // Assuming products is an array of strings
    filter.products = product;
  }

  const exhibitors = await Exhibitor.find(filter).sort({ createdAt:-1 });

  res.status(200).json({
    message: "Filtered exhibitors",
    success: true,
    exhibitors,
  });
});

// Controller to retrieve a single exhibitor by ID (public)
const getExhibitorById = asyncHandler(async (req, res) => {
  const exhibitor = await Exhibitor.findById(req.params.id);
  if (!exhibitor) {
    return res.status(404).json({
      message: "Exhibitor not found",
      success: false,
    });
  }
  res.status(200).json({
    message: "Exhibitor fetched successfully",
    success: true,
    key: exhibitor,
  });
});

// Controller to retrieve a single exhibitor by userID (public)
const getExhibitorByUserId = asyncHandler(async (req, res) => {
  const exhibitor = await Exhibitor.findOne({ userId: req.params.userId });

  if (!exhibitor) {
    return res.status(404).json({
      message: "Exhibitor not found",
      success: false,
    });
  }

  res.status(200).json({
    message: "Exhibitor fetched successfully",
    success: true,
    key: exhibitor,
  });
});

// Controller for an exhibitor to create their own profile
const createExhibitorProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      companyName,
      productsOrServices,
      contactInfo,
      logo,
      description,
      documents,
    } = req.body;

    // Check if a profile already exists for this user
    const alreadyExists = await Exhibitor.findOne({ userId });
    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Exhibitor profile already exists",
      });
    }

    // Validate required fields
    if (!companyName || !productsOrServices || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Create the new exhibitor profile
    const newExhibitor = await Exhibitor.create({
      userId,
      companyName,
      productsOrServices,
      contactInfo,
      logo,
      description,
      documents,
    });

    return res.status(201).json({
      message: "Exhibitor profile created",
      success: true,
      exhibitor: newExhibitor,
    });
  } catch (error) {
    console.error("Server error while creating exhibitor profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating exhibitor profile",
    });
  }
});


// Controller for an exhibitor to update their own profile
const updateOwnExhibitorProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const updated = await Exhibitor.findOneAndUpdate({ userId }, req.body, {
    new: true,
  });
  console.log("Authenticated userId:", userId);

  if (!updated) {
    return res.status(404).json({ message: "Exhibitor profile not found" });
  }

  res.status(200).json({
    message: "Exhibitor profile updated",
    success: true,
    exhibitor: updated,
  });
});

// Controller for admin to update any exhibitor profile
const updateExhibitor = asyncHandler(async (req, res) => {
  const updated = await Exhibitor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updated) {
    return res.status(404).json({ message: "Exhibitor not found" });
  }

  res.status(200).json({
    message: "Exhibitor updated",
    success: true,
    exhibitor: updated,
  });
});

// Controller for admin to delete an exhibitor
const deleteExhibitor = asyncHandler(async (req, res) => {
  // Find the exhibitor first
  const exhibitor = await Exhibitor.findById(req.params.id);

  if (!exhibitor) {
    return res.status(404).json({ message: "Exhibitor not found", success: false });
  }

  // Free booths assigned to this exhibitor (match by exhibitor _id)
  await Booth.updateMany(
    { exhibitorId: exhibitor._id },
    { $set: { exhibitorId: null, status: "available" } }
  );

  // Delete the professional profile
  await exhibitor.deleteOne();

  res.status(200).json({
    message: "Exhibitor profile and related booths updated successfully",
    success: true,
  });
});


// Controller to approve an exhibitor application
const approveExhibitor = asyncHandler(async (req, res) => {
  const exhibitor = await Exhibitor.findById(req.params.id);

  if (!exhibitor) {
    return res.status(404).json({ message: "Exhibitor not found" });
  }

  exhibitor.applicationStatus = "approved";
  await exhibitor.save();

  res.status(200).json({
    message: "Exhibitor approved",
    success: true,
    exhibitor,
  });
});

// Controller to reject an exhibitor application
const rejectExhibitor = asyncHandler(async (req, res) => {
  const exhibitor = await Exhibitor.findById(req.params.id);

  if (!exhibitor) {
    return res.status(404).json({ message: "Exhibitor not found" });
  }

  exhibitor.applicationStatus = "rejected";
  await exhibitor.save();

  res.status(200).json({
    message: "Exhibitor rejected",
    success: true,
    exhibitor,
  });
});

module.exports = {
  getAllExhibitors,
  getExhibitorById,
  getExhibitorByUserId,
  createExhibitorProfile,
  updateOwnExhibitorProfile,
  updateExhibitor,
  deleteExhibitor,
  approveExhibitor,
  rejectExhibitor,
};
