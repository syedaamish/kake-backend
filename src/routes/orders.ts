import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Order from '../models/Order';
import Product from '../models/Product';
import { authenticateFirebaseToken, requireUser, requireAdmin } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// All order routes require authentication
router.use(authenticateFirebaseToken);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/',
  requireUser,
  [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.productId').isMongoId().withMessage('Invalid product ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.customization').optional().isObject(),
    body('deliveryAddress.name').trim().notEmpty().withMessage('Delivery name is required'),
    body('deliveryAddress.phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone number required'),
    body('deliveryAddress.street').trim().notEmpty().withMessage('Street address is required'),
    body('deliveryAddress.houseNumber').trim().notEmpty().withMessage('House number is required'),
    body('deliveryAddress.pincode').matches(/^\d{6}$/).withMessage('Valid 6-digit pincode required'),
    body('deliveryAddress.city').trim().notEmpty().withMessage('City is required'),
    body('deliveryAddress.state').trim().notEmpty().withMessage('State is required'),
    body('paymentMethod').isIn(['cod', 'online', 'wallet']).withMessage('Invalid payment method'),
    body('deliveryDetails.type').optional().isIn(['standard', 'express', 'scheduled']),
    body('deliveryDetails.scheduledDate').optional().isISO8601(),
    body('deliveryDetails.scheduledTime').optional().isString(),
    body('notes').optional().isString().isLength({ max: 500 })
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

    const user = req.user!.userData;
    const { items, deliveryAddress, paymentMethod, deliveryDetails, notes } = req.body;

    // Validate and calculate order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        throw createError(`Product ${item.productId} not found or unavailable`, 400);
      }

      if (!product.availability.inStock && !product.availability.preOrderDays) {
        throw createError(`Product ${product.name} is out of stock`, 400);
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        weight: product.weight,
        customization: item.customization || {},
        subtotal: itemSubtotal
      });

      // Update product stock if not pre-order
      if (product.availability.inStock && product.availability.quantity > 0) {
        await Product.findByIdAndUpdate(product._id, {
          $inc: { 'availability.quantity': -item.quantity }
        });
      }
    }

    // Calculate delivery fee and total
    const deliveryFee = subtotal >= 999 ? 0 : 49;
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + deliveryFee + tax;

    // Calculate estimated delivery time
    const now = new Date();
    let estimatedDelivery = new Date(now);
    
    if (deliveryDetails?.type === 'express') {
      estimatedDelivery.setHours(now.getHours() + 2);
    } else if (deliveryDetails?.type === 'scheduled' && deliveryDetails.scheduledDate) {
      estimatedDelivery = new Date(deliveryDetails.scheduledDate);
    } else {
      estimatedDelivery.setDate(now.getDate() + 1);
      estimatedDelivery.setHours(18, 0, 0, 0);
    }

    // Calculate loyalty points earned (1 point per ₹100)
    const loyaltyPointsEarned = Math.floor(total / 100);

    // Create order
    const order = new Order({
      userId: user._id,
      firebaseUID: user.firebaseUID,
      items: orderItems,
      deliveryAddress,
      orderSummary: {
        subtotal,
        deliveryFee,
        tax,
        discount: 0,
        total
      },
      paymentMethod,
      deliveryDetails: {
        type: deliveryDetails?.type || 'standard',
        scheduledDate: deliveryDetails?.scheduledDate,
        scheduledTime: deliveryDetails?.scheduledTime,
        estimatedDelivery,
        deliveryInstructions: deliveryDetails?.deliveryInstructions
      },
      notes,
      loyaltyPointsEarned
    });

    await order.save();

    // Update user loyalty points
    user.loyaltyPoints += loyaltyPointsEarned;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          orderId: order.orderId,
          _id: order._id,
          status: order.status,
          paymentStatus: order.paymentStatus,
          items: order.items,
          deliveryAddress: order.deliveryAddress,
          orderSummary: order.orderSummary,
          deliveryDetails: order.deliveryDetails,
          timeline: order.timeline,
          loyaltyPointsEarned: order.loyaltyPointsEarned,
          createdAt: order.createdAt
        }
      }
    });
  })
);

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get('/',
  requireUser,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('status').optional().isIn(['pending', 'confirmed', 'preparing', 'baking', 'ready', 'out-for-delivery', 'delivered', 'cancelled'])
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

    const user = req.user!.userData;
    const {
      page = 1,
      limit = 20,
      status
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = { userId: user._id };
    if (status) {
      filter.status = status;
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .populate('items.productId', 'name images category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalOrders / limitNum);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalOrders,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  })
);

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id',
  requireUser,
  [
    param('id').isMongoId().withMessage('Invalid order ID')
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

    const user = req.user!.userData;
    const order = await Order.findOne({
      _id: req.params.id,
      userId: user._id
    }).populate('items.productId', 'name images category').lean();

    if (!order) {
      throw createError('Order not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        order
      }
    });
  })
);

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel',
  requireUser,
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('reason').optional().isString().isLength({ max: 500 }).withMessage('Reason must be less than 500 characters')
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

    const user = req.user!.userData;
    const order = await Order.findOne({
      _id: req.params.id,
      userId: user._id
    });

    if (!order) {
      throw createError('Order not found', 404);
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      throw createError('Order cannot be cancelled at this stage', 400);
    }

    order.status = 'cancelled';
    order.cancellationReason = req.body.reason || 'Cancelled by customer';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        await Product.findByIdAndUpdate(product._id, {
          $inc: { 'availability.quantity': item.quantity }
        });
      }
    }

    // Deduct loyalty points if they were awarded
    if (order.loyaltyPointsEarned > 0) {
      user.loyaltyPoints = Math.max(0, user.loyaltyPoints - order.loyaltyPointsEarned);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        order: {
          orderId: order.orderId,
          status: order.status,
          cancellationReason: order.cancellationReason,
          timeline: order.timeline
        }
      }
    });
  })
);

