# Know How Cafe - Frontend Application

A modern, responsive React-based web application for Know How Cafe - a creative workshop space and DIY kit e-commerce platform. Built with TypeScript, Vite, and Tailwind CSS, featuring a beautiful UI with shadcn/ui components.

## 🌐 Live Deployment

- **Production URL**: `https://www.knowhowindia.in`
- **Alternative URLs**: 
  - `https://know-how-frontend.vercel.app`
  - `https://know-how-frontend-rosy.vercel.app`
- **Hosting**: Vercel
- **Custom Domain**: `knowhowindia.in` (configured via Vercel DNS)

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Pages & Routes](#pages--routes)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Components](#components)
- [State Management](#state-management)
- [Deployment](#deployment)
- [Performance](#performance)

## 🛠 Tech Stack

### Core Framework
- **React**: 18.3.1 (Latest stable)
- **TypeScript**: 5.5.3 (Type safety)
- **Vite**: 7.2.4 (Build tool & dev server)

### Routing
- **React Router DOM**: 6.26.2
  - Client-side routing
  - Protected routes
  - Admin route guards

### UI Framework & Styling
- **Tailwind CSS**: 3.4.11
  - Utility-first CSS framework
  - Dark mode support
  - Responsive design
- **shadcn/ui**: Component library
  - Built on Radix UI primitives
  - Accessible components
  - Customizable design system

### UI Components (Radix UI)
- Accordion, Alert Dialog, Avatar
- Checkbox, Collapsible, Context Menu
- Dialog, Dropdown Menu, Hover Card
- Label, Menubar, Navigation Menu
- Popover, Progress, Radio Group
- Scroll Area, Select, Separator
- Slider, Switch, Tabs
- Toast, Toggle, Tooltip

### State Management
- **React Context API**: Cart management
- **React Query (TanStack Query)**: 5.56.2
  - Server state management
  - Caching & synchronization
  - Background updates

### Form Handling
- **React Hook Form**: 7.53.0
  - Form validation
  - Performance optimization
- **Zod**: 3.23.8
  - Schema validation
  - TypeScript integration
- **@hookform/resolvers**: 3.9.0

### HTTP Client
- **Axios**: 1.6.2
  - API communication
  - Request/response interceptors
  - Error handling

### Utilities
- **date-fns**: 3.6.0 (Date formatting)
- **jspdf**: 3.0.4 (PDF generation for receipts)
- **nanoid**: 5.1.6 (Unique ID generation)
- **lucide-react**: 0.462.0 (Icon library)
- **class-variance-authority**: 0.7.1 (Component variants)
- **clsx**: 2.1.1 (Conditional classnames)
- **tailwind-merge**: 2.5.2 (Tailwind class merging)

### Additional Libraries
- **recharts**: 2.12.7 (Charts for admin dashboard)
- **sonner**: 1.5.0 (Toast notifications)
- **next-themes**: 0.3.0 (Theme management)
- **embla-carousel-react**: 8.3.0 (Carousel component)
- **react-day-picker**: 8.10.1 (Date picker)
- **input-otp**: 1.2.4 (OTP input component)
- **cmdk**: 1.0.0 (Command menu)
- **vaul**: 0.9.3 (Drawer component)

### Development Tools
- **ESLint**: 9.9.0 (Code linting)
- **TypeScript ESLint**: 8.0.1
- **PostCSS**: 8.4.47
- **Autoprefixer**: 10.4.20

## ✨ Features

### User Features
- ✅ **Authentication**
  - Email/Password signup with OTP verification
  - Email/Password login
  - Google OAuth 2.0 login
  - Password reset via OTP
  - JWT token-based sessions
  - Persistent login state

- ✅ **Workshop Bookings**
  - Activity selection
  - Date & time slot selection
  - Combo packages
  - Participant count
  - Booking confirmation
  - Booking history
  - Booking cancellation
  - Booking updates

- ✅ **DIY Kit Shopping**
  - Browse DIY kits
  - Shopping cart functionality
  - Checkout process
  - Order tracking
  - Order history

- ✅ **Payment Processing**
  - Cashfree payment integration
  - Multiple payment methods (UPI, Cards, Net Banking)
  - Payment status tracking
  - Receipt generation (PDF)
  - Payment success/failure handling

- ✅ **User Profile**
  - View bookings
  - View orders
  - Update preferences

### Admin Features
- ✅ **Dashboard**
  - Bookings management
  - Orders management
  - User management
  - Analytics & statistics

- ✅ **Booking Management**
  - View all bookings
  - Filter & search
  - Update booking status
  - Cancel bookings
  - Process refunds

- ✅ **Order Management**
  - View all orders
  - Update delivery status
  - Track shipments
  - Order analytics

- ✅ **User Management**
  - View all users
  - User statistics
  - Activity tracking

### UI/UX Features
- ✅ **Responsive Design**
  - Mobile-first approach
  - Tablet optimization
  - Desktop layouts
  - Touch-friendly interactions

- ✅ **Dark Mode**
  - System preference detection
  - Manual toggle
  - Persistent theme selection

- ✅ **Accessibility**
  - ARIA labels
  - Keyboard navigation
  - Screen reader support
  - Focus management

- ✅ **Performance**
  - Code splitting
  - Lazy loading
  - Image optimization
  - Efficient re-renders

- ✅ **Cookie Consent**
  - GDPR compliance
  - User preference tracking
  - Consent management

## 📄 Pages & Routes

### Public Pages
- **`/`** - Login page
- **`/signup`** - User registration
- **`/forgot-password`** - Password reset
- **`/auth/google/callback`** - Google OAuth callback handler

### Authenticated Pages
- **`/home`** - Main landing page with:
  - Hero section
  - About section
  - Activities showcase
  - Events section
  - Statistics
  - Testimonials
  - Location
  - Contact form

- **`/booking`** - Workshop booking page
- **`/activities`** - Activities listing page
- **`/buy`** - DIY kits shopping page
- **`/cart`** - Shopping cart
- **`/cart-checkout`** - Cart checkout
- **`/checkout`** - Single item checkout
- **`/my-orders`** - User's order history
- **`/orders`** - Orders page (redirects to my-orders)

### Payment Pages
- **`/payment-processing`** - Payment processing page
- **`/success`** - Payment success page
- **`/failed`** - Payment failure page

### Admin Pages (Protected)
- **`/admin/dashboard/bookings`** - Admin bookings management
- **`/admin/dashboard/diy-orders`** - Admin DIY orders management
- **`/admin/dashboard/users`** - Admin user management

### Legal & Policy Pages
- **`/privacy-policy`** - Privacy policy
- **`/shipping-policy`** - Shipping policy
- **`/terms-and-conditions`** - Terms and conditions
- **`/cancellations-refunds`** - Cancellation & refund policy
- **`/contact-us`** - Contact page

### Utility Pages
- **`/all-orders`** - All orders view (admin/redirect)
- **`*`** - 404 Not Found page

## 📁 Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── lovable-uploads/      # Image assets
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components (49 files)
│   │   ├── About.tsx
│   │   ├── Activities.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── Contact.tsx
│   │   ├── CookieConsent.tsx
│   │   ├── Hero.tsx
│   │   ├── Loader.tsx
│   │   ├── Location.tsx
│   │   ├── Navigation.tsx
│   │   ├── Receipt.tsx
│   │   ├── Stats.tsx
│   │   └── Testimonials.tsx
│   ├── contexts/
│   │   └── CartContext.tsx   # Cart state management
│   ├── data/
│   │   └── diyKits.ts        # DIY kit data
│   ├── hooks/
│   │   ├── use-mobile.tsx   # Mobile detection hook
│   │   └── use-toast.ts     # Toast notification hook
│   ├── lib/
│   │   ├── api.ts           # API client configuration
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── Activities.tsx
│   │   ├── AdminBookings.tsx
│   │   ├── AdminDIYOrders.tsx
│   │   ├── AdminUsers.tsx
│   │   ├── AllOrders.tsx
│   │   ├── Booking.tsx
│   │   ├── Buy.tsx
│   │   ├── CancellationsAndRefunds.tsx
│   │   ├── Cart.tsx
│   │   ├── CartCheckout.tsx
│   │   ├── Checkout.tsx
│   │   ├── ContactUs.tsx
│   │   ├── Events.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── GoogleAuthCallback.tsx
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   ├── MyOrders.tsx
│   │   ├── NotFound.tsx
│   │   ├── Orders.tsx
│   │   ├── PaymentFailed.tsx
│   │   ├── PaymentProcessing.tsx
│   │   ├── PaymentSuccess.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── ShippingPolicy.tsx
│   │   ├── SignUp.tsx
│   │   └── TermsAndConditions.tsx
│   ├── utils/
│   │   ├── cookieConsent.ts  # Cookie consent utilities
│   │   └── generatePdf.ts   # PDF receipt generation
│   ├── App.tsx              # Main app component
│   ├── App.css
│   ├── index.css           # Global styles
│   ├── main.tsx            # App entry point
│   └── vite-env.d.ts       # Vite type definitions
├── components.json          # shadcn/ui configuration
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json
├── tsconfig.node.json
├── vercel.json             # Vercel deployment config
└── vite.config.ts          # Vite configuration
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ installed
- npm, yarn, or bun package manager
- Git

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd Know-How-Cafe-main/frontend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

### Step 3: Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=https://knowhow-backend-d2gs.onrender.com

# Google OAuth (if needed for frontend)
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Environment
VITE_ENV=production
```

### Step 4: Start Development Server

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

Application will start on `http://localhost:5173` (or next available port)

### Step 5: Build for Production

```bash
npm run build
# or
yarn build
```

Build output will be in `dist/` directory.

### Step 6: Preview Production Build

```bash
npm run preview
```

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | - |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | No | - |
| `VITE_ENV` | Environment (development/production) | No | development |

## 🧩 Components

### Layout Components
- **Navigation**: Main navigation bar with menu, user actions, dark mode toggle
- **AdminLayout**: Admin dashboard layout with sidebar navigation
- **CookieConsent**: Cookie consent banner (GDPR compliant)

### Page Components
- **Hero**: Landing page hero section
- **About**: About section
- **Activities**: Activities showcase
- **Stats**: Statistics section
- **Testimonials**: Customer testimonials
- **Location**: Location/map section
- **Contact**: Contact form section

### UI Components (shadcn/ui)
49 reusable UI components including:
- Buttons, Cards, Dialogs
- Forms, Inputs, Selects
- Tables, Tabs, Toasts
- And many more...

### Utility Components
- **Loader**: Loading spinner
- **Receipt**: PDF receipt generator

## 🔄 State Management

### React Context
- **CartContext**: Manages shopping cart state
  - Add/remove items
  - Update quantities
  - Clear cart
  - Persistent storage

### React Query
- Server state management
- API data caching
- Background refetching
- Optimistic updates

### Local Storage
- User authentication token
- User profile data
- Admin status
- Theme preference
- Cookie consent status

## 🚢 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Import GitHub repository to Vercel
   - Or use Vercel CLI: `vercel`

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   - Add `VITE_API_URL` in Vercel dashboard
   - Add other environment variables as needed

4. **Custom Domain**
   - Add custom domain in Vercel dashboard
   - Configure DNS records:
     - A record: `@` → Vercel IP
     - CNAME: `www` → cname.vercel-dns.com
   - SSL certificate auto-provisioned

5. **Deploy**
   - Automatic deployments on git push
   - Preview deployments for PRs
   - Production deployments from main branch

### Vercel Configuration (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This enables client-side routing for all paths.

### Post-Deployment Checklist

- [ ] Verify production URL loads correctly
- [ ] Test authentication flow
- [ ] Verify API connection
- [ ] Test payment flow
- [ ] Check mobile responsiveness
- [ ] Verify dark mode toggle
- [ ] Test all navigation links
- [ ] Verify cookie consent banner
- [ ] Check Google OAuth redirect
- [ ] Test PDF receipt generation

## ⚡ Performance

### Optimizations Implemented

1. **Code Splitting**
   - Route-based code splitting
   - Lazy loading for admin pages
   - Dynamic imports

2. **Image Optimization**
   - Optimized image formats
   - Lazy loading images
   - Responsive images

3. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Gzip compression (Vercel)

4. **Caching**
   - React Query caching
   - Browser caching
   - CDN caching (Vercel)

5. **Performance Metrics**
   - Lighthouse score optimization
   - Core Web Vitals optimization

### Build Output

Production build includes:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Source maps (optional)

## 🎨 Styling

### Tailwind CSS
- Utility-first approach
- Custom color palette
- Responsive breakpoints
- Dark mode variants

### Design System
- Consistent spacing scale
- Typography system
- Color palette
- Component variants

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔒 Security

### Implemented Security Measures

1. **Token Storage**
   - JWT tokens in localStorage
   - Secure token handling
   - Token expiration checks

2. **Route Protection**
   - Protected routes for authenticated users
   - Admin route guards
   - Redirect unauthorized access

3. **Input Validation**
   - Form validation with Zod
   - Client-side validation
   - Server-side validation (backend)

4. **XSS Protection**
   - React's built-in XSS protection
   - Sanitized user inputs
   - Safe HTML rendering

5. **HTTPS**
   - Enforced in production
   - Secure API communication

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Production build
npm run build:dev    # Development build

# Linting
npm run lint         # Run ESLint

# Preview
npm run preview      # Preview production build
```

### Code Style
- ESLint configuration
- TypeScript strict mode
- Prettier (recommended)

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify `VITE_API_URL` is set correctly
   - Check CORS settings on backend
   - Verify backend is running

2. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check Node.js version (18+)
   - Verify TypeScript types

3. **Routing Issues**
   - Verify `vercel.json` configuration
   - Check React Router setup
   - Ensure all routes are defined

4. **Payment Issues**
   - Verify Cashfree configuration
   - Check payment session creation
   - Verify webhook URLs

## 📞 Support

For issues, questions, or contributions:
- Check existing issues in the repository
- Review component documentation
- Verify environment variables
- Check browser console for errors

## 📄 License

[Your License Here]

---

**Built with ❤️ for Know How Cafe**
