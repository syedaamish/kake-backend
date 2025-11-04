import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';
import User from '../models/User';
import Order from '../models/Order';
import Category from '../models/Category';
import { connectDB } from '../config/database';

// Load environment variables
dotenv.config();

// Comprehensive Bakery Products Data
const bakeryProducts = [
  {
    name: 'Classic Chocolate Birthday Cake',
    description: 'Rich, moist chocolate cake with creamy chocolate frosting. Perfect for birthday celebrations with customizable decorations.',
    category: 'cakes',
    subcategory: 'chocolate',
    price: 899,
    originalPrice: 1099,
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400'
    ],
    rating: {
      average: 4.8,
      count: 156
    },
    weight: '1kg',
    servings: 8,
    ingredients: ['Flour', 'Cocoa Powder', 'Sugar', 'Eggs', 'Butter', 'Vanilla Extract', 'Baking Powder'],
    allergens: ['gluten', 'eggs', 'dairy'],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ['birthday'],
    availability: {
      inStock: true,
      quantity: 25,
      preOrderDays: 1
    },
    customization: {
      flavors: ['Chocolate', 'Vanilla', 'Strawberry'],
      sizes: ['1kg', '1.5kg', '2kg'],
      decorations: ['Happy Birthday', 'Custom Message', 'Photo Print']
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    seo: {
      slug: 'classic-chocolate-birthday-cake',
      metaTitle: 'Classic Chocolate Birthday Cake - Kake Bakery',
      metaDescription: 'Rich, moist chocolate birthday cake with creamy frosting. Perfect for celebrations.',
      keywords: ['chocolate cake', 'birthday cake', 'celebration cake']
    }
  },
  {
    name: 'Vanilla Rainbow Birthday Cake',
    description: 'Colorful vanilla sponge cake with rainbow layers and vanilla buttercream. A delightful treat for kids\' birthdays.',
    category: 'cakes',
    subcategory: 'vanilla',
    price: 1199,
    originalPrice: 1399,
    images: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400',
      'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400'
    ],
    rating: {
      average: 4.6,
      count: 89
    },
    weight: '1.5kg',
    servings: 12,
    ingredients: ['Flour', 'Sugar', 'Eggs', 'Butter', 'Vanilla Extract', 'Food Coloring', 'Baking Powder'],
    allergens: ['gluten', 'eggs', 'dairy'],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ['birthday'],
    availability: {
      inStock: true,
      quantity: 15,
      preOrderDays: 2
    },
    customization: {
      flavors: ['Vanilla', 'Strawberry', 'Chocolate'],
      sizes: ['1kg', '1.5kg', '2kg'],
      decorations: ['Rainbow Theme', 'Unicorn', 'Custom Characters']
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    seo: {
      slug: 'vanilla-rainbow-birthday-cake',
      metaTitle: 'Vanilla Rainbow Birthday Cake - Kake Bakery',
      metaDescription: 'Colorful vanilla rainbow cake perfect for kids\' birthdays and celebrations.',
      keywords: ['rainbow cake', 'vanilla cake', 'kids birthday', 'colorful cake']
    }
  },
  {
    name: 'Elegant Red Velvet Anniversary Cake',
    description: 'Luxurious red velvet cake with cream cheese frosting, decorated with elegant roses. Perfect for romantic celebrations.',
    category: 'cakes',
    subcategory: 'red-velvet',
    price: 1599,
    originalPrice: 1899,
    images: [
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400',
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400'
    ],
    rating: {
      average: 4.9,
      count: 234
    },
    weight: '1.5kg',
    servings: 12,
    ingredients: ['Flour', 'Cocoa Powder', 'Red Food Coloring', 'Buttermilk', 'Cream Cheese', 'Sugar', 'Eggs'],
    allergens: ['gluten', 'eggs', 'dairy'],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ['anniversary', 'valentine'],
    availability: {
      inStock: true,
      quantity: 20,
      preOrderDays: 1
    },
    customization: {
      flavors: ['Red Velvet', 'Chocolate', 'Vanilla'],
      sizes: ['1kg', '1.5kg', '2kg', '3kg'],
      decorations: ['Rose Decoration', 'Heart Theme', 'Custom Anniversary Message']
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
    seo: {
      slug: 'elegant-red-velvet-anniversary-cake',
      metaTitle: 'Red Velvet Anniversary Cake - Kake Bakery',
      metaDescription: 'Luxurious red velvet cake perfect for anniversaries and romantic celebrations.',
      keywords: ['red velvet cake', 'anniversary cake', 'romantic cake', 'elegant cake']
    }
  },
  {
    name: 'Three-Tier Wedding Cake',
    description: 'Magnificent three-tier wedding cake with vanilla sponge, buttercream frosting, and elegant floral decorations.',
    category: 'cakes',
    subcategory: 'tiered',
    price: 4999,
    originalPrice: 5999,
    images: [
      'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400',
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400'
    ],
    rating: {
      average: 5.0,
      count: 67
    },
    weight: '5kg',
    servings: 50,
    ingredients: ['Premium Flour', 'Madagascar Vanilla', 'Fresh Cream', 'Sugar', 'Eggs', 'Butter'],
    allergens: ['gluten', 'eggs', 'dairy'],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ['wedding'],
    availability: {
      inStock: true,
      quantity: 5,
      preOrderDays: 7
    },
    customization: {
      flavors: ['Vanilla', 'Chocolate', 'Red Velvet', 'Lemon'],
      sizes: ['3-Tier', '4-Tier', '5-Tier'],
      decorations: ['Fresh Flowers', 'Sugar Flowers', 'Pearl Details', 'Custom Design']
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 4,
    seo: {
      slug: 'three-tier-wedding-cake',
      metaTitle: 'Three-Tier Wedding Cake - Kake Bakery',
      metaDescription: 'Magnificent three-tier wedding cake with elegant decorations for your special day.',
      keywords: ['wedding cake', 'three tier cake', 'elegant cake', 'custom wedding cake']
    }
  },
  {
    name: 'Assorted Cupcake Box (12 pieces)',
    description: 'A delightful assortment of 12 cupcakes in various flavors including chocolate, vanilla, red velvet, and lemon.',
    category: 'desserts',
    subcategory: 'assorted',
    price: 599,
    originalPrice: 699,
    images: [
      'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400',
      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400'
    ],
    rating: {
      average: 4.4,
      count: 312
    },
    weight: '600g',
    servings: 12,
    ingredients: ['Flour', 'Sugar', 'Eggs', 'Butter', 'Various Flavorings', 'Cream Cheese', 'Cocoa Powder'],
    allergens: ['gluten', 'eggs', 'dairy'],
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
      quantity: 40,
      preOrderDays: 0
    },
    customization: {
      flavors: ['Chocolate', 'Vanilla', 'Red Velvet', 'Lemon', 'Strawberry'],
      sizes: ['6 pieces', '12 pieces', '24 pieces'],
      decorations: ['Buttercream Swirl', 'Fondant Toppers', 'Sprinkles']
    },
    isActive: true,
    isFeatured: false,
    sortOrder: 5,
    seo: {
      slug: 'assorted-cupcake-box-12-pieces',
      metaTitle: 'Assorted Cupcakes Box - Kake Bakery',
      metaDescription: 'Delightful assortment of 12 cupcakes in various flavors perfect for parties.',
      keywords: ['cupcakes', 'assorted flavors', 'party treats', 'mini cakes']
    }
  },
  {
    name: 'Fresh Fruit Tart',
    description: 'Buttery pastry shell filled with vanilla custard and topped with fresh seasonal fruits. A perfect balance of flavors.',
    category: 'pastries',
    subcategory: 'tarts',
    price: 399,
    originalPrice: 499,
    images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400'
    ],
    rating: {
      average: 4.3,
      count: 98
    },
    weight: '200g',
    servings: 2,
    ingredients: ['Pastry Flour', 'Butter', 'Vanilla Custard', 'Fresh Fruits', 'Sugar', 'Eggs'],
    allergens: ['gluten', 'eggs', 'dairy'],
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      sugarFree: false,
      eggless: false
    },
    occasions: ['everyday'],
    availability: {
      inStock: true,
      quantity: 30,
      preOrderDays: 0
    },
    customization: {
      flavors: ['Vanilla Custard', 'Chocolate Custard', 'Lemon Curd'],
      sizes: ['Individual', 'Large (serves 4)', 'Family (serves 8)'],
      decorations: ['Seasonal Fruits', 'Berry Mix', 'Tropical Fruits']
    },
    isActive: true,
    isFeatured: false,
    sortOrder: 6,
    seo: {
      slug: 'fresh-fruit-tart',
      metaTitle: 'Fresh Fruit Tart - Kake Bakery',
      metaDescription: 'Buttery pastry tart with vanilla custard and fresh seasonal fruits.',
      keywords: ['fruit tart', 'pastry', 'fresh fruits', 'custard tart']
    }
  }
];

