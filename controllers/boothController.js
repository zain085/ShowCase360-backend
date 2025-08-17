const { Booth } = require("../models/boothModel"); 
const { Exhibitor } = require("../models/exhibitorModel"); 
const asyncHandler = require("express-async-handler");

// Controller to retrieve all available (unassigned) booths
const getAvailableBooths = asyncHandler(async (req, res) => {
  const booths = await Booth.find({ exhibitorId: null }).sort({ createdAt:-1 });
  res.status(200).json({
    message: "Available booths",
    success: true,
    booths,
  });
});

// Controller to retrieve all reserved booths
const getReservedBooths = asyncHandler(async (req, res) => {
  const booths = await Booth.find({ exhibitorId: { $ne: null } }).populate("exhibitorId").sort({ createdAt:-1 });
  res.status(200).json({
    message: "Reserved booths",
    success: true,
    booths,
  });
});

// Controller to retrieve a booth by its ID
const getBoothById = asyncHandler(async (req, res) => {
  const booth = await Booth.findById(req.params.id);
  if (!booth) return res.status(404).json({ message: "Booth not found" });

  res.status(200).json({
    success: true,
    booth,
  });
});

// Controller to get booth assigned to the logged-in exhibitor
const getMyBooth = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find exhibitor profile linked to the logged-in user
  const exhibitor = await Exhibitor.findOne({ userId });

  if (!exhibitor) {
    res.status(404);
    throw new Error("Exhibitor profile not found");
  }

  // Find all booths assigned to this exhibitor
  const booths = await Booth.find({ exhibitorId: exhibitor._id })
    .populate("expoId", "title")
    .populate("exhibitorId", "companyName").sort({ createdAt:-1 });

  if (!booths || booths.length === 0) {
    res.status(404);
    throw new Error("No booths assigned yet");
  }

  res.status(200).json({
    success: true,
    message: "Booths fetched successfully",
    booths,
  });
});



// Controller to create a new booth
const createBooth = asyncHandler(async (req, res) => {
  const { expoId, boothNumber, exhibitorId, location } = req.body;

  if (!expoId || !boothNumber || !location?.trim()) {
    return res.status(400).json({
      message: "Expo ID, Booth Number, and Location are required",
      success: false,
    });
  }

  const booth = await Booth.create({
    expoId,
    boothNumber,
    location,
    exhibitorId: exhibitorId || null,
    status: exhibitorId ? "reserved" : "available",
  });

  res.status(201).json({
    message: "Booth created successfully",
    success: true,
    booth,
  });
});


// Controller to update an existing booth
const updateBooth = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  // Convert empty exhibitorId string to null
  if (updates.exhibitorId === "") {
    updates.exhibitorId = null;
  }

  // Ensure logical consistency
  if ("exhibitorId" in updates) {
    updates.status = updates.exhibitorId ? "reserved" : "available";
  }

  if (updates.status === "available" && updates.exhibitorId) {
    updates.status = "reserved";
  }

  const updated = await Booth.findByIdAndUpdate(id, updates, { new: true });

  if (!updated) return res.status(404).json({ message: "Booth not found" });

  res.status(200).json({
    message: "Booth updated",
    success: true,
    booth: updated,
  });
});



// Controller to delete a booth by its ID
const deleteBooth = asyncHandler(async (req, res) => {
  const deleted = await Booth.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Booth not found" });

  res.status(200).json({
    message: "Booth deleted",
    success: true,
  });
});

module.exports = {
  getAvailableBooths,
  getReservedBooths,
  getBoothById,
  getMyBooth,
  createBooth,
  updateBooth,
  deleteBooth,
};
