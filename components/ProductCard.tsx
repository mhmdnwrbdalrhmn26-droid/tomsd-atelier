import React, { useState } from "react";
import { Plus, Eye, Sparkles, Heart } from "lucide-react";
import { Product, Currency, CURRENCY_SYMBOLS, CURRENCY_RATES, Language } from "../types";

interface ProductCardProps {
  key?: string;
  product: Product;
  currentCurrency: Currency;
  currentLanguage: Language;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
}

export default function ProductCard({
  product,
  currentCurrency,
  currentLanguage,
  onViewDetails,
  onAddToCart,
  isFavorite = false,
  onToggleFavorite
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  // Convert Base USD to current Currency rates with discount support
  const hasDiscount = product.discountPercentage !== undefined && product.discountPercentage > 0;
  const originalPriceNumber = product.price * CURRENCY_RATES[currentCurrency];
  const discountedPriceNumber = hasDiscount
    ? (product.price * (1 - (product.discountPercentage || 0) / 100)) * CURRENCY_RATES[currentCurrency]
    : originalPriceNumber;

  const formattedOriginalPrice = originalPriceNumber.toLocaleString(undefined, {
    style: "currency",
    currency: currentCurrency,
    maximumFractionDigits: currentCurrency === Currency.JPY ? 0 : 2
  });

  const formattedDiscountedPrice = discountedPriceNumber.toLocaleString(undefined, {
    style: "currency",
    currency: currentCurrency,
    maximumFractionDigits: currentCurrency === Currency.JPY ? 0 : 2
  });

  // Calculate matching hex color for swatches
  const activeColorHex = product.colorHexes[selectedColor] || "#999999";

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white dark:bg-stone-900 border border-neutral-100/50 dark:border-neutral-800 p-2 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-neutral-200/5 dark:hover:shadow-black/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Image Container with Hover-to-Zoom & Alternative view */}
      <div 
        id={`card-img-container-${product.id}`}
        className="relative aspect-[3/4] bg-neutral-100 dark:bg-stone-800 w-full overflow-hidden rounded-sm"
      >
        
        {/* Curated quote badge on deep hover */}
        {product.curatedQuote && (
          <div className="absolute top-3 left-3 z-25 pointer-events-none">
            <span className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm px-2.5 py-1 text-[9px] font-mono font-medium tracking-wider text-neutral-800 dark:text-stone-200 uppercase shadow-sm">
              ATELIER DIRECTIVE
            </span>
          </div>
        )}

        {/* Dynamic Discount Ribbon */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-25 pointer-events-none">
            <span className="bg-rose-600 text-white font-mono text-[9px] font-extrabold tracking-wider px-2 py-1 uppercase rounded-xs shadow-md shadow-rose-900/10">
              {currentLanguage === Language.AR ? `خصم %${product.discountPercentage}` : `-${product.discountPercentage}% OFF`}
            </span>
          </div>
        )}

        {/* Live Fashion Recommendation tag */}
        <div className="absolute top-3 right-3 z-25 bg-neutral-900/90 dark:bg-stone-100/90 text-white dark:text-neutral-905 font-mono text-[8px] tracking-widest px-2 py-0.5 rounded-sm uppercase pointer-events-none">
          {product.category}
        </div>

        {/* Minimalist Heart overlay */}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            className="absolute bottom-3 right-3 z-30 p-2 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm text-neutral-905 dark:text-stone-100 hover:bg-white dark:hover:bg-stone-850 hover:scale-110 active:scale-95 shadow-sm transition-all cursor-pointer"
            title="حفظ في الأرشيف المفضّل"
          >
            <Heart className={`h-3.5 w-3.5 transition-colors ${isFavorite ? "text-neutral-950 dark:text-white fill-neutral-950 dark:fill-white animate-bounce" : "text-neutral-500 hover:text-neutral-900"}`} />
          </button>
        )}

        {/* Base Image Link */}
        <div onClick={() => onViewDetails(product)} className="w-full h-full cursor-pointer">
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover object-center transition-all duration-1000 ease-out ${isHovered ? "scale-105" : "scale-100"}`}
            referrerPolicy="no-referrer"
          />

          {/* Quick View Cover Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm text-neutral-900 dark:text-stone-100 py-3 px-6 text-[10px] uppercase font-mono tracking-[0.2em] shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              INSPECT ATELIER PIECE
            </div>
          </div>
        </div>

      </div>

      {/* Description Layout */}
      <div className="flex flex-col pt-4 pb-2 px-1">
        
        {/* Brand & Sizes line */}
        <div className="flex justify-between items-center mb-1">
          <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
            {product.fabric.split(",")[0]}
          </span>
          <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">
            {product.sizes.join(" · ")}
          </span>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onViewDetails(product)}
          className="font-sans font-normal text-xs text-neutral-900 dark:text-stone-100 tracking-wide mb-1 cursor-pointer hover:text-neutral-500 dark:hover:text-stone-350 transition-colors"
        >
          {product.name}
        </h3>

        {/* Stock remaining info */}
        <div className="mb-1.5 flex items-center space-x-1.5 rtl:space-x-reverse">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${product.stockCount !== undefined && product.stockCount <= 2 ? "bg-rose-600 animate-ping" : "bg-amber-500 animate-pulse"}`}></span>
          <span className={`font-sans text-[9.5px] tracking-wide ${product.stockCount !== undefined && product.stockCount <= 2 ? "text-rose-600 font-bold" : "text-stone-500 dark:text-stone-400 font-medium"}`}>
            {currentLanguage === Language.AR 
              ? `المتبقي: ${product.stockCount ?? 4} قطع فقط`
              : `Only ${product.stockCount ?? 4} pieces remaining`}
          </span>
        </div>

        {/* Color Swatch Indicators & Convert price */}
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-neutral-100/60 dark:border-neutral-800">
          <div className="flex items-center space-x-1.5">
            {product.colors.map((color) => (
              <button
                id={`card-color-${product.id}-${color.replace(/\s+/g, "-")}`}
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: product.colorHexes[color] }}
                className={`h-3 w-3 rounded-full border transition-all ${color === selectedColor ? "ring-1 ring-neutral-950 dark:ring-white ring-offset-2 dark:ring-offset-stone-900 border-transparent scale-110" : "border-neutral-200 dark:border-neutral-800 hover:scale-105"}`}
                title={color}
              />
            ))}
          </div>

          <div className="flex flex-col items-end">
            {hasDiscount ? (
              <>
                <span className="font-mono text-[9.5px] text-neutral-400 dark:text-neutral-500 line-through leading-none mb-0.5 tracking-wider">
                  {formattedOriginalPrice}
                </span>
                <span className="font-mono text-xs font-bold text-rose-600 leading-none tracking-wider">
                  {formattedDiscountedPrice}
                </span>
              </>
            ) : (
              <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-stone-100 tracking-wider">
                {formattedOriginalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Detailed styling cue */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 h-0 group-hover:h-8 transition-all duration-500 overflow-hidden flex items-center justify-between">
          <span className="font-mono text-[9px] text-zinc-400 dark:text-stone-500 italic">
            Fit: {product.fit.split(" ")[0]}
          </span>
          <button
            id={`card-quick-add-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, product.sizes[0], selectedColor);
            }}
            className="flex items-center space-x-1 font-mono text-[9px] text-neutral-900 dark:text-stone-100 hover:text-neutral-600 dark:hover:text-stone-300 font-bold tracking-widest uppercase pb-0.5 border-b border-neutral-900 dark:border-stone-100 hover:border-neutral-500 cursor-pointer"
          >
            <Plus className="h-2.5 w-2.5" />
            <span>BAG IT</span>
          </button>
        </div>

      </div>

    </div>
  );
}
