import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health - Health check',
      'POST /api/auth/verify-token - Verify Firebase token',
      'GET /api/users/profile - Get user profile',
      'PUT /api/users/profile - Update user profile',
      'GET /api/products - Get products with filters',
      'GET /api/products/:id - Get single product',
      'POST /api/orders - Create new order',
      'GET /api/orders - Get user orders',
      'GET /api/orders/:id - Get single order',
      'PUT /api/orders/:id/status - Update order status',
      'GET /api/categories - Get product categories'
    ]
  });
};
