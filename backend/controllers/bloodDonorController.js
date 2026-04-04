import BloodDonor from '../models/BloodDonor.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Register as Blood Donor
export const registerAsDonor = async (req, res, next) => {
  try {
    const { bloodGroup, city, phone, healthStatus } = req.body;

    if (!bloodGroup || !city || !phone) {
      return errorResponse(res, 400, 'Blood group, city, and phone are required');
    }

    // Check if already registered
    const existingDonor = await BloodDonor.findOne({ userId: req.user.userId });
    if (existingDonor) {
      return errorResponse(res, 400, 'You are already registered as a blood donor');
    }

    const donor = new BloodDonor({
      userId: req.user.userId,
      bloodGroup,
      city,
      phone,
      healthStatus,
    });

    await donor.save();

    // Update user blood group
    await User.findByIdAndUpdate(req.user.userId, { bloodGroup });

    return successResponse(res, 201, 'Registered as blood donor successfully', donor);
  } catch (error) {
    next(error);
  }
};

// Get Donor Profile
export const getDonorProfile = async (req, res, next) => {
  try {
    const donor = await BloodDonor.findOne({ userId: req.user.userId }).populate(
      'userId',
      'firstName lastName email phone'
    );

    if (!donor) {
      return errorResponse(res, 404, 'Donor profile not found');
    }

    return successResponse(res, 200, 'Donor profile fetched successfully', donor);
  } catch (error) {
    next(error);
  }
};

// Search Donors by Blood Group and City
export const searchDonors = async (req, res, next) => {
  try {
    const { bloodGroup, city } = req.query;

    let query = { isAvailable: true };

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    if (city) {
      query.city = new RegExp(city, 'i');
    }

    const donors = await BloodDonor.find(query)
      .populate('userId', 'firstName lastName phone email')
      .sort({ totalDonations: -1 });

    return successResponse(res, 200, 'Donors found successfully', donors);
  } catch (error) {
    next(error);
  }
};

// Get Available Donors (with pagination)
export const getAvailableDonors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const donors = await BloodDonor.find({ isAvailable: true })
      .populate('userId', 'firstName lastName phone email')
      .sort({ totalDonations: -1 })
      .limit(limit)
      .skip(skip);

    const total = await BloodDonor.countDocuments({ isAvailable: true });

    return res.status(200).json({
      success: true,
      message: 'Available donors fetched successfully',
      data: donors,
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

// Update Donor Availability
export const updateDonorAvailability = async (req, res, next) => {
  try {
    const { isAvailable } = req.body;

    const donor = await BloodDonor.findOneAndUpdate(
      { userId: req.user.userId },
      { isAvailable },
      { new: true }
    );

    if (!donor) {
      return errorResponse(res, 404, 'Donor profile not found');
    }

    return successResponse(
      res,
      200,
      `Donor availability updated to ${isAvailable ? 'available' : 'unavailable'}`,
      donor
    );
  } catch (error) {
    next(error);
  }
};

// Record Donation
export const recordDonation = async (req, res, next) => {
  try {
    const { location, units } = req.body;

    const donor = await BloodDonor.findOne({ userId: req.user.userId });

    if (!donor) {
      return errorResponse(res, 404, 'Donor profile not found');
    }

    // Add to donation history
    donor.donationHistory.push({
      date: new Date(),
      location,
      units,
    });

    donor.totalDonations += 1;
    donor.lastDonationDate = new Date();

    // Set next eligible date (3 months after last donation)
    const nextEligible = new Date();
    nextEligible.setMonth(nextEligible.getMonth() + 3);
    donor.nextEligibleDate = nextEligible;

    // Mark unavailable if not enough time has passed
    if (donor.nextEligibleDate > new Date()) {
      donor.isAvailable = false;
    }

    await donor.save();

    return successResponse(res, 200, 'Donation recorded successfully', donor);
  } catch (error) {
    next(error);
  }
};

// Update Donor Profile
export const updateDonorProfile = async (req, res, next) => {
  try {
    const { bloodGroup, city, phone, healthStatus } = req.body;

    const donor = await BloodDonor.findOneAndUpdate(
      { userId: req.user.userId },
      {
        bloodGroup,
        city,
        phone,
        healthStatus,
      },
      { new: true, runValidators: true }
    );

    if (!donor) {
      return errorResponse(res, 404, 'Donor profile not found');
    }

    return successResponse(res, 200, 'Donor profile updated successfully', donor);
  } catch (error) {
    next(error);
  }
};

// Get Donor Statistics
export const getDonorStats = async (req, res, next) => {
  try {
    const totalDonors = await BloodDonor.countDocuments();
    const availableDonors = await BloodDonor.countDocuments({ isAvailable: true });

    const donorsByBloodGroup = await BloodDonor.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 },
          available: {
            $sum: { $cond: ['$isAvailable', 1, 0] },
          },
        },
      },
    ]);

    const topCities = await BloodDonor.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return successResponse(res, 200, 'Donor statistics retrieved successfully', {
      totalDonors,
      availableDonors,
      donorsByBloodGroup,
      topCities,
    });
  } catch (error) {
    next(error);
  }
};
