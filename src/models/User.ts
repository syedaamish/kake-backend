import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firebaseUID: string;
  phone: string;
  name?: string;
  email?: string;
  dateOfBirth?: Date;
  addresses: IAddress[];
  preferences: {
    notifications: boolean;
    marketing: boolean;
    language: string;
  };
  loyaltyPoints: number;
  isActive: boolean;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  _id?: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  street: string;
  houseNumber: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
  isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>({
  type: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
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
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const UserSchema = new Schema<IUser>({
  firebaseUID: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  dateOfBirth: {
    type: Date
  },
  addresses: [AddressSchema],
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    marketing: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi']
    }
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
UserSchema.index({ firebaseUID: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for user's full address
UserSchema.virtual('defaultAddress').get(function() {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
});

// Pre-save middleware to ensure only one default address
UserSchema.pre('save', function(next) {
  if (this.addresses && this.addresses.length > 0) {
    const defaultAddresses = this.addresses.filter(addr => addr.isDefault);
    if (defaultAddresses.length > 1) {
      // Keep only the first default address
      this.addresses.forEach((addr, index) => {
        if (index > 0 && addr.isDefault) {
          addr.isDefault = false;
        }
      });
    } else if (defaultAddresses.length === 0 && this.addresses && this.addresses.length > 0) {
      // Set first address as default
      const firstAddress = this.addresses[0];
      if (firstAddress) {
        firstAddress.isDefault = true;
      }
    }
  }
  next();
});

// Instance methods
UserSchema.methods.addAddress = function(addressData: Partial<IAddress>) {
  // If this is the first address or marked as default, make it default
  if (this.addresses.length === 0 || addressData.isDefault) {
    this.addresses.forEach((addr: IAddress) => {
      addr.isDefault = false;
    });
    addressData.isDefault = true;
  }
  
  this.addresses.push(addressData);
  return this.save();
};

UserSchema.methods.updateAddress = function(addressId: string, updateData: Partial<IAddress>) {
  const address = this.addresses.id(addressId);
  if (!address) {
    throw new Error('Address not found');
  }
  
  // If setting as default, unset other defaults
  if (updateData.isDefault) {
    this.addresses.forEach((addr: IAddress) => {
      if (addr._id?.toString() !== addressId) {
        addr.isDefault = false;
      }
    });
  }
  
  Object.assign(address, updateData);
  return this.save();
};

UserSchema.methods.removeAddress = function(addressId: string) {
  const address = this.addresses.id(addressId);
  if (!address) {
    throw new Error('Address not found');
  }
  
  const wasDefault = address.isDefault;
  this.addresses.pull({ _id: addressId });
  
  // If removed address was default, make first remaining address default
  if (wasDefault && this.addresses.length > 0) {
    this.addresses[0].isDefault = true;
  }
  
  return this.save();
};

export default mongoose.model<IUser>('User', UserSchema);
