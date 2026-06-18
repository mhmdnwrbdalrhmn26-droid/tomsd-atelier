import React, { useState } from "react";
import { X, Ruler, Sparkles, Check, ShoppingBag, ArrowLeft } from "lucide-react";
import { Product, Currency, TRANSLATIONS, CURRENCY_RATES, CURRENCY_SYMBOLS, Language } from "../types";
import { PRODUCTS } from "../data";

interface ProductDetailModalProps {
  product: Product;
  currentCurrency: Currency;
  currentLanguage: Language;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onNavigateToProduct: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  currentCurrency,
  currentLanguage,
  onClose,
  onAddToCart,
  onNavigateToProduct
}: ProductDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isSuccessfullyAdded, setIsSuccessfullyAdded] = useState(false);

  // Smart Sizing Advisor States
  const [advisorHeight, setAdvisorHeight] = useState("175");
  const [advisorWeight, setAdvisorWeight] = useState("70");
  const [advisorFit, setAdvisorFit] = useState<"slim" | "classic" | "oversized">("classic");
  const [guideTab, setGuideTab] = useState<"table" | "advisor">("advisor");

  // Calculate recommended size dynamically based on height, weight, and fit preference
  const calculateRecommendedSize = (): { size: string; notes: string; notesAr: string } => {
    const h = parseFloat(advisorHeight) || 175;
    const w = parseFloat(advisorWeight) || 70;
    
    let baseSize = "M";
    if (w < 55) {
      baseSize = h < 165 ? "XS" : "S";
    } else if (w >= 55 && w < 68) {
      baseSize = h < 172 ? "S" : "M";
    } else if (w >= 68 && w < 80) {
      baseSize = h < 178 ? "M" : "L";
    } else if (w >= 80 && w < 93) {
      baseSize = h < 185 ? "L" : "XL";
    } else {
      baseSize = "XL";
    }

    // Shift sizing based on client's styling fit preference
    let recommended = baseSize;
    if (advisorFit === "slim") {
      // Suggest a step down if they prefer a tight/sharp structured look
      const index = product.sizes.indexOf(baseSize);
      if (index > 0) {
        recommended = product.sizes[index - 1];
      }
    } else if (advisorFit === "oversized") {
      // Suggest a step up for extra volume if the product has larger options
      const index = product.sizes.indexOf(baseSize);
      if (index !== -1 && index < product.sizes.length - 1) {
        recommended = product.sizes[index + 1];
      }
    }

    // Double-check if calculated size is available for this product, fallback if not
    if (!product.sizes.includes(recommended)) {
      recommended = product.sizes.includes(baseSize) ? baseSize : product.sizes[0];
    }

    // Personal styling advice strings
    let notes = "";
    let notesAr = "";
    if (advisorFit === "oversized") {
      notes = `This selection provides our signature architectural drape, featuring a relaxed chest shoulder flow and extra comfort.`;
      notesAr = `يوفر هذا الاختيار المظهر الدراماتيكي العريض والمميز لعلامتنا التجارية، مع أكتاف منسدلة وانسيابية فاخرة ومثالية.`;
    } else if (advisorFit === "slim") {
      notes = `This fits closer to the traditional tailoring lines, emphasizing a sharp, clean structured look.`;
      notesAr = `يناسب هذا الخيار القصة الكلاسيكية المحددة للبدل الفاخرة، مع التركيز على خطوط الهيكل الأنيقة والنظيفة والمشدودة.`;
    } else {
      notes = `A perfectly balanced cut. True to our modern classic silhouette—ideal drape and proportion.`;
      notesAr = `قصة متوازنة تماماً تلتزم بالصورة الظلية الكلاسيكية الحديثة لورشة الأتيليه مع التهوية والانسيابية المثالية.`;
    }

    return { size: recommended, notes, notesAr };
  };

  const calculatedRec = calculateRecommendedSize();

  const t = TRANSLATIONS[currentLanguage];

  // Convert Base Price and support discount
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

  // Complete the Look - Fetch linked products
  const completeLookProducts = PRODUCTS.filter((p) => product.completeTheLookIds.includes(p.id));

  // Handle zooming state logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handleBagSubmit = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setIsSuccessfullyAdded(true);
    setTimeout(() => {
      setIsSuccessfullyAdded(false);
    }, 2000);
  };

  return (
    <div id="product-detail-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div id="product-detail-container" className="relative w-full max-w-6xl bg-white dark:bg-stone-900 text-neutral-900 dark:text-stone-100 rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row my-8 border dark:border-neutral-800">
        
        {/* Close Button */}
        <button
          id="detail-modal-close"
          onClick={onClose}
          className="absolute right-4 top-4 z-40 bg-white/90 dark:bg-stone-900/90 hover:bg-neutral-900 dark:hover:bg-white dark:hover:text-neutral-950 text-neutral-900 dark:text-stone-100 p-2.5 rounded-full shadow-lg transition-all cursor-pointer border border-neutral-150 dark:border-neutral-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Column: Image Gallery View */}
        <div className="w-full md:w-[55%] bg-neutral-50 dark:bg-stone-950/40 p-4 sm:p-8 flex flex-col justify-between">
          
          <div className="flex items-center space-x-2 font-mono text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
            <span className="hover:text-black dark:hover:text-white cursor-pointer" onClick={onClose}>ATELIER CATALOGUE</span>
            <span>/</span>
            <span className="text-black font-semibold">{product.category}</span>
          </div>

          {/* Main Zoomable Image Frame */}
          <div
            id="detail-image-zoom-frame"
            className="relative aspect-[3/4] w-full bg-neutral-200 overflow-hidden rounded-sm cursor-crosshair group mb-6"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.images[activeImageIdx]}
              alt={product.name}
              className={`w-full h-full object-cover object-center transition-transform duration-200 ${isZoomed ? "scale-225" : "scale-100"}`}
              style={isZoomed ? { transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%` } : undefined}
              referrerPolicy="no-referrer"
            />
            
            {/* Visual cue for zoom */}
            {!isZoomed && (
              <span className="absolute bottom-3 right-3 bg-black/60 text-white font-mono text-[8px] tracking-widest py-1 px-3.5 backdrop-blur-xs rounded-sm">
                HOVER TO ZOOM DETAIL
              </span>
            )}
          </div>

          {/* Alternative Image Select Toggles */}
          <div className="flex space-x-3">
            {product.images.map((img, idx) => (
              <button
                id={`detail-img-thumb-${idx}`}
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative aspect-[3/4] w-20 overflow-hidden border transition-all ${idx === activeImageIdx ? "border-neutral-900 scale-102 ring-1 ring-neutral-900" : "border-neutral-250 opacity-60 hover:opacity-100"}`}
              >
                <img src={img} alt="Thumbnail view" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Garment Information & Options */}
        <div className="w-full md:w-[45%] p-6 sm:p-10 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-100 dark:border-stone-800 bg-white dark:bg-stone-900">
          
          <div>
            {/* Designer Note Quote */}
            <div className="mb-6 pb-4 border-b border-neutral-100 dark:border-stone-800">
              <span className="bg-neutral-100 dark:bg-stone-800 text-neutral-800 dark:text-stone-300 font-mono text-[9px] tracking-[0.2em] px-2.5 py-1 uppercase rounded-xs">
                {product.category} SELECTION
              </span>
              <p className="mt-4 font-mono font-medium text-[10px] leading-relaxed text-zinc-500 dark:text-stone-400 italic max-w-sm">
                "{product.curatedQuote}"
              </p>
            </div>

            {/* Title & Price heading */}
            <h2 className="font-sans text-xl sm:text-2xl font-light tracking-[0.05em] uppercase text-neutral-900 dark:text-stone-105 mb-2 leading-tight">
              {product.name}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                {hasDiscount ? (
                  <>
                    <span className="font-mono text-sm text-neutral-400 dark:text-neutral-500 line-through tracking-wider">
                      {formattedOriginalPrice}
                    </span>
                    <span className="font-mono text-base font-bold text-rose-600 tracking-wider">
                      {formattedOriginalPrice === formattedDiscountedPrice ? formattedOriginalPrice : formattedDiscountedPrice}
                    </span>
                  </>
                ) : (
                  <p className="font-mono text-base font-semibold text-neutral-900 dark:text-stone-100 tracking-wider">
                    {formattedOriginalPrice}
                  </p>
                )}
              </div>
              
              {/* Remaining pieces scarcity badge */}
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-sm">
                <span className={`inline-block w-2 h-2 rounded-full ${product.stockCount !== undefined && product.stockCount <= 2 ? "bg-rose-600 animate-ping" : "bg-amber-500 animate-pulse"}`}></span>
                <span className={`font-sans text-[10.5px] uppercase tracking-wide font-semibold ${product.stockCount !== undefined && product.stockCount <= 2 ? "text-rose-600" : "text-amber-700 dark:text-amber-500"}`}>
                  {currentLanguage === Language.AR 
                    ? `متبقي في الورشة: ${product.stockCount ?? 4} قطع فقط!`
                    : `Workshop pieces left: ${product.stockCount ?? 4}`}
                </span>
              </div>
            </div>

            {/* Long Material description */}
            <div className="mb-6 font-sans text-xs text-neutral-600 dark:text-stone-300 leading-relaxed font-light">
              <p>{product.description}</p>
            </div>

            {/* Premium details list */}
            <div className="bg-neutral-50/70 dark:bg-stone-950/20 p-4 rounded-sm border border-neutral-100/50 dark:border-neutral-800 mb-6 space-y-2">
              <div className="flex justify-between text-[11px] font-sans">
                <span className="text-neutral-400 dark:text-neutral-500 tracking-wider">{t.filterFabric}</span>
                <span className="text-neutral-950 dark:text-stone-150 font-medium text-right font-mono">{product.fabric}</span>
              </div>
              <div className="flex justify-between text-[11px] font-sans">
                <span className="text-neutral-400 dark:text-neutral-500 tracking-wider">{t.filterFit}</span>
                <span className="text-neutral-950 dark:text-stone-150 font-medium text-right font-mono">{product.fit}</span>
              </div>
            </div>

            {/* Color Swatch Options */}
            <div className="mb-6">
              <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400 block mb-2 font-semibold">
                {t.filterColor}: <span className="text-neutral-900 dark:text-stone-100 font-mono font-medium">{selectedColor}</span>
              </span>
              <div className="flex items-center space-x-3">
                {product.colors.map((color) => (
                  <button
                    id={`detail-color-btn-${color.replace(/\s+/g, "-")}`}
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: product.colorHexes[color] }}
                    className={`h-7 w-7 rounded-full border transition-all ${color === selectedColor ? "ring-2 ring-neutral-900 dark:ring-white ring-offset-2 dark:ring-offset-stone-900 border-transparent" : "border-neutral-300 dark:border-neutral-700 hover:scale-105"}`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Options & Size Guide trigger */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2.5">
                <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400 font-semibold">
                  {t.filterSize}: <span className="text-neutral-900 dark:text-stone-100 font-mono font-medium">{selectedSize}</span>
                </span>
                
                {/* Sizing Advisor Link */}
                <button
                  id="detail-size-guide-trigger"
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="flex items-center space-x-1 font-mono text-[9px] text-zinc-500 dark:text-stone-400 hover:text-black dark:hover:text-white cursor-pointer uppercase pb-0.5 border-b border-dotted"
                >
                  <Ruler className="h-3 w-3" />
                  <span>{t.sizeGuide}</span>
                </button>
              </div>

              {/* Sizing Grid Switches */}
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    id={`detail-size-btn-${size}`}
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-1 text-center font-mono text-xs tracking-wider transition-all cursor-pointer border rounded-xs ${size === selectedSize ? "bg-neutral-950 dark:bg-stone-100 border-neutral-950 dark:border-stone-100 text-white dark:text-neutral-950 font-bold" : "bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-750 dark:text-stone-300 hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:border-neutral-900 dark:hover:border-stone-400"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Size guide interactive details box */}
              {showSizeGuide && (
                <div id="detail-size-guide-box" className="mt-4 p-4 border border-zinc-250 dark:border-neutral-800 bg-neutral-50 dark:bg-stone-950/60 rounded-sm font-sans text-xs leading-relaxed shadow-md">
                  {/* Selector Tabs */}
                  <div className="flex border-b border-zinc-200 dark:border-neutral-800 mb-4 pb-2 text-[10px] sm:text-[11px] font-mono tracking-wider">
                    <button
                      id="guide-tab-advisor-btn"
                      type="button"
                      onClick={() => setGuideTab("advisor")}
                      className={`flex-1 pb-1 text-center font-bold uppercase transition-all ${guideTab === "advisor" ? "border-b-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600"}`}
                    >
                      {currentLanguage === Language.AR ? "حاسب المقاس الذكي" : "SMART FIT ADVISOR"}
                    </button>
                    <button
                      id="guide-tab-table-btn"
                      type="button"
                      onClick={() => setGuideTab("table")}
                      className={`flex-1 pb-1 text-center font-bold uppercase transition-all ${guideTab === "table" ? "border-b-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white" : "text-zinc-400 hover:text-zinc-600"}`}
                    >
                      {currentLanguage === Language.AR ? "جدول المقاسات الفني" : "TECHNICAL SIZE CHART"}
                    </button>
                  </div>

                  {guideTab === "table" ? (
                    <div className="font-mono text-[10px] space-y-1">
                      <div className="flex justify-between font-bold border-b dark:border-neutral-800 pb-1.5 mb-1.5 text-neutral-800 dark:text-stone-205">
                        <span>ATELIER SCALE</span>
                        <span>EU SIZE</span>
                        <span>CHEST INCHES</span>
                      </div>
                      <div className="space-y-1 text-neutral-600 dark:text-stone-300">
                        <div className={`flex justify-between ${selectedSize === "XS" ? "font-bold text-neutral-950 dark:text-white bg-neutral-200/50 dark:bg-stone-800 px-1 rounded-sm" : ""}`}><span>XS</span><span>44</span><span>34" - 36"</span></div>
                        <div className={`flex justify-between ${selectedSize === "S" ? "font-bold text-neutral-950 dark:text-white bg-neutral-200/50 dark:bg-stone-800 px-1 rounded-sm" : ""}`}><span>S</span><span>46</span><span>36" - 38"</span></div>
                        <div className={`flex justify-between ${selectedSize === "M" ? "font-bold text-neutral-950 dark:text-white bg-neutral-200/50 dark:bg-stone-800 px-1 rounded-sm" : ""}`}><span>M</span><span>48</span><span>38" - 40"</span></div>
                        <div className={`flex justify-between ${selectedSize === "L" ? "font-bold text-neutral-950 dark:text-white bg-neutral-200/50 dark:bg-stone-800 px-1 rounded-sm" : ""}`}><span>L</span><span>50</span><span>40" - 42"</span></div>
                        <div className={`flex justify-between ${selectedSize === "XL" ? "font-bold text-neutral-950 dark:text-white bg-neutral-200/50 dark:bg-stone-800 px-1 rounded-sm" : ""}`}><span>XL</span><span>52</span><span>42" - 44"</span></div>
                      </div>
                      <p className="mt-3 text-[9px] text-zinc-400">
                        *Our garments utilize room-retaining dropped shoulder cuts. Sourcing true size retains this architectural silhouette.*
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 font-sans">
                      {/* Metric inputs row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9.5px] uppercase font-mono tracking-wider text-zinc-450 dark:text-stone-400 mb-1">
                            {currentLanguage === Language.AR ? "الطول (سم)" : "HEIGHT (CM)"}
                          </label>
                          <input
                            type="number"
                            min="140"
                            max="220"
                            value={advisorHeight}
                            onChange={(e) => setAdvisorHeight(e.target.value)}
                            className="w-full bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 rounded-xs py-1.5 px-2.5 text-xs font-mono focus:border-neutral-900 dark:focus:border-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9.5px] uppercase font-mono tracking-wider text-zinc-450 dark:text-stone-400 mb-1">
                            {currentLanguage === Language.AR ? "الوزن (كجم)" : "WEIGHT (KG)"}
                          </label>
                          <input
                            type="number"
                            min="35"
                            max="180"
                            value={advisorWeight}
                            onChange={(e) => setAdvisorWeight(e.target.value)}
                            className="w-full bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 rounded-xs py-1.5 px-2.5 text-xs font-mono focus:border-neutral-900 dark:focus:border-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Styling fit preference */}
                      <div>
                        <span className="block text-[9.5px] uppercase font-mono tracking-wider text-zinc-450 dark:text-stone-400 mb-1">
                          {currentLanguage === Language.AR ? "تفضيل نمط القصة" : "FIT STYLE PREFERENCE"}
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          {(["slim", "classic", "oversized"] as const).map((fitOption) => (
                            <button
                              key={fitOption}
                              type="button"
                              onClick={() => setAdvisorFit(fitOption)}
                              className={`py-1 text-[9.5px] font-mono tracking-wider uppercase border rounded-xs ${advisorFit === fitOption ? "bg-neutral-900 dark:bg-stone-105 border-neutral-900 dark:border-stone-105 text-white dark:text-neutral-950 font-bold" : "bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-800 text-neutral-600 dark:text-stone-300 hover:border-neutral-400"}`}
                            >
                              {fitOption === "slim" ? (currentLanguage === Language.AR ? "مشدودة" : "Slim") : fitOption === "oversized" ? (currentLanguage === Language.AR ? "عريضة" : "Oversized") : (currentLanguage === Language.AR ? "كلاسيك" : "Classic")}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Output Recommendation Card */}
                      <div className="bg-white dark:bg-stone-900/80 border border-zinc-200 dark:border-stone-800/80 p-3 rounded-sm flex flex-col items-center text-center">
                        <span className="text-[9.5px] font-mono uppercase tracking-widest text-zinc-400">
                          {currentLanguage === Language.AR ? "المقاس الموصى به" : "DESIGNER RECOMMENDED SIZE"}
                        </span>
                        <span className="font-mono text-2xl font-bold text-neutral-950 dark:text-white mt-1 mb-1.5 bg-neutral-100 dark:bg-stone-850 px-4 py-1.5 rounded-sm shadow-xs border dark:border-stone-750">
                          {calculatedRec.size}
                        </span>
                        <p className="text-[10px] text-zinc-550 dark:text-stone-300 font-light px-2">
                          {currentLanguage === Language.AR ? calculatedRec.notesAr : calculatedRec.notes}
                        </p>
                        
                        <button
                          type="button"
                          id="advisor-apply-recomended-size"
                          onClick={() => setSelectedSize(calculatedRec.size)}
                          className="mt-3 w-full bg-neutral-900 dark:bg-stone-100 text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-stone-200 text-[9.5px] font-mono tracking-widest uppercase py-2 px-3 rounded-xs transition-colors cursor-pointer"
                        >
                          {currentLanguage === Language.AR ? `اعتماد المقاس الموصى به (${calculatedRec.size})` : `APPLY RECOMMENDED SIZE (${calculatedRec.size})`}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Sticky checkout style addition action and Cross Selling Complete Look */}
          <div className="mt-auto pt-6 border-t border-neutral-100 dark:border-neutral-800">
            
            {/* Action Buttons: Add to cart & Quick return in a single row */}
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                id="detail-add-bag-btn"
                onClick={handleBagSubmit}
                className={`flex-1 py-4 px-2 sm:px-4 rounded-xs tracking-widest text-[11px] uppercase font-semibold transition-all transform active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2 shadow-md ${isSuccessfullyAdded ? "bg-emerald-600 text-white" : "bg-neutral-950 dark:bg-stone-100 text-white dark:text-neutral-950 hover:bg-neutral-900 dark:hover:bg-stone-250 hover:shadow-neutral-950/20"}`}
              >
                {isSuccessfullyAdded ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>{t.addedToCart.toUpperCase()}!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>{t.addToCart.toUpperCase()} ({formattedDiscountedPrice})</span>
                  </>
                )}
              </button>

              <button
                id="detail-instant-close-btn"
                onClick={onClose}
                className="px-5 py-4 rounded-xs tracking-widest text-[11.5px] font-bold border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-stone-500 hover:bg-neutral-50 dark:hover:bg-stone-850 text-neutral-800 dark:text-stone-200 transition-colors uppercase cursor-pointer flex items-center justify-center space-x-1 bg-transparent"
                title={currentLanguage === Language.AR ? "الرجوع للمعرض الفني" : "Back to Gallery"}
              >
                <ArrowLeft className="h-3.5 w-3.5 rotate-180 rtl:rotate-0" />
                <span>{currentLanguage === Language.AR ? "رجوع" : "BACK"}</span>
              </button>
            </div>

            {/* "Complete the Look" Cross-selling carousel */}
            {completeLookProducts.length > 0 && (
              <div id="detail-cross-sell" className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <span className="font-sans text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400 font-semibold block mb-4">
                  {t.completeLook.toUpperCase()}
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  {completeLookProducts.slice(0, 2).map((p) => {
                    const priceStr = (p.price * CURRENCY_RATES[currentCurrency]).toLocaleString(undefined, {
                      style: "currency",
                      currency: currentCurrency,
                      maximumFractionDigits: currentCurrency === Currency.JPY ? 0 : 2
                    });
                    return (
                      <div
                        id={`cross-sell-item-${p.id}`}
                        key={p.id}
                        onClick={() => onNavigateToProduct(p)}
                        className="group flex space-x-2.5 bg-neutral-50 dark:bg-stone-950 p-2 border border-neutral-100/50 dark:border-neutral-800 rounded-sm cursor-pointer transition-colors hover:bg-neutral-100/60 dark:hover:bg-stone-850"
                      >
                        <div className="h-14 w-11 bg-neutral-200 dark:bg-stone-800 overflow-hidden rounded-xs flex-shrink-0">
                          <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover filter brightness-[0.97]" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <span className="font-sans text-[10px] text-neutral-800 dark:text-stone-200 font-medium truncate tracking-wide">
                            {p.name}
                          </span>
                          <span className="font-mono text-[9px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {priceStr}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
