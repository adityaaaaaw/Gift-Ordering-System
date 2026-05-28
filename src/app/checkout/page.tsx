"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/context/AuthContext";
import { dbService } from "@/services/db";
import { toast } from "@/hooks/useToast";
import { CreditCard, ShoppingBag, Truck, MapPin, User, Mail, Phone, Lock, Sparkles, Check } from "lucide-react";
import confetti from "canvas-confetti";

interface CheckoutInputs {
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  paymentMethod: "CreditCard" | "PayPal" | "CashOnDelivery";
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCartStore();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutInputs>({
    defaultValues: {
      name: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      paymentMethod: "CreditCard",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVV: "",
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");

  // Pre-fill logged-in customer info
  useEffect(() => {
    if (user) {
      setValue("name", user.displayName || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !loading) {
      router.push("/cart");
    }
  }, [cart, router]);

  const onSubmitForm = async (data: CheckoutInputs) => {
    if (cart.length === 0) return;

    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        personalization: item.personalization,
      }));

      // Submit the complete order payload (with base64 custom photo embed)
      const createdOrder = await dbService.createOrder({
        userId: user?.uid || "guest-user-uid",
        customerName: data.name,
        customerEmail: data.email,
        items: orderItems,
        totalAmount: cartTotal,
        status: "Pending",
        shippingAddress: {
          street: data.street,
          city: data.city,
          state: data.state,
          zip: data.zip,
          phone: data.phone,
        },
        paymentMethod: data.paymentMethod,
      });

      // Confetti celebration
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#8b5cf6", "#10b981", "#ff007f"],
      });

