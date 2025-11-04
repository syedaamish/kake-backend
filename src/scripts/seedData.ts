import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';
import User from '../models/User';
import Order from '../models/Order';
import Category from '../models/Category';
import { connectDB } from '../config/database';

// Load environment variables
dotenv.config();

// Sample Categories Data
const sampleCategories = [
  {
    _id: 'flowers',
    name: 'Flowers',
    description: 'Beautiful fresh flowers for all occasions - bouquets, arrangements, and single stems',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
    isActive: true,
    sortOrder: 1
  },
  {
    _id: 'cakes',
    name: 'Cakes',
    description: 'Delicious handcrafted cakes for celebrations, birthdays, and special occasions',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    isActive: true,
    sortOrder: 2
  },
  {
    _id: 'personalized-gifts',
    name: 'Personalized Gifts',
    description: 'Custom and personalized gifts to make your loved ones feel special',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    isActive: true,
    sortOrder: 3
  },
  {
    _id: 'plants',
    name: 'Plants',
    description: 'Indoor and outdoor plants to bring nature into your home and garden',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    isActive: true,
    sortOrder: 4
  }
];

const sampleProducts = [
  // FLOWERS
  {
    name: 'Red Rose Bouquet',
    description: 'Beautiful bouquet of 12 fresh red roses, perfect for expressing love and romance.',
    category: 'flowers',
    subcategory: 'roses',
    price: 899,
    originalPrice: 1099,
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400'
    ],
    rating: {
      average: 4.8,
      count: 156
    },
    weight: '500g',
    servings: 1,
    ingredients: ['Fresh Red Roses', 'Baby Breath', 'Greenery', 'Ribbon'],
    allergens: ['pollen'],
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      sugarFree: true,
      eggless: true
    },
    occasions: ['valentine', 'anniversary', 'birthday'],
    availability: {
      inStock: true,
      quantity: 25,
      preOrderDays: 1
    },
    customization: {
      flavors: [],
      sizes: ['12 roses', '24 roses', '36 roses'],
      decorations: ['Ribbon', 'Gift Wrap', 'Greeting Card']
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    seo: {
      slug: 'red-rose-bouquet',
      metaTitle: 'Red Rose Bouquet - Fresh & Beautiful',
      metaDescription: 'Order fresh red rose bouquet online. Perfect for love and romance.',
      keywords: ['red roses', 'bouquet', 'fresh flowers', 'romance']
    }
  },
  // CAKES
  {
    name: 'Chocolate Birthday Cake',
    description: 'Rich chocolate cake with creamy frosting, perfect for birthday celebrations.',
    category: 'cakes',
    subcategory: 'birthday',
    price: 1299,
    originalPrice: 1499,
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400'
    ],
    rating: {
      average: 4.8,
      count: 89
    },
    weight: '1kg',
    servings: 10,
    ingredients: ['flour', 'cocoa powder', 'sugar', 'eggs', 'butter', 'cream'],
    allergens: ['eggs', 'dairy', 'gluten'],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ['birthday', 'celebration'],
    availability: {
      inStock: true,
      quantity: 25,
      preOrderDays: 2
    },
    customization: {
      flavors: ['chocolate', 'vanilla', 'strawberry'],
      sizes: ['1kg', '1.5kg', '2kg'],
      decorations: ['Happy Birthday', 'Custom Message', 'Candles']
    },
    seo: {
      slug: 'chocolate-birthday-cake',
      metaTitle: 'Chocolate Birthday Cake - Perfect for Celebrations',
      metaDescription: 'Delicious chocolate birthday cake with custom decorations.',
      keywords: ['chocolate cake', 'birthday cake', 'celebration', 'custom']
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 2
  },
  {
    name: 'Vanilla Wedding Cake',
    description: 'Elegant three-tier vanilla cake perfect for weddings and special occasions.',
    category: 'cakes',
    subcategory: 'wedding',
    price: 4999,
    originalPrice: 5999,
    images: [
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400',
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400'
    ],
    rating: {
      average: 4.9,
      count: 45
    },
    weight: '5kg',
    servings: 50,
    ingredients: ['flour', 'vanilla', 'sugar', 'eggs', 'butter', 'cream cheese'],
    allergens: ['eggs', 'dairy', 'gluten'],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ['wedding', 'anniversary'],
    availability: {
      inStock: true,
      quantity: 5,
      preOrderDays: 7
    },
    customization: {
      flavors: ['vanilla', 'lemon', 'almond'],
      sizes: ['3-tier', '4-tier', '5-tier'],
      decorations: ['Flowers', 'Pearls', 'Custom Design']
    },
    seo: {
      slug: 'vanilla-wedding-cake',
      metaTitle: 'Vanilla Wedding Cake - Elegant & Beautiful',
      metaDescription: 'Stunning vanilla wedding cake with custom decorations for your special day.',
      keywords: ['wedding cake', 'vanilla cake', 'elegant', 'custom design']
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 3
  },
  // PERSONALIZED GIFTS
  {
    name: 'Custom Photo Frame',
    description: 'Beautiful wooden photo frame with personalized engraving for your special memories.',
    category: 'personalized-gifts',
    subcategory: 'frames',
    price: 799,
    originalPrice: 999,
    images: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
    ],
    rating: {
      average: 4.7,
      count: 123
    },
    weight: '300g',
    servings: 1,
    ingredients: ['Wood', 'Glass', 'Metal Hardware'],
    allergens: [],
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      sugarFree: true,
      eggless: true
    },
    occasions: ['birthday', 'anniversary', 'wedding', 'valentine'],
    availability: {
      inStock: true,
      quantity: 50,
      preOrderDays: 3
    },
    customization: {
      flavors: [],
      sizes: ['5x7', '8x10', '11x14'],
      decorations: ['Custom Engraving', 'Names & Dates', 'Special Message']
    },
    seo: {
      slug: 'custom-photo-frame',
      metaTitle: 'Custom Photo Frame - Personalized Memories',
      metaDescription: 'Beautiful personalized photo frame with custom engraving for special memories.',
      keywords: ['photo frame', 'personalized', 'custom engraving', 'memories']
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 4
  },
  {
    name: 'Personalized Mug',
    description: 'Custom ceramic mug with your photo and text, perfect for daily use or as a gift.',
    category: 'personalized-gifts',
    subcategory: 'mugs',
    price: 399,
    originalPrice: 499,
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    ],
    rating: {
      average: 4.6,
      count: 234
    },
    weight: '350g',
    servings: 1,
    ingredients: ['Ceramic', 'Food-safe Ink'],
    allergens: [],
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      sugarFree: true,
      eggless: true
    },
    occasions: ['birthday', 'valentine', 'everyday'],
    availability: {
      inStock: true,
      quantity: 100,
      preOrderDays: 2
    },
    customization: {
      flavors: [],
      sizes: ['11oz', '15oz'],
      decorations: ['Photo Print', 'Custom Text', 'Name & Date']
    },
    seo: {
      slug: 'personalized-mug',
      metaTitle: 'Personalized Mug - Custom Photo & Text',
      metaDescription: 'Custom ceramic mug with your photo and text. Perfect personalized gift.',
      keywords: ['personalized mug', 'custom mug', 'photo mug', 'gift']
    },
    isActive: true,
    isFeatured: false,
    sortOrder: 5
  },
  // PLANTS
  {
    name: 'Snake Plant (Sansevieria)',
    description: 'Low-maintenance indoor plant perfect for beginners. Great for air purification.',
    category: 'plants',
    subcategory: 'indoor',
    price: 599,
    originalPrice: 799,
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400'
    ],
    rating: {
      average: 4.8,
      count: 167
    },
    weight: '2kg',
    servings: 1,
    ingredients: ['Snake Plant', 'Ceramic Pot', 'Soil', 'Drainage Stones'],
    allergens: [],
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      sugarFree: true,
      eggless: true
    },
    occasions: ['housewarming', 'birthday', 'everyday'],
    availability: {
      inStock: true,
      quantity: 30,
      preOrderDays: 1
    },
    customization: {
      flavors: [],
      sizes: ['Small', 'Medium', 'Large'],
      decorations: ['Ceramic Pot', 'Decorative Stones', 'Care Instructions']
    },
    seo: {
      slug: 'snake-plant-sansevieria',
      metaTitle: 'Snake Plant - Low Maintenance Indoor Plant',
      metaDescription: 'Beautiful snake plant perfect for indoor spaces. Low maintenance and air purifying.',
      keywords: ['snake plant', 'indoor plant', 'low maintenance', 'air purifying']
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 6
  },
  {
    name: 'Monstera Deliciosa',
    description: 'Stunning tropical plant with large, split leaves. Perfect statement piece for any room.',
    category: 'plants',
    subcategory: 'tropical',
    price: 1299,
    originalPrice: 1599,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400'
    ],
    rating: {
      average: 4.9,
      count: 89
    },
    weight: '5kg',
    servings: 1,
    ingredients: ['Monstera Plant', 'Large Pot', 'Premium Soil', 'Support Stake'],
    allergens: [],
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      sugarFree: true,
      eggless: true
    },
    occasions: ['housewarming', 'birthday'],
    availability: {
      inStock: true,
      quantity: 15,
      preOrderDays: 3
    },
    customization: {
      flavors: [],
      sizes: ['Medium', 'Large', 'Extra Large'],
      decorations: ['Decorative Pot', 'Moss Pole', 'Care Guide']
    },
    seo: {
      slug: 'monstera-deliciosa',
      metaTitle: 'Monstera Deliciosa - Beautiful Tropical Plant',
      metaDescription: 'Stunning monstera plant with split leaves. Perfect indoor tropical plant.',
      keywords: ['monstera', 'tropical plant', 'indoor plant', 'statement plant']
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 7
  }
];