// Bakery Categories Data
const bakeryCategories = [
  {
    _id: 'birthday',
    name: 'Birthday Cakes',
    description: 'Celebrate special birthdays with our delicious and customizable birthday cakes',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
    isActive: true,
    sortOrder: 1
  },
  {
    _id: 'anniversary',
    name: 'Anniversary Cakes',
    description: 'Romantic and elegant cakes perfect for anniversary celebrations',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300',
    isActive: true,
    sortOrder: 2
  },
  {
    _id: 'wedding',
    name: 'Wedding Cakes',
    description: 'Stunning multi-tier wedding cakes for your special day',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=300',
    isActive: true,
    sortOrder: 3
  },
  {
    _id: 'cupcakes',
    name: 'Cupcakes',
    description: 'Delightful individual cupcakes perfect for parties and events',
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=300',
    isActive: true,
    sortOrder: 4
  },
  {
    _id: 'pastries',
    name: 'Pastries',
    description: 'Fresh pastries and tarts for everyday indulgence',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300',
    isActive: true,
    sortOrder: 5
  }
];

// Sample Users Data
const sampleUsers = [
  {
    firebaseUID: 'demo_user_1',
    phone: '9876543210',
    profile: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'rajesh.kumar@example.com',
      dateOfBirth: new Date('1985-06-15'),
      gender: 'male'
    },
    addresses: [
      {
        name: 'Rajesh Kumar',
        phone: '9876543210',
        type: 'home',
        street: '123 MG Road',
        houseNumber: 'A-101',
        landmark: 'Near Metro Station',
        pincode: '560001',
        city: 'Bangalore',
        state: 'Karnataka',
        isDefault: true
      }
    ],
    preferences: {
      dietaryRestrictions: ['vegetarian'],
      favoriteCategories: ['birthday', 'anniversary'],
      communicationPreferences: {
        sms: true,
        email: true,
        whatsapp: false
      }
    },
    loyaltyPoints: 150,
    totalOrders: 5,
    totalSpent: 4500,
    isActive: true
  },
  {
    firebaseUID: 'demo_user_2',
    phone: '9876543211',
    profile: {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@example.com',
      dateOfBirth: new Date('1990-03-22'),
      gender: 'female'
    },
    addresses: [
      {
        name: 'Priya Sharma',
        phone: '9876543211',
        type: 'home',
        street: '456 Brigade Road',
        houseNumber: 'B-205',
        landmark: 'Opposite Shopping Mall',
        pincode: '560025',
        city: 'Bangalore',
        state: 'Karnataka',
        isDefault: true
      }
    ],
    preferences: {
      dietaryRestrictions: [],
      favoriteCategories: ['cupcakes', 'pastries'],
      communicationPreferences: {
        sms: true,
        email: true,
        whatsapp: true
      }
    },
    loyaltyPoints: 75,
    totalOrders: 3,
    totalSpent: 2100,
    isActive: true
  }
];

