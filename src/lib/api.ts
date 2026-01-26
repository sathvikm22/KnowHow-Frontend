const PRODUCTION_BACKEND = 'https://knowhow-backend-d2gs.onrender.com';

const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');
  if (typeof window !== 'undefined') {
    const h = window.location.hostname;
    if (h === 'www.knowhowindia.in' || h === 'knowhowindia.in') return PRODUCTION_BACKEND;
  }
  return 'http://localhost:3000';
};

const API_BASE = getBackendUrl();
const API_BASE_URL = `${API_BASE}/api`;

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
  verified?: boolean;
  expiresIn?: number;
  isAdmin?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Remove leading slash from endpoint if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;
    
    // Validate URL
    if (!url || url === 'undefined' || !url.startsWith('http')) {
      console.error('Invalid API URL:', url, 'Base URL:', this.baseUrl);
      throw new Error(`Invalid API URL: ${url}. Please check VITE_BACKEND_URL environment variable.`);
    }
    
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Always include credentials for HttpOnly cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // NO Authorization header - tokens are in HttpOnly cookies only
    // This prevents XSS token theft

    try {
      console.log('API Request:', { 
        method: options.method || 'GET', 
        url, 
        baseUrl: this.baseUrl,
        body: options.body ? JSON.parse(options.body) : undefined
      });
      
      // Add timeout for mobile browsers (30 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      config.signal = controller.signal;
      
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      console.log('API Response:', { 
        status: response.status, 
        statusText: response.statusText,
        success: data.success, 
        message: data.message,
        hasData: !!data.data,
        fullResponse: JSON.stringify(data, null, 2)
      });
      
      // For 400 errors, return the data so frontend can check response.success
      // This allows proper error handling for validation errors, duplicate emails, etc.
      if (!response.ok && response.status === 400 && data.success === false) {
        return data;
      }
      
      // Handle 401/403 - try to refresh token automatically
      if (response.status === 401 || response.status === 403) {
        // Try to refresh access token using refresh token
        try {
          // Refresh endpoint is at /api/auth/refresh (baseUrl is already /api)
          const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (refreshResponse.ok) {
            // Retry original request with new access token
            return this.request<T>(endpoint, options);
          } else {
            // Refresh failed - user needs to login again
            // Clear any stale auth state
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('isAdmin');
            window.dispatchEvent(new CustomEvent('userLoggedOut'));
            
            const errorMessage = data.message || data.error || 'Session expired. Please login again.';
            const error = new Error(errorMessage);
            (error as any).status = response.status;
            throw error;
          }
        } catch (refreshError) {
          // Refresh failed - clear auth state
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('isAdmin');
          window.dispatchEvent(new CustomEvent('userLoggedOut'));
          
          const errorMessage = data.message || data.error || 'Session expired. Please login again.';
          const error = new Error(errorMessage);
          (error as any).status = response.status;
          throw error;
        }
      }

      // For other errors, throw with detailed error info
      if (!response.ok) {
        const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
        const error = new Error(errorMessage);
        // Attach error details for better debugging
        (error as any).details = data.details;
        (error as any).status = data.status || response.status;
        (error as any).statusText = data.statusText || response.statusText;
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      console.error('Failed URL:', url);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      // Handle network errors with more specific messages
      if (error instanceof TypeError || error.name === 'TypeError') {
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('aborted')) {
          const backendUrl = API_BASE;
          throw new Error(
            `Network error: Unable to connect to backend. ` +
            `Please check your internet connection and try again. ` +
            `If the problem persists, the server may be temporarily unavailable.`
          );
        }
        if (error.message.includes('CORS')) {
          throw new Error('CORS error: The backend server is not allowing requests from this origin. Please check CORS configuration.');
        }
      }
      
      // Handle AbortError (timeout)
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: The server took too long to respond. Please check your connection and try again.');
      }
      
      // Re-throw with original error message if it's already descriptive
      if (error.message && !error.message.includes('Network error')) {
        throw error;
      }
      
      throw new Error(error.message || 'An unexpected error occurred. Please try again.');
    }
  }

  // Auth endpoints
  async sendSignupOTP(email: string, name: string): Promise<ApiResponse> {
    return this.request('/auth/signup/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  }

  async verifySignupOTP(email: string, otp: string): Promise<ApiResponse> {
    return this.request('/auth/signup/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async completeSignup(
    email: string,
    name: string,
    password: string
  ): Promise<ApiResponse> {
    return this.request('/auth/signup/complete', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async sendForgotPasswordOTP(email: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyForgotPasswordOTP(
    email: string,
    otp: string
  ): Promise<ApiResponse> {
    return this.request('/auth/forgot-password/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async resetPassword(
    email: string,
    password: string
  ): Promise<ApiResponse> {
    return this.request('/auth/forgot-password/reset', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async completeGoogleSignIn(code: string): Promise<ApiResponse> {
    return this.request('/auth/google/complete', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async getCurrentUser(): Promise<ApiResponse> {
    const response = await this.request('/auth/me', {
      method: 'GET',
    });
    
    // Update localStorage with user info from backend (non-sensitive UI state only)
    if (response.success && response.user) {
      localStorage.setItem('userName', response.user.name);
      localStorage.setItem('userEmail', response.user.email);
      // DO NOT store phone/address in localStorage - fetch from backend when needed
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse> {
    try {
      // Call logout endpoint (clears HttpOnly cookies on backend)
      const result = await this.request('/auth/logout', {
        method: 'POST',
      });
      // Clear user info from localStorage (no tokens stored)
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('deliveryPhone');
      localStorage.removeItem('deliveryAddress');
      // Dispatch logout event for components to react
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      return result;
    } catch (error) {
      // Even if API call fails, clear local user info
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('deliveryPhone');
      localStorage.removeItem('deliveryAddress');
      // Dispatch logout event for components to react
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      return { success: true, message: 'Logged out successfully' };
    }
  }

  async getCookieConsent(): Promise<ApiResponse<{ cookieConsent: 'accepted' | 'declined' | null }>> {
    return this.request('/auth/cookie-consent', {
      method: 'GET',
    });
  }

  async updateCookieConsent(consent: 'accepted' | 'declined'): Promise<ApiResponse> {
    return this.request('/auth/cookie-consent', {
      method: 'POST',
      body: JSON.stringify({ consent }),
    });
  }

  // Cart endpoints
  async getCart(): Promise<ApiResponse<{ cart: Array<{ id: string; kit_name: string; price: number; quantity: number }> }>> {
    return this.request('/auth/cart', {
      method: 'GET',
    });
  }

  async addToCart(kitName: string, price: number, quantity: number = 1): Promise<ApiResponse> {
    return this.request('/auth/cart/add', {
      method: 'POST',
      body: JSON.stringify({ kitName, price, quantity }),
    });
  }

  async updateCartItem(kitName: string, quantity: number): Promise<ApiResponse> {
    return this.request('/auth/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ kitName, quantity }),
    });
  }

  async removeFromCart(kitName: string): Promise<ApiResponse> {
    return this.request('/auth/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ kitName }),
    });
  }

  async clearCart(): Promise<ApiResponse> {
    return this.request('/auth/cart/clear', {
      method: 'DELETE',
    });
  }

  // Payment endpoints
  async createOrder(amount: number, slotDetails: any): Promise<ApiResponse<{ order_id: string; payment_session_id: string; amount: number; currency: string }>> {
    return this.request('/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, slotDetails }),
    });
  }

  async verifyPayment(orderId: string, paymentId: string): Promise<ApiResponse> {
    return this.request('/verify-payment', {
      method: 'POST',
      body: JSON.stringify({
        cashfree_order_id: orderId,
        cashfree_payment_id: paymentId,
      }),
    });
  }

  async checkPaymentStatus(orderId: string): Promise<ApiResponse<{ payment_status: string; booking_status: string; booking: any }>> {
    return this.request(`/check-payment-status/${orderId}`, {
      method: 'GET',
    });
  }

  async getMyBookings(): Promise<ApiResponse<{ bookings: any[] }>> {
    return this.request('/my-bookings', {
      method: 'GET',
    });
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<ApiResponse> {
    return this.request(`/cancel-booking/${bookingId}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async updateBooking(
    bookingId: string, 
    bookingDate: string, 
    bookingTimeSlot: string,
    newActivityName?: string,
    newActivityPrice?: string
  ): Promise<ApiResponse> {
    return this.request(`/update-booking/${bookingId}`, {
      method: 'POST',
      body: JSON.stringify({ 
        booking_date: bookingDate, 
        booking_time_slot: bookingTimeSlot,
        new_activity_name: newActivityName,
        new_activity_price: newActivityPrice
      }),
    });
  }

  async getAvailableSlots(activityName: string, bookingDate: string): Promise<ApiResponse<{ available_slots: string[]; all_slots: string[]; booked_slots: string[] }>> {
    return this.request(`/available-slots?activity_name=${encodeURIComponent(activityName)}&booking_date=${encodeURIComponent(bookingDate)}`, {
      method: 'GET',
    });
  }

  // DIY Orders endpoints
  async createDIYOrder(amount: number, orderData: any): Promise<ApiResponse<{ order_id: string; payment_session_id: string; amount: number; currency: string }>> {
    return this.request('/create-diy-order', {
      method: 'POST',
      body: JSON.stringify({ amount, orderData }),
    });
  }

  async verifyDIYPayment(orderId: string, paymentId: string): Promise<ApiResponse> {
    return this.request('/verify-diy-payment', {
      method: 'POST',
      body: JSON.stringify({
        cashfree_order_id: orderId,
        cashfree_payment_id: paymentId,
      }),
    });
  }

  async getMyDIYOrders(): Promise<ApiResponse<{ orders: any[] }>> {
    return this.request('/my-diy-orders', {
      method: 'GET',
    });
  }

  async getAllDIYOrders(): Promise<ApiResponse<{ orders: any[] }>> {
    return this.request('/all-diy-orders', {
      method: 'GET',
    });
  }

  async updateDeliveryStatus(orderId: string, deliveryStatus: string, deliveryTime?: string): Promise<ApiResponse> {
    return this.request(`/update-delivery-status/${orderId}`, {
      method: 'POST',
      body: JSON.stringify({ delivery_status: deliveryStatus, delivery_time: deliveryTime }),
    });
  }

  async checkDIYPaymentStatus(orderId: string): Promise<ApiResponse<{ payment_status: string; order: any }>> {
    return this.request(`/check-diy-payment-status/${orderId}`, {
      method: 'GET',
    });
  }

  // Note: Cashfree doesn't use signature verification like Razorpay
  // Payment verification is done server-side using payment_id

  async getAllUsers(): Promise<ApiResponse<{ users: any[] }>> {
    return this.request('/auth/all-users', {
      method: 'GET',
    });
  }

  async getAllBookings(): Promise<ApiResponse<{ bookings: any[] }>> {
    return this.request('/all-bookings', {
      method: 'GET',
    });
  }

  // Add Ons endpoints
  async getActivities(): Promise<ApiResponse<{ activities: any[] }>> {
    return this.request('/addons/activities', {
      method: 'GET',
    });
  }

  async getDIYKits(): Promise<ApiResponse<{ kits: any[] }>> {
    return this.request('/addons/diy-kits', {
      method: 'GET',
    });
  }

  async getDIYKitByName(name: string): Promise<ApiResponse<{ kit: any }>> {
    return this.request(`/addons/diy-kits/name/${encodeURIComponent(name)}`, {
      method: 'GET',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export { API_BASE };

export const logout = () => api.logout();
export const getCurrentUser = () => api.getCurrentUser();

