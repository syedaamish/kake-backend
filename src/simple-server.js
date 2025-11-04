// Simplified Backend Server for Testing Integration
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', message: 'Backend server is running' });
});

// Mock authentication endpoints
app.post('/api/auth/verify-token', (req, res) => {
  const { idToken, userData } = req.body;
  
  // Mock user data
  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    id: '507f1f77bcf86cd799439011',
    phone: '+919876543210',
    firebaseUid: 'firebase_uid_123',
    name: userData?.name || 'Test User',
    email: userData?.email || 'test@example.com',
    addresses: [],
    preferences: {
      dietaryRestrictions: [],
      favoriteCategories: [],
      communicationPreferences: {
        sms: true,
        email: true,
        whatsapp: false
      }
    },
    loyaltyPoints: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date()
  };

  res.json({
    success: true,
    data: { user: mockUser },
    message: 'Authentication successful'
  });
});

// Comprehensive Bakery Products Data
const bakeryProducts = [
  {
    _id: '507f1f77bcf86cd799439012',
    name: "Classic Chocolate Birthday Cake",
    description: "Rich, moist chocolate cake with creamy chocolate frosting. Perfect for birthday celebrations with customizable decorations.",
    category: "birthday",
    subcategory: "chocolate",
    price: 899,
    originalPrice: 1099,
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400"
    ],
    rating: { average: 4.8, count: 156 },
    weight: "1kg",
    servings: 8,
    ingredients: ["Flour", "Cocoa Powder", "Sugar", "Eggs", "Butter", "Vanilla Extract", "Baking Powder"],
    allergens: ["Gluten", "Eggs", "Dairy"],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ["birthday", "celebration"],
    availability: {
      inStock: true,
      quantity: 25,
      preOrderDays: 1
    },
    customization: {
      flavors: ["Chocolate", "Vanilla", "Strawberry"],
      sizes: ["1kg", "1.5kg", "2kg"],
      decorations: ["Happy Birthday", "Custom Message", "Photo Print"]
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 1
  },
  {
    _id: '507f1f77bcf86cd799439013',
    name: "Vanilla Rainbow Birthday Cake",
    description: "Colorful vanilla sponge cake with rainbow layers and vanilla buttercream. A delightful treat for kids' birthdays.",
    category: "birthday",
    subcategory: "vanilla",
    price: 1199,
    originalPrice: 1399,
    images: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400",
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400"
    ],
    rating: { average: 4.6, count: 89 },
    weight: "1.5kg",
    servings: 12,
    ingredients: ["Flour", "Sugar", "Eggs", "Butter", "Vanilla Extract", "Food Coloring", "Baking Powder"],
    allergens: ["Gluten", "Eggs", "Dairy"],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ["birthday", "kids party"],
    availability: {
      inStock: true,
      quantity: 15,
      preOrderDays: 2
    },
    customization: {
      flavors: ["Vanilla", "Strawberry", "Chocolate"],
      sizes: ["1kg", "1.5kg", "2kg"],
      decorations: ["Rainbow Theme", "Unicorn", "Custom Characters"]
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 2
  },
  {
    _id: '507f1f77bcf86cd799439014',
    name: "Elegant Red Velvet Anniversary Cake",
    description: "Luxurious red velvet cake with cream cheese frosting, decorated with elegant roses. Perfect for romantic celebrations.",
    category: "anniversary",
    subcategory: "red-velvet",
    price: 1599,
    originalPrice: 1899,
    images: [
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400",
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400"
    ],
    rating: { average: 4.9, count: 234 },
    weight: "1.5kg",
    servings: 12,
    ingredients: ["Flour", "Cocoa Powder", "Red Food Coloring", "Buttermilk", "Cream Cheese", "Sugar", "Eggs"],
    allergens: ["Gluten", "Eggs", "Dairy"],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ["anniversary", "valentine", "romantic"],
    availability: {
      inStock: true,
      quantity: 20,
      preOrderDays: 1
    },
    customization: {
      flavors: ["Red Velvet", "Chocolate", "Vanilla"],
      sizes: ["1kg", "1.5kg", "2kg", "3kg"],
      decorations: ["Rose Decoration", "Heart Theme", "Custom Anniversary Message"]
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 3
  },
  {
    _id: '507f1f77bcf86cd799439015',
    name: "Three-Tier Wedding Cake",
    description: "Magnificent three-tier wedding cake with vanilla sponge, buttercream frosting, and elegant floral decorations.",
    category: "wedding",
    subcategory: "tiered",
    price: 4999,
    originalPrice: 5999,
    images: [
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400",
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400"
    ],
    rating: { average: 5.0, count: 67 },
    weight: "5kg",
    servings: 50,
    ingredients: ["Premium Flour", "Madagascar Vanilla", "Fresh Cream", "Sugar", "Eggs", "Butter"],
    allergens: ["Gluten", "Eggs", "Dairy"],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ["wedding", "engagement"],
    availability: {
      inStock: true,
      quantity: 5,
      preOrderDays: 7
    },
    customization: {
      flavors: ["Vanilla", "Chocolate", "Red Velvet", "Lemon"],
      sizes: ["3-Tier", "4-Tier", "5-Tier"],
      decorations: ["Fresh Flowers", "Sugar Flowers", "Pearl Details", "Custom Design"]
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 4
  },
  {
    _id: '507f1f77bcf86cd799439016',
    name: "Assorted Birthday Cupcakes (Box of 12)",
    description: "Delightful assortment of birthday cupcakes with various flavors and colorful frosting. Perfect for parties.",
    category: "cupcakes",
    subcategory: "assorted",
    price: 599,
    originalPrice: 699,
    images: [
      "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400",
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400"
    ],
    rating: { average: 4.7, count: 312 },
    weight: "600g",
    servings: 12,
    ingredients: ["Flour", "Sugar", "Eggs", "Butter", "Various Flavoring", "Food Coloring"],
    allergens: ["Gluten", "Eggs", "Dairy"],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ["birthday", "party", "office celebration"],
    availability: {
      inStock: true,
      quantity: 40,
      preOrderDays: 0
    },
    customization: {
      flavors: ["Vanilla", "Chocolate", "Strawberry", "Red Velvet"],
      sizes: ["Box of 6", "Box of 12", "Box of 24"],
      decorations: ["Colorful Frosting", "Sprinkles", "Custom Toppers"]
    },
    isActive: true,
    isFeatured: false,
    sortOrder: 5
  },
  {
    _id: '507f1f77bcf86cd799439017',
    name: "Fresh Fruit Tart",
    description: "Buttery pastry shell filled with vanilla custard and topped with fresh seasonal fruits. A perfect dessert treat.",
    category: "pastries",
    subcategory: "tarts",
    price: 399,
    originalPrice: 499,
    images: [
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400"
    ],
    rating: { average: 4.5, count: 198 },
    weight: "200g",
    servings: 2,
    ingredients: ["Pastry Flour", "Butter", "Vanilla Custard", "Fresh Fruits", "Sugar", "Eggs"],
    allergens: ["Gluten", "Eggs", "Dairy"],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ["dessert", "tea time", "casual"],
    availability: {
      inStock: true,
      quantity: 30,
      preOrderDays: 0
    },
    customization: {
      flavors: ["Vanilla Custard", "Chocolate Custard", "Lemon Curd"],
      sizes: ["Individual", "Large"],
      decorations: ["Seasonal Fruits", "Berry Mix", "Tropical Fruits"]
    },
    isActive: true,
    isFeatured: false,
    sortOrder: 6
  }
];

// Categories Data
const categories = [
  {
    _id: "birthday",
    name: "Birthday Cakes",
    description: "Celebrate special birthdays with our delicious and customizable birthday cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300",
    isActive: true,
    sortOrder: 1
  },
  {
    _id: "anniversary",
    name: "Anniversary Cakes",
    description: "Romantic and elegant cakes perfect for anniversary celebrations",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300",
    isActive: true,
    sortOrder: 2
  },
  {
    _id: "wedding",
    name: "Wedding Cakes",
    description: "Stunning multi-tier wedding cakes for your special day",
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=300",
    isActive: true,
    sortOrder: 3
  },
  {
    _id: "cupcakes",
    name: "Cupcakes",
    description: "Delightful individual cupcakes perfect for parties and events",
    image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=300",
    isActive: true,
    sortOrder: 4
  },
  {
    _id: "pastries",
    name: "Pastries",
    description: "Fresh pastries and tarts for everyday indulgence",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300",
    isActive: true,
    sortOrder: 5
  }
];

// Products endpoints with filtering and pagination
app.get('/api/products', (req, res) => {
  const { category, page = 1, limit = 10, sort = 'name', search } = req.query;
  let filteredProducts = [...bakeryProducts];

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }

  // Search functionality
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  }

  // Sorting
  filteredProducts.sort((a, b) => {
    switch (sort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating.average - a.rating.average;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / limitNum);

  res.json({
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts: filteredProducts.length,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      filters: {
        category,
        search,
        sort
      }
    }
  });
});

// Get featured products
app.get('/api/products/featured', (req, res) => {
  const { limit = 4 } = req.query;
  const featuredProducts = bakeryProducts
    .filter(product => product.isFeatured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, parseInt(limit));

  res.json({
    success: true,
    data: {
      products: featuredProducts
    }
  });
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 10, sort = 'name' } = req.query;
  
  let categoryProducts = bakeryProducts.filter(product => product.category === category);
  
  // Sorting
  categoryProducts.sort((a, b) => {
    switch (sort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating.average - a.rating.average;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedProducts = categoryProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(categoryProducts.length / limitNum);

  res.json({
    success: true,
    data: {
      products: paginatedProducts,
      category,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts: categoryProducts.length,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    }
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = bakeryProducts.find(p => p._id === id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({
    success: true,
    data: { product }
  });
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  // Calculate product counts for each category
  const categoriesWithCounts = categories.map(category => {
    const productCount = bakeryProducts.filter(product => product.category === category._id).length;
    return {
      ...category,
      count: productCount
    };
  });

  res.json({
    success: true,
    data: { categories: categoriesWithCounts }
  });
});

// Get category details
app.get('/api/categories/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const category = categories.find(cat => cat._id === categoryId);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  const productCount = bakeryProducts.filter(product => product.category === categoryId).length;
  const categoryWithCount = {
    ...category,
    count: productCount
  };

  res.json({
    success: true,
    data: { category: categoryWithCount }
  });
});

// Mock orders endpoints
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    data: {
      orders: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    }
  });
});

app.post('/api/orders', (req, res) => {
  const mockOrder = {
    _id: '507f1f77bcf86cd799439014',
    orderId: 'ORD-' + Date.now(),
    userId: '507f1f77bcf86cd799439011',
    items: req.body.items || [],
    totalAmount: req.body.totalAmount || 0,
    status: 'pending',
    createdAt: new Date()
  };

  res.json({
    success: true,
    data: { order: mockOrder },
    message: 'Order created successfully'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api/*`);
});
