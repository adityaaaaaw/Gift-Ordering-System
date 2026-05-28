"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  cartId: string; // ProductId + Personalization hash to allow multiple custom items of same product
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  personalization?: {
    customImage?: string; // Base64 data URL
    customMessage?: string; // engraving / greeting text
  };
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: Omit<CartItem, "cartId" | "quantity">, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("giftly_cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart:", e);
        }
      }
    }
  }, []);

  // Save cart to LocalStorage whenever it changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("giftly_cart", JSON.stringify(newCart));
    }
  };

  const addToCart = (
    item: Omit<CartItem, "cartId" | "quantity">,
    quantity = 1
  ) => {
    // Generate a unique cartId based on the product ID and personalizations
    const imgHash = item.personalization?.customImage ? "img" : "noimg";
    const msgHash = item.personalization?.customMessage
      ? encodeURIComponent(item.personalization.customMessage)
      : "nomsg";
    const cartId = `${item.productId}-${imgHash}-${msgHash}`;

    const existingIndex = cart.findIndex((i) => i.cartId === cartId);
    
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      saveCart(newCart);
    } else {
      const newItem: CartItem = {
        ...item,
        cartId,
        quantity,
      };
      saveCart([...cart, newItem]);
    }
  };

  const removeFromCart = (cartId: string) => {
    saveCart(cart.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    const newCart = cart.map((item) =>
      item.cartId === cartId ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
