import { CartItem, ContentItem } from '@/types';
import { createContext, ReactNode, useState, useEffect } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: ContentItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // This initialization logic is now more robust
    try {
      const localData = localStorage.getItem('cart');
      if (localData) {
        const parsedData = JSON.parse(localData);
        // We explicitly check if the parsed data is an array
        if (Array.isArray(parsedData)) {
          return parsedData;
        }
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
    // If anything goes wrong, we fall back to an empty array
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: ContentItem) => {
    setCartItems((prevItems) => {
      // Ensure prevItems is always an array before spreading
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) =>
      (Array.isArray(prevItems) ? prevItems : []).filter((item) => item.id !== itemId),
    );
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCartItems((prevItems) =>
      (Array.isArray(prevItems) ? prevItems : []).map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item,
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Ensure cartItems is an array before calling reduce
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const cartCount = safeCartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = safeCartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems: safeCartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};