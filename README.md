E-Commerce Backend API
Welcome to the E-Commerce Backend API! This project provides a comprehensive backend solution for managing e-commerce operations, including user management, product listings, order processing, and advanced features like email verification, password management, and multimedia handling.

Table of Contents
Features
Technologies
Installation
Configuration
Usage


Features
User Management:
User registration and login
Email verification
Password reset (forgot and change)
Product Management:
Product CRUD operations
Sub-category management
Brand management
Order Management:
Shopping cart functionality
Order creation and tracking
Coupon Management:
Create and apply coupons
Payment Integration:
Stripe/PayPal support
File Handling:
Image upload with Multer and Cloudinary
Date and Time Management:
Using Moment.js for date and time handling
Security:
Password hashing with Bcryptjs
Utilities:
URL slug generation with Slugify

Technologies
Backend Framework: Node.js with Express
Database: MongoDB
Authentication: JWT (JSON Web Tokens) with Bcryptjs
Payment Gateway: PayPal
File Storage: Cloudinary with Multer
Date Management: Moment.js
Environment Management: dotenv
URL Slug Generation: Slugify


Configuration
Ensure you have the following configurations set in your .env file:

PORT: Port number for the server.
MONGODB_URI: Connection string for your MongoDB database.
JWT_SECRET: Secret key for signing JWT tokens.
STRIPE_SECRET_KEY: Secret key for Stripe payment processing.

Usage
The backend API is accessible at http://localhost:5000.

Example Endpoints
User Registration: POST /api/users/register
User Login: POST /api/users/login
Email Verification: GET /api/users/verify-email/:token
Forgot Password: POST /api/users/forgot-password
Reset Password: POST /api/users/reset-password/:token
Get Products: GET /api/products
Create Product: POST /api/products
Upload Image: POST /api/upload
Create Order: POST /api/orders
Apply Coupon: POST /api/coupons/apply
Cart Management
Add to Cart: POST /api/cart
Get Cart: GET /api/cart
Update Cart: PUT /api/cart/:itemId
Remove from Cart: DELETE /api/cart/:itemId
For more detailed information on endpoints and usage, refer to the API Documentation.