import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OrderItem } from "@/types";

// Extends OrderItem to include a unique cartId
export interface StoreCartItem extends OrderItem {
  cartId: string; // Hashed key combining productId + personalization values
}

interface CartState {
  cart: StoreCartItem[];
  cartCount: number;
  cartTotal: number;
  
  // Actions
  addToCart: (item: Omit<OrderItem, "quantity">, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
}

// Helper to generate a unique cart ID based on personalization
const generateCartId = (productId: string, personalization?: OrderItem["personalization"]) => {
  const imgHash = personalization?.customImage ? "img" : "noimg";
  const msgHash = personalization?.customMessage
    ? encodeURIComponent(personalization.customMessage)
    : "nomsg";
  return `${productId}-${imgHash}-${msgHash}`;
};

// Helper to compute counts and totals
const recalculateTotals = (cart: StoreCartItem[]) => {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { cartCount, cartTotal };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      cartCount: 0,
      cartTotal: 0,

      addToCart: (item, quantity = 1) => {
        const cartId = generateCartId(item.productId, item.personalization);
        const currentCart = get().cart;
        
        const existingIndex = currentCart.findIndex((i) => i.cartId === cartId);
        
        let newCart: StoreCartItem[];
        
        if (existingIndex > -1) {
          newCart = [...currentCart];
          newCart[existingIndex].quantity += quantity;
        } else {
          const newCartItem: StoreCartItem = {
            ...item,
            cartId,
            quantity,
          };
          newCart = [...currentCart, newCartItem];
        }

        const totals = recalculateTotals(newCart);
        set({ cart: newCart, ...totals });
      },

      removeFromCart: (cartId) => {
        const currentCart = get().cart;
        const newCart = currentCart.filter((item) => item.cartId !== cartId);
        const totals = recalculateTotals(newCart);
        set({ cart: newCart, ...totals });
      },

      updateQuantity: (cartId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartId);
          return;
        }
        
        const currentCart = get().cart;
        const newCart = currentCart.map((item) =>
          item.cartId === cartId ? { ...item, quantity } : item
        );
        
        const totals = recalculateTotals(newCart);
        set({ cart: newCart, ...totals });
      },

      clearCart: () => {
        set({ cart: [], cartCount: 0, cartTotal: 0 });
      },
    }),
    {
      name: "giftly_zustand_cart", // key name inside LocalStorage
    }
  )
);
