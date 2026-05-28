"use client";

import React from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, ArrowRight, Minus, Plus, MessageSquare, Image as ImageIcon, Gift } from "lucide-react";
import { toast } from "@/hooks/useToast";

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCartStore();

  const handleQuantityUpdate = (cartId: string, name: string, qty: number) => {
    updateQuantity(cartId, qty);
    if (qty <= 0) {
      toast({
        title: "Item removed",
        description: `Successfully removed ${name} from your hamper box.`,
        variant: "default",
      });
    }
  };

  const handleRemoveItem = (cartId: string, name: string) => {
    removeFromCart(cartId);
    toast({
      title: "Item removed",
      description: `Successfully removed ${name} from your hamper box.`,
      variant: "default",
    });
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center flex flex-col items-center justify-center space-y-4">
        <div className="h-14 w-14 bg-muted rounded-full flex items-center justify-center text-muted-foreground border border-border">
          <Gift size={22} className="animate-float text-primary" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">Your Gift Box is Empty</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-[280px] leading-relaxed mx-auto font-normal">
            Fill it with curated spa wellness cosmetics, preserved Ecuadorian roses, and personalized keepsakes to celebrate your anniversaries.
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-xl shadow-md shadow-primary/20 transition cursor-pointer"
        >
          Browse Hampers & Gifts
        </Link>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Glow */}
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

      <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-8">
        Your Cart (Keepsake Collection)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left: Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass border border-border rounded-2xl overflow-hidden bg-card/35 backdrop-blur-md">
            <div className="p-6 divide-y divide-border/60">
              {cart.map((item) => (
                <div key={item.cartId} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Image & details */}
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-cover border border-border shrink-0"
                    />
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-foreground line-clamp-1">{item.name}</h3>
                      <p className="text-[10px] font-black text-primary">${item.price.toFixed(2)}</p>
                      
                      {/* Personalizations */}
                      {item.personalization && (
                        <div className="flex flex-wrap gap-2 pt-1.5">
                          {item.personalization.customMessage && (
                            <span className="inline-flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 py-0.5 px-2 rounded-lg text-[9px] font-bold">
                              <MessageSquare size={9} />
                              Engraving: "{item.personalization.customMessage}"
                            </span>
                          )}
                          {item.personalization.customImage && (
                            <span className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 py-0.5 px-2 rounded-lg text-[9px] font-bold">
                              <ImageIcon size={9} />
                              Keepsake Photo Loaded
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Prices */}
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-transparent pt-3 sm:pt-0 border-border">
                    <div className="flex items-center border border-border rounded-lg bg-card">
                      <button
                        onClick={() => handleQuantityUpdate(item.cartId, item.name, item.quantity - 1)}
                        className="p-2 text-muted-foreground hover:text-foreground transition hover:bg-muted rounded-l-lg cursor-pointer"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="px-3 text-xs font-bold text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityUpdate(item.cartId, item.name, item.quantity + 1)}
                        className="p-2 text-muted-foreground hover:text-foreground transition hover:bg-muted rounded-r-lg cursor-pointer"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.cartId, item.name)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/40 p-4 border-t border-border/60 flex items-center justify-between">
              <button
                onClick={() => {
                  clearCart();
                  toast({ title: "Cart cleared", description: "All hampers removed." });
                }}
                className="text-[10px] font-bold text-muted-foreground hover:text-destructive uppercase tracking-wider transition cursor-pointer"
              >
                Clear Cart
              </button>
              <Link
                href="/products"
                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider cursor-pointer"
              >
                + Add More Gifts
              </Link>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass border border-border rounded-2xl p-6 bg-card/35 backdrop-blur-md space-y-6">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-foreground pb-3 border-b border-border/60">
              Keepsake Summary
            </h2>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground font-normal">
                <span>Total Items</span>
                <span>{cart.reduce((acc, item) => acc + item.quantity, 0)} gifts</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground font-normal">
                <span>Shipping Fees</span>
                <span className="text-emerald-500 font-bold">Complimentary</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground font-normal">
                <span>Milestone Greeting Card</span>
                <span className="text-emerald-500 font-bold">Free Premium Card</span>
              </div>
              <div className="pt-3 border-t border-border/50 flex justify-between items-baseline">
                <span className="font-bold text-foreground">Total Price</span>
                <span className="text-lg font-black text-foreground">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 transition duration-200 cursor-pointer"
            >
              Secure Checkout
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
