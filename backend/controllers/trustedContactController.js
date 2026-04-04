import TrustedContact from '../models/TrustedContact.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Get All Trusted Contacts for User
export const getTrustedContacts = async (req, res, next) => {
  try {
    const contacts = await TrustedContact.find({
      userId: req.user.userId,
      isActive: true,
    }).sort({ createdAt: -1 });

    return successResponse(res, 200, 'Trusted contacts fetched successfully', contacts);
  } catch (error) {
    next(error);
  }
};

// Add New Trusted Contact
export const addTrustedContact = async (req, res, next) => {
  try {
    const { name, phone, email, relationship, isPrimary } = req.body;

    if (!name || !phone) {
      return errorResponse(res, 400, 'Name and phone are required');
    }

    const contact = new TrustedContact({
      userId: req.user.userId,
      name,
      phone,
      email,
      relationship,
      isPrimary: isPrimary || false,
    });

    await contact.save();

    return successResponse(res, 201, 'Trusted contact added successfully', contact);
  } catch (error) {
    next(error);
  }
};

// Get Single Trusted Contact
export const getTrustedContact = async (req, res, next) => {
  try {
    const contact = await TrustedContact.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!contact) {
      return errorResponse(res, 404, 'Trusted contact not found');
    }

    return successResponse(res, 200, 'Trusted contact fetched successfully', contact);
  } catch (error) {
    next(error);
  }
};

// Update Trusted Contact
export const updateTrustedContact = async (req, res, next) => {
  try {
    const { name, phone, email, relationship, isPrimary } = req.body;

    const contact = await TrustedContact.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      {
        name,
        phone,
        email,
        relationship,
        isPrimary,
      },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return errorResponse(res, 404, 'Trusted contact not found');
    }

    return successResponse(res, 200, 'Trusted contact updated successfully', contact);
  } catch (error) {
    next(error);
  }
};

// Delete Trusted Contact
export const deleteTrustedContact = async (req, res, next) => {
  try {
    const contact = await TrustedContact.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!contact) {
      return errorResponse(res, 404, 'Trusted contact not found');
    }

    return successResponse(res, 200, 'Trusted contact deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Set Primary Contact
export const setPrimaryContact = async (req, res, next) => {
  try {
    // Remove primary status from all other contacts
    await TrustedContact.updateMany(
      { userId: req.user.userId },
      { isPrimary: false }
    );

    // Set selected contact as primary
    const contact = await TrustedContact.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      { isPrimary: true },
      { new: true }
    );

    if (!contact) {
      return errorResponse(res, 404, 'Trusted contact not found');
    }

    return successResponse(res, 200, 'Primary contact set successfully', contact);
  } catch (error) {
    next(error);
  }
};
