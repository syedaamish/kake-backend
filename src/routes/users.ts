import express from 'express';
import { authenticateFirebaseToken, requireUser } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// All user routes require authentication
router.use(authenticateFirebaseToken);
router.use(requireUser);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', 
  asyncHandler(async (req, res) => {
    const user = req.user!.userData;

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

// @desc    Get user loyalty points
// @route   GET /api/users/loyalty-points
// @access  Private
router.get('/loyalty-points',
  asyncHandler(async (req, res) => {
    const user = req.user!.userData;

    res.status(200).json({
      success: true,
      data: {
        loyaltyPoints: user.loyaltyPoints,
        pointsHistory: [] // TODO: Implement points history tracking
      }
    });
  })
);

export default router;
