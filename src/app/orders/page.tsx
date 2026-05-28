"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { dbService } from "@/services/db";
import { Order, OrderStatus } from "@/types";
import StatusTracker from "@/components/StatusTracker";
import { toast } from "@/hooks/useToast";
import { MapPin, Calendar, CreditCard, Sparkles, MessageSquare, Image as ImageIcon, Clipboard, CheckCircle, Package, ArrowRight, ArrowLeft, ShieldAlert, Mail } from "lucide-react";
import Link from "next/link";

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeOrderId = searchParams.get("id");

  const { user } = useAuth();
  
  // States for search
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // States for active order tracking
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [activeOrderLoading, setActiveOrderLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-search email if available
  useEffect(() => {
    if (activeOrderId) return; // Do not auto-search email list if tracking specific ID

    let trackingEmail = "";
    if (user?.email) {
      trackingEmail = user.email;
    } else if (typeof window !== "undefined") {
      const lastEmail = localStorage.getItem("giftly_last_order_email");
      if (lastEmail) trackingEmail = lastEmail;
    }

    if (trackingEmail) {
      setEmail(trackingEmail);
      executeEmailSearch(trackingEmail);
    }
  }, [user, activeOrderId]);

  // Subscribe to real-time updates for active tracking order
  useEffect(() => {
    if (!activeOrderId) {
      setActiveOrder(null);
      return;
    }

    setActiveOrderLoading(true);
    
    // Subscribe to Universal DB service real-time subscriber
    const unsubscribe = dbService.subscribeToOrder(activeOrderId, (updatedOrder) => {
      setActiveOrder(updatedOrder);
      setActiveOrderLoading(false);
    });

    return () => unsubscribe();
  }, [activeOrderId]);

  const executeEmailSearch = async (searchEmail: string) => {
    if (!searchEmail.trim()) return;
    setSearching(true);
    try {
      const list = await dbService.getOrdersByEmail(searchEmail);
      setOrders(list);
      setHasSearched(true);
    } catch (e) {
      console.error("Order lookup by email failed:", e);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeEmailSearch(email);
  };

  const copyId = () => {
    if (!activeOrderId) return;
    navigator.clipboard.writeText(activeOrderId);
    setCopied(true);
    toast({ title: "Copied", description: "Order ID copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: OrderStatus) => {
    return {
      Pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
      Designing: "bg-pink-500/10 text-pink-500 border border-pink-500/20",
      Packing: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
      Shipped: "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20",
      Delivered: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
      Cancelled: "bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse",
    }[status];
  };

  const getStatusMessage = (status: OrderStatus) => {
    return {
      Pending: "We have received your request and will start crafting shortly.",
      Designing: "Our visual designers are creating your custom engraving templates.",
      Packing: "Designing complete! Hamper items are wrapped in custom pine slides.",
      Shipped: "Dispatched! Handed over to Express Cargo.",
      Delivered: "Safe hand-delivery complete. Enjoy your special celebration!",
      Cancelled: "This order has been cancelled and invoice refunded.",
    }[status];
  };

  // ==========================================
  // VIEW RENDER: 1. Live Timeline Stepper Tracking
  // ==========================================
  if (activeOrderId) {
    if (activeOrderLoading) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-20 animate-pulse space-y-6">
          <div className="h-6 bg-muted rounded w-1/4" />
          <div className="h-40 bg-muted rounded-2xl w-full" />
          <div className="h-20 bg-muted rounded-2xl w-full" />
        </div>
      );
    }

    if (!activeOrder) {
      return (
        <div className="mx-auto max-w-md px-4 py-20 text-center flex flex-col items-center justify-center space-y-4">
          <div className="h-14 w-14 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center border border-red-500/20">
            <Clipboard size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Order Not Found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[280px] leading-relaxed mx-auto font-normal">
              The tracking code <code className="bg-black/10 px-1 py-0.5 rounded font-mono font-bold">{activeOrderId}</code> is invalid or has expired.
            </p>
          </div>
          <button
            onClick={() => router.push("/orders")}
            className="text-xs font-semibold text-primary bg-primary/10 py-2 px-5 rounded-xl border border-primary/20 transition cursor-pointer"
          >
            Search Tracking Again
          </button>
        </div>
      );
    }

    return (
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back navigation */}
        <button
          onClick={() => router.push("/orders")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition mb-8 group cursor-pointer"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition duration-150" />
          Back to Tracking Lookup
        </button>

        {/* Info header panel */}
        <div className="glass border border-border rounded-2xl p-6 bg-card/35 backdrop-blur-md space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary py-0.5 px-2 rounded-lg text-[9px] font-bold uppercase tracking-wider animate-pulse">
                <Sparkles size={9} /> Live Updates Active
              </span>
              <div className="flex items-center gap-2 pt-1">
                <h1 className="text-lg sm:text-xl font-extrabold text-foreground">
                  Track Keepsake #{activeOrder.id.slice(0, 8)}
                </h1>
                <button
                  onClick={copyId}
                  className="text-[10px] text-muted-foreground hover:text-foreground font-semibold bg-muted py-0.5 px-2 rounded-lg border border-border transition flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <CheckCircle size={10} className="text-emerald-500" /> : <Clipboard size={10} />}
                  {copied ? "Copied" : "Copy ID"}
                </button>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Estimated Delivery</p>
              <p className="text-sm font-extrabold text-foreground">Express Transit (Active)</p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3.5 flex items-start gap-3">
            <div className="h-5 w-5 bg-primary/10 rounded-lg flex items-center justify-center text-primary mt-0.5">
              <Sparkles size={12} className="animate-spin" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-foreground block">
                Current Status: {activeOrder.status}
              </span>
              <span className="text-muted-foreground leading-relaxed font-normal mt-0.5 block leading-normal">
                {getStatusMessage(activeOrder.status)}
              </span>
            </div>
          </div>
        </div>

        {/* STEPPER STATUS TIMELINE */}
        <div className="glass border border-border rounded-3xl p-6 md:p-8 bg-card/35 backdrop-blur-md mb-8">
          <StatusTracker currentStatus={activeOrder.status} trackingHistory={activeOrder.trackingHistory} />
        </div>

        {/* DETAILS LOGS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-normal">
          
          <div className="glass border border-border rounded-2xl p-6 bg-card/35 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground pb-2 border-b border-border/60">
              Delivery Log
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex gap-2.5 items-start">
                <MapPin size={15} className="text-primary mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">Recipient Name & Contact</p>
                  <p className="text-muted-foreground">{activeOrder.customerName}</p>
                  <p className="text-muted-foreground">Phone: {activeOrder.shippingAddress.phone}</p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <MapPin size={15} className="text-primary mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">Keepsake Destination Address</p>
                  <p className="text-muted-foreground">{activeOrder.shippingAddress.street}</p>
                  <p className="text-muted-foreground font-normal">
                    {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.zip}
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start border-t border-border/40 pt-4 mt-2">
                <CreditCard size={15} className="text-primary mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground">Payment Summary</p>
                  <p className="text-muted-foreground">secured: {activeOrder.paymentMethod}</p>
                  <p className="text-muted-foreground">Billing: {activeOrder.customerEmail}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass border border-border rounded-2xl p-6 bg-card/35 backdrop-blur-md space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground pb-2 border-b border-border/60">
                Purchased Box Contents
              </h3>
              
              <div className="divide-y divide-border/60 max-h-[220px] overflow-y-auto pr-1 space-y-3">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex flex-col gap-2 text-xs font-normal">
                    <div className="flex gap-3 items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-8 w-8 rounded-lg object-cover border border-border shrink-0"
                        />
                        <div className="truncate max-w-[150px]">
                          <p className="font-bold text-foreground truncate">{item.name}</p>
                          <p className="text-[9px] text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-foreground text-xs">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Personalizations */}
                    {item.personalization && (
                      <div className="ml-10 bg-muted/40 p-3 rounded-xl border border-border space-y-2">
                        {item.personalization.customMessage && (
                          <div className="flex gap-1.5 items-start">
                            <MessageSquare size={11} className="text-primary mt-0.5 shrink-0" />
                            <p className="text-[10px] text-muted-foreground italic leading-relaxed leading-normal">
                              "{item.personalization.customMessage}"
                            </p>
                          </div>
                        )}
                        
                        {item.personalization.customImage && (
                          <div className="space-y-1">
                            <div className="flex gap-1.5 items-center">
                              <ImageIcon size={11} className="text-primary shrink-0" />
                              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wide">Keepsake Image Loaded</span>
                            </div>
                            <img
                              src={item.personalization.customImage}
                              alt="Personalization keepsake"
                              className="h-16 w-auto rounded-lg border border-border shadow-sm object-cover"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-baseline text-xs mt-4">
              <span className="font-bold text-foreground">Paid Total</span>
              <span className="text-base font-black text-foreground">${activeOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW RENDER: 2. Email-based Order Search Lookup
  // ==========================================
  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Glow */}
      <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

      <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight animate-float">
          Track Your Keepsakes
        </h1>
        <p className="text-sm text-muted-foreground font-normal">
          Enter the customer email address used during purchase to check the live design, packing, and delivery timeline.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-12 relative z-10">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
              <Mail size={15} />
            </span>
            <input
              required
              type="email"
              placeholder="customer.email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs glass-input text-foreground rounded-xl"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-wider py-2 px-5 rounded-xl transition duration-200 cursor-pointer shrink-0"
          >
            {searching ? "Searching..." : "Track"}
          </button>
        </form>
      </div>

      <div className="max-w-3xl mx-auto space-y-6 relative z-10 font-normal">
        {searching ? (
          [1, 2].map((s) => (
            <div key={s} className="h-28 w-full rounded-2xl bg-card border border-border animate-pulse" />
          ))
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="glass border border-border rounded-2xl p-6 bg-card/35 backdrop-blur-md hover:border-primary/25 transition duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[10px] font-black text-foreground bg-muted border border-border py-0.5 px-2 rounded-lg">
                    ID: #{order.id.slice(0, 8)}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-2 rounded-lg ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex gap-2 items-center text-xs">
                  <Package size={14} className="text-muted-foreground shrink-0" />
                  <span className="font-bold text-foreground line-clamp-1">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                  <span className="flex items-center gap-1 font-normal">
                    <Calendar size={11} />
                    Placed: {new Date(order.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="font-bold text-foreground">
                    Total Paid: ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href={`/orders?id=${order.id}`}
                className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 bg-primary/10 border border-primary/20 text-primary py-2 px-4 rounded-xl text-xs font-bold transition hover:bg-primary hover:text-primary-foreground group cursor-pointer"
              >
                Track Live Status
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition duration-150" />
              </Link>
            </div>
          ))
        ) : hasSearched ? (
          <div className="text-center py-16 rounded-2xl glass border border-border/80 bg-card/25 max-w-md mx-auto flex flex-col items-center justify-center space-y-4 p-8">
            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground border border-border">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">No Hampers Found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[280px] leading-relaxed mx-auto font-normal">
                We couldn't find any gift records matching <strong className="text-foreground">{email}</strong>. Check for typographical errors or make sure you checked out under this email address.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 py-2 px-5 rounded-xl border border-primary/20 transition cursor-pointer"
            >
              Order New Gift Box
            </Link>
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-muted-foreground font-normal border border-dashed border-border/70 rounded-2xl">
            Click 'Track' to inspect your active orders.
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-4xl px-4 py-20 text-center flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground">Loading tracking data...</p>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
