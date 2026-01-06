import React, { createContext, useContext, useState, ReactNode } from 'react';

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (wine: {id: string; name: string; image: string; price: number}) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartSize: number;
};

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartSize: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (wine: {id: string; name: string; image: string; price: number}) => {
    setCartItems(prev => {
      const found = prev.find(i => i.id === wine.id);
      if (found) {
        return prev.map(i => i.id === wine.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, { ...wine, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => {
      const found = prev.find(i => i.id === id);
      if (found && found.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      } else {
        return prev.filter(i => i.id !== id);
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartSize: cartItems.reduce((n, item) => n + item.quantity, 0) }}>
      {children}
    </CartContext.Provider>
  );
}
