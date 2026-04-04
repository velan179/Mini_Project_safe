import Report from '../models/Report.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Create Report
export const createReport = async (req, res, next) => {
  try {
    const { title, description, location, reportType, severity, isAnonymous } = req.body;

    if (!title || !description || !reportType) {
      return errorResponse(res, 400, 'Title, description, and report type are required');
    }

    const report = new Report({
      userId: isAnonymous ? null : req.user.userId,
      title,
      description,
      location,
      reportType,
      severity,
      isAnonymous: isAnonymous || false,
    });

    await report.save();

    return successResponse(res, 201, 'Report created successfully', report);
  } catch (error) {
    next(error);
  }
};

// Get All Reports
export const getReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { reportType, status, severity } = req.query;

    let query = {};

    if (reportType) query.reportType = reportType;
    if (status) query.status = status;
    if (severity) query.severity = severity;

    const reports = await Report.find(query)
      .populate('userId', 'firstName lastName -_id')
      .sort({ reportedAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Report.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: 'Reports fetched successfully',
      data: reports,
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

// Get User's Reports
export const getUserReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ userId: req.user.userId })
      .sort({ reportedAt: -1 });

    return successResponse(res, 200, 'User reports fetched successfully', reports);
  } catch (error) {
    next(error);
  }
};

// Get Single Report
export const getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('userId', 'firstName lastName')
      .populate('verifiedBy', 'firstName lastName');

    if (!report) {
      return errorResponse(res, 404, 'Report not found');
    }

    return successResponse(res, 200, 'Report fetched successfully', report);
  } catch (error) {
    next(error);
  }
};

// Update Report
export const updateReport = async (req, res, next) => {
  try {
    const { title, description, severity } = req.body;

    const report = await Report.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
        status: 'pending',
      },
      {
        title,
        description,
        severity,
      },
      { new: true, runValidators: true }
    );

    if (!report) {
      return errorResponse(res, 404, 'Report not found or cannot be updated');
    }

    return successResponse(res, 200, 'Report updated successfully', report);
  } catch (error) {
    next(error);
  }
};

// Update Report Status (Admin only)
export const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'verified', 'resolved', 'rejected'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status');
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status,
        verifiedBy: req.user.userId,
      },
      { new: true }
    );

    if (!report) {
      return errorResponse(res, 404, 'Report not found');
    }

    return successResponse(res, 200, 'Report status updated successfully', report);
  } catch (error) {
    next(error);
  }
};

// Like Report
export const likeReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!report) {
      return errorResponse(res, 404, 'Report not found');
    }

    return successResponse(res, 200, 'Report liked successfully', report);
  } catch (error) {
    next(error);
  }
};

// Delete Report
export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!report) {
      return errorResponse(res, 404, 'Report not found');
    }

    return successResponse(res, 200, 'Report deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Get Report Statistics
export const getReportStats = async (req, res, next) => {
  try {
    const totalReports = await Report.countDocuments();
    const verifiedReports = await Report.countDocuments({ status: 'verified' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    const reportsByType = await Report.aggregate([
      {
        $group: {
          _id: '$reportType',
          count: { $sum: 1 },
          verified: {
            $sum: { $cond: [{ $eq: ['$status', 'verified'] }, 1, 0] },
          },
        },
      },
    ]);

    const topReports = await Report.find()
      .sort({ likes: -1 })
      .limit(5);

    return successResponse(res, 200, 'Report statistics retrieved successfully', {
      totalReports,
      verifiedReports,
      pendingReports,
      reportsByType,
      topReports,
    });
  } catch (error) {
    next(error);
  }
};
