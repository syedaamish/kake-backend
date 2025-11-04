import express from 'express';
import { body, validationResult } from 'express-validator';
import { FirebaseAuthService } from '../config/firebase';
import User from '../models/User';
import { authenticateFirebaseToken } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// @desc    Verify Firebase ID token and get/create user
// @route   POST /api/auth/verify-token
// @access  Public
router.post('/verify-token', 
  [
    body('idToken').notEmpty().withMessage('ID token is required'),
    body('userData').optional().isObject().withMessage('User data must be an object')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { idToken, userData } = req.body;

    // Verify Firebase token
    const verificationResult = await FirebaseAuthService.verifyIdToken(idToken);
    
    if (!verificationResult.success) {
      return res.status(401).json({
        success: false,
        message: verificationResult.error || 'Token verification failed'
      });
    }

    const { uid, phoneNumber, email } = verificationResult;

    // Find existing user or create new one
    let user = await User.findOne({ firebaseUID: uid });
    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      user = new User({
        firebaseUID: uid,
        phone: phoneNumber?.replace('+91', '') || '',
        email: email,
        lastLoginAt: new Date(),
        ...userData // Include any additional user data from frontend
      });
      await user.save();
    } else {
      // Update existing user
      user.lastLoginAt = new Date();
      if (userData) {
        Object.assign(user, userData);
      }
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: isNewUser ? 'User created successfully' : 'User authenticated successfully',
      data: {
        user: {
          id: user._id,
          firebaseUID: user.firebaseUID,
          phone: user.phone,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          addresses: user.addresses,
          preferences: user.preferences,
          loyaltyPoints: user.loyaltyPoints,
          isNewUser
        }
      }
    });
  })
);

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', 
  authenticateFirebaseToken,
  asyncHandler(async (req, res) => {
    if (!req.user?.userData) {
      throw createError('User not found', 404);
    }

    const user = req.user.userData;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firebaseUID: user.firebaseUID,
          phone: user.phone,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          addresses: user.addresses,
          preferences: user.preferences,
          loyaltyPoints: user.loyaltyPoints,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt
        }
      }
    });
  })
);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile',
  authenticateFirebaseToken,
  [
    body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('dateOfBirth').optional().isISO8601().withMessage('Please provide a valid date'),
    body('preferences.notifications').optional().isBoolean(),
    body('preferences.marketing').optional().isBoolean(),
    body('preferences.language').optional().isIn(['en', 'hi']).withMessage('Language must be en or hi')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!req.user?.userData) {
      throw createError('User not found', 404);
    }

    const user = req.user.userData;
    const updateData = req.body;

    // Update user fields
    Object.keys(updateData).forEach(key => {
      if (key === 'preferences' && typeof updateData[key] === 'object') {
        user.preferences = { ...user.preferences, ...updateData[key] };
      } else {
        user[key] = updateData[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          firebaseUID: user.firebaseUID,
          phone: user.phone,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          addresses: user.addresses,
          preferences: user.preferences,
          loyaltyPoints: user.loyaltyPoints
        }
      }
    });
  })
);

// @desc    Add user address
// @route   POST /api/auth/addresses
// @access  Private
router.post('/addresses',
  authenticateFirebaseToken,
  [
    body('type').isIn(['home', 'work', 'other']).withMessage('Address type must be home, work, or other'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid Indian phone number'),
    body('street').trim().notEmpty().withMessage('Street address is required'),
    body('houseNumber').trim().notEmpty().withMessage('House number is required'),
    body('pincode').matches(/^\d{6}$/).withMessage('Please provide a valid 6-digit pincode'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('isDefault').optional().isBoolean()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!req.user?.userData) {
      throw createError('User not found', 404);
    }

    const user = req.user.userData;
    await user.addAddress(req.body);

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: {
        addresses: user.addresses
      }
    });
  })
);

// @desc    Update user address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
router.put('/addresses/:addressId',
  authenticateFirebaseToken,
  [
    body('type').optional().isIn(['home', 'work', 'other']),
    body('name').optional().trim().notEmpty(),
    body('phone').optional().matches(/^[6-9]\d{9}$/),
    body('street').optional().trim().notEmpty(),
    body('houseNumber').optional().trim().notEmpty(),
    body('pincode').optional().matches(/^\d{6}$/),
    body('city').optional().trim().notEmpty(),
    body('state').optional().trim().notEmpty(),
    body('isDefault').optional().isBoolean()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!req.user?.userData) {
      throw createError('User not found', 404);
    }

    const user = req.user.userData;
    const { addressId } = req.params;

    try {
      await user.updateAddress(addressId, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        data: {
          addresses: user.addresses
        }
      });
    } catch (error: any) {
      throw createError(error.message, 404);
    }
  })
);

// @desc    Delete user address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
router.delete('/addresses/:addressId',
  authenticateFirebaseToken,
  asyncHandler(async (req, res) => {
    if (!req.user?.userData) {
      throw createError('User not found', 404);
    }

    const user = req.user.userData;
    const { addressId } = req.params;

    try {
      await user.removeAddress(addressId);
      
      res.status(200).json({
        success: true,
        message: 'Address deleted successfully',
        data: {
          addresses: user.addresses
        }
      });
    } catch (error: any) {
      throw createError(error.message, 404);
    }
  })
);

export default router;
