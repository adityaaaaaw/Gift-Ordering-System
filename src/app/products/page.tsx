"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { dbService } from "@/services/db";
import { Product, Category } from "@/types";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, Gift, X } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");

  // Fetch all products & categories from Database Layer
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsList, categoriesList] = await Promise.all([
          dbService.getProducts(),
          dbService.getCategories(),
        ]);
        setProducts(productsList);
        setCategories(categoriesList);
      } catch (e) {
        console.error("Failed to load products/categories data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync category filter if URL search parameters update
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Apply filters, search, and sorting
  useEffect(() => {
    let result = [...products];

    // 1. Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Filter by Search Query
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // 3. Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: Featured first, then newest
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("featured");
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Background Glow */}
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center sm:text-left space-y-2 mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Signature Hampers & Gifts
        </h1>
        <p className="text-sm text-muted-foreground font-normal">
          Explore our fully customizable romantic domes, wellness sets, and engraved accessories.
        </p>
      </div>

      {/* Search & Filter Controls Panel */}
      <div className="glass rounded-2xl p-6 border border-border bg-card/35 backdrop-blur-md space-y-4 mb-10 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search hampers, key tags, engravings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm glass-input text-foreground rounded-xl"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort selection dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
            <SlidersHorizontal size={14} className="text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-3 text-xs bg-muted border border-border rounded-xl text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent cursor-pointer"
            >
              <option value="featured">Bestsellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Dynamic Category Filtering Tags */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`py-1.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition duration-200 cursor-pointer ${
              selectedCategory === "All"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            All
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-1.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition duration-200 cursor-pointer ${
                selectedCategory.toLowerCase() === cat.id.toLowerCase()
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid Render */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="h-[380px] w-full rounded-2xl bg-card border border-border animate-pulse flex flex-col p-5 space-y-4">
              <div className="aspect-square w-full rounded-xl bg-muted" />
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 rounded-2xl glass border border-border/80 bg-card/25 max-w-lg mx-auto flex flex-col items-center justify-center space-y-4 p-8">
          <div className="h-14 w-14 bg-muted rounded-full flex items-center justify-center text-muted-foreground border border-border">
            <Gift size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">No Hampers Match</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[280px] leading-relaxed mx-auto font-normal">
              We couldn't find any gifts matching your specific combination of filters. Try clearing search keywords or selecting a different category.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 py-2 px-5 rounded-xl border border-primary/20 transition cursor-pointer"
          >
            Clear Filters & Search
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-20 text-center flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground font-semibold">Loading Gift Catalog...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
