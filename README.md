# Digital Premium Store

A modern, full-featured e-commerce platform built with Next.js 15 for selling digital products. This application includes both customer-facing features and a comprehensive admin dashboard for managing products, orders, users, and more.

## 🚀 Features

### Customer Features

- **Product Browsing**: Browse and search digital products with filtering and sorting
- **Shopping Cart**: Add products to cart and manage items
- **User Authentication**: Sign up, login, and Google OAuth integration
- **Order Management**: View orders, track delivery status, and manage expired products
- **User Dashboard**: Personal dashboard with order history and profile management
- **Product Reviews**: Rate and review purchased products
- **Blog System**: Read and explore blog posts
- **FAQ Section**: Frequently asked questions with interactive UI
- **Contact Form**: Reach out to support via contact form
- **Newsletter**: Subscribe to newsletter for updates

### Admin Features

- **Admin Dashboard**: Comprehensive dashboard with analytics
  - Total Products
  - Total Orders
  - Delivered Orders
  - Refund Orders
  - Canceled Orders
  - Total Sales
- **Product Management**: Add, edit, and manage digital products
- **Order Management**: View all orders with filtering system and search functionality
  - Filter orders by status
  - Recent orders display
  - Order actions on hover
  - Order search capability
- **Category Management**: Create and manage product categories and subcategories
- **User Management**: View and manage all registered users
- **Staff Management**: Manage admin staff members
- **Blog Management**: Create and manage blog posts
- **FAQ Management**: Add and manage frequently asked questions
- **Review Management**: Moderate product reviews
- **Wallet System**: Add wallet balance for users
- **Website Settings**: Configure website settings, social links, and contact information

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: React 19
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js (Credentials & Google OAuth)
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Image Upload**: Cloudinary
- **Email**: Nodemailer
- **State Management**: TanStack React Query
- **Notifications**: React Hot Toast
- **Icons**: Lucide React, React Icons
- **Animations**: Lottie React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm/yarn
- MongoDB database (local or cloud like MongoDB Atlas)
- Cloudinary account (for image uploads)
- Google OAuth credentials (optional, for Google login)

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd digital_premium_store
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Generate NextAuth Secret

You can generate a secure secret for NextAuth using:

```bash
openssl rand -base64 32
```

Or use any online random string generator.

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 6. Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📁 Project Structure

```
digital_premium_store/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (pages)/           # Public and protected pages
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   └── (user-dashboard)/ # User dashboard pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   └── ...               # Feature components
│   ├── lib/                  # Utility libraries
│   │   ├── mongoose.js       # Database connection
│   │   └── cloudinary.js     # Cloudinary config
│   ├── models/               # Mongoose models
│   └── provider/             # Context providers
├── public/                   # Static assets
└── package.json
```

## 🎨 Color Scheme

The project uses the following color palette:

- Primary: `#00befa` (Cyan Blue)
- Secondary: `#88e789` (Light Green)

## 🔐 Default Admin Credentials

**Note**: Change these credentials immediately after first login!

- Username: `monisaha774`
- Password: `CuYw70H9fvRXV3Ba`

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🌐 API Routes

The application includes various API routes for:

- Authentication (login, register, admin login, Google OAuth)
- Products (CRUD operations)
- Orders (create, update, fetch)
- Cart management
- User dashboard data
- Admin operations
- File uploads
- Contact form submissions

## 🚀 Deployment

This application can be deployed on platforms like:

- Vercel (recommended for Next.js)
- Netlify
- AWS
- DigitalOcean

Make sure to set all environment variables in your deployment platform's environment settings.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For any issues or suggestions, please contact the project maintainer.

## 📞 Support

For support, please use the contact form in the application or reach out to the development team.

---

**Note**: Remember to update the admin credentials and keep your environment variables secure. Never commit `.env.local` or any sensitive information to version control.
