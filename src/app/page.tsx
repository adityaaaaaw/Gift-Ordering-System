"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { dbService } from "@/services/db";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import {
  Gift,
  Sparkles,
  Heart,
  Truck,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
  PenTool,
  BadgePercent,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const list = await dbService.getProducts();
        setFeaturedProducts(list.filter((p) => p.featured).slice(0, 3));
      } catch (e) {
        console.error("Failed to load products:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: "Personalized", icon: PenTool, color: "from-pink-500 to-rose-500", count: "12 Items", id: "personalized" },
    { name: "Anniversary", icon: Heart, color: "from-violet-500 to-purple-500", count: "8 Items", id: "anniversary" },
    { name: "Tech", icon: Sparkles, color: "from-blue-500 to-indigo-500", count: "5 Items", id: "tech" },
    { name: "Corporate", icon: TrendingUp, color: "from-emerald-500 to-teal-500", count: "10 Items", id: "corporate" },
  ];

  const steps = [
    {
      num: "01",
      title: "Select Premium Box",
      desc: "Choose from our high-end wellness spa trunks or handmade flower glass domes.",
      icon: Gift,
    },
    {
      num: "02",
      title: "Add Personal Touch",
      desc: "Upload a special photo and write a heartfelt greeting card note or engraving text.",
      icon: ImageIcon,
    },
    {
      num: "03",
      title: "Artisanal Crafting",
      desc: "Our master designers assemble your custom pieces with absolute decorative precision.",
      icon: PenTool,
    },
    {
      num: "04",
      title: "Express Dispatched",
      desc: "Sealed in a signature velvet box and hand-delivered directly with active live-tracking.",
      icon: Truck,
    },
  ];

  return (
    <div className="relative w-full pb-20 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none animate-pulse" />

      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:text-left lg:grid lg:grid-cols-12 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary py-1.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} className="animate-pulse" /> Curated Anniversaries & Milestones
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Curate Unforgettable <br />
            <span className="gradient-text font-black">Moments of Love</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
            Elevate your gifting tradition. Personalize signature hampers with bespoke photo frames, hot-stamped leather engravings, and gourmet spa wellness cosmetics. Perfectly crafted by master artisans.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold h-11 px-6 rounded-xl transition duration-200 shadow-md shadow-primary/25 cursor-pointer"
            >
              Explore Catalog
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center justify-center bg-card hover:bg-muted border border-border text-foreground text-sm font-semibold h-11 px-6 rounded-xl transition duration-200 cursor-pointer"
            >
              Track Existing Order
            </Link>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border/50 max-w-md mx-auto lg:mx-0">
            <div className="text-left space-y-1">
              <p className="text-xl sm:text-2xl font-extrabold text-foreground">17k+</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Hampers Gifted</p>
            </div>
            <div className="text-left space-y-1">
              <p className="text-xl sm:text-2xl font-extrabold text-foreground">99.4%</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Joy Delivered</p>
            </div>
            <div className="text-left space-y-1">
              <p className="text-xl sm:text-2xl font-extrabold text-foreground">5-Star</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Average Review</p>
            </div>
          </div>
        </motion.div>

        {/* Hero Visual Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block lg:col-span-5 relative"
        >
          <div className="relative mx-auto w-full max-w-[400px]">
            <div className="absolute inset-0 -m-6 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-card/80 glass">
              <img
                src="https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&auto=format&fit=crop&q=80"
                alt="Premium Curated Hampers"
                className="w-full object-cover aspect-[4/5] object-center scale-100 hover:scale-102 transition duration-500"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/45 backdrop-blur-md border border-white/10 text-white space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-violet-300">Milestone Special</p>
                <h3 className="text-sm font-bold">17-Month Anniversary Hamper</h3>
                <p className="text-[10px] text-white/80 leading-relaxed font-normal">Features hot-stamped custom letter engraving and velvet slide-out keepsake drawer.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. CURATED CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Select by Collection</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-normal">
            Beautifully categorized gift architectures tailored for unique anniversary and wellness celebrations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={`/products?category=${category.id}`}
                className="group relative overflow-hidden rounded-2xl glass glass-hover p-6 bg-card/45 backdrop-blur-md flex flex-col items-center justify-center text-center space-y-4 border border-border cursor-pointer"
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg transition duration-300 group-hover:scale-110`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition">
                    {category.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{category.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. DYNAMIC TIMELINE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-muted/40 rounded-3xl border border-border/40 my-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="text-center space-y-3 mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">How We Craft Your Hamper</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto font-normal">
            A precise multi-stage assembly flow designed to infuse pure sentimental value into every single package.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center space-y-4 relative">
                {index < 3 && (
                  <div className="hidden lg:block absolute top-[28px] left-[65%] right-[-35%] h-[1px] border-t border-dashed border-border z-0" />
                )}

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-card border border-border text-primary shadow-sm z-10">
                  <span className="absolute -top-3.5 -right-3.5 text-xs font-black bg-primary/10 border border-primary/20 text-primary py-0.5 px-2 rounded-full">
                    {step.num}
                  </span>
                  <Icon size={20} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] mx-auto font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. BESTSELLERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="text-center sm:text-left space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Bestseller Classics
            </h2>
            <p className="text-sm text-muted-foreground font-normal">
              Pre-crafted or fully personalized options chosen most by our celebration planners.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition cursor-pointer"
          >
            Explore All Products
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="h-[350px] w-full rounded-2xl bg-card border border-border animate-pulse flex flex-col p-5 space-y-4">
                <div className="aspect-square w-full rounded-xl bg-muted" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card/25 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">No bestseller products found.</p>
          </div>
        )}
      </section>

      {/* 5. TRUSTED VALUES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Secure Checkout Guarantee</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              100% secure custom payment simulations with automated invoice matching.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
            <Gift size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Bespoke Artisan Touch</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              Every custom engraving is proof-inspected by master gift box visual designers.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Truck size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Active Hand-delivered</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              Hand-delivered box sets dispatch with active mobile sms and map timeline tracking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
