import Alert from '../models/Alert.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Get All Alerts
export const getAlerts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { type, status, severity } = req.query;

    let query = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (severity) query.severity = severity;

    const alerts = await Alert.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Alert.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Alerts fetched successfully',
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

// Create Alert (Admin only)
export const createAlert = async (req, res, next) => {
  try {
    const { title, description, location, severity, type } = req.body;

    if (!title || !type) {
      return errorResponse(res, 400, 'Title and type are required');
    }

    const alert = new Alert({
      title,
      description,
      location,
      severity,
      type,
      createdBy: req.user.userId,
    });

    await alert.save();

    return successResponse(res, 201, 'Alert created successfully', alert);
  } catch (error) {
    next(error);
  }
};

// Get Single Alert
export const getAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id).populate(
      'createdBy',
      'firstName lastName email'
    );

    if (!alert) {
      return errorResponse(res, 404, 'Alert not found');
    }

    return successResponse(res, 200, 'Alert fetched successfully', alert);
  } catch (error) {
    next(error);
  }
};

// Update Alert
export const updateAlert = async (req, res, next) => {
  try {
    const { title, description, status, severity } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
        severity,
      },
      { new: true, runValidators: true }
    );

    if (!alert) {
      return errorResponse(res, 404, 'Alert not found');
    }

    return successResponse(res, 200, 'Alert updated successfully', alert);
  } catch (error) {
    next(error);
  }
};

// Delete Alert
export const deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return errorResponse(res, 404, 'Alert not found');
    }

    return successResponse(res, 200, 'Alert deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Get Active Alerts
export const getActiveAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({ status: 'active' })
      .populate('createdBy', 'firstName lastName')
      .sort({ timestamp: -1 });

    return successResponse(res, 200, 'Active alerts fetched successfully', alerts);
  } catch (error) {
    next(error);
  }
};
