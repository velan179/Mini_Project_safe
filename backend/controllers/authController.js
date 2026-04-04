import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Register User
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, bloodGroup } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return errorResponse(res, 400, 'User already exists with this email or phone');
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      bloodGroup,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password)
    const userObj = user.toObject();
    delete userObj.password;

    return successResponse(res, 201, 'User registered successfully', {
      user: userObj,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Login User
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide email and password');
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password)
    const userObj = user.toObject();
    delete userObj.password;

    return successResponse(res, 200, 'Login successful', {
      user: userObj,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Get Current User
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, 'User found', user);
  } catch (error) {
    next(error);
  }
};

// Update User Profile
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, location, bloodGroup, emergencyNumber } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        firstName,
        lastName,
        phone,
        location,
        bloodGroup,
        emergencyNumber,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, 'Profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};

// Change Password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId).select('+password');

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Verify current password
    const isPasswordMatch = await user.comparePassword(currentPassword);

    if (!isPasswordMatch) {
      return errorResponse(res, 401, 'Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return successResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
