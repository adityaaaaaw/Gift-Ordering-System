"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { dbService } from "@/services/db";
import { Order, Product } from "@/types";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Gift,
  Plus,
  Package,
  Layers,
  ChevronRight,
  LogOut,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Authenticate Admin route
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch orders and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersList, productsList] = await Promise.all([
          dbService.getOrders(),
          dbService.getProducts(),
        ]);
        setOrders(ordersList);
        setProducts(productsList);
      } catch (e) {
        console.error("Dashboard failed to retrieve reports:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 animate-pulse space-y-6">
        <div className="h-6 bg-muted rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="h-24 bg-muted rounded-2xl w-full" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-3xl w-full" />
      </div>
    );
  }

  // Analytics Computations
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalHampers = orders.length;
  
  // Refined customizable status check (Designing + Packing + Pending)
  const customizationQueueCount = orders.filter(
    (o) => o.status === "Pending" || o.status === "Designing" || o.status === "Packing"
  ).length;
  
  const lowInventoryProducts = products.filter((p) => p.stock <= 8);
  const recentOrders = orders.slice(0, 4);

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
              className="flex items-center gap-2.5 py-2 px-3.5 text-xs font-bold bg-primary/10 border border-primary/20 text-primary rounded-xl"
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
              className="flex items-center gap-2.5 py-2 px-3.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition"
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
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Dashboard Metrics
            </h1>
            <p className="text-xs text-muted-foreground">
              Review real-time sales summaries, personalization queues, and catalog alarms.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2 px-4 rounded-xl shadow-md shadow-primary/20 transition cursor-pointer"
            >
              <Plus size={13} />
              Create Product
            </Link>
          </div>
        </div>

        {/* 1. SAAS METRIC CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sales Revenue */}
          <div className="glass border border-border bg-card/35 backdrop-blur-md rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Sales Revenue
              </span>
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <TrendingUp size={14} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">${totalRevenue.toFixed(2)}</p>
              <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-1">
                +100% simulated increase
              </p>
            </div>
          </div>

          {/* Hampers Ordered */}
          <div className="glass border border-border bg-card/35 backdrop-blur-md rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Hampers
              </span>
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <ShoppingBag size={14} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{totalHampers} orders</p>
              <p className="text-[10px] text-muted-foreground mt-1">Total active deliveries</p>
            </div>
          </div>

          {/* Customization queue */}
          <div className="glass border border-border bg-card/35 backdrop-blur-md rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Designing Queue
              </span>
              <div className="p-2 bg-pink-500/10 text-pink-500 rounded-lg">
                <Clock size={14} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{customizationQueueCount} active</p>
              <p className="text-[10px] text-pink-500 font-bold mt-1">Requires design/pack work</p>
            </div>
          </div>

          {/* Alarm warning card */}
          <div className="glass border border-border bg-card/35 backdrop-blur-md rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Catalog Alerts
              </span>
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                <AlertTriangle size={14} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{lowInventoryProducts.length} warnings</p>
              <p className="text-[10px] text-amber-500 font-bold mt-1">Items stock limit low</p>
            </div>
          </div>
        </div>

        {/* 2. REVENUE ANALYSIS CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Custom chart widget */}
          <div className="glass border border-border bg-card/35 backdrop-blur-md rounded-2xl p-6 lg:col-span-8 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Monthly Revenue Simulation</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-normal">Simulated category dispatch volume.</p>
            </div>
            
            {/* Visual Bar Chart */}
            <div className="flex items-end justify-between h-48 pt-4 gap-4 px-2 select-none border-b border-border/80 pb-1">
              {[
                { name: "Personalized", val: 78, color: "bg-pink-500" },
                { name: "Anniversary", val: 94, color: "bg-violet-500" },
                { name: "Tech Setups", val: 56, color: "bg-blue-500" },
                { name: "Corporate", val: 45, color: "bg-emerald-500" },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                  <span className="text-[9px] font-black text-foreground opacity-0 group-hover:opacity-100 mb-1 transition duration-150">
                    {bar.val}%
                  </span>
                  <div
                    className={`w-full rounded-t-xl transition duration-500 origin-bottom group-hover:brightness-105 shadow-md shadow-primary/5 ${bar.color}`}
                    style={{ height: `${bar.val}%` }}
                  />
                  <span className="text-[9px] text-muted-foreground font-semibold mt-2.5 truncate max-w-[80px]">
                    {bar.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Warning Feed */}
          <div className="glass border border-border bg-card/35 backdrop-blur-md rounded-2xl p-6 lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider pb-2 border-b border-border/60">
              Low Stock Warnings
            </h3>
            
            <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
              {lowInventoryProducts.length > 0 ? (
                lowInventoryProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex gap-2.5 items-center truncate">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-7 w-7 rounded-lg border border-border object-cover shrink-0"
                      />
                      <span className="font-bold text-foreground truncate max-w-[120px]">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-destructive bg-destructive/10 py-0.5 px-2 rounded-lg border border-destructive/20 animate-pulse">
                      Stock: {p.stock}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-muted-foreground text-center py-6">All hampers fully stocked.</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. RECENT ORDERS TABULAR fulfiller */}
        <div className="glass border border-border bg-card/35 backdrop-blur-md rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Recent Personalization Orders
            </h3>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline uppercase tracking-wide cursor-pointer"
            >
              Fulfill Queue
              <ChevronRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[9px]">
                  <th className="py-2.5">Order ID</th>
                  <th className="py-2.5">Recipient</th>
                  <th className="py-2.5">Hampers</th>
                  <th className="py-2.5">Date Placed</th>
                  <th className="py-2.5 text-right">Paid Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-normal">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/30 transition">
                      <td className="py-3 font-bold text-foreground">#{order.id.slice(0, 8)}</td>
                      <td className="py-3 text-muted-foreground">{order.customerName}</td>
                      <td className="py-3 text-muted-foreground line-clamp-1 max-w-[180px]">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                      </td>
                      <td className="py-3 text-muted-foreground font-normal">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 text-right font-bold text-foreground">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No gift orders placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
