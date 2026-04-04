import Evidence from '../models/Evidence.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import fs from 'fs';
import path from 'path';

// Upload Evidence
export const uploadEvidence = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'No file uploaded');
    }

    const { type, description, location, tags, isPublic } = req.body;

    const evidence = new Evidence({
      userId: req.user.userId,
      type,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      location: location ? JSON.parse(location) : {},
      description,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
      isPublic: isPublic === 'true',
    });

    await evidence.save();

    return successResponse(res, 201, 'Evidence uploaded successfully', evidence);
  } catch (error) {
    // Delete file if evidence save fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// Get User's Evidence
export const getUserEvidence = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const evidence = await Evidence.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Evidence.countDocuments({ userId: req.user.userId });

    return res.status(200).json({
      success: true,
      message: 'Evidence fetched successfully',
      data: evidence,
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

// Get Single Evidence
export const getEvidence = async (req, res, next) => {
  try {
    const evidence = await Evidence.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!evidence) {
      return errorResponse(res, 404, 'Evidence not found');
    }

    return successResponse(res, 200, 'Evidence fetched successfully', evidence);
  } catch (error) {
    next(error);
  }
};

// Delete Evidence
export const deleteEvidence = async (req, res, next) => {
  try {
    const evidence = await Evidence.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!evidence) {
      return errorResponse(res, 404, 'Evidence not found');
    }

    // Delete file from storage
    if (evidence.filePath && fs.existsSync(evidence.filePath)) {
      fs.unlinkSync(evidence.filePath);
    }

    return successResponse(res, 200, 'Evidence deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Update Evidence Status (for admin/verification)
export const updateEvidenceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status');
    }

    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!evidence) {
      return errorResponse(res, 404, 'Evidence not found');
    }

    return successResponse(res, 200, 'Evidence status updated successfully', evidence);
  } catch (error) {
    next(error);
  }
};

// Get Public Evidence (for map/feed)
export const getPublicEvidence = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const evidence = await Evidence.find({
      isPublic: true,
      status: 'verified',
    })
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Evidence.countDocuments({
      isPublic: true,
      status: 'verified',
    });

    return res.status(200).json({
      success: true,
      message: 'Public evidence fetched successfully',
      data: evidence,
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
