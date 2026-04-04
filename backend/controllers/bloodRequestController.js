import BloodRequest from '../models/BloodRequest.js';
import BloodDonor from '../models/BloodDonor.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Create Blood Request
export const createBloodRequest = async (req, res, next) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsNeeded,
      hospital,
      location,
      phone,
      urgency,
      reason,
      neededBy,
    } = req.body;

    if (!patientName || !bloodGroup || !unitsNeeded || !hospital) {
      return errorResponse(res, 400, 'All required fields must be provided');
    }

    const bloodRequest = new BloodRequest({
      userId: req.user.userId,
      patientName,
      bloodGroup,
      unitsNeeded,
      hospital,
      location,
      phone,
      urgency,
      reason,
      neededBy,
    });

    await bloodRequest.save();

    // Notify nearby donors (optional: implement notification system)
    // This could use websockets or push notifications

    return successResponse(res, 201, 'Blood request created successfully', bloodRequest);
  } catch (error) {
    next(error);
  }
};

// Get All Blood Requests
export const getBloodRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, bloodGroup, urgency } = req.query;

    let query = {};

    if (status) query.status = status;
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (urgency) query.urgency = urgency;

    const requests = await BloodRequest.find(query)
      .populate('userId', 'firstName lastName phone')
      .sort({ requestDate: -1 })
      .limit(limit)
      .skip(skip);

    const total = await BloodRequest.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Blood requests fetched successfully',
      data: requests,
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

// Get User's Blood Requests
export const getUserBloodRequests = async (req, res, next) => {
  try {
    const requests = await BloodRequest.find({ userId: req.user.userId })
      .populate('userId', 'firstName lastName phone')
      .sort({ requestDate: -1 });

    return successResponse(res, 200, 'User blood requests fetched successfully', requests);
  } catch (error) {
    next(error);
  }
};

// Get Single Blood Request
export const getBloodRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('userId', 'firstName lastName phone')
      .populate('responses.donorId', 'firstName lastName phone');

    if (!request) {
      return errorResponse(res, 404, 'Blood request not found');
    }

    return successResponse(res, 200, 'Blood request fetched successfully', request);
  } catch (error) {
    next(error);
  }
};

// Update Blood Request
export const updateBloodRequest = async (req, res, next) => {
  try {
    const { patientName, bloodGroup, unitsNeeded, hospital, urgency, reason } =
      req.body;

    const request = await BloodRequest.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
        status: 'pending',
      },
      {
        patientName,
        bloodGroup,
        unitsNeeded,
        hospital,
        urgency,
        reason,
      },
      { new: true, runValidators: true }
    );

    if (!request) {
      return errorResponse(res, 404, 'Blood request not found or cannot be updated');
    }

    return successResponse(res, 200, 'Blood request updated successfully', request);
  } catch (error) {
    next(error);
  }
};

// Respond to Blood Request
export const respondToBloodRequest = async (req, res, next) => {
  try {
    const { units, status } = req.body; // status: 'accepted' or 'declined'

    if (!['accepted', 'declined'].includes(status)) {
      return errorResponse(res, 400, 'Invalid response status');
    }

    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return errorResponse(res, 404, 'Blood request not found');
    }

    // Add response
    request.responses.push({
      donorId: req.user.userId,
      units: status === 'accepted' ? units : 0,
      responseDate: new Date(),
      status,
    });

    // Update total units received if accepted
    if (status === 'accepted') {
      request.totalUnitsReceived += units;
    }

    // Update status if all units received
    if (request.totalUnitsReceived >= request.unitsNeeded) {
      request.status = 'fulfilled';
    }

    await request.save();

    return successResponse(res, 200, 'Response to blood request recorded', request);
  } catch (error) {
    next(error);
  }
};

// Update Blood Request Status
export const updateBloodRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'fulfilled', 'cancelled', 'expired'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status');
    }

    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return errorResponse(res, 404, 'Blood request not found');
    }

    return successResponse(res, 200, 'Blood request status updated successfully', request);
  } catch (error) {
    next(error);
  }
};

// Delete Blood Request
export const deleteBloodRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
      status: 'pending',
    });

    if (!request) {
      return errorResponse(res, 404, 'Blood request not found or cannot be deleted');
    }

    return successResponse(res, 200, 'Blood request deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Get Matching Donors
export const getMatchingDonors = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return errorResponse(res, 404, 'Blood request not found');
    }

    const donors = await BloodDonor.find({
      bloodGroup: request.bloodGroup,
      isAvailable: true,
    })
      .populate('userId', 'firstName lastName phone email')
      .sort({ totalDonations: -1 });

    return successResponse(res, 200, 'Matching donors found', donors);
  } catch (error) {
    next(error);
  }
};

// Get Blood Request Statistics
export const getBloodRequestStats = async (req, res, next) => {
  try {
    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({ status: 'pending' });
    const fulfilledRequests = await BloodRequest.countDocuments({ status: 'fulfilled' });

    const requestsByBloodGroup = await BloodRequest.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
        },
      },
    ]);

    const requestsByUrgency = await BloodRequest.aggregate([
      {
        $group: {
          _id: '$urgency',
          count: { $sum: 1 },
        },
      },
    ]);

    return successResponse(res, 200, 'Blood request statistics retrieved successfully', {
      totalRequests,
      pendingRequests,
      fulfilledRequests,
      requestsByBloodGroup,
      requestsByUrgency,
    });
  } catch (error) {
    next(error);
  }
};