      // Show global success toast alert
      toast({
        title: "Order Placed Successfully",
        description: `Your keepsake tracking code is #${createdOrder.id.slice(0, 8)}.`,
        variant: "success",
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("giftly_last_order_email", data.email);
      }

      clearCart();
      router.push(`/orders?id=${createdOrder.id}`);
    } catch (e) {
      console.error("Order submission failure:", e);
      toast({
        title: "Checkout failed",
        description: "An error occurred while building your hampers box.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Glow */}
      <div className="absolute top-[20%] left-[-5%] w-[450px] h-[450px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-8">
        Keepsake Delivery Checkout
      </h1>

      <form onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Customer Info */}
          <div className="glass border border-border rounded-2xl p-6 bg-card/35 backdrop-blur-md space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
              <User size={14} className="text-primary" />
              Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="Receiver's full name"
                  className={`w-full p-2.5 text-xs glass-input text-foreground rounded-xl ${errors.name ? "border-destructive focus:ring-destructive/15" : ""}`}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <span className="text-[9px] text-destructive font-bold">{errors.name.message}</span>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  className={`w-full p-2.5 text-xs glass-input text-foreground rounded-xl ${errors.email ? "border-destructive" : ""}`}
                  {...register("email", { 
                    required: "Email is required", 
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address format"
                    }
                  })}
                />
                {errors.email && <span className="text-[9px] text-destructive font-bold">{errors.email.message}</span>}
              </div>
            </div>
          </div>

          {/* 2. Destination Address */}
          <div className="glass border border-border rounded-2xl p-6 bg-card/35 backdrop-blur-md space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
              <MapPin size={14} className="text-primary" />
              Keepsake Hand-Delivery Address
            </h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Street Address</label>
                <input
                  type="text"
                  placeholder="Apartment, suite, or flat number"
                  className={`w-full p-2.5 text-xs glass-input text-foreground rounded-xl ${errors.street ? "border-destructive" : ""}`}
                  {...register("street", { required: "Street address is required" })}
                />
                {errors.street && <span className="text-[9px] text-destructive font-bold">{errors.street.message}</span>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    placeholder="New York"
                    className={`w-full p-2.5 text-xs glass-input text-foreground rounded-xl ${errors.city ? "border-destructive" : ""}`}
                    {...register("city", { required: "City is required" })}
                  />
                  {errors.city && <span className="text-[9px] text-destructive font-bold">{errors.city.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    placeholder="NY"
                    className={`w-full p-2.5 text-xs glass-input text-foreground rounded-xl ${errors.state ? "border-destructive" : ""}`}
                    {...register("state", { required: "State is required" })}
                  />
                  {errors.state && <span className="text-[9px] text-destructive font-bold">{errors.state.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ZIP Code</label>
                  <input
                    type="text"
                    placeholder="10001"
                    className={`w-full p-2.5 text-xs glass-input text-foreground rounded-xl ${errors.zip ? "border-destructive" : ""}`}
                    {...register("zip", { required: "Zip is required" })}
                  />
                  {errors.zip && <span className="text-[9px] text-destructive font-bold">{errors.zip.message}</span>}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className={`w-full p-2.5 text-xs glass-input text-foreground rounded-xl ${errors.phone ? "border-destructive" : ""}`}
                  {...register("phone", { required: "Phone number is required" })}
                />
                {errors.phone && <span className="text-[9px] text-destructive font-bold">{errors.phone.message}</span>}
              </div>
            </div>
          </div>

          {/* 3. Payment Toggles */}
          <div className="glass border border-border rounded-2xl p-6 bg-card/35 backdrop-blur-md space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
              <CreditCard size={14} className="text-primary" />
              Settlement & Payment Method
            </h2>

            <div className="space-y-5">
              {/* Toggle row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "CreditCard", label: "Credit Card" },
                  { value: "PayPal", label: "PayPal" },
                  { value: "CashOnDelivery", label: "Cash On Delivery" },
                ].map((pm) => (
                  <label
                    key={pm.value}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer text-center select-none transition-all duration-200 ${
                      selectedPaymentMethod === pm.value
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      value={pm.value}
                      className="hidden"
                      {...register("paymentMethod")}
                    />
                    <span className="text-xs font-bold uppercase tracking-wider leading-none text-center">
                      {pm.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Credit card form simulator */}
              {selectedPaymentMethod === "CreditCard" && (
                <div className="space-y-4 pt-3 border-t border-border/50 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Cardholder full name"
                      className={`w-full p-2.5 text-xs glass-input text-foreground rounded-xl ${errors.cardName ? "border-destructive" : ""}`}
                      {...register("cardName", { required: selectedPaymentMethod === "CreditCard" ? "Card name is required" : false })}
                    />
                    {errors.cardName && <span className="text-[9px] text-destructive font-bold">{errors.cardName.message}</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      className={`w-full p-2.5 text-xs glass-input text-foreground rounded-xl ${errors.cardNumber ? "border-destructive" : ""}`}
                      {...register("cardNumber", { required: selectedPaymentMethod === "CreditCard" ? "Card number is required" : false })}
                    />
                    {errors.cardNumber && <span className="text-[9px] text-destructive font-bold">{errors.cardNumber.message}</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className={`w-full p-2.5 text-xs glass-input text-foreground rounded-xl ${errors.cardExpiry ? "border-destructive" : ""}`}
                        {...register("cardExpiry", { required: selectedPaymentMethod === "CreditCard" ? "Expiry is required" : false })}
                      />
                      {errors.cardExpiry && <span className="text-[9px] text-destructive font-bold">{errors.cardExpiry.message}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">CVV Code</label>
                      <input
                        type="password"
                        placeholder="***"
                        maxLength={4}
                        className={`w-full p-2.5 text-xs glass-input text-foreground rounded-xl ${errors.cardCVV ? "border-destructive" : ""}`}
                        {...register("cardCVV", { required: selectedPaymentMethod === "CreditCard" ? "CVV is required" : false })}
                      />
                      {errors.cardCVV && <span className="text-[9px] text-destructive font-bold">{errors.cardCVV.message}</span>}
                    </div>
                  </div>
                </div>
              )}

              <div className="inline-flex gap-2 items-center text-[10px] text-muted-foreground py-2 border-t border-border/50 w-full mt-2 font-normal">
                <Lock size={12} className="text-emerald-500 shrink-0" />
                <span>Simulated secure tunnel. No payment details are captured permanently.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pricing Summary Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass border border-border rounded-2xl p-6 bg-card/35 backdrop-blur-md space-y-6">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-foreground pb-2 border-b border-border/60">
              Anniversary Bundle
            </h2>
            
            <div className="divide-y divide-border/60 max-h-[220px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.cartId} className="py-3 flex gap-3 items-center justify-between text-xs font-normal">
                  <div className="flex gap-2 items-center truncate">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-8 w-8 rounded-lg object-cover border border-border shrink-0"
                    />
                    <div className="truncate max-w-[120px]">
                      <p className="font-bold text-foreground truncate">{item.name}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-foreground shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/60 space-y-3.5 text-xs font-normal">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Cart Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Keepsake Wrapping</span>
                <span className="text-emerald-500 font-bold">Complimentary</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <span className="font-bold text-foreground">Final Total</span>
                <span className="text-base font-black text-foreground">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25 transition cursor-pointer"
            >
              {loading ? (
                <>Simulating Checkout...</>
              ) : (
                <>
                  Place Gift Order
                  <Sparkles size={14} className="text-amber-300 fill-amber-300 animate-pulse shrink-0" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
