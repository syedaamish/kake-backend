import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: {
    average: number;
    count: number;
  };
  weight: string;
  servings?: number;
  ingredients: string[];
  allergens: string[];
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    sugarFree: boolean;
    eggless: boolean;
  };
  occasions: string[];
  availability: {
    inStock: boolean;
    quantity: number;
    preOrderDays?: number;
  };
  customization: {
    flavors: string[];
    sizes: string[];
    decorations: string[];
  };
  seo: {
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for static methods
export interface IProductModel extends Model<IProduct> {
  findByCategory(category: string, filters?: any): any;
  findFeatured(limit?: number): any;
  searchProducts(query: string, filters?: any): any;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Product name cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['flowers', 'cakes', 'personalized-gifts', 'plants'],
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  images: [{
    type: String,
    required: true
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  weight: {
    type: String,
    required: true,
    match: [/^\d+(\.\d+)?\s*(kg|g|lbs|oz)$/i, 'Please enter a valid weight format (e.g., 1kg, 500g)']
  },
  servings: {
    type: Number,
    min: 1
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    enum: ['nuts', 'dairy', 'eggs', 'gluten', 'soy', 'sesame', 'shellfish']
  }],
  dietary: {
    vegetarian: {
      type: Boolean,
      default: true
    },
    vegan: {
      type: Boolean,
      default: false
    },
    glutenFree: {
      type: Boolean,
      default: false
    },
    sugarFree: {
      type: Boolean,
      default: false
    },
    eggless: {
      type: Boolean,
      default: false
    }
  },
  occasions: [{
    type: String,
    enum: ['birthday', 'anniversary', 'wedding', 'graduation', 'valentine', 'christmas', 'diwali', 'holi', 'everyday']
  }],
  availability: {
    inStock: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    preOrderDays: {
      type: Number,
      min: 0,
      max: 30
    }
  },
  customization: {
    flavors: [{
      type: String,
      trim: true
    }],
    sizes: [{
      type: String,
      trim: true
    }],
    decorations: [{
      type: String,
      trim: true
    }]
  },
  seo: {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
    },
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot be more than 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot be more than 160 characters']
    },
    keywords: [{
      type: String,
      trim: true
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ 'seo.slug': 1 });
ProductSchema.index({ isFeatured: -1, sortOrder: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ 'rating.average': -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ 'occasions': 1 });
ProductSchema.index({ 'dietary.vegetarian': 1 });
ProductSchema.index({ 'dietary.vegan': 1 });
ProductSchema.index({ 'dietary.glutenFree': 1 });

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for availability status
ProductSchema.virtual('availabilityStatus').get(function() {
  if (!this.isActive) return 'inactive';
  if (!this.availability.inStock) return 'out-of-stock';
  if (this.availability.quantity === 0 && this.availability.preOrderDays) return 'pre-order';
  if (this.availability.quantity > 0) return 'in-stock';
  return 'unavailable';
});

// Pre-save middleware to generate slug if not provided
ProductSchema.pre('save', function(next) {
  if (!this.seo.slug && this.name) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  // Auto-generate meta title and description if not provided
  if (!this.seo.metaTitle) {
    this.seo.metaTitle = this.name.length > 60 ? this.name.substring(0, 57) + '...' : this.name;
  }
  
  if (!this.seo.metaDescription) {
    this.seo.metaDescription = this.description.length > 160 ? this.description.substring(0, 157) + '...' : this.description;
  }
  
  next();
});

// Static methods
ProductSchema.statics.findByCategory = function(category: string, filters: any = {}) {
  return this.find({ 
    category, 
    isActive: true, 
    ...filters 
  }).sort({ isFeatured: -1, sortOrder: 1, createdAt: -1 });
};

ProductSchema.statics.findFeatured = function(limit: number = 10) {
  return this.find({ 
    isFeatured: true, 
    isActive: true 
  }).sort({ sortOrder: 1, createdAt: -1 }).limit(limit);
};

ProductSchema.statics.searchProducts = function(query: string, filters: any = {}) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $and: [
      {
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { 'seo.keywords': { $in: [searchRegex] } },
          { ingredients: { $in: [searchRegex] } }
        ]
      },
      { isActive: true },
      filters
    ]
  }).sort({ 'rating.average': -1, createdAt: -1 });
};

// Instance methods
ProductSchema.methods.updateRating = function(newRating: number) {
  const totalRating = (this.rating.average * this.rating.count) + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

ProductSchema.methods.updateStock = function(quantity: number) {
  this.availability.quantity = Math.max(0, this.availability.quantity + quantity);
  this.availability.inStock = this.availability.quantity > 0;
  return this.save();
};

export default mongoose.model<IProduct, IProductModel>('Product', ProductSchema);
