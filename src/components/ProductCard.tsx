"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "@/hooks/useToast";
import { ShoppingCart, Star, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page
    if (product.stock <= 0) return;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });

    // Fire Toast alert using our global Shadcn-style Toast system!
    toast({
      title: "Added to cart",
      description: `Successfully added ${product.name} to your keepsakes box.`,
      variant: "success",
    });
  };

  const isLowStock = product.stock > 0 && product.stock <= 8;
  const isOutOfStock = product.stock <= 0;

  return (
    <Link
      href={`/product/${product.id}`} // LINK TO SINGULAR /product/[id] ROUTE!
      className="group block relative overflow-hidden rounded-2xl glass glass-hover border border-border bg-card/45 backdrop-blur-md flex flex-col h-full"
    >
      {/* Image Wrapper */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {/* Category tag */}
        <span className="absolute top-3 left-3 z-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
          {product.category}
        </span>

        {/* Stock / Promotion Badges */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 z-10 rounded-full bg-destructive text-destructive-foreground px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
            Sold Out
          </span>
        ) : isLowStock ? (
          <span className="absolute top-3 right-3 z-10 rounded-full bg-amber-500/90 backdrop-blur-sm border border-amber-400/20 text-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider animate-pulse shadow-md">
            Low Stock ({product.stock})
          </span>
        ) : product.featured ? (
          <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-primary/95 text-primary-foreground px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
            <Sparkles size={9} /> Bestseller
          </span>
        ) : null}

        {/* Image */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center transition duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-center pb-6">
          <span className="bg-white text-black text-xs font-bold py-2 px-5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition duration-300">
            Customize Gift
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Ratings */}
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={12} className="fill-current" />
            <span className="text-xs font-bold">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-muted-foreground font-normal">(Reviews)</span>
          </div>

          <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition duration-150">
            {product.name}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2 pt-3 border-t border-border/50">
          <span className="text-base font-extrabold text-foreground">
            ${product.price.toFixed(2)}
          </span>

          {!isOutOfStock ? (
            <button
              onClick={handleQuickAdd}
              className="p-2 text-primary hover:text-primary-foreground hover:bg-primary border border-primary/20 hover:border-transparent rounded-xl transition duration-200 cursor-pointer"
              aria-label="Add to cart"
              title="Add to cart instantly"
            >
              <ShoppingCart size={15} />
            </button>
          ) : (
            <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wide uppercase">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;
