"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { dbService } from "@/services/db";
import { Order, OrderStatus } from "@/types";
import { toast } from "@/hooks/useToast";
import {
  Package,
  Layers,
  ShoppingBag,
  LogOut,
  MapPin,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  Sparkles,
  Clipboard,
  CheckCircle,
  Truck,
  Box,
  Scissors,
  ClipboardCheck,
  Gift,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Authenticate Admin route
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const fetchOrders = async () => {
    try {
      const list = await dbService.getOrders();
      setOrders(list);
    } catch (e) {
      console.error("Orders retrieval failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await dbService.updateOrderStatus(orderId, status);
      toast({
        title: "Order status updated",
        description: `Order #${orderId.slice(0, 8)} set to ${status}.`,
        variant: status === "Cancelled" ? "destructive" : "success",
      });
      fetchOrders();
    } catch (e) {
      console.error("Order status update failed:", e);
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
    return {
      Pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
      Designing: "bg-pink-500/10 text-pink-500 border border-pink-500/20",
      Packing: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
      Shipped: "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20",
      Delivered: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
      Cancelled: "bg-red-500/10 text-red-500 border border-red-500/20",
    }[status];
  };

  const getStatusIcon = (status: OrderStatus) => {
    return {
      Pending: <ClipboardCheck size={11} />,
      Designing: <Scissors size={11} />,
      Packing: <Box size={11} />,
      Shipped: <Truck size={11} />,
      Delivered: <CheckCircle size={11} />,
      Cancelled: <XCircle size={11} />,
    }[status];
  };

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 animate-pulse space-y-6">
        <div className="h-6 bg-muted rounded w-1/4" />
        <div className="h-64 bg-muted rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card/40 backdrop-blur-md p-6 space-y-8 shrink-0 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
                <Gift size={16} />
              </div>
              <span className="text-base font-extrabold tracking-tight text-foreground">
                Giftly Admin
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">SaaS Anniversary Hampers</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 py-2 px-3.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition"
            >
              <Layers size={14} />
              Dashboard Metrics
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 py-2 px-3.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition"
            >
              <Package size={14} />
              Inventory Manager
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 py-2 px-3.5 text-xs font-bold bg-primary/10 border border-primary/20 text-primary rounded-xl"
            >
              <ShoppingBag size={14} />
              Fulfillment Pipeline
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex items-center justify-between">
          <div className="space-y-0.5 truncate max-w-[120px]">
            <p className="text-[10px] font-bold text-foreground truncate">{user.displayName}</p>
            <p className="text-[9px] text-muted-foreground">Admin Portal</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition cursor-pointer"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Main SaaS Canvas */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto font-normal">
        {/* Header */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Fulfillment Pipeline
          </h1>
          <p className="text-xs text-muted-foreground">
            Inspect customer keepsakes personalizations, view uploaded photos, and push pipeline statuses.
          </p>
        </div>

        {/* Orders list */}
        <div className="space-y-6 relative z-10">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className={`glass border bg-card/35 backdrop-blur-md rounded-2xl p-6 space-y-6 hover:border-primary/15 transition duration-300 ${
                  order.status === "Cancelled" ? "border-red-500/25 bg-red-500/[0.01]" : "border-border"
                }`}
              >
                
                {/* 1. Header order info */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border/50">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black text-foreground bg-muted border border-border py-0.5 px-2 rounded-lg">
                        ID: #{order.id.slice(0, 8)}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-2 rounded-lg ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1.5 font-normal">
                      <Calendar size={11} />
                      <span>Placed: {new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Status Pipeline Update dropdown row */}
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Advance Status
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(["Pending", "Designing", "Packing", "Shipped", "Delivered", "Cancelled"] as const).map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(order.id, st)}
                            className={`py-1 px-2.5 rounded-lg text-[9px] font-bold transition duration-150 cursor-pointer ${
                              order.status === st
                                ? st === "Cancelled"
                                  ? "bg-red-500 text-white shadow-md shadow-red-500/10"
                                  : "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Customer details & products log columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Receiver logs */}
                  <div className="lg:col-span-4 space-y-3.5 text-xs font-normal">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Recipient & Destination
                    </h4>
                    
                    <div className="space-y-2 font-normal text-muted-foreground">
                      <div className="flex gap-2 items-start">
                        <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground">{order.customerName}</p>
                          <p>Phone: {order.shippingAddress.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                        <p>
                          {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state} {order.shippingAddress.zip}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-border/40 text-[10px]">
                        <p className="font-bold text-foreground">Billing Contact</p>
                        <p className="truncate max-w-[180px]">{order.customerEmail}</p>
                        <p className="text-[9px] mt-0.5">Method: {order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Ordered hampers with personalizations */}
                  <div className="lg:col-span-8 space-y-4 font-normal">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Box Contents & Bespoke Requests
                    </h4>

                    <div className="divide-y divide-border/40 space-y-3.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="pt-3.5 first:pt-0 space-y-2.5">
                          
                          {/* Item details */}
                          <div className="flex items-center justify-between text-xs font-normal">
                            <div className="flex gap-2 items-center">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-8 w-8 rounded-lg object-cover border border-border shrink-0"
                              />
                              <span className="font-bold text-foreground truncate max-w-[200px]">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                (Qty: {item.quantity})
                              </span>
                            </div>
                            <span className="font-bold text-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          {/* Personalization configurations */}
                          {item.personalization && (
                            <div className="ml-10 bg-muted/40 p-4 rounded-2xl border border-border space-y-3">
                              {item.personalization.customMessage && (
                                <div className="flex gap-2 items-start text-xs">
                                  <MessageSquare size={13} className="text-primary mt-0.5 shrink-0" />
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">
                                      Custom Engraving / Greeting Text
                                    </span>
                                    <p className="text-foreground italic leading-relaxed">
                                      "{item.personalization.customMessage}"
                                    </p>
                                  </div>
                                </div>
                              )}

                              {item.personalization.customImage && (
                                <div className="flex gap-2 items-start text-xs">
                                  <ImageIcon size={13} className="text-primary mt-0.5 shrink-0" />
                                  <div className="space-y-1.5">
                                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">
                                      Bespoke Image Keepsake
                                    </span>
                                    {/* Previewing the user's uploaded base64 image */}
                                    <a
                                      href={item.personalization.customImage}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block relative w-32 aspect-[4/3] rounded-xl overflow-hidden border border-border hover:brightness-95 transition"
                                      title="Click to view image in full window"
                                    >
                                      <img
                                        src={item.personalization.customImage}
                                        alt="Customer upload preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Footer billing stats */}
                <div className="pt-4 border-t border-border/50 flex justify-between items-baseline text-xs font-normal">
                  <span className="text-muted-foreground">Order Settlement Status: <strong>Settled</strong></span>
                  <span className="font-bold text-foreground">
                    Total Amount: <strong className="text-base font-black">${order.totalAmount.toFixed(2)}</strong>
                  </span>
                </div>

              </div>
            ))
          ) : (
            /* Empty State */
            <div className="text-center py-20 rounded-2xl glass border border-border/80 bg-card/25 max-w-md mx-auto flex flex-col items-center justify-center space-y-4 p-8">
              <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground border border-border">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Pipeline Clear</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-[250px] leading-relaxed mx-auto font-normal">
                  No orders have been submitted to the delivery pipeline yet. As soon as a customer checks out, they will appear here!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