// Sample Users Data
const sampleUsers = [
  {
    firebaseUID: 'user_9876543210',
    phone: '9876543210',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    dateOfBirth: new Date('1990-05-15'),
    addresses: [
      {
        type: 'home',
        name: 'Aarav Sharma',
        phone: '9876543210',
        street: 'MG Road',
        houseNumber: 'A-301',
        landmark: 'Near Metro Station',
        pincode: '110001',
        city: 'Delhi',
        state: 'Delhi',
        isDefault: true
      }
    ],
    preferences: {
      notifications: true,
      marketing: false,
      language: 'en'
    },
    loyaltyPoints: 150,
    isActive: true,
    lastLoginAt: new Date()
  },
  {
    firebaseUID: 'user_8765432109',
    phone: '8765432109',
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    dateOfBirth: new Date('1992-08-22'),
    addresses: [
      {
        type: 'home',
        name: 'Priya Patel',
        phone: '8765432109',
        street: 'Linking Road',
        houseNumber: 'B-205',
        landmark: 'Opposite Mall',
        pincode: '400050',
        city: 'Mumbai',
        state: 'Maharashtra',
        isDefault: true
      },
      {
        type: 'work',
        name: 'Priya Patel',
        phone: '8765432109',
        street: 'BKC',
        houseNumber: 'Tower 3, Floor 15',
        landmark: 'Business District',
        pincode: '400051',
        city: 'Mumbai',
        state: 'Maharashtra',
        isDefault: false
      }
    ],
    preferences: {
      notifications: true,
      marketing: true,
      language: 'en'
    },
    loyaltyPoints: 280,
    isActive: true,
    lastLoginAt: new Date()
  },
  {
    firebaseUID: 'user_7654321098',
    phone: '7654321098',
    name: 'Rohit Kumar',
    email: 'rohit.kumar@gmail.com',
    addresses: [
      {
        type: 'home',
        name: 'Rohit Kumar',
        phone: '7654321098',
        street: 'Brigade Road',
        houseNumber: 'C-102',
        landmark: 'Near Park',
        pincode: '560001',
        city: 'Bangalore',
        state: 'Karnataka',
        isDefault: true
      }
    ],
    preferences: {
      notifications: false,
      marketing: false,
      language: 'en'
    },
    loyaltyPoints: 75,
    isActive: true,
    lastLoginAt: new Date()
  }
];

