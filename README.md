# Biolex Pharmaceutical Website

A modern, professional pharmaceutical B2B website for Biolex Pharmaceutical Private Limited. Built with React, TypeScript, and Tailwind CSS, this platform connects wholesalers and healthcare professionals with quality pharmaceutical products.

## 🚀 Features

### Frontend (React + TypeScript + Tailwind CSS)

#### Public Pages
- **Home Page**: Hero section, featured categories, company overview, and call-to-action sections
- **About Us**: Complete company information, values, mission, and vision
- **Products**: Dynamic product listing with category filters and search functionality
- **Contact**: Contact form with company details and location information

#### Admin Panel
- **Secure Login**: JWT-based authentication
- **Dashboard**: Overview of products, categories, and inquiries
- **Product Management**: Add, edit, delete products with image upload support
- **Category Management**: Manage product categories
- **Inquiry Management**: View and manage customer inquiries with status tracking

### Key Features
- ✅ ISO 9001:2015 certified company branding
- ✅ No pricing displayed (B2B inquiry-based model)
- ✅ Product inquiry system for all products
- ✅ Responsive design (mobile-first approach)
- ✅ Professional pharmaceutical UI/UX
- ✅ Loading states and empty states
- ✅ Toast notifications for user feedback
- ✅ Protected routes for admin access

## 📁 Project Structure

```
/tmp/sandbox/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/               # Reusable UI components
│   │   │   ├── Navbar.tsx        # Main navigation
│   │   │   ├── Footer.tsx        # Footer component
│   │   │   ├── InquiryModal.tsx  # Product inquiry modal
│   │   │   └── ProtectedRoute.tsx # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.tsx          # Home page
│   │   │   ├── About.tsx         # About page
│   │   │   ├── Products.tsx      # Products listing
│   │   │   ├── Contact.tsx       # Contact page
│   │   │   ├── AdminLogin.tsx    # Admin login
│   │   │   └── AdminDashboard.tsx # Admin dashboard
│   │   ├── services/
│   │   │   └── api.ts            # API service layer
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript types
│   │   └── App.tsx               # Main app component
│   └── styles/
│       ├── tailwind.css
│       ├── theme.css
│       └── fonts.css
├── .env.example                  # Environment variables template
├── package.json
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4.x** - Styling
- **React Router 7.x** - Routing
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **Radix UI** - UI components

## 📋 Prerequisites

- Node.js 18+ installed
- pnpm (preferred) or npm
- A running Node.js + Express + MongoDB backend

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your backend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
pnpm build
# or
npm run build
```

## 🔌 Backend Integration

This frontend is designed to work with a Node.js + Express + MongoDB backend. You need to set up the backend with the following API endpoints:

### Required API Endpoints

#### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

#### Inquiries
- `GET /api/inquiries` - Get all inquiries (Admin only)
- `POST /api/inquiries` - Create inquiry
- `PATCH /api/inquiries/:id/status` - Update inquiry status (Admin only)

### API Response Format

All API responses should follow this format:

```typescript
{
  success: boolean;
  data?: any;
  message?: string;
}
```

### Backend Setup Requirements

1. **MongoDB Atlas Database**
   - Create a MongoDB Atlas cluster
   - Set up database collections: products, categories, inquiries, admins

2. **Environment Variables** (Backend)
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

3. **CORS Configuration**
   - Enable CORS for frontend URL
   - Example: `http://localhost:5173`

4. **Image Upload**
   - Implement image upload using Cloudinary or local storage
   - Return image URL in product creation response

## 📊 Database Schema (MongoDB)

### Admin Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string (hashed),
  createdAt: Date
}
```

### Category Collection
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  createdAt: Date
}
```

### Product Collection
```typescript
{
  _id: ObjectId,
  name: string,
  category: ObjectId (ref: Category),
  description: string,
  image: string (URL),
  createdAt: Date
}
```

### Inquiry Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  phone: string,
  message: string,
  productId: ObjectId (ref: Product, optional),
  status: 'pending' | 'contacted' | 'resolved',
  createdAt: Date
}
```

## 🔐 Admin Access

To create an admin account, you'll need to add a user directly to your MongoDB database with a hashed password. Use bcrypt to hash the password:

```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = bcrypt.hashSync('your_password', 10);
```

Example admin document:
```javascript
{
  name: "Admin",
  email: "admin@biolexpharmaceutical.com",
  password: hashedPassword
}
```

## 🎨 Customization

### Updating Company Information

Edit the following files to update company details:
- `src/app/components/Navbar.tsx` - Header contact info
- `src/app/components/Footer.tsx` - Footer details
- `src/app/pages/About.tsx` - Complete company information
- `src/app/pages/Contact.tsx` - Contact page details

### Styling

The project uses Tailwind CSS. Customize the theme in:
- `src/styles/theme.css` - CSS custom properties
- `src/styles/tailwind.css` - Tailwind configuration

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚨 Important Notes

1. **No Static Data**: All data comes from API calls. Make sure your backend is running.
2. **Empty States**: Proper empty states are shown when no data is available.
3. **Loading States**: Loading indicators are displayed during API calls.
4. **Error Handling**: All API calls include error handling with toast notifications.
5. **Authentication**: Admin routes are protected and require JWT authentication.

## 🔧 Development Tips

1. **API Testing**: Test all API endpoints using Postman before integrating
2. **CORS Issues**: Ensure backend CORS is properly configured
3. **Image Upload**: Implement proper image validation and upload on backend
4. **JWT Expiry**: Set appropriate JWT expiry times (e.g., 7 days)
5. **Validation**: Add input validation on both frontend and backend

## 📝 Environment Variables

Create a `.env` file with:

```env
# Backend API URL (required)
VITE_API_URL=http://localhost:5000/api

# Optional: Add Cloudinary config if using direct upload from frontend
# VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
# VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🐛 Troubleshooting

### Issue: API calls failing
- **Solution**: Check if backend is running and VITE_API_URL is correct

### Issue: Images not displaying
- **Solution**: Verify image URLs are accessible and CORS is enabled

### Issue: Admin login not working
- **Solution**: Ensure admin account exists in database with correct credentials

### Issue: Protected routes redirecting
- **Solution**: Check if JWT token is stored in localStorage and is valid

## 📄 License

Private - Biolex Pharmaceutical Private Limited

## 👨‍💼 Company Information

- **Company Name**: Biolex Pharmaceutical Private Limited
- **CEO**: Ravi Kumar Bhalla
- **Location**: Manimajra, Chandigarh, India
- **Business Type**: Wholesaler / Distributor
- **Established**: 2021
- **Certification**: ISO 9001:2015

## 📧 Support

For technical support or inquiries:
- Email: info@biolexpharmaceutical.com
- Phone: +91 123 456 7890

---

Built with ❤️ for Biolex Pharmaceutical Private Limited
