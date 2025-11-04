import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for static methods
export interface ICategoryModel extends Model<ICategory> {
  findActive(): any;
  findByName(name: string): any;
}

const CategorySchema = new Schema<ICategory>({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Category name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    type: String,
    required: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid image URL']
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  sortOrder: {
    type: Number,
    default: 0,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
CategorySchema.index({ name: 1 });
CategorySchema.index({ isActive: 1, sortOrder: 1 });

// Static methods
CategorySchema.statics.findActive = function(limit?: number) {
  const query = this.find({ isActive: true }).sort({ sortOrder: 1 });
  if (limit) {
    query.limit(limit);
  }
  return query;
};

CategorySchema.statics.findByName = function(name: string) {
  return this.findOne({ name: new RegExp(name, 'i') });
};

// Virtual for product count (to be populated when needed)
CategorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

const Category = mongoose.model<ICategory, ICategoryModel>('Category', CategorySchema);

export default Category;
