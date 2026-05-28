"use client";

import React from "react";
import Link from "next/link";
import { Gift, Heart, Globe, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
                <Gift size={16} />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Giftly
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Crafting unforgettable milestones through premium curated gift hampers and bespoke personalized tokens of affection. Hand-delivered with precision.
            </p>
            <div className="flex space-x-3 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition"><Globe size={16} /></a>
              <a href="#" className="hover:text-foreground transition"><Mail size={16} /></a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Milestones</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground transition">Anniversary Specialties</Link></li>
              <li><Link href="/products" className="hover:text-foreground transition">Bespoke Engravings</Link></li>
              <li><Link href="/products" className="hover:text-foreground transition">Executive Hampers</Link></li>
              <li><Link href="/products" className="hover:text-foreground transition">Wedding Essentials</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Customer Support</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/orders" className="hover:text-foreground transition">Real-time Tracking</Link></li>
              <li><a href="#" className="hover:text-foreground transition">Refund Policies</a></li>
              <li><a href="#" className="hover:text-foreground transition">Shipping Protocols</a></li>
              <li><a href="#" className="hover:text-foreground transition">Contact Artisans</a></li>
            </ul>
          </div>

          {/* Tech/Disclaimer */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Enterprise</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Antigravity-designed framework optimized for instant scale and edge deployment on Vercel. Hybrid server/client caching.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-muted-foreground">
            &copy; {new Date().getFullYear()} Giftly Systems Inc. All rights reserved.
          </p>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            Handcrafted with <Heart size={10} className="text-destructive fill-destructive" /> for perfect anniversary celebrations.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
