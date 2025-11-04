import { Request, Response, NextFunction } from 'express';
import { FirebaseAuthService } from '../config/firebase';
import User from '../models/User';

// Extend Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        phoneNumber?: string;
        email?: string;
        userData?: any;
      };
    }
  }
}

export const authenticateFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please include Bearer token in Authorization header.'
      });
    }

    const idToken = authHeader.split(' ')[1];
    
    if (!idToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format.'
      });
    }

    // Verify Firebase ID token
    const verificationResult = await FirebaseAuthService.verifyIdToken(idToken);
    
    if (!verificationResult.success) {
      return res.status(401).json({
        success: false,
        message: verificationResult.error || 'Token verification failed.'
      });
    }

    // Find or create user in MongoDB
    let user = await User.findOne({ firebaseUID: verificationResult.uid });
    
    if (!user && verificationResult.phoneNumber) {
      // Create new user if doesn't exist
      user = new User({
        firebaseUID: verificationResult.uid,
        phone: verificationResult.phoneNumber.replace('+91', ''),
        email: verificationResult.email,
        lastLoginAt: new Date()
      });
      await user.save();
    } else if (user) {
      // Update last login time
      user.lastLoginAt = new Date();
      await user.save();
    }

    // Attach user data to request
    req.user = {
      uid: verificationResult.uid,
      phoneNumber: verificationResult.phoneNumber,
      email: verificationResult.email,
      userData: user
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const idToken = authHeader.split(' ')[1];
    
    if (!idToken) {
      return next(); // Continue without authentication
    }

    // Try to verify token, but don't fail if invalid
    const verificationResult = await FirebaseAuthService.verifyIdToken(idToken);
    
    if (verificationResult.success) {
      const user = await User.findOne({ firebaseUID: verificationResult.uid });
      
      req.user = {
        uid: verificationResult.uid,
        phoneNumber: verificationResult.phoneNumber,
        email: verificationResult.email,
        userData: user
      };
    }

    next();
  } catch (error) {
    // Log error but continue without authentication
    console.error('Optional authentication error:', error);
    next();
  }
};

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.userData) {
    return res.status(401).json({
      success: false,
      message: 'User account not found. Please complete registration.'
    });
  }
  next();
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Check if user has admin custom claims
    const firebaseUser = await FirebaseAuthService.getUserByUID(req.user.uid);
    
    if (!firebaseUser.success || !firebaseUser.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    // In a real app, you'd check custom claims or role in database
    // For now, we'll check if user email is in admin list
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    const isAdmin = adminEmails.includes(req.user.email || '');

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking admin permissions.'
    });
  }
};
