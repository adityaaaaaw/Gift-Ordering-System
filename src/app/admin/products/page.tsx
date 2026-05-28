"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { dbService } from "@/services/db";
import { Product, Category } from "@/types";
import { toast } from "@/hooks/useToast";
import {
  Package,
  Layers,
  ShoppingBag,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  X,
  Sparkles,
  Gift,
} from "lucide-react";
import Link from "next/link";

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "personalized",
    stock: "",
    featured: false,
    imageUrl: "",
  });

  // Authenticate Admin route
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch product list and categories
  const fetchData = async () => {
    try {
      const [productsList, categoriesList] = await Promise.all([
        dbService.getProducts(),
        dbService.getCategories(),
      ]);
      setProducts(productsList);
      setCategories(categoriesList);
      if (categoriesList.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: categoriesList[0].id }));
      }
    } catch (e) {
      console.error("Products retrieval failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: categories.length > 0 ? categories[0].id : "personalized",
      stock: "",
      featured: false,
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured,
      imageUrl: product.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string, name: string) => {
    if (confirm(`Are you sure you want to retire ${name} from the catalog?`)) {
      try {
        await dbService.deleteProduct(productId);
        toast({
          title: "Product Deleted",
          description: `Successfully retired ${name} from your catalog.`,
          variant: "success",
        });
        fetchData();
      } catch (e) {
        console.error("Product deletion failed:", e);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const priceNum = parseFloat(formData.price) || 0;
    const stockNum = parseInt(formData.stock) || 0;
    
    const imageToUse =
      formData.imageUrl.trim() ||
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80";

    const payload = {
      name: formData.name,
      description: formData.description,
      price: priceNum,
      category: formData.category.toLowerCase(),
      stock: stockNum,
      featured: formData.featured,
      imageUrl: imageToUse,
    };

    try {
      if (editingProduct) {
        await dbService.updateProduct(editingProduct.id, payload);
        toast({
          title: "Product updated",
          description: `Successfully saved changes for ${formData.name}.`,
          variant: "success",
        });
      } else {
        await dbService.addProduct(payload);
        toast({
          title: "Product created",
          description: `Successfully added ${formData.name} to the catalog.`,
          variant: "success",
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Form submit failure:", err);
      setLoading(false);
    }
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
              className="flex items-center gap-2.5 py-2 px-3.5 text-xs font-bold bg-primary/10 border border-primary/20 text-primary rounded-xl"
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
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto font-normal">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Inventory Manager
            </h1>
            <p className="text-xs text-muted-foreground">
              Create, update, and manage product catalogs, tags, and stock counts.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2 px-4 rounded-xl shadow-md shadow-primary/20 transition cursor-pointer"
          >
            <Plus size={13} />
            Create Product Hamper
          </button>
        </div>

        {/* 1. TABLE RENDER */}
        <div className="glass border border-border bg-card/35 backdrop-blur-md rounded-2xl p-6 relative z-10 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-xs text-left border-collapse font-normal">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[9px]">
                  <th className="py-2.5">Image</th>
                  <th className="py-2.5">Name</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Price</th>
                  <th className="py-2.5">Stock</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {products.length > 0 ? (
                  products.map((p) => {
                    const isLowStock = p.stock > 0 && p.stock <= 8;
                    const isOutOfStock = p.stock <= 0;

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition">
                        <td className="py-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="h-9 w-9 rounded-lg border border-border object-cover"
                          />
                        </td>
                        <td className="py-3">
                          <div className="space-y-0.5 max-w-[200px]">
                            <p className="font-bold text-foreground truncate">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                              {p.description}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground uppercase text-[10px] font-semibold">{p.category}</td>
                        <td className="py-3 font-bold text-foreground">${p.price.toFixed(2)}</td>
                        <td className="py-3">
                          <span
                            className={`font-bold ${
                              isOutOfStock
                                ? "text-destructive"
                                : isLowStock
                                ? "text-amber-500"
                                : "text-foreground"
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            {p.featured && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[9px] font-bold border border-primary/20">
                                <Sparkles size={8} /> Bestseller
                              </span>
                            )}
                            {isOutOfStock ? (
                              <span className="inline-block rounded-full bg-red-500/10 text-red-500 px-2 py-0.5 text-[9px] font-bold border border-red-500/20">
                                Out
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-block rounded-full bg-amber-500/10 text-amber-500 px-2 py-0.5 text-[9px] font-bold border border-amber-500/20 animate-pulse">
                                Low
                              </span>
                            ) : (
                              <span className="inline-block rounded-full bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-[9px] font-bold border border-emerald-500/20">
                                Active
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No products in catalog. Add one now!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. DYNAMIC CREATE/EDIT MODAL OVERLAY */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg glass bg-card rounded-3xl p-6 md:p-8 shadow-2xl border border-border relative space-y-6 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Package size={15} className="text-primary" />
                  {editingProduct ? "Edit Product Hamper" : "Add Product Hamper"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Product Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Forever Enchanted Rose"
                      className="w-full p-2 text-xs glass-input text-foreground rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Collection Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2 text-xs bg-muted border border-border rounded-xl text-foreground font-semibold cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Detailed Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Full product descriptions, features, and milestone annotations..."
                    className="w-full h-20 p-2 text-xs glass-input text-foreground rounded-xl placeholder:text-muted-foreground/60 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Hamper Price ($)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="45.00"
                      className="w-full p-2 text-xs glass-input text-foreground rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Stock Inventory Quantity</label>
                    <input
                      required
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="15"
                      className="w-full p-2 text-xs glass-input text-foreground rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Product Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://unsplash.com/photo-..."
                    className="w-full p-2 text-xs glass-input text-foreground rounded-xl"
                  />
                  <p className="text-[8px] text-muted-foreground/80">Leave blank to load a beautiful default curated picture.</p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-3.5 w-3.5 rounded text-primary focus:ring-primary border-border bg-card cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-xs font-bold text-foreground cursor-pointer flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-500 fill-amber-500" />
                    Feature as 'Bestseller' badge on Home Screen
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/60 font-semibold">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs font-bold text-muted-foreground hover:bg-muted py-2 px-4 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-wider py-2 px-5 rounded-xl shadow-md transition cursor-pointer"
                  >
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
