"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { dbService } from "@/services/db";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "@/hooks/useToast";
import { Star, Upload, MessageSquare, Plus, Minus, ShoppingBag, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const addToCart = useCartStore((state) => state.addToCart);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Personalization states
  const [customMessage, setCustomMessage] = useState("");
  const [customImage, setCustomImage] = useState<string | null>(null); // base64 string
  const [imageName, setImageName] = useState("");

  // Fetch product detail
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const item = await dbService.getProductById(id);
        if (item) {
          setProduct(item);
        }
      } catch (e) {
        console.error("Failed to load product detail:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle image upload & base64 conversion
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Keepsake image size must be smaller than 2MB.",
          variant: "warning",
        });
        return;
      }
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

    const personalization = (customImage || customMessage.trim()) 
      ? {
          ...(customImage ? { customImage } : {}),
          ...(customMessage.trim() ? { customMessage } : {}),
        }
      : undefined;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      personalization,
    }, quantity);

    // Trigger Toast Notification
    toast({
      title: "Gift added to cart",
      description: `Successfully added ${quantity}x ${product.name} to your hamper box.`,
      variant: "success",
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-3xl bg-muted" />
          <div className="space-y-6 py-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-10 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center flex flex-col items-center justify-center space-y-4">
        <div className="h-14 w-14 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center border border-red-500/20">
          <AlertTriangle size={22} />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">Gift Not Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-[280px] leading-relaxed mx-auto font-normal">
            The product you're looking for does not exist or has been retired by our curators.
          </p>
        </div>
        <Link href="/products" className="text-xs font-semibold text-primary bg-primary/10 py-2 px-5 rounded-xl border border-primary/20 transition duration-200">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isLowStock = product.stock > 0 && product.stock <= 8;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Glow */}
      <div className="absolute top-[20%] right-[-5%] w-[450px] h-[450px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

      {/* Back button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition mb-8 group"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition duration-150" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-card shadow-lg glass">
            {isOutOfStock && (
              <span className="absolute top-4 right-4 z-10 rounded-full bg-destructive text-destructive-foreground px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider animate-pulse">
                Sold Out
              </span>
            )}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Details & Form */}
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-[10px] font-bold text-primary uppercase tracking-wider">
              {product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-1.5 text-amber-500">
              <Star size={14} className="fill-current" />
              <span className="text-xs font-bold">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground font-normal">
                (Authentic customer review)
              </span>
            </div>

            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-2xl font-black text-foreground">${product.price.toFixed(2)}</span>
              {isLowStock && (
                <span className="text-xs font-bold text-amber-500 animate-pulse">
                  Only {product.stock} items remaining in stock
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed font-normal">
            {product.description}
          </p>

          {/* PERSONALIZATION */}
          <div className="rounded-2xl border border-border bg-muted/40 p-5 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/50">
              <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                Personalization Center
              </span>
              <span className="text-[9px] bg-primary/10 text-primary py-0.5 px-2 rounded-full font-bold animate-pulse">
                Bespoke Optional
              </span>
            </div>

            {/* Engraving */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <MessageSquare size={13} className="text-muted-foreground" />
                Engraving Text or Greeting Card Note
              </label>
              <textarea
                placeholder="Examples: 'A & S Forever', 'Happy 17 Months my love!', or special messages..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                maxLength={250}
                className="w-full h-20 p-3 text-xs glass-input text-foreground rounded-xl placeholder:text-muted-foreground/60 resize-none"
              />
              <div className="text-[10px] text-muted-foreground text-right">
                {customMessage.length}/250 characters
              </div>
            </div>

            {/* Keepsake Photo Upload */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Upload size={13} className="text-muted-foreground" />
                Upload Keepsake Photo (for personalized frames/lockets)
              </label>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/50 bg-card/40 hover:bg-card/75 rounded-2xl p-4 w-full sm:w-1/2 aspect-[4/3] cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Upload size={20} className="text-muted-foreground mb-2 group-hover:scale-110" />
                  <span className="text-xs font-bold text-foreground">Select Keepsake Photo</span>
                  <span className="text-[9px] text-muted-foreground/80 mt-1">JPEG/PNG up to 2MB</span>
                </label>

                {customImage ? (
                  <div className="relative w-full sm:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card animate-fade-in">
                    <img
                      src={customImage}
                      alt="Personalization Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setCustomImage(null);
                        setImageName("");
                      }}
                      className="absolute top-2 right-2 bg-black/75 hover:bg-black text-white p-1.5 rounded-full text-[9px] font-bold"
                    >
                      Clear
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-white text-[9px] py-1 px-3 truncate">
                      {imageName}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-2xl border border-border border-dashed bg-card/25 w-full sm:w-1/2 aspect-[4/3] text-[10px] text-muted-foreground/60">
                    Image preview will appear here
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* QUANTITY & ACTIONS */}
          <div className="flex flex-wrap gap-4 items-center pt-4">
            
            <div className="flex items-center border border-border rounded-xl bg-card">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-muted-foreground hover:text-foreground transition hover:bg-muted rounded-l-xl"
                disabled={isOutOfStock}
              >
                <Minus size={13} />
              </button>
              <span className="px-4 text-xs font-bold text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 text-muted-foreground hover:text-foreground transition hover:bg-muted rounded-r-xl"
                disabled={isOutOfStock}
              >
                <Plus size={13} />
              </button>
            </div>

            <div className="flex-1 min-w-[120px]">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Subtotal</p>
              <p className="text-lg font-black text-foreground">
                ${(product.price * quantity).toFixed(2)}
              </p>
            </div>

            {!isOutOfStock ? (
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition duration-200 cursor-pointer"
              >
                <ShoppingBag size={14} />
                Add to Cart
              </button>
            ) : (
              <button
                disabled
                className="bg-muted text-muted-foreground/60 border border-border cursor-not-allowed py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                Currently Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
