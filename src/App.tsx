import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Booking from "./pages/Booking";
import Activities from "./pages/Activities";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Buy from "./pages/Buy";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';
import AdminAddOns from './pages/AdminAddOns';
import GoogleAuthCallback from './pages/GoogleAuthCallback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CancellationsAndRefunds from './pages/CancellationsAndRefunds';
import ContactUs from './pages/ContactUs';
import Orders from './pages/Orders';
import MyOrders from './pages/MyOrders';
import AllOrders from './pages/AllOrders';
import CartCheckout from './pages/CartCheckout';
import AdminDIYOrders from './pages/AdminDIYOrders';
import PaymentProcessing from './pages/PaymentProcessing';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import CookieConsent from './components/CookieConsent';
import { initializeCookieConsent } from './utils/cookieConsent';
import { CartProvider } from './contexts/CartContext';
import { restoreSessionFromCookies } from './utils/auth';
import ProtectedRoute from './components/ProtectedRoute';
import { api } from './lib/api';

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
    // Initialize cookie consent on app load
    initializeCookieConsent();
    
    // Restore session on app load
    const restoreSession = async () => {
      const cookieConsent = localStorage.getItem('cookieConsent');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      
      // If we have user info but no consent, check if we can restore from localStorage
      if (userName && userEmail && cookieConsent !== 'accepted') {
        // Try to verify the token is still valid
        try {
          const response = await api.getCurrentUser();
          if (response.success && response.user) {
            // Session is valid
            console.log('Session restored from localStorage');
            window.dispatchEvent(new CustomEvent('authStateChanged'));
          } else {
            // Invalid session, clear it
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          // API call failed, but keep localStorage for now
          // It will be cleared on next failed API call
        }
      } else if (cookieConsent === 'accepted') {
        // Try to restore session from cookies
        const restored = await restoreSessionFromCookies();
        if (restored) {
          console.log('Session restored from cookies');
          window.dispatchEvent(new CustomEvent('authStateChanged'));
        }
      }
    };
    
    restoreSession();

    // Listen for storage changes (cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userName' || e.key === 'authToken') {
        // Auth state changed in another tab, dispatch event
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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/booking" element={<ProtectedRoute requireAuth={true}><Booking /></ProtectedRoute>} />
              <Route path="/activities" element={<ProtectedRoute requireAuth={true}><Activities /></ProtectedRoute>} />
              <Route path="/buy" element={<ProtectedRoute requireAuth={true}><Buy /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute requireAuth={true}><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute requireAuth={true}><Checkout /></ProtectedRoute>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/terms-of-service" element={<TermsAndConditions />} />
              <Route path="/cancellations-refunds" element={<CancellationsAndRefunds />} />
              <Route path="/refund-policy" element={<CancellationsAndRefunds />} />
              <Route path="/cancellation-policy" element={<CancellationsAndRefunds />} />
              <Route path="/returns" element={<CancellationsAndRefunds />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/orders" element={<ProtectedRoute requireAuth={true}><Orders /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute requireAuth={true}><MyOrders /></ProtectedRoute>} />
              <Route path="/all-orders" element={<ProtectedRoute requireAuth={true}><AllOrders /></ProtectedRoute>} />
              <Route path="/cart-checkout" element={<ProtectedRoute requireAuth={true}><CartCheckout /></ProtectedRoute>} />
              <Route path="/payment-processing" element={<PaymentProcessing />} />
              <Route path="/success" element={<PaymentSuccess />} />
              <Route path="/failed" element={<PaymentFailed />} />
              <Route path="/admin/dashboard/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
              <Route path="/admin/dashboard/diy-orders" element={<AdminRoute><AdminDIYOrders /></AdminRoute>} />
              <Route path="/admin/dashboard/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/dashboard/addons" element={<AdminRoute><AdminAddOns /></AdminRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
          </Router>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
