# 🎂 Kake Bakery Backend API

A comprehensive Node.js backend with MongoDB and Firebase OTP authentication for the Kake bakery website.

## 🚀 Features

### 🔐 Authentication & Authorization
- **Firebase OTP Authentication** - Secure phone number verification
- **JWT Token Management** - Stateless authentication
- **User Profile Management** - Complete user data handling
- **Address Management** - Multiple delivery addresses per user
- **Admin Role Support** - Protected admin routes

### 📦 Product Management
- **Product Catalog** - Complete product CRUD operations
- **Category Management** - Organized product categories
- **Advanced Filtering** - Price, dietary, occasion-based filters
- **Search Functionality** - Full-text product search
- **Inventory Management** - Stock tracking and updates
- **SEO Optimization** - URL slugs and meta data

### 🛒 Order Management
- **Order Processing** - Complete order lifecycle
- **Real-time Status Updates** - Order tracking system
- **Payment Integration Ready** - COD, Online, Wallet support
- **Delivery Management** - Standard, Express, Scheduled delivery
- **Order History** - Complete user order tracking
- **Rating & Reviews** - Order and product ratings

### 💳 Business Features
- **Loyalty Points System** - Reward system for customers
- **Dynamic Pricing** - Support for discounts and offers
- **Delivery Fee Calculation** - Smart delivery fee logic
- **Tax Calculation** - Automated tax computation
- **Analytics Ready** - Order statistics and reporting

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Admin SDK
- **Language**: TypeScript
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB (local or Atlas)
- Firebase project with Admin SDK
- Cloudinary account (optional, for image uploads)

## ⚡ Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd kake-backend

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Enable Authentication > Phone provider
4. Go to Project Settings > Service Accounts
5. Generate new private key (JSON)
6. Extract values to your `.env` file

### 4. Database Setup

```bash
# Start MongoDB (if running locally)
mongod

# Seed sample data
npm run seed
```

### 5. Start Development Server

```bash
# Development mode with hot reload
npm run dev

# Production build and start
npm run build
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require Bearer token in Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### 🔐 Authentication Routes

#### Verify Firebase Token
```http
POST /api/auth/verify-token
Content-Type: application/json

{
  "idToken": "firebase-id-token",
  "userData": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com",
  "preferences": {
    "notifications": true,
    "marketing": false
  }
}
```

#### Add Address
```http
POST /api/auth/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "home",
  "name": "John Doe",
  "phone": "9876543210",
  "street": "123 Main Street",
  "houseNumber": "A-101",
  "landmark": "Near Park",
  "pincode": "110001",
  "city": "Delhi",
  "state": "Delhi",
  "isDefault": true
}
```

### 🛍 Product Routes

#### Get All Products
```http
GET /api/products?category=cakes&minPrice=100&maxPrice=1000&sort=price-low&page=1&limit=20
```

#### Get Featured Products
```http
GET /api/products/featured?limit=10
```

#### Get Products by Category
```http
GET /api/products/category/cakes?sort=popular&page=1
```

#### Get Single Product
```http
GET /api/products/:productId
```

#### Search Products
```http
GET /api/products?search=chocolate&category=cakes
```

### 🛒 Order Routes

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product-id",
      "quantity": 2,
      "customization": {
        "flavor": "chocolate",
        "size": "1kg",
        "decoration": "happy birthday"
      }
    }
  ],
  "deliveryAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "street": "123 Main Street",
    "houseNumber": "A-101",
    "pincode": "110001",
    "city": "Delhi",
    "state": "Delhi"
  },
  "paymentMethod": "cod",
  "deliveryDetails": {
    "type": "standard",
    "deliveryInstructions": "Call before delivery"
  },
  "notes": "Please handle with care"
}
```

#### Get User Orders
```http
GET /api/orders?page=1&limit=20&status=delivered
Authorization: Bearer <token>
```

#### Get Single Order
```http
GET /api/orders/:orderId
Authorization: Bearer <token>
```

#### Cancel Order
```http
PUT /api/orders/:orderId/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Changed mind"
}
```

#### Rate Order
```http
PUT /api/orders/:orderId/rating
Authorization: Bearer <token>
Content-Type: application/json

{
  "overall": 5,
  "food": 5,
  "delivery": 4,
  "comment": "Excellent cake and fast delivery!"
}
```

### 📊 Category Routes

#### Get All Categories
```http
GET /api/categories
```

#### Get Category Filters
```http
GET /api/categories/filters
```

### 👨‍💼 Admin Routes

#### Get All Orders (Admin)
```http
GET /api/orders/admin/all?status=pending&page=1&limit=50
Authorization: Bearer <admin-token>
```

#### Update Order Status (Admin)
```http
PUT /api/orders/:orderId/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Order confirmed and being prepared"
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment | No (default: development) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | Yes |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | Yes |
| `JWT_SECRET` | JWT secret key | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `CLOUDINARY_*` | Cloudinary config (optional) | No |

### Database Indexes

The application automatically creates indexes for:
- User: `firebaseUID`, `phone`, `email`
- Product: `category`, `slug`, `price`, `rating`
- Order: `userId`, `status`, `orderId`

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure MongoDB Atlas
- [ ] Set up Firebase project
- [ ] Configure Cloudinary (if using)
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up SSL/TLS

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📈 Monitoring

### Health Check
```http
GET /health
```

### Database Health
The health endpoint includes database connectivity status.

### Logging
- Development: Console logging with colors
- Production: JSON structured logging

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for frontend domain
- **Helmet Security**: Security headers enabled
- **Input Validation**: All inputs validated and sanitized
- **Firebase Auth**: Secure token verification
- **MongoDB Injection Protection**: Mongoose built-in protection

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@kakebakery.com
- Documentation: [API Docs](https://api.kakebakery.com/docs)

---

**Built with ❤️ for Kake Bakery**
