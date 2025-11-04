import express from 'express';
import { query, param, validationResult } from 'express-validator';
import Product from '../models/Product';
import { optionalAuth } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = express.Router();

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
router.get('/',
  optionalAuth,
  [
    query('category').optional().isIn(['flowers', 'cakes', 'personalized-gifts', 'plants']),
    query('minPrice').optional().isNumeric().withMessage('Min price must be a number'),
    query('maxPrice').optional().isNumeric().withMessage('Max price must be a number'),
    query('weight').optional().isString(),
    query('occasions').optional().isString(),
    query('dietary').optional().isString(),
    query('sort').optional().isIn(['name', 'price-low', 'price-high', 'rating', 'newest', 'popular']),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('search').optional().isString().trim()
  ],
  asyncHandler(async (req:any, res:any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      category,
      minPrice,
      maxPrice,
      weight,
      occasions,
      dietary,
      sort = 'popular',
      page = 1,
      limit = 20,
      search
    } = req.query;

    // Build filter object
    const filters: any = { isActive: true };

    if (category) {
      filters.category = category;
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice as string);
    }

    if (weight) {
      const weights = (weight as string).split(',');
      filters.weight = { $in: weights };
    }

    if (occasions) {
      const occasionList = (occasions as string).split(',');
      filters.occasions = { $in: occasionList };
    }

    if (dietary) {
      const dietaryFilters = (dietary as string).split(',');
      dietaryFilters.forEach(filter => {
        filters[`dietary.${filter}`] = true;
      });
    }

    // Build sort object
    let sortObj: any = {};
    switch (sort) {
      case 'price-low':
        sortObj = { price: 1 };
        break;
      case 'price-high':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'popular':
      default:
        sortObj = { isFeatured: -1, 'rating.average': -1, sortOrder: 1 };
        break;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let query;
    if (search) {
      query = Product.searchProducts(search as string, filters);
    } else {
      query = Product.find(filters);
    }

    const [products, totalProducts] = await Promise.all([
      query.sort(sortObj).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(totalProducts / limitNum);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        },
        filters: {
          category,
          priceRange: { min: minPrice, max: maxPrice },
          weight,
          occasions,
          dietary,
          sort
        }
      }
    });
  })
);

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured',
  optionalAuth,
  [
    query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20')
  ],
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const products = await Product.findFeatured(limit);

    res.status(200).json({
      success: true,
      data: {
        products
      }
    });
  })
);

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
router.get('/category/:category',
  optionalAuth,
  [
    param('category').isIn(['flowers', 'cakes', 'personalized-gifts', 'plants']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('sort').optional().isIn(['price-low', 'price-high', 'rating', 'newest', 'popular'])
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

    const { category } = req.params;
    const {
      page = 1,
      limit = 20,
      sort = 'popular'
    } = req.query;

    // Build sort object
    let sortObj: any = {};
    switch (sort) {
      case 'price-low':
        sortObj = { price: 1 };
        break;
      case 'price-high':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'popular':
      default:
        sortObj = { isFeatured: -1, 'rating.average': -1, sortOrder: 1 };
        break;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [products, totalProducts] = await Promise.all([
      Product.findByCategory(category).sort(sortObj).skip(skip).limit(limitNum).lean(),
      Product.countDocuments({ category, isActive: true })
    ]);

    const totalPages = Math.ceil(totalProducts / limitNum);

    res.status(200).json({
      success: true,
      data: {
        products,
        category,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  })
);

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id',
  optionalAuth,
  [
    param('id').isMongoId().withMessage('Invalid product ID')
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

    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      throw createError('Product not found', 404);
    }

    if (!product.isActive) {
      throw createError('Product is not available', 404);
    }

    // Get related products from same category
    const relatedProducts = await Product.findByCategory(product.category)
      .limit(6)
      .select('name price images rating category')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        product,
        relatedProducts: relatedProducts.filter(p => p._id.toString() !== product._id.toString())
      }
    });
  })
);

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
router.get('/slug/:slug',
  optionalAuth,
  [
    param('slug').matches(/^[a-z0-9-]+$/).withMessage('Invalid slug format')
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

    const product = await Product.findOne({ 
      'seo.slug': req.params.slug,
      isActive: true 
    }).lean();

    if (!product) {
      throw createError('Product not found', 404);
    }

    // Get related products from same category
    const relatedProducts = await Product.findByCategory(product.category)
      .limit(6)
      .select('name price images rating category seo.slug')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        product,
        relatedProducts: relatedProducts.filter(p => p._id.toString() !== product._id.toString())
      }
    });
  })
);

export default router;