// Function to create sample orders
const createSampleOrders = async (users: any[], products: any[]) => {
  const generateOrderId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `KAKE${timestamp}${random}`.toUpperCase();
  };

  const sampleOrders = [
    {
      orderId: generateOrderId(),
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
            flavor: 'Chocolate',
            size: '1kg',
            decoration: 'Happy Birthday'
          },
          subtotal: products[0].price
        }
      ],
      deliveryAddress: {
        name: users[0].addresses[0].name,
        phone: users[0].addresses[0].phone,
        street: users[0].addresses[0].street,
        houseNumber: users[0].addresses[0].houseNumber,
        landmark: users[0].addresses[0].landmark,
        pincode: users[0].addresses[0].pincode,
        city: users[0].addresses[0].city,
        state: users[0].addresses[0].state
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
        transactionId: 'TXN' + Date.now(),
        paymentGateway: 'razorpay',
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      deliveryDetails: {
        estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actualDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        deliveryPartner: 'Kake Delivery',
        trackingNumber: 'KAKE' + Date.now()
      },
      specialInstructions: 'Please call before delivery',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      orderId: generateOrderId(),
      userId: users[1]._id,
      firebaseUID: users[1].firebaseUID,
      items: [
        {
          productId: products[4]._id,
          name: products[4].name,
          price: products[4].price,
          quantity: 2,
          weight: products[4].weight,
          customization: {
            flavor: 'Assorted',
            size: '12 pieces',
            decoration: 'Buttercream Swirl'
          },
          subtotal: products[4].price * 2
        }
      ],
      deliveryAddress: {
        name: users[1].addresses[0].name,
        phone: users[1].addresses[0].phone,
        street: users[1].addresses[0].street,
        houseNumber: users[1].addresses[0].houseNumber,
        landmark: users[1].addresses[0].landmark,
        pincode: users[1].addresses[0].pincode,
        city: users[1].addresses[0].city,
        state: users[1].addresses[0].state
      },
      orderSummary: {
        subtotal: products[4].price * 2,
        deliveryFee: 50,
        tax: Math.round(products[4].price * 2 * 0.05),
        discount: 0,
        total: products[4].price * 2 + 50 + Math.round(products[4].price * 2 * 0.05)
      },
      status: 'pending',
      paymentStatus: 'paid',
      paymentMethod: 'online',
      paymentDetails: {
        transactionId: 'TXN' + (Date.now() + 1000),
        paymentGateway: 'razorpay',
        paidAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      deliveryDetails: {
        estimatedDelivery: new Date(Date.now() + 12 * 60 * 60 * 1000),
        deliveryPartner: 'Kake Delivery',
        trackingNumber: 'KAKE' + (Date.now() + 1000)
      },
      specialInstructions: 'Birthday party order',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ];

  return sampleOrders;
};

// Main seeding function
const seedBakeryData = async () => {
  try {
    console.log('🌱 Starting bakery data seeding...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Existing data cleared');

    // Seed categories first
    console.log('🏷️ Seeding bakery categories...');
    const createdCategories = await Category.insertMany(bakeryCategories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Seed products
    console.log('🍰 Seeding bakery products...');
    const createdProducts = await Product.insertMany(bakeryProducts);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Seed users
    console.log('👥 Seeding users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Seed orders
    console.log('📦 Seeding orders...');
    const sampleOrders = await createSampleOrders(createdUsers, createdProducts);
    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${createdOrders.length} orders`);

    console.log('🎉 Bakery data seeding completed successfully!');
    console.log(`
📊 Summary:
- Categories: ${createdCategories.length}
- Products: ${createdProducts.length}
- Users: ${createdUsers.length}
- Orders: ${createdOrders.length}
    `);

    // Close database connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error seeding bakery data:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedBakeryData();
}

export default seedBakeryData;
