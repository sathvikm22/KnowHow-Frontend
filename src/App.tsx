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

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: JSX.Element }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/" replace />;
}

const App = () => {
  useEffect(() => {
    // Initialize cookie consent on app load
    initializeCookieConsent();
    
    // Restore session from cookies if consent is given
    const restoreSession = async () => {
      const cookieConsent = localStorage.getItem('cookieConsent');
      if (cookieConsent === 'accepted') {
        // Try to restore session from cookies
        const restored = await restoreSessionFromCookies();
        if (restored) {
          console.log('Session restored from cookies');
        }
      }
    };
    
    restoreSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/home" element={<Index />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
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
              <Route path="/orders" element={<Orders />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/all-orders" element={<AllOrders />} />
              <Route path="/cart-checkout" element={<CartCheckout />} />
              <Route path="/payment-processing" element={<PaymentProcessing />} />
              <Route path="/success" element={<PaymentSuccess />} />
              <Route path="/failed" element={<PaymentFailed />} />
              <Route path="/admin/dashboard/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
              <Route path="/admin/dashboard/diy-orders" element={<AdminRoute><AdminDIYOrders /></AdminRoute>} />
              <Route path="/admin/dashboard/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
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
