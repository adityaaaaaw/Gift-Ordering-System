"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X, Sun, Moon, Gift } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.cartCount);
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load and apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("giftly_theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    setTheme(initialTheme);
    
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("giftly_theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Catalog" },
    { href: "/orders", label: "Track Order" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-45 w-full border-b border-border bg-background/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-2 rounded-xl text-primary-foreground group-hover:scale-105 transition duration-200 shadow-md shadow-primary/20">
                <Gift size={20} className="animate-pulse" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Giftly
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition duration-200 ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition duration-200"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition duration-200"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth / Profile Area */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-border">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 py-1.5 px-3 rounded-lg hover:bg-primary/20 transition duration-200"
                  >
                    <LayoutDashboard size={13} />
                    SaaS Panel
                  </Link>
                )}
                <div className="flex items-center gap-1.5 text-sm text-foreground font-medium">
                  <User size={14} className="text-muted-foreground" />
                  <span className="max-w-[100px] truncate">{user.displayName}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition duration-200"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted py-1.5 px-3 rounded-lg transition duration-200"
                >
                  Admin Portal
                </Link>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 py-1.5 px-3 rounded-lg transition duration-200"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Action Buttons */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-md py-4 px-4 space-y-3 transition duration-300">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Profile Section in Mobile Drawer */}
          <div className="pt-4 border-t border-border space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-foreground">
                  <User size={16} className="text-muted-foreground" />
                  <span>{user.displayName}</span>
                  <span className="text-[10px] bg-primary/20 text-primary py-0.5 px-2 rounded-full uppercase tracking-wider font-semibold">
                    {user.role}
                  </span>
                </div>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center gap-2 py-2 px-3 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition"
                  >
                    <LayoutDashboard size={15} />
                    SaaS Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 py-2 px-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-sm font-medium text-muted-foreground hover:bg-muted py-2 px-3 rounded-lg transition"
                >
                  Admin Portal
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-sm font-semibold bg-primary text-primary-foreground py-2 px-3 rounded-lg transition"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