// @desc    Rate order
// @route   PUT /api/orders/:id/rating
// @access  Private
router.put('/:id/rating',
  requireUser,
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('overall').isInt({ min: 1, max: 5 }).withMessage('Overall rating must be between 1 and 5'),
    body('food').isInt({ min: 1, max: 5 }).withMessage('Food rating must be between 1 and 5'),
    body('delivery').isInt({ min: 1, max: 5 }).withMessage('Delivery rating must be between 1 and 5'),
    body('comment').optional().isString().isLength({ max: 1000 }).withMessage('Comment must be less than 1000 characters')
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

    const user = req.user!.userData;
    const order = await Order.findOne({
      _id: req.params.id,
      userId: user._id
    });

    if (!order) {
      throw createError('Order not found', 404);
    }

    if (order.status !== 'delivered') {
      throw createError('Can only rate delivered orders', 400);
    }

    if (order.rating) {
      throw createError('Order already rated', 400);
    }

    const { overall, food, delivery, comment } = req.body;

    const ratingData = {
      overall,
      food,
      delivery,
      comment,
      ratedAt: new Date()
    };

    order.rating = ratingData;
    await order.save();

    // Update product ratings
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        // Update product rating - simplified approach
        const currentRating = product.rating || { average: 0, count: 0 };
        const newCount = currentRating.count + 1;
        const newAverage = ((currentRating.average * currentRating.count) + overall) / newCount;
        
        await Product.findByIdAndUpdate(product._id, {
          'rating.average': Math.round(newAverage * 10) / 10,
          'rating.count': newCount
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: {
        rating: order.rating
      }
    });
  })
);

// Admin routes
// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Admin
router.get('/admin/all',
  requireAdmin,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['pending', 'confirmed', 'preparing', 'baking', 'ready', 'out-for-delivery', 'delivered', 'cancelled']),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601()
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

    const {
      page = 1,
      limit = 50,
      status,
      startDate,
      endDate
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .populate('userId', 'name phone')
        .populate('items.productId', 'name category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalOrders / limitNum);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalOrders,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  })
);

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
router.put('/:id/status',
  requireAdmin,
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('status').isIn(['pending', 'confirmed', 'preparing', 'baking', 'ready', 'out-for-delivery', 'delivered', 'cancelled']),
    body('notes').optional().isString().isLength({ max: 500 })
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

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw createError('Order not found', 404);
    }

    const { status, notes } = req.body;

    order.status = status;
    order.timeline[status] = new Date();
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order: {
          orderId: order.orderId,
          status: order.status,
          timeline: order.timeline,
          notes: order.notes
        }
      }
    });
  })
);

export default router;
