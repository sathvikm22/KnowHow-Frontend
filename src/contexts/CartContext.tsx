import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface CartItem {
  id: string;
  kit_name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  loading: boolean;
  addToCart: (kitName: string, price: number, quantity?: number) => Promise<void>;
  updateCartItem: (kitName: string, quantity: number) => Promise<void>;
  removeFromCart: (kitName: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      // Check if user is authenticated (UI state check)
      // Actual auth is verified by backend via HttpOnly cookies
      const userName = localStorage.getItem('userName');
      if (!userName) {
        setCart([]);
        setLoading(false);
        return;
      }

      const response = await api.getCart();
      if (response.success && response.cart) {
        setCart(response.cart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      refreshCart();
    };
    
    window.addEventListener('authStateChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const addToCart = async (kitName: string, price: number, quantity: number = 1) => {
    try {
      const response = await api.addToCart(kitName, price, quantity);
      if (response.success) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (kitName: string, quantity: number) => {
    try {
      const response = await api.updateCartItem(kitName, quantity);
      if (response.success) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (kitName: string) => {
    try {
      const response = await api.removeFromCart(kitName);
      if (response.success) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.clearCart();
      if (response.success) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

