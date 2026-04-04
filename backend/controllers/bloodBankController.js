import BloodBank from '../models/BloodBank.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Create Blood Bank (Admin only)
export const createBloodBank = async (req, res, next) => {
  try {
    const {
      name,
      city,
      location,
      phone,
      email,
      website,
      operatingHours,
      inventory,
      services,
    } = req.body;

    if (!name || !city || !phone) {
      return errorResponse(res, 400, 'Name, city, and phone are required');
    }

    const bloodBank = new BloodBank({
      name,
      city,
      location,
      phone,
      email,
      website,
      operatingHours,
      inventory,
      services,
    });

    await bloodBank.save();

    return successResponse(res, 201, 'Blood bank created successfully', bloodBank);
  } catch (error) {
    next(error);
  }
};

// Get All Blood Banks
export const getAllBloodBanks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bloodBanks = await BloodBank.find({ isActive: true })
      .limit(limit)
      .skip(skip)
      .sort({ rating: -1 });

    const total = await BloodBank.countDocuments({ isActive: true });

    return res.status(200).json({
      success: true,
      message: 'Blood banks fetched successfully',
      data: bloodBanks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Search Blood Banks by City
export const searchBloodBanksByCity = async (req, res, next) => {
  try {
    const { city, bloodGroup } = req.query;

    let query = { isActive: true };

    if (city) {
      query.city = new RegExp(city, 'i');
    }

    let bloodBanks = await BloodBank.find(query).sort({ rating: -1 });

    // Filter by blood group if specified
    if (bloodGroup) {
      bloodBanks = bloodBanks.filter((bank) =>
        bank.inventory.some((inv) => inv.bloodGroup === bloodGroup && inv.units > 0)
      );
    }

    return successResponse(res, 200, 'Blood banks found successfully', bloodBanks);
  } catch (error) {
    next(error);
  }
};

// Get Single Blood Bank
export const getBloodBank = async (req, res, next) => {
  try {
    const bloodBank = await BloodBank.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!bloodBank) {
      return errorResponse(res, 404, 'Blood bank not found');
    }

    return successResponse(res, 200, 'Blood bank fetched successfully', bloodBank);
  } catch (error) {
    next(error);
  }
};

// Update Blood Bank
export const updateBloodBank = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      website,
      operatingHours,
      inventory,
      services,
      location,
    } = req.body;

    const bloodBank = await BloodBank.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
        email,
        website,
        operatingHours,
        inventory,
        services,
        location,
      },
      { new: true, runValidators: true }
    );

    if (!bloodBank) {
      return errorResponse(res, 404, 'Blood bank not found');
    }

    return successResponse(res, 200, 'Blood bank updated successfully', bloodBank);
  } catch (error) {
    next(error);
  }
};

// Update Blood Bank Inventory
export const updateInventory = async (req, res, next) => {
  try {
    const { bloodGroup, units } = req.body;

    if (!bloodGroup || units === undefined) {
      return errorResponse(res, 400, 'Blood group and units are required');
    }

    const bloodBank = await BloodBank.findById(req.params.id);

    if (!bloodBank) {
      return errorResponse(res, 404, 'Blood bank not found');
    }

    // Find and update inventory item
    const inventoryIndex = bloodBank.inventory.findIndex(
      (inv) => inv.bloodGroup === bloodGroup
    );

    if (inventoryIndex !== -1) {
      bloodBank.inventory[inventoryIndex].units = units;
      bloodBank.inventory[inventoryIndex].lastUpdated = new Date();
    } else {
      bloodBank.inventory.push({
        bloodGroup,
        units,
        lastUpdated: new Date(),
      });
    }

    await bloodBank.save();

    return successResponse(res, 200, 'Inventory updated successfully', bloodBank);
  } catch (error) {
    next(error);
  }
};

// Add Review
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return errorResponse(res, 400, 'Rating must be between 1 and 5');
    }

    const bloodBank = await BloodBank.findById(req.params.id);

    if (!bloodBank) {
      return errorResponse(res, 404, 'Blood bank not found');
    }

    bloodBank.reviews.push({
      userId: req.user.userId,
      rating,
      comment,
      date: new Date(),
    });

    // Update overall rating
    const avgRating =
      bloodBank.reviews.reduce((sum, review) => sum + review.rating, 0) /
      bloodBank.reviews.length;
    bloodBank.rating = avgRating;

    await bloodBank.save();

    return successResponse(res, 201, 'Review added successfully', bloodBank);
  } catch (error) {
    next(error);
  }
};

// Delete Blood Bank (Deactivate)
export const deleteBloodBank = async (req, res, next) => {
  try {
    const bloodBank = await BloodBank.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!bloodBank) {
      return errorResponse(res, 404, 'Blood bank not found');
    }

    return successResponse(res, 200, 'Blood bank deleted successfully');
  } catch (error) {
    next(error);
  }
};
