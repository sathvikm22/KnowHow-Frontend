// Get API base URL from environment variable
// VITE_API_URL should be the base URL (e.g., http://localhost:3000 or https://knowhow-backend.onrender.com)
// We append /api to it
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
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
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      
      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check if the backend is running.');
      }
      throw error;
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

  async getCurrentUser(): Promise<ApiResponse> {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  async logout(): Promise<ApiResponse> {
    try {
      // Try to call logout endpoint
      const result = await this.request('/auth/logout', {
        method: 'POST',
      });
      // Clear token from localStorage
      localStorage.removeItem('authToken');
      return result;
    } catch (error) {
      // Even if API call fails, clear local token
      localStorage.removeItem('authToken');
      return { success: true, message: 'Logged out successfully' };
    }
  }
}

export const api = new ApiClient(API_BASE_URL);

// Export standalone functions for easier importing
export const logout = () => api.logout();
export const getCurrentUser = () => api.getCurrentUser();

