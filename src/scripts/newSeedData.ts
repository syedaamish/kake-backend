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
    allergens: [],
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
  {
    name: 'Mixed Flower Arrangement',
    description: 'Colorful mixed flower arrangement with seasonal blooms in a beautiful vase.',
    category: 'flowers',
    subcategory: 'arrangements',
    price: 1299,
    originalPrice: 1599,
    images: [
      'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=400',
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400'
    ],
    rating: {
      average: 4.7,
      count: 89
    },
    weight: '800g',
    servings: 1,
    ingredients: ['Mixed Seasonal Flowers', 'Ceramic Vase', 'Floral Foam'],
    allergens: [],
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      sugarFree: true,
      eggless: true
    },
    occasions: ['birthday', 'anniversary', 'everyday'],
    availability: {
      inStock: true,
      quantity: 15,
      preOrderDays: 2
    },
    customization: {
      flavors: [],
      sizes: ['Small', 'Medium', 'Large'],
      decorations: ['Ceramic Vase', 'Glass Vase', 'Basket']
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    seo: {
      slug: 'mixed-flower-arrangement',
      metaTitle: 'Mixed Flower Arrangement - Colorful & Fresh',
      metaDescription: 'Beautiful mixed flower arrangement with seasonal blooms in vase.',
      keywords: ['flower arrangement', 'mixed flowers', 'seasonal blooms', 'vase']
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
    occasions: ['birthday', 'everyday'],
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
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
    seo: {
      slug: 'chocolate-birthday-cake',
      metaTitle: 'Chocolate Birthday Cake - Perfect for Celebrations',
      metaDescription: 'Delicious chocolate birthday cake with custom decorations.',
      keywords: ['chocolate cake', 'birthday cake', 'celebration', 'custom']
    }
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
    isActive: true,
    isFeatured: true,
    sortOrder: 4,
    seo: {
      slug: 'vanilla-wedding-cake',
      metaTitle: 'Vanilla Wedding Cake - Elegant & Beautiful',
      metaDescription: 'Stunning vanilla wedding cake with custom decorations for your special day.',
      keywords: ['wedding cake', 'vanilla cake', 'elegant', 'custom design']
    }
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
    isActive: true,
    isFeatured: true,
    sortOrder: 5,
    seo: {
      slug: 'custom-photo-frame',
      metaTitle: 'Custom Photo Frame - Personalized Memories',
      metaDescription: 'Beautiful personalized photo frame with custom engraving for special memories.',
      keywords: ['photo frame', 'personalized', 'custom engraving', 'memories']
    }
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
    isActive: true,
    isFeatured: false,
    sortOrder: 6,
    seo: {
      slug: 'personalized-mug',
      metaTitle: 'Personalized Mug - Custom Photo & Text',
      metaDescription: 'Custom ceramic mug with your photo and text. Perfect personalized gift.',
      keywords: ['personalized mug', 'custom mug', 'photo mug', 'gift']
    }
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
    occasions: ['birthday', 'everyday'],
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
    isActive: true,
    isFeatured: true,
    sortOrder: 7,
    seo: {
      slug: 'snake-plant-sansevieria',
      metaTitle: 'Snake Plant - Low Maintenance Indoor Plant',
      metaDescription: 'Beautiful snake plant perfect for indoor spaces. Low maintenance and air purifying.',
      keywords: ['snake plant', 'indoor plant', 'low maintenance', 'air purifying']
    }
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
    occasions: ['birthday', 'everyday'],
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
    isActive: true,
    isFeatured: true,
    sortOrder: 8,
    seo: {
      slug: 'monstera-deliciosa',
      metaTitle: 'Monstera Deliciosa - Beautiful Tropical Plant',
      metaDescription: 'Stunning monstera plant with split leaves. Perfect indoor tropical plant.',
      keywords: ['monstera', 'tropical plant', 'indoor plant', 'statement plant']
    }
  }
];

// Sample Users Data
const sampleUsers = [
  {
    firebaseUID: 'demo_user_1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '9876543210',
    dateOfBirth: new Date('1985-06-15'),
    gender: 'male',
    addresses: [{
      name: 'Rajesh Kumar',
      phone: '9876543210',
      street: '123 MG Road',
      houseNumber: 'A-101',
      landmark: 'Near Metro Station',
      pincode: '560001',
      city: 'Bangalore',
      state: 'Karnataka',
      isDefault: true
    }],
    preferences: {
      dietary: ['vegetarian'],
      favoriteCategories: ['cakes', 'flowers'],
      communication: {
        sms: true,
        email: true,
        whatsapp: true
      }
    },
    loyaltyPoints: 150,
    totalOrders: 5,
    totalSpent: 4500,
    isActive: true
  },
  {
    firebaseUID: 'demo_user_2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9876543211',
    dateOfBirth: new Date('1990-03-22'),
    gender: 'female',
    addresses: [{
      name: 'Priya Sharma',
      phone: '9876543211',
      street: '456 Brigade Road',
      houseNumber: 'B-205',
      landmark: 'Opposite Shopping Mall',
      pincode: '560025',
      city: 'Bangalore',
      state: 'Karnataka',
      isDefault: true
    }],
    preferences: {
      dietary: ['vegan'],
      favoriteCategories: ['plants', 'personalized-gifts'],
      communication: {
        sms: true,
        email: false,
        whatsapp: true
      }
    },
    loyaltyPoints: 75,
    totalOrders: 3,
    totalSpent: 2100,
    isActive: true
  }
];

// Function to seed data
async function seedData() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected successfully');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Existing data cleared');

    // Seed Categories
    console.log('📂 Seeding categories...');
    const categories = await Category.insertMany(sampleCategories);
    console.log(`✅ ${categories.length} categories seeded successfully`);

    // Seed Products
    console.log('🛍️ Seeding products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ ${products.length} products seeded successfully`);

    // Seed Users
    console.log('👥 Seeding users...');
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ ${users.length} users seeded successfully`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`Categories: ${categories.length}`);
    console.log(`Products: ${products.length}`);
    console.log(`Users: ${users.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

export default seedData;