// Sample Orders Data (will be created after users and products are seeded)
const createSampleOrders = async (users: any[], products: any[]) => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const sampleOrders = [
    {
      userId: users[0]._id,
      firebaseUID: users[0].firebaseUID,
      items: [
        {
          productId: products[0]._id,
          name: products[0].name,
          price: products[0].price,
          quantity: 1,
          weight: products[0].weight,
          customization: {
            flavor: 'chocolate',
            size: '1kg',
            decoration: 'Happy Birthday Aarav!'
          },
          subtotal: products[0].price
        }
      ],
      deliveryAddress: {
        name: 'Aarav Sharma',
        phone: '9876543210',
        street: 'MG Road',
        houseNumber: 'A-301',
        landmark: 'Near Metro Station',
        pincode: '110001',
        city: 'Delhi',
        state: 'Delhi'
      },
      orderSummary: {
        subtotal: products[0].price,
        deliveryFee: 0,
        tax: Math.round(products[0].price * 0.05),
        discount: 0,
        total: products[0].price + Math.round(products[0].price * 0.05)
      },
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'online',
      paymentDetails: {
        transactionId: 'TXN_' + Date.now(),
        paymentGateway: 'razorpay',
        paidAt: threeDaysAgo
      },
      deliveryDetails: {
        type: 'standard',
        estimatedDelivery: threeDaysAgo,
        actualDelivery: threeDaysAgo
      },
      timeline: {
        orderPlaced: threeDaysAgo,
        orderConfirmed: new Date(threeDaysAgo.getTime() + 30 * 60 * 1000),
        preparationStarted: new Date(threeDaysAgo.getTime() + 2 * 60 * 60 * 1000),
        readyForDelivery: new Date(threeDaysAgo.getTime() + 4 * 60 * 60 * 1000),
        outForDelivery: new Date(threeDaysAgo.getTime() + 5 * 60 * 60 * 1000),
        delivered: new Date(threeDaysAgo.getTime() + 6 * 60 * 60 * 1000)
      },
      rating: {
        overall: 5,
        food: 5,
        delivery: 4,
        comment: 'Amazing chocolate cake! Perfect for the birthday celebration.',
        ratedAt: new Date(threeDaysAgo.getTime() + 24 * 60 * 60 * 1000)
      },
      loyaltyPointsEarned: Math.floor((products[0].price + Math.round(products[0].price * 0.05)) / 100),
      loyaltyPointsUsed: 0,
      createdAt: threeDaysAgo,
      updatedAt: threeDaysAgo
    },
    {
      userId: users[1]._id,
      firebaseUID: users[1].firebaseUID,
      items: [
        {
          productId: products[1]._id,
          name: products[1].name,
          price: products[1].price,
          quantity: 1,
          weight: products[1].weight,
          customization: {
            flavor: 'red velvet',
            size: '1kg',
            decoration: 'Happy Anniversary'
          },
          subtotal: products[1].price
        },
        {
          productId: products[2]._id,
          name: products[2].name,
          price: products[2].price,
          quantity: 2,
          weight: products[2].weight,
          customization: {
            flavor: 'vanilla',
            decoration: 'sprinkles'
          },
          subtotal: products[2].price * 2
        }
      ],
      deliveryAddress: {
        name: 'Priya Patel',
        phone: '8765432109',
        street: 'Linking Road',
        houseNumber: 'B-205',
        landmark: 'Opposite Mall',
        pincode: '400050',
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      orderSummary: {
        subtotal: products[1].price + (products[2].price * 2),
        deliveryFee: 0,
        tax: Math.round((products[1].price + (products[2].price * 2)) * 0.05),
        discount: 50,
        total: products[1].price + (products[2].price * 2) + Math.round((products[1].price + (products[2].price * 2)) * 0.05) - 50
      },
      status: 'out-for-delivery',
      paymentStatus: 'paid',
      paymentMethod: 'cod',
      deliveryDetails: {
        type: 'express',
        estimatedDelivery: now,
        deliveryInstructions: 'Call before delivery'
      },
      timeline: {
        orderPlaced: yesterday,
        orderConfirmed: new Date(yesterday.getTime() + 15 * 60 * 1000),
        preparationStarted: new Date(yesterday.getTime() + 2 * 60 * 60 * 1000),
        readyForDelivery: new Date(yesterday.getTime() + 6 * 60 * 60 * 1000),
        outForDelivery: new Date(now.getTime() - 30 * 60 * 1000)
      },
      loyaltyPointsEarned: Math.floor((products[1].price + (products[2].price * 2) + Math.round((products[1].price + (products[2].price * 2)) * 0.05) - 50) / 100),
      loyaltyPointsUsed: 0,
      createdAt: yesterday,
      updatedAt: now
    },
    {
      userId: users[2]._id,
      firebaseUID: users[2].firebaseUID,
      items: [
        {
          productId: products[3]._id,
          name: products[3].name,
          price: products[3].price,
          quantity: 3,
          weight: products[3].weight,
          customization: {
            flavor: 'chocolate chip',
            decoration: 'gift box'
          },
          subtotal: products[3].price * 3
        }
      ],
      deliveryAddress: {
        name: 'Rohit Kumar',
        phone: '7654321098',
        street: 'Brigade Road',
        houseNumber: 'C-102',
        landmark: 'Near Park',
        pincode: '560001',
        city: 'Bangalore',
        state: 'Karnataka'
      },
      orderSummary: {
        subtotal: products[3].price * 3,
        deliveryFee: 49,
        tax: Math.round((products[3].price * 3) * 0.05),
        discount: 0,
        total: (products[3].price * 3) + 49 + Math.round((products[3].price * 3) * 0.05)
      },
      status: 'preparing',
      paymentStatus: 'paid',
      paymentMethod: 'online',
      paymentDetails: {
        transactionId: 'TXN_' + (Date.now() - 1000),
        paymentGateway: 'paytm',
        paidAt: twoDaysAgo
      },
      deliveryDetails: {
        type: 'standard',
        estimatedDelivery: new Date(now.getTime() + 4 * 60 * 60 * 1000)
      },
      timeline: {
        orderPlaced: twoDaysAgo,
        orderConfirmed: new Date(twoDaysAgo.getTime() + 20 * 60 * 1000),
        preparationStarted: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },
      loyaltyPointsEarned: Math.floor(((products[3].price * 3) + 49 + Math.round((products[3].price * 3) * 0.05)) / 100),
      loyaltyPointsUsed: 0,
      createdAt: twoDaysAgo,
      updatedAt: now
    }
  ];

  return sampleOrders;
};

const seedData = async () => {
  try {
    console.log('🌱 Starting comprehensive data seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await Promise.all([
      Product.deleteMany({}),
      User.deleteMany({}),
      Order.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data (products, users, orders)');
    
    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} products`);
    
    // Insert sample users
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Inserted ${users.length} users`);
    
    // Create and insert sample orders
    const orderData = await createSampleOrders(users, products);
    const orders = await Order.insertMany(orderData);
    console.log(`✅ Inserted ${orders.length} orders`);
    
    // Display summary
    const [categoryCounts, orderStatusCounts] = await Promise.all([
      Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ]);
    
    console.log('\n📊 Products by category:');
    categoryCounts.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products`);
    });
    
    console.log('\n📋 Orders by status:');
    orderStatusCounts.forEach(status => {
      console.log(`   ${status._id}: ${status.count} orders`);
    });
    
    console.log('\n👥 Users created:');
    users.forEach(user => {
      console.log(`   ${user.name} (${user.phone}) - ${user.loyaltyPoints} points`);
    });
    
    console.log('\n🎉 Comprehensive data seeding completed successfully!');
    console.log('\n🚀 Ready to start the backend server with:');
    console.log('   npm run dev');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

export { seedData, sampleProducts, sampleUsers, createSampleOrders };
