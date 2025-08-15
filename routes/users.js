import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);


router.get('/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  res.json({
    success: true,
    data: user
  });
}));

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', [
  body('fullname')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('profileImageUrl')
    .optional()
    .isURL()
    .withMessage('Profile image URL must be a valid URL')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }

  const { fullname, email, profileImageUrl } = req.body;

  // Check if email is being updated and if it's already taken
  if (email && email !== req.user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken'
      });
    }
  }

  // Update user
  const user = await User.findById(req.user.id);
  
  if (fullname) user.fullname = fullname;
  if (email) user.email = email;
  if (profileImageUrl !== undefined) user.profileImageUrl = profileImageUrl;

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      profileImageUrl: user.profileImageUrl
    }
  });
}));

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
router.delete('/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Delete user (this will also delete associated todos due to cascade)
  await user.deleteOne();

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
}));

export { router };
