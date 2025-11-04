import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  customization?: {
    flavor?: string;
    size?: string;
    decoration?: string;
    specialInstructions?: string;
  };
  subtotal: number;
}

export interface IDeliveryAddress {
  name: string;
  phone: string;
  street: string;
  houseNumber: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
}

export interface IOrder extends Document {
  orderId: string;
  userId: mongoose.Types.ObjectId;
  firebaseUID: string;
  items: IOrderItem[];
  deliveryAddress: IDeliveryAddress;
  orderSummary: {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'baking' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cod' | 'online' | 'wallet';
  paymentDetails?: {
    transactionId?: string;
    paymentGateway?: string;
    paidAt?: Date;
  };
  deliveryDetails: {
    type: 'standard' | 'express' | 'scheduled';
    scheduledDate?: Date;
    scheduledTime?: string;
    estimatedDelivery: Date;
    actualDelivery?: Date;
    deliveryInstructions?: string;
  };
  timeline: {
    orderPlaced: Date;
    orderConfirmed?: Date;
    preparationStarted?: Date;
    readyForDelivery?: Date;
    outForDelivery?: Date;
    delivered?: Date;
    cancelled?: Date;
  };
  notes?: string;
  cancellationReason?: string;
  rating?: {
    overall: number;
    food: number;
    delivery: number;
    comment?: string;
    ratedAt: Date;
  };
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  weight: {
    type: String,
    required: true
  },
  customization: {
    flavor: String,
    size: String,
    decoration: String,
    specialInstructions: String
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const DeliveryAddressSchema = new Schema<IDeliveryAddress>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  houseNumber: {
    type: String,
    required: true,
    trim: true
  },
  landmark: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  firebaseUID: {
    type: String,
    required: true,
    index: true
  },
  items: [OrderItemSchema],
  deliveryAddress: {
    type: DeliveryAddressSchema,
    required: true
  },
  orderSummary: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'baking', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'wallet'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    paymentGateway: String,
    paidAt: Date
  },
  deliveryDetails: {
    type: {
      type: String,
      enum: ['standard', 'express', 'scheduled'],
      default: 'standard'
    },
    scheduledDate: Date,
    scheduledTime: String,
    estimatedDelivery: {
      type: Date,
      required: true
    },
    actualDelivery: Date,
    deliveryInstructions: String
  },
  timeline: {
    orderPlaced: {
      type: Date,
      default: Date.now
    },
    orderConfirmed: Date,
    preparationStarted: Date,
    readyForDelivery: Date,
    outForDelivery: Date,
    delivered: Date,
    cancelled: Date
  },
  notes: String,
  cancellationReason: String,
  rating: {
    overall: {
      type: Number,
      min: 1,
      max: 5
    },
    food: {
      type: Number,
      min: 1,
      max: 5
    },
    delivery: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    ratedAt: Date
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ firebaseUID: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ 'deliveryDetails.estimatedDelivery': 1 });
OrderSchema.index({ orderId: 1 });

// Virtual for order age in hours
OrderSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
});

// Virtual for delivery status
OrderSchema.virtual('deliveryStatus').get(function() {
  const now = new Date();
  const estimated = this.deliveryDetails.estimatedDelivery;
  
  if (this.status === 'delivered') return 'delivered';
  if (this.status === 'cancelled') return 'cancelled';
  if (this.status === 'out-for-delivery') return 'in-transit';
  if (now > estimated) return 'delayed';
  return 'on-time';
});

// Pre-save middleware to generate order ID
OrderSchema.pre('save', function(next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.orderId = `KAKE${timestamp}${random}`.toUpperCase();
  }
  
  // Update timeline based on status changes
  if (this.isModified('status')) {
    const now = new Date();
    switch (this.status) {
      case 'confirmed':
        if (!this.timeline.orderConfirmed) this.timeline.orderConfirmed = now;
        break;
      case 'preparing':
        if (!this.timeline.preparationStarted) this.timeline.preparationStarted = now;
        break;
      case 'ready':
        if (!this.timeline.readyForDelivery) this.timeline.readyForDelivery = now;
        break;
      case 'out-for-delivery':
        if (!this.timeline.outForDelivery) this.timeline.outForDelivery = now;
        break;
      case 'delivered':
        if (!this.timeline.delivered) {
          this.timeline.delivered = now;
          this.deliveryDetails.actualDelivery = now;
        }
        break;
      case 'cancelled':
        if (!this.timeline.cancelled) this.timeline.cancelled = now;
        break;
    }
  }
  
  next();
});

// Static methods
OrderSchema.statics.findByUser = function(userId: string, limit: number = 20) {
  return this.find({ 
    $or: [
      { userId: mongoose.Types.ObjectId.isValid(userId) ? userId : null },
      { firebaseUID: userId }
    ]
  })
  .populate('items.productId', 'name images category')
  .sort({ createdAt: -1 })
  .limit(limit);
};

OrderSchema.statics.findByStatus = function(status: string, limit: number = 50) {
  return this.find({ status })
    .populate('userId', 'name phone')
    .populate('items.productId', 'name category')
    .sort({ createdAt: -1 })
    .limit(limit);
};

OrderSchema.statics.getOrderStats = function(startDate?: Date, endDate?: Date) {
  const match: any = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = startDate;
    if (endDate) match.createdAt.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$orderSummary.total' },
        averageOrderValue: { $avg: '$orderSummary.total' },
        statusBreakdown: {
          $push: {
            status: '$status',
            total: '$orderSummary.total'
          }
        }
      }
    }
  ]);
};

// Instance methods
OrderSchema.methods.updateStatus = function(newStatus: string, notes?: string) {
  this.status = newStatus;
  if (notes) this.notes = notes;
  return this.save();
};

OrderSchema.methods.addRating = function(ratingData: any) {
  this.rating = {
    ...ratingData,
    ratedAt: new Date()
  };
  return this.save();
};

OrderSchema.methods.calculateDeliveryTime = function() {
  if (this.timeline.delivered && this.timeline.orderPlaced) {
    return Math.floor((this.timeline.delivered.getTime() - this.timeline.orderPlaced.getTime()) / (1000 * 60));
  }
  return null;
};

export default mongoose.model<IOrder>('Order', OrderSchema);
