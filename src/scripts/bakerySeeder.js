// Comprehensive Bakery Data Seeder for MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

// Simple Product Schema for seeding
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  subcategory: String,
  price: Number,
  originalPrice: Number,
  images: [String],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  weight: String,
  servings: Number,
  ingredients: [String],
  allergens: [String],
  dietary: {
    vegetarian: { type: Boolean, default: true },
    vegan: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    sugarFree: { type: Boolean, default: false },
    eggless: { type: Boolean, default: false }
  },
  occasions: [String],
  availability: {
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 50 },
    preOrderDays: Number
  },
  customization: {
    flavors: [String],
    sizes: [String],
    decorations: [String]
  },
  seo: {
    slug: String,
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

// Comprehensive Bakery Products Data
const bakeryProducts = [
  // Birthday Cakes
  {
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
    seo: {
      slug: "classic-chocolate-birthday-cake",
      metaTitle: "Classic Chocolate Birthday Cake - Kake Bakery",
      metaDescription: "Order delicious chocolate birthday cake online. Fresh, moist, and customizable for your special celebration.",
      keywords: ["chocolate cake", "birthday cake", "celebration cake", "custom cake"]
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 1
  },
  {
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
    seo: {
      slug: "vanilla-rainbow-birthday-cake",
      metaTitle: "Vanilla Rainbow Birthday Cake - Kids Special | Kake Bakery",
      metaDescription: "Colorful rainbow birthday cake perfect for kids. Order online with custom decorations and messages.",
      keywords: ["rainbow cake", "kids birthday cake", "vanilla cake", "colorful cake"]
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 2
  },

  // Anniversary Cakes
  {
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
    seo: {
      slug: "elegant-red-velvet-anniversary-cake",
      metaTitle: "Red Velvet Anniversary Cake - Romantic Celebration | Kake Bakery",
      metaDescription: "Celebrate your anniversary with our elegant red velvet cake. Premium quality with romantic decorations.",
      keywords: ["red velvet cake", "anniversary cake", "romantic cake", "celebration cake"]
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 3
  },

  // Wedding Cakes
  {
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
    seo: {
      slug: "three-tier-wedding-cake",
      metaTitle: "Three Tier Wedding Cake - Premium Wedding Cakes | Kake Bakery",
      metaDescription: "Stunning three-tier wedding cake for your special day. Custom designs and premium ingredients.",
      keywords: ["wedding cake", "three tier cake", "custom wedding cake", "premium cake"]
    },
    isActive: true,
    isFeatured: true,
    sortOrder: 4
  },

  // Cupcakes
  {
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
    seo: {
      slug: "assorted-birthday-cupcakes-box-12",
      metaTitle: "Birthday Cupcakes Box of 12 - Party Treats | Kake Bakery",
      metaDescription: "Order assorted birthday cupcakes online. Perfect for parties and celebrations. Fresh and delicious.",
      keywords: ["birthday cupcakes", "party cupcakes", "assorted cupcakes", "celebration treats"]
    },
    isActive: true,
    isFeatured: false,
    sortOrder: 5
  },

  // Pastries
  {
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
    seo: {
      slug: "fresh-fruit-tart",
      metaTitle: "Fresh Fruit Tart - Gourmet Pastries | Kake Bakery",
      metaDescription: "Delicious fresh fruit tart with vanilla custard. Perfect dessert for any occasion.",
      keywords: ["fruit tart", "pastry", "dessert", "fresh fruits", "custard tart"]
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

// Database connection and seeding function
async function seedBakeryData() {
  try {
    console.log('🌱 Starting bakery data seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://aamishkhan:aamish123@cluster0.mongodb.net/kake-bakery?retryWrites=true&w=majority');
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(bakeryProducts);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Log summary
    console.log('\n📊 Seeding Summary:');
    console.log(`   • Products: ${insertedProducts.length}`);
    console.log(`   • Categories: ${categories.length}`);
    
    console.log('\n🎂 Products by Category:');
    const productsByCategory = {};
    insertedProducts.forEach(product => {
      productsByCategory[product.category] = (productsByCategory[product.category] || 0) + 1;
    });
    
    Object.entries(productsByCategory).forEach(([category, count]) => {
      console.log(`   • ${category}: ${count} products`);
    });

    console.log('\n🎉 Bakery data seeding completed successfully!');
    console.log('📝 Categories available:', categories.map(c => c.name).join(', '));
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  seedBakeryData();
}

module.exports = { seedBakeryData, bakeryProducts, categories };
