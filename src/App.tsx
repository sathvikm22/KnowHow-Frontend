import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import CookieConsent from './components/CookieConsent';
import { initializeCookieConsent } from './utils/cookieConsent';
import { CartProvider } from './contexts/CartContext';
import { restoreSessionFromCookies } from './utils/auth';
import ProtectedRoute from './components/ProtectedRoute';

// Keep the landing page immediately available and defer route code until a visitor needs it.
// This preserves all existing routes and UI while reducing the initial JavaScript download.
const NotFound = lazy(() => import('./pages/NotFound'));
const Booking = lazy(() => import('./pages/Booking'));
const Activities = lazy(() => import('./pages/Activities'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Buy = lazy(() => import('./pages/Buy'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const AdminBookings = lazy(() => import('./pages/AdminBookings'));
const AdminAddOns = lazy(() => import('./pages/AdminAddOns'));
const GoogleAuthCallback = lazy(() => import('./pages/GoogleAuthCallback'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const CancellationRefundPolicy = lazy(() => import('./pages/CancellationRefundPolicy'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Orders = lazy(() => import('./pages/Orders'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const AllOrders = lazy(() => import('./pages/AllOrders'));
const CartCheckout = lazy(() => import('./pages/CartCheckout'));
const AdminDIYOrders = lazy(() => import('./pages/AdminDIYOrders'));
const PaymentProcessing = lazy(() => import('./pages/PaymentProcessing'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailed = lazy(() => import('./pages/PaymentFailed'));

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: JSX.Element }) {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      {children}
    </ProtectedRoute>
  );
}

const App = () => {
  useEffect(() => {
    initializeCookieConsent();

    const restoreSession = async () => {
      const userName = localStorage.getItem('userName');
      // Protected pages verify existing sessions. Avoid a second /auth/me call
      // on each admin reload, which caused the route to remount and flicker.
      if (userName) return;
      await restoreSessionFromCookies();
    };

    restoreSession();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userName' || e.key === 'userEmail') {
        window.dispatchEvent(new CustomEvent('authStateChanged'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Suspense fallback={null}>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/shipping" element={<Navigate to="/shipping-policy" replace />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
              <Route path="/terms-of-service" element={<Navigate to="/terms-and-conditions" replace />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
              <Route path="/cancellations-refunds" element={<CancellationRefundPolicy />} />
              <Route path="/orders" element={<ProtectedRoute requireAuth={true}><Orders /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute requireAuth={true}><MyOrders /></ProtectedRoute>} />
              <Route path="/all-orders" element={<ProtectedRoute requireAuth={true}><AllOrders /></ProtectedRoute>} />
              <Route path="/cart-checkout" element={<CartCheckout />} />
              <Route path="/payment-processing" element={<PaymentProcessing />} />
              <Route path="/success" element={<PaymentSuccess />} />
              <Route path="/failed" element={<PaymentFailed />} />
              <Route path="/admin/dashboard/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
              <Route path="/admin/dashboard/diy-orders" element={<AdminRoute><AdminDIYOrders /></AdminRoute>} />
              <Route path="/admin/dashboard/addons" element={<AdminRoute><AdminAddOns /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <CookieConsent />
          </Router>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
