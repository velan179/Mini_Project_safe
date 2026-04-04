import SOSAlert from '../models/SOSAlert.js';
import TrustedContact from '../models/TrustedContact.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Create SOS Alert
export const createSOSAlert = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      alertType,
      severity,
      photoUrl,
      audioUrl,
      videoUrl,
      notifyContacts,
    } = req.body;

    if (!title || !alertType) {
      return errorResponse(res, 400, 'Title and alert type are required');
    }

    const alert = new SOSAlert({
      userId: req.user.userId,
      title,
      description,
      location,
      alertType,
      severity,
      photoUrl,
      audioUrl,
      videoUrl,
    });

    // If notifyContacts is true, add trusted contacts
    if (notifyContacts) {
      const trustedContacts = await TrustedContact.find({
        userId: req.user.userId,
        isActive: true,
      });

      alert.contacts = trustedContacts.map((contact) => ({
        contactId: contact._id,
        name: contact.name,
        phone: contact.phone,
        notifiedAt: new Date(),
        status: 'pending',
      }));
    }

    await alert.save();

    return successResponse(res, 201, 'SOS alert created successfully', alert);
  } catch (error) {
    next(error);
  }
};

// Get All SOS Alerts (with filters)
export const getSOSAlerts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, severity, alertType } = req.query;

    let query = {};

    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (alertType) query.alertType = alertType;

    const alerts = await SOSAlert.find(query)
      .populate('userId', 'firstName lastName phone email')
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);

    const total = await SOSAlert.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'SOS alerts fetched successfully',
      data: alerts,
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

// Get User's SOS Alerts
export const getUserSOSAlerts = async (req, res, next) => {
  try {
    const alerts = await SOSAlert.find({ userId: req.user.userId })
      .sort({ timestamp: -1 });

    return successResponse(res, 200, 'User SOS alerts fetched successfully', alerts);
  } catch (error) {
    next(error);
  }
};

// Get Single SOS Alert
export const getSOSAlert = async (req, res, next) => {
  try {
    const alert = await SOSAlert.findById(req.params.id)
      .populate('userId', 'firstName lastName phone email')
      .populate('contacts.contactId', 'name phone');

    if (!alert) {
      return errorResponse(res, 404, 'SOS alert not found');
    }

    return successResponse(res, 200, 'SOS alert fetched successfully', alert);
  } catch (error) {
    next(error);
  }
};

// Update SOS Alert Status
export const updateSOSAlertStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['active', 'resolved', 'cancelled'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status');
    }

    const alert = await SOSAlert.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!alert) {
      return errorResponse(res, 404, 'SOS alert not found');
    }

    return successResponse(res, 200, 'SOS alert status updated successfully', alert);
  } catch (error) {
    next(error);
  }
};

// Add Respondent
export const addRespondent = async (req, res, next) => {
  try {
    const alert = await SOSAlert.findById(req.params.id);

    if (!alert) {
      return errorResponse(res, 404, 'SOS alert not found');
    }

    alert.respondents.push({
      userId: req.user.userId,
      respondedAt: new Date(),
      action: req.body.action || 'assistance-offered',
    });

    await alert.save();

    return successResponse(res, 200, 'Respondent added successfully', alert);
  } catch (error) {
    next(error);
  }
};

// Get Nearby Alerts (by location)
export const getNearbyAlerts = async (req, res, next) => {
  try {
    const { latitude, longitude, maxDistance } = req.query;

    if (!latitude || !longitude) {
      return errorResponse(res, 400, 'Latitude and longitude are required');
    }

    const distance = parseInt(maxDistance) || 5000; // 5km default

    const alerts = await SOSAlert.find({
      $and: [
        {
          'location.latitude': {
            $gte: latitude - 0.045,
            $lte: latitude + 0.045,
          },
        },
        {
          'location.longitude': {
            $gte: longitude - 0.045,
            $lte: longitude + 0.045,
          },
        },
      ],
    }).populate('userId', 'firstName lastName phone email');

    return successResponse(res, 200, 'Nearby alerts found', alerts);
  } catch (error) {
    next(error);
  }
};

// Delete SOS Alert
export const deleteSOSAlert = async (req, res, next) => {
  try {
    const alert = await SOSAlert.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!alert) {
      return errorResponse(res, 404, 'SOS alert not found');
    }

    return successResponse(res, 200, 'SOS alert deleted successfully');
  } catch (error) {
    next(error);
  }
};
