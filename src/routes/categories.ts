import express from 'express';
import Category from '../models/Category';
import Product from '../models/Product';
import { optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// @desc    Get all product categories with counts
// @route   GET /api/categories
// @access  Public
router.get('/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    // Get categories from MongoDB
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Get product counts for each category
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    // Create stats lookup
    const statsMap = categoryStats.reduce((acc, stat) => {
      acc[stat._id] = stat;
      return acc;
    }, {} as any);

    // Combine categories with stats
    const categoriesWithStats = categories.map(category => {
      const stats = statsMap[category.name.toLowerCase()] || { count: 0, avgPrice: 0, minPrice: 0, maxPrice: 0 };
      
      return {
        id: category._id,
        name: category.name,
        description: category.description,
        image: category.image,
        isActive: category.isActive,
        sortOrder: category.sortOrder,
        productCount: stats.count,
        priceRange: {
          min: stats.minPrice || 0,
          max: stats.maxPrice || 0,
          avg: Math.round(stats.avgPrice || 0)
        },
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      };
    });

    res.json({
      success: true,
      data: categoriesWithStats,
      total: categoriesWithStats.length
    });
  })
);

// @desc    Get category filters and options
// @route   GET /api/categories/filters
// @access  Public
router.get('/filters',
  optionalAuth,
  asyncHandler(async (req, res) => {
    // Get all unique filter options from products
    const [
      occasions,
      weights,
      priceRange,
      dietaryOptions
    ] = await Promise.all([
      Product.distinct('occasions', { isActive: true }),
      Product.distinct('weight', { isActive: true }),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ]),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $project: {
            dietary: { $objectToArray: '$dietary' }
          }
        },
        { $unwind: '$dietary' },
        { $match: { 'dietary.v': true } },
        {
          $group: {
            _id: '$dietary.k',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const filters = {
      occasions: occasions.flat().filter((item, index, arr) => arr.indexOf(item) === index),
      weights: weights.sort(),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 },
      dietary: dietaryOptions.map(d => ({
        key: d._id,
        name: d._id.charAt(0).toUpperCase() + d._id.slice(1),
        count: d.count
      })),
      sortOptions: [
        { key: 'popular', name: 'Most Popular' },
        { key: 'price-low', name: 'Price: Low to High' },
        { key: 'price-high', name: 'Price: High to Low' },
        { key: 'rating', name: 'Highest Rated' },
        { key: 'newest', name: 'Newest First' }
      ]
    };

    res.status(200).json({
      success: true,
      data: {
        filters
      }
    });
  })
);

export default router;
