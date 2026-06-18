import React, { useState, useEffect } from "react";
import { ArrowUp, ShoppingBag, Sparkles, SlidersHorizontal, X, ArrowRight, ShieldCheck, Heart, Info, Trash2, HeartHandshake } from "lucide-react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import StylistAssistant from "./components/StylistAssistant";
import CheckoutModal from "./components/CheckoutModal";
import OrderTracker from "./components/OrderTracker";
import AdminPanel from "./components/AdminPanel";
import CustomerPortal from "./components/CustomerPortal";
import { PRODUCTS } from "./data";
import { Product, CartItem, Currency, Language, TRANSLATIONS, CURRENCY_RATES, CURRENCY_SYMBOLS, Category } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<"home" | "shop" | "tracker">("home");
  const [language, setLanguage] = useState<Language>(() => {
    const cached = localStorage.getItem("atelier_language");
    if (cached && Object.values(Language).includes(cached as Language)) {
      return cached as Language;
    }
    return Language.AR; // Default to Arabic on first load/request
  });
  const [currency, setCurrency] = useState<Currency>(() => {
    const cached = localStorage.getItem("atelier_currency");
    if (cached && Object.values(Currency).includes(cached as Currency)) {
      return cached as Currency;
    }
    return Currency.SAR; // Default to SAR (Saudi Riyal) for Arabic experience
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("atelier_dark_mode") === "true";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("atelier_dark_mode", String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.dir = language === Language.AR ? "rtl" : "ltr";
    localStorage.setItem("atelier_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("atelier_currency", currency);
  }, [currency]);
  
  // Dynamic products states with luxury persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem("atelier_dynamic_products");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (err) {
        console.error("Failed to parse cached dynamic products", err);
      }
    }
    return PRODUCTS;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Dynamic Contact & Security settings
  const [contactPhone, setContactPhone] = useState(() => {
    const cached = localStorage.getItem("atelier_contact_phone");
    if (!cached || cached === "+966 50 123 4567") {
      return "+249 11 744 2964";
    }
    return cached;
  });
  const [contactWhatsApp, setContactWhatsApp] = useState(() => {
    const cached = localStorage.getItem("atelier_contact_whatsapp");
    if (!cached || cached === "966501234567") {
      return "249117442964";
    }
    return cached;
  });
  const [contactEmail, setContactEmail] = useState(() => {
    return localStorage.getItem("atelier_contact_email") || "mhmdnwrbdalrhmn26@gmail.com";
  });
  const [adminPasscode, setAdminPasscode] = useState(() => {
    return localStorage.getItem("atelier_admin_passcode") || "1926";
  });

  const handleUpdateContactSettings = (phone: string, whatsapp: string, email: string) => {
    setContactPhone(phone);
    setContactWhatsApp(whatsapp);
    setContactEmail(email);
    localStorage.setItem("atelier_contact_phone", phone);
    localStorage.setItem("atelier_contact_whatsapp", whatsapp);
    localStorage.setItem("atelier_contact_email", email);
  };

  const handleUpdatePasscode = (newPasscode: string) => {
    setAdminPasscode(newPasscode);
    localStorage.setItem("atelier_admin_passcode", newPasscode);
  };

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem("atelier_dynamic_products", JSON.stringify(updatedProducts));
  };

  const handleAddProduct = (newProduct: Product) => {
    saveProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => p.id === updatedProduct.id ? updatedProduct : p);
    saveProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  const handleResetProducts = () => {
    saveProducts(PRODUCTS);
  };
  
  // Drawer Toggles
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);

  // Customer Favorites State
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("tomsd_favorites");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const handleToggleFavorite = (product: Product) => {
    const exists = favoriteProducts.some((p) => p.id === product.id);
    let updated;
    if (exists) {
      updated = favoriteProducts.filter((p) => p.id !== product.id);
    } else {
      updated = [...favoriteProducts, product];
    }
    setFavoriteProducts(updated);
    localStorage.setItem("tomsd_favorites", JSON.stringify(updated));
  };

  const handleRemoveFavorite = (product: Product) => {
    const updated = favoriteProducts.filter((p) => p.id !== product.id);
    setFavoriteProducts(updated);
    localStorage.setItem("tomsd_favorites", JSON.stringify(updated));
  };

  // Search and Curation Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterSize, setFilterSize] = useState<string>("All");
  const [filterColor, setFilterColor] = useState<string>("All");
  const [filterFit, setFilterFit] = useState<string>("All");
  const [filterFabric, setFilterFabric] = useState<string>("All");
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(600); // base in USD

  // Order timeline state
  const [placedOrderTrackingId, setPlacedOrderTrackingId] = useState<string>("");

  // Capsule Wardrobe Mix & Match States
  const [mixCoat, setMixCoat] = useState<Product | null>(null);
  const [mixKnit, setMixKnit] = useState<Product | null>(null);
  const [mixTrouser, setMixTrouser] = useState<Product | null>(null);

  const t = TRANSLATIONS[language];

  // Load cart bag persistence
  useEffect(() => {
    const cachedCart = localStorage.getItem("atelier_bag_cache");
    if (cachedCart) {
      try {
        setCart(JSON.parse(cachedCart));
      } catch (err) {
        console.error("Cart hydration failed:", err);
      }
    }
  }, []);

  // Update cart bag cache
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("atelier_bag_cache", JSON.stringify(newCart));
  };

  const handleAddToCart = (product: Product, size: string, color: string) => {
    const existingIdx = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].qty += 1;
      updateCart(updated);
    } else {
      updateCart([...cart, { product, selectedSize: size, selectedColor: color, qty: 1 }]);
    }
  };

  const handleRemoveFromCart = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    updateCart(updated);
  };

  const handleQtyChange = (index: number, delta: number) => {
    const updated = [...cart];
    const newQty = updated[index].qty + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].qty = newQty;
    }
    updateCart(updated);
  };

  const handleSuccessfulOrder = (orderId: string) => {
    setPlacedOrderTrackingId(orderId);
    updateCart([]); // flush bag
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setActiveView("tracker");
  };

  // Curation Filters Logic
  const allAvailableFilters = {
    sizes: ["All", "XS", "S", "M", "L", "XL", "38", "40", "42"],
    colors: ["All", "Carbon", "Alabaster", "Stone", "Taupe", "Sand", "Midnight"],
    fits: ["All", "Oversized", "Relaxed", "Tailored", "Fluid"],
    fabrics: ["All", "Wool", "Cashmere", "Silk", "Linen", "Calfskin"]
  };

  // Filter masterpieces
  const filteredProducts = products.filter((p) => {
    // Search match
    const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Category match
    const matchesCategory = filterCategory === "All" || p.category === filterCategory;

    // Size match
    const matchesSize = filterSize === "All" || p.sizes.includes(filterSize);

    // Color match (supports partial name matches, e.g. "Atelier Carbon" matching "Carbon")
    const matchesColor = filterColor === "All" || p.colors.some((c) => c.toLowerCase().includes(filterColor.toLowerCase()));

    // Fit match
    const matchesFit = filterFit === "All" || p.fit.toLowerCase().includes(filterFit.toLowerCase());

    // Fabric match
    const matchesFabric = filterFabric === "All" || p.fabric.toLowerCase().includes(filterFabric.toLowerCase());

    // Price match calibrated to USD
    const matchesPrice = p.price <= filterMaxPrice;

    return matchesSearch && matchesCategory && matchesSize && matchesColor && matchesFit && matchesFabric && matchesPrice;
  });

  // Calculate pricing totals with individual product discount percentage
  const subtotalBase = cart.reduce((acc, curr) => {
    const discount = curr.product.discountPercentage || 0;
    const finalPrice = curr.product.price * (1 - discount / 100);
    return acc + finalPrice * curr.qty;
  }, 0);
  const transformedSubtotal = subtotalBase * CURRENCY_RATES[currency];

  const formatPrice = (amount: number) => {
    return amount.toLocaleString(undefined, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: currency === Currency.JPY ? 0 : 2
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilterCategory("All");
    setFilterSize("All");
    setFilterColor("All");
    setFilterFit("All");
    setFilterFabric("All");
    setFilterMaxPrice(600);
  };

  return (
    <div 
      id="atelier-app-root" 
      dir={language === Language.AR ? "rtl" : "ltr"}
      className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-neutral-800 dark:text-stone-100 flex flex-col justify-between selection:bg-neutral-900 selection:text-white transition-colors duration-250"
    >
      
      {/* Premium Sticky Navigation */}
      <Navigation
        currentLanguage={language}
        currentCurrency={currency}
        onLanguageChange={setLanguage}
        onCurrencyChange={setCurrency}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        favoritesCount={favoriteProducts.length}
        onCartClick={() => setIsCartOpen(true)}
        onStylistClick={() => setIsStylistOpen(true)}
        onTrackerClick={() => {
          setActiveView("tracker");
          setIsCartOpen(false);
        }}
        onHomeClick={() => {
          setActiveView("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onShopClick={() => {
          setActiveView("shop");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onAdminClick={() => setIsAdminOpen(true)}
        onCustomerClick={() => setIsCustomerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim().toLowerCase() === "/admin" || q.trim().toLowerCase() === "admin") {
            setIsAdminOpen(true);
            setSearchQuery("");
            return;
          }
          if (activeView !== "shop") setActiveView("shop");
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main viewport */}
      <main className="flex-1">
        
        {activeView === "home" && (
          <div id="home-view" className="animate-fade-in">
            {/* Immersive Slideshow Hero */}
            <Hero
              currentLanguage={language}
              onExploreClick={() => {
                setActiveView("shop");
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
            />

            {/* Introductory brand manifesto block */}
            <section className="bg-neutral-50 py-16 sm:py-24 border-b border-neutral-100">
              <div className="max-w-4xl mx-auto text-center px-4">
                <span className="font-mono text-[9px] tracking-[0.4em] text-neutral-450 block uppercase mb-4">
                  THE ATELIER MANIFESTO
                </span>
                <p className="font-display font-light text-xl sm:text-2xl text-neutral-900 leading-relaxed max-w-2xl mx-auto">
                  “We reject superficial fashion. Every garment is treated as architectural masonry — balancing drop silhouettes with quiet, heavy texturing.”
                </p>
                <div className="h-0.5 w-12 bg-neutral-900 mx-auto mt-6" />
              </div>
            </section>

            {/* Curated highlights / Collections */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-12">
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-neutral-400 block uppercase mb-2">
                    {t.newArrivals.toUpperCase()}
                  </span>
                  <h2 className="font-sans text-2xl font-light tracking-wide uppercase text-neutral-900">
                    Hand-crafted Curated Classics
                  </h2>
                </div>
                <button
                  id="home-view-all-masterpieces"
                  onClick={() => {
                    setActiveView("shop");
                    handleClearFilters();
                  }}
                  className="mt-4 sm:mt-0 font-sans text-xs tracking-widest uppercase pb-1 border-b border-neutral-900 text-neutral-900 hover:text-neutral-500 hover:border-neutral-400 cursor-pointer transition-colors"
                >
                  {t.allProducts}
                </button>
              </div>

              {/* Bento Grid Gallery highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currentCurrency={currency}
                    currentLanguage={language}
                    onViewDetails={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                    isFavorite={favoriteProducts.some((fav) => fav.id === product.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </section>

            {/* Category Promo Callouts with high quality images */}
            <section className="bg-white border-t border-neutral-100 py-16 sm:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Promo Col 1 */}
                  <div 
                    id="promo-card-tailoring"
                    onClick={() => {
                      setFilterCategory(Category.Tailoring);
                      setActiveView("shop");
                    }}
                    className="group relative h-96 overflow-hidden bg-zinc-900 cursor-pointer rounded-sm"
                  >
                    <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=700" alt="Tailoring" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 filter brightness-90" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent z-15" />
                    <div className="absolute bottom-6 left-6 z-20 text-white">
                      <span className="font-mono text-[9px] tracking-widest block mb-2 text-stone-300">COLLECTION</span>
                      <h3 className="font-sans text-lg tracking-wider uppercase font-light">Structured Tailoring</h3>
                    </div>
                  </div>

                  {/* Promo Col 2 */}
                  <div 
                    id="promo-card-knitwear"
                    onClick={() => {
                      setFilterCategory(Category.Knitwear);
                      setActiveView("shop");
                    }}
                    className="group relative h-96 overflow-hidden bg-zinc-900 cursor-pointer rounded-sm"
                  >
                    <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=700" alt="Knitwear" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 filter brightness-90" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent z-15" />
                    <div className="absolute bottom-6 left-6 z-20 text-white">
                      <span className="font-mono text-[9px] tracking-widest block mb-2 text-stone-300">COLLECTION</span>
                      <h3 className="font-sans text-lg tracking-wider uppercase font-light">Artisan Premium Knitwear</h3>
                    </div>
                  </div>

                  {/* Promo Col 3 */}
                  <div 
                    id="promo-card-loungewear"
                    onClick={() => {
                      setFilterCategory(Category.Loungewear);
                      setActiveView("shop");
                    }}
                    className="group relative h-96 overflow-hidden bg-zinc-900 cursor-pointer rounded-sm"
                  >
                    <img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=700" alt="Loungewear" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 filter brightness-90" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent z-15" />
                    <div className="absolute bottom-6 left-6 z-20 text-white">
                      <span className="font-mono text-[9px] tracking-widest block mb-2 text-stone-300">COLLECTION</span>
                      <h3 className="font-sans text-lg tracking-wider uppercase font-light">Minimal Luxury Loungewear</h3>
                    </div>
                  </div>

                </div>
              </div>
            </section>

          </div>
        )}

        {activeView === "shop" && (
          <div id="shop-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            
            {/* Header section with Filter controls */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 pb-6 border-b border-neutral-100">
              <div>
                <span className="font-mono text-[9px] tracking-widest text-zinc-400 block uppercase mb-2">
                  EXPLORE {filterCategory === "All" ? "ALL" : filterCategory.toUpperCase()} COLLECTIONS
                </span>
                <h1 className="font-sans text-3xl font-light tracking-wide uppercase text-neutral-950">
                  {t.allProducts}
                </h1>
                <p className="font-mono text-[10px] text-zinc-550 mt-1 font-medium pb-2 md:pb-0">
                  Showing {filteredProducts.length} of {products.length} masterpieces
                </p>
              </div>

              {/* Advanced Filter Trigger button */}
              <div className="flex space-x-3 items-center">
                <button
                  id="shop-toggle-filter-btn"
                  onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                  className="flex items-center space-x-2 bg-neutral-950 hover:bg-neutral-900 text-white text-xs tracking-wider uppercase py-3.5 px-6 rounded-xs cursor-pointer shadow-md transition-shadow active:scale-98"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Interactive Filter Suite</span>
                </button>

                {(filterCategory !== "All" || filterSize !== "All" || filterColor !== "All" || filterFit !== "All" || filterFabric !== "All" || filterMaxPrice < 600) && (
                  <button
                    id="shop-clear-filters-link"
                    onClick={handleClearFilters}
                    className="font-mono text-[10px] text-rose-700 hover:text-rose-900 font-bold tracking-widest uppercase cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Advanced Curation Filter Grid */}
            {isFilterDrawerOpen && (
              <div id="filter-drawer-container" className="bg-neutral-50/70 border border-neutral-150 p-6 sm:p-8 rounded-sm mb-10 animate-fade-in grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                
                {/* 1. Category Switch */}
                <div>
                  <label className="block font-sans text-[10.5px] font-semibold tracking-widest uppercase text-neutral-550 mb-2.5">
                    Category Collection
                  </label>
                  <div className="flex flex-col space-y-1">
                    {["All", ...Object.values(Category)].map((cat) => (
                      <button
                        id={`filter-cat-${cat}`}
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`text-left font-mono text-[11px] py-1 transition-colors ${filterCategory === cat ? "text-neutral-950 font-bold" : "text-neutral-500 hover:text-black"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Sizing Select */}
                <div>
                  <label className="block font-sans text-[10.5px] font-semibold tracking-widest uppercase text-neutral-550 mb-2.5">
                    Garment Size
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {allAvailableFilters.sizes.map((sz) => (
                      <button
                        id={`filter-size-${sz}`}
                        key={sz}
                        onClick={() => setFilterSize(sz)}
                        className={`py-1 px-3 border font-mono text-[10px] transition-all cursor-pointer rounded-xs ${filterSize === sz ? "bg-black border-black text-white font-bold" : "bg-white border-neutral-200 text-neutral-500 hover:border-black"}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Color Select */}
                <div>
                  <label className="block font-sans text-[10.5px] font-semibold tracking-widest uppercase text-neutral-550 mb-2.5">
                    Color Spectrum
                  </label>
                  <div className="flex flex-col space-y-1">
                    {allAvailableFilters.colors.map((col) => (
                      <button
                        id={`filter-color-${col}`}
                        key={col}
                        onClick={() => setFilterColor(col)}
                        className={`text-left font-mono text-[11px] py-1 transition-colors ${filterColor === col ? "text-neutral-950 font-bold" : "text-neutral-500 hover:text-black"}`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Fabrics & Fits */}
                <div>
                  <label className="block font-sans text-[10.5px] font-semibold tracking-widest uppercase text-neutral-550 mb-1.5">
                    Fabric Weave
                  </label>
                  <select
                    id="filter-fabric-select"
                    value={filterFabric}
                    onChange={(e) => setFilterFabric(e.target.value)}
                    className="w-full bg-white border border-neutral-250 p-2 text-[10.5px] font-mono outline-none rounded-xs focus:border-black"
                  >
                    {allAvailableFilters.fabrics.map((fab) => (
                      <option key={fab} value={fab}>{fab}</option>
                    ))}
                  </select>

                  <label className="block font-sans text-[10.5px] font-semibold tracking-widest uppercase text-neutral-550 mt-4 mb-1.5">
                    Silhouette fit
                  </label>
                  <select
                    id="filter-fit-select"
                    value={filterFit}
                    onChange={(e) => setFilterFit(e.target.value)}
                    className="w-full bg-white border border-neutral-250 p-2 text-[10.5px] font-mono outline-none rounded-xs focus:border-black"
                  >
                    {allAvailableFilters.fits.map((fit) => (
                      <option key={fit} value={fit}>{fit}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Max Price slider calibrated */}
                <div>
                  <label className="block font-sans text-[10.5px] font-semibold tracking-widest uppercase text-neutral-550 mb-2">
                    Melt Price (USD)
                  </label>
                  <input
                    id="filter-price-slider"
                    type="range"
                    min={150}
                    max={600}
                    step={10}
                    value={filterMaxPrice}
                    onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                    className="w-full accent-neutral-950 cursor-pointer"
                  />
                  <div className="flex justify-between items-center font-mono text-[10px] text-neutral-600 mt-2 bg-white px-2 py-1 rounded-sm border">
                    <span>Max Price:</span>
                    <strong className="text-black font-semibold">
                      {formatPrice(filterMaxPrice * CURRENCY_RATES[currency])}
                    </strong>
                  </div>
                </div>

              </div>
            )}

            {/* Catalog Grid View */}
            {filteredProducts.length > 0 ? (
              <div id="shop-catalog-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currentCurrency={currency}
                    currentLanguage={language}
                    onViewDetails={setSelectedProduct}
                    onAddToCart={handleAddToCart}
                    isFavorite={favoriteProducts.some((fav) => fav.id === product.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div id="shop-empty-state" className="text-center py-24 bg-neutral-50 px-4 rounded-sm border border-dashed border-neutral-200">
                <Info className="h-8 w-8 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-sans text-base font-light tracking-widest uppercase text-neutral-900 mb-2">
                  No matching garments
                </h3>
                <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto mb-6">
                  Our ateliers are currently weaving new fabrics. Try broadening your color, size, or category parameters.
                </p>
                <button
                  id="empty-state-reset-btn"
                  onClick={handleClearFilters}
                  className="font-mono text-[10px] text-white bg-neutral-950 px-6 py-3.5 tracking-widest uppercase rounded-xs hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Reset Curation Options
                </button>
              </div>
            )}

            {/* CAPSULE WARDROBE MIX & MATCH BUILDER */}
            <div id="capsule-builder-section" className="mt-20 pt-16 border-t border-neutral-200 dark:border-stone-800">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#a8a29e] dark:text-stone-450 uppercase block mb-2 font-bold">
                  {language === Language.AR ? "لوحة التنسيق وتطابق المنسوجات" : "MINIMALIST CAPSULE LAYERING"}
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-light tracking-wide uppercase text-neutral-900 dark:text-stone-100 mb-3">
                  {language === Language.AR ? "خزانة تفاعلية لتنسيق المظهر" : "Interactive Capsule Wardrobe Studio"}
                </h3>
                <p className="font-sans font-light text-xs text-neutral-600 dark:text-stone-300 leading-relaxed">
                  {language === Language.AR 
                    ? "اختر وراكب القطع المختلفة معاً لمعاينة انسجام الألوان، تناسق طبقات الصوف مع نسيج الحرير، وجرأة المظهر الظلي قبل الشراء."
                    : "Select and stack our bespoke garments to instantly evaluate color synergy, fabric texture contrast, and structural drapery harmony."
                  }
                </p>
              </div>

              {/* Grid with 3 Slots + 1 Analysis Result */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* 1. Outerwear Slot */}
                <div id="capsule-slot-outerwear" className="bg-neutral-50 dark:bg-stone-950 p-5 border border-neutral-150 dark:border-stone-850 rounded-sm flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] tracking-widest text-[#a8a29e] block mb-3 uppercase">
                      {language === Language.AR ? "1. معطف خارجي" : "1. OUTERWEAR drapes"}
                    </span>
                    {mixCoat ? (
                      <div className="animate-fade-in">
                        <div className="relative aspect-[3/4] bg-neutral-200 dark:bg-stone-900 overflow-hidden rounded-xs mb-3 border dark:border-stone-800">
                          <img src={mixCoat.images[0]} alt={mixCoat.name} className="w-full h-full object-cover filter brightness-95" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => setMixCoat(null)}
                            className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full cursor-pointer hover:bg-black"
                            title="Remove"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <h4 className="font-sans font-medium text-xs text-neutral-900 dark:text-stone-100 truncate">{mixCoat.name}</h4>
                        <span className="font-mono text-[10px] text-zinc-400 block mt-0.5">{mixCoat.fabric}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center aspect-[3/4] border border-dashed border-neutral-300 dark:border-stone-800 rounded-sm p-4 text-center">
                        <span className="text-[10px] font-mono text-zinc-400 mb-4">{language === Language.AR ? "لا توجد قطعة" : "Empty Slot"}</span>
                        <select
                          onChange={(e) => {
                            const found = products.find(p => p.id === e.target.value);
                            if (found) setMixCoat(found);
                          }}
                          className="w-full bg-white dark:bg-stone-900 text-[10.5px] border dark:border-stone-800 p-2 outline-none font-mono text-neutral-800 dark:text-stone-200"
                        >
                          <option value="">{language === Language.AR ? "+ اختر معطفاً خارقاً" : "+ Select Outerwear"}</option>
                          {products.filter(p => p.category === Category.Outerwear).map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Knitwear Layer Slot */}
                <div id="capsule-slot-knitwear" className="bg-neutral-50 dark:bg-stone-950 p-5 border border-neutral-150 dark:border-stone-850 rounded-sm flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] tracking-widest text-[#a8a29e] block mb-3 uppercase">
                      {language === Language.AR ? "2. رداء نسيجي / سترة" : "2. KNITWEAR layer"}
                    </span>
                    {mixKnit ? (
                      <div className="animate-fade-in">
                        <div className="relative aspect-[3/4] bg-neutral-200 dark:bg-stone-900 overflow-hidden rounded-xs mb-3 border dark:border-stone-800">
                          <img src={mixKnit.images[0]} alt={mixKnit.name} className="w-full h-full object-cover filter brightness-95" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => setMixKnit(null)}
                            className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full cursor-pointer hover:bg-black"
                            title="Remove"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <h4 className="font-sans font-medium text-xs text-neutral-900 dark:text-stone-100 truncate">{mixKnit.name}</h4>
                        <span className="font-mono text-[10px] text-zinc-400 block mt-0.5">{mixKnit.fabric}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center aspect-[3/4] border border-dashed border-neutral-300 dark:border-stone-800 rounded-sm p-4 text-center">
                        <span className="text-[10px] font-mono text-zinc-400 mb-4">{language === Language.AR ? "لا توجد قطعة" : "Empty Slot"}</span>
                        <select
                          onChange={(e) => {
                            const found = products.find(p => p.id === e.target.value);
                            if (found) setMixKnit(found);
                          }}
                          className="w-full bg-white dark:bg-stone-900 text-[10.5px] border dark:border-stone-800 p-2 outline-none font-mono text-neutral-800 dark:text-stone-200"
                        >
                          <option value="">{language === Language.AR ? "+ اختر رداءً علوياً" : "+ Select Knitwear"}</option>
                          {products.filter(p => p.category === Category.Knitwear).map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Trousers Slot */}
                <div id="capsule-slot-trousers" className="bg-neutral-50 dark:bg-stone-950 p-5 border border-neutral-150 dark:border-stone-850 rounded-sm flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] tracking-widest text-[#a8a29e] block mb-3 uppercase">
                      {language === Language.AR ? "3. سراويل وحياكة سفلية" : "3. BOTTOM silhouette"}
                    </span>
                    {mixTrouser ? (
                      <div className="animate-fade-in">
                        <div className="relative aspect-[3/4] bg-neutral-200 dark:bg-stone-900 overflow-hidden rounded-xs mb-3 border dark:border-stone-800">
                          <img src={mixTrouser.images[0]} alt={mixTrouser.name} className="w-full h-full object-cover filter brightness-95" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => setMixTrouser(null)}
                            className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full cursor-pointer hover:bg-black"
                            title="Remove"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <h4 className="font-sans font-medium text-xs text-neutral-900 dark:text-stone-100 truncate">{mixTrouser.name}</h4>
                        <span className="font-mono text-[10px] text-zinc-400 block mt-0.5">{mixTrouser.fabric}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center aspect-[3/4] border border-dashed border-neutral-300 dark:border-stone-800 rounded-sm p-4 text-center">
                        <span className="text-[10px] font-mono text-zinc-400 mb-4">{language === Language.AR ? "لا توجد قطعة" : "Empty Slot"}</span>
                        <select
                          onChange={(e) => {
                            const found = products.find(p => p.id === e.target.value);
                            if (found) setMixTrouser(found);
                          }}
                          className="w-full bg-white dark:bg-stone-900 text-[10.5px] border dark:border-stone-800 p-2 outline-none font-mono text-neutral-800 dark:text-stone-200"
                        >
                          <option value="">{language === Language.AR ? "+ اختر سروالاً" : "+ Select Trousers"}</option>
                          {products.filter(p => p.name.toLowerCase().includes("trouser") || p.category === Category.Loungewear).map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Layering Analysis Module */}
                <div id="capsule-analysis-module" className="bg-neutral-900 dark:bg-stone-900 hover:bg-neutral-850 dark:hover:bg-stone-850 p-6 border border-neutral-800 rounded-sm text-white flex flex-col justify-between shadow-2xl transition-all">
                  
                  {mixCoat || mixKnit || mixTrouser ? (
                    <div className="animate-fade-in flex flex-col h-full justify-between">
                      <div>
                        <span className="font-mono text-[8px] tracking-[0.2em] text-[#fb923c] uppercase block mb-1">
                          {language === Language.AR ? "المطابقة المتخصصة للألوان والهيكل" : "ATELIER HARMONY METRICS"}
                        </span>
                        
                        {/* Harmony Score calculation */}
                        {(() => {
                          let score = 85;
                          let adviceEn = "Selected pieces offer a superb foundational baseline silhouette for clean quiet luxury coordinates.";
                          let adviceAr = "تقدم المنسوجات المحددة قواماً أساسياً متوازناً لتنسيق الألوان أحادية الدرجة الهادئة والممتازة.";
                          
                          const activeCount = [mixCoat, mixKnit, mixTrouser].filter(Boolean).length;
                          
                          if (activeCount === 1) {
                            score = 80;
                            adviceEn = "Add a second companion garment to unlock complete layering drape and color contrast evaluations.";
                            adviceAr = "أضف قطعة تنسيق تكميلية ثانية لتفعيل حاسب تباين المنسوجات وخوارزمية مطابقة السيلويت الكهرماني.";
                          } else if (activeCount === 2) {
                            score = 90;
                            adviceEn = "Great balance achieved. The drop shoulder lines construct a fluid graphic drape that looks effortless yet meticulously sharp.";
                            adviceAr = "تناسق رائع جداً. تنسج أكتاف الملس المعطف خطوطاً ديناميكية فخمة تحتفظ بالصلابة مع بقاء التهوية والمظهر الأنيق.";
                          } else if (activeCount === 3) {
                            // Perfect capsule
                            const hasLinen = [mixCoat, mixKnit, mixTrouser].some(item => item?.fabric.toLowerCase().includes("linen"));
                            const hasWool = [mixCoat, mixKnit, mixTrouser].some(item => item?.fabric.toLowerCase().includes("wool"));
                            const hasCashmere = [mixCoat, mixKnit, mixTrouser].some(item => item?.fabric.toLowerCase().includes("cashmere"));
                            
                            if (hasWool && hasCashmere) {
                              score = 98;
                              adviceEn = "Ultimate masterpiece combo. Heavy Italian wool layered on ultra-soft regenerative cashmere loomed knitting creates the crown jewel silhouette.";
                              adviceAr = "تحفة التنسيق الكاملة من أتيليه. راحة الحياكة الكشميرية الفائقة تحت ثقل الصوف المعطف الإيطالي تعيد صياغة المظهر الساحر لسموكم.";
                            } else {
                              score = 95;
                              adviceEn = "Exceptional tonal layering. Clean monochrome styling with luxurious textural friction that elevates presence in any space.";
                              adviceAr = "تناغم قماش استثنائي فخم. طراز أحادي الملامح هادئ مع ملمس ناعم وخشن يعزز حضور سموكم في أي محفل.";
                            }
                          }

                          return (
                            <>
                              <div className="flex items-baseline space-x-2.5 rtl:space-x-reverse mt-2 mb-4">
                                <span className="font-mono text-3xl font-extrabold text-[#fb923c] animate-pulse">
                                  {score}%
                                </span>
                                <span className="font-mono text-[9px] uppercase text-stone-300">
                                  {language === Language.AR ? "مؤشر التلاؤم الكلي" : "HARMONY SCORE"}
                                </span>
                              </div>
                              <p className="font-sans text-[11px] leading-relaxed text-stone-200">
                                {language === Language.AR ? adviceAr : adviceEn}
                              </p>
                            </>
                          );
                        })()}
                      </div>

                      <div className="border-t border-neutral-800 pt-4 mt-6">
                        <button
                          type="button"
                          id="capsule-add-all-btn"
                          onClick={() => {
                            let addedCount = 0;
                            [mixCoat, mixKnit, mixTrouser].forEach(item => {
                              if (item) {
                                handleAddToCart(item, item.sizes[0], item.colors[0]);
                                addedCount++;
                              }
                            });
                            if (addedCount > 0) {
                              setIsCartOpen(true);
                            }
                          }}
                          className="w-full bg-[#fb923c] hover:bg-[#f97316] text-neutral-950 font-sans text-[10px] tracking-wider uppercase font-extrabold py-3 px-3 transition-colors rounded-xs shadow-lg text-center cursor-pointer block"
                        >
                          {language === Language.AR ? "إضافة قطع الأتيليه المنسقة للسلة" : "ADD CAPSULE TO BAG"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMixCoat(null);
                            setMixKnit(null);
                            setMixTrouser(null);
                          }}
                          className="w-full bg-transparent text-neutral-400 hover:text-white text-[9px] tracking-widest uppercase font-mono mt-3 rounded-xs text-center border border-neutral-800 hover:border-neutral-700 py-1.5 transition-colors cursor-pointer"
                        >
                          {language === Language.AR ? "إعادة تعيين اللوحة" : "RESET COMPILER"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full text-zinc-400 py-10">
                      <Sparkles className="h-7 w-7 text-stone-500 mb-3 animate-pulse" />
                      <span className="font-mono text-[9.5px] uppercase tracking-widest block font-bold">
                        {language === Language.AR ? "بانتظار الملبوسات" : "COMPILER AWAITING"}
                      </span>
                      <p className="font-sans text-[10.5px] font-light mt-2 px-1 max-w-[190px] mx-auto text-zinc-500 leading-relaxed">
                        {language === Language.AR 
                          ? "قم باختيار قطعة واحدة أولاً وسيقوم المحلل التلقائي بحساب تلاؤم الكوتور الفخم ونسبة تباين الصوف والكشمير والحرير." 
                          : "Select any garment above to activate our real-time fashion compiler for master layer evaluation."
                        }
                      </p>
                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* CAPSULE WARDROBE END */}

          </div>
        )}

        {/* Search Order status view */}
        {activeView === "tracker" && (
          <div id="tracker-view" className="animate-fade-in bg-stone-50/50">
            <OrderTracker
              currentLanguage={language}
              initialTrackingId={placedOrderTrackingId}
              onBackToShop={() => setActiveView("shop")}
            />
          </div>
        )}

      </main>

      {/* Slide-over Right Shopping Bag Drawer */}
      {isCartOpen && (
        <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex justify-end">
          <div id="cart-drawer" className="w-full max-w-md bg-white text-neutral-900 h-full shadow-2xl flex flex-col justify-between border-l border-neutral-150 animate-slide-in">
            
            {/* Header row */}
            <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-zinc-950 text-white">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="h-4.5 w-4.5 text-stone-250" />
                <h3 className="font-sans text-xs font-semibold uppercase tracking-widest">
                  {t.orderBag}
                </h3>
              </div>
              <button
                id="cart-drawer-close"
                onClick={() => setIsCartOpen(false)}
                className="text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Shopping List scroll panel */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-neutral-50/25">
              {cart.length > 0 ? (
                cart.map((item, index) => (
                  <div id={`cart-item-${item.product.id}-${index}`} key={index} className="flex space-x-4 bg-white p-3.5 border border-neutral-150 rounded-sm">
                    {/* Item Thumbnail */}
                    <div className="h-20 w-15 bg-neutral-200 overflow-hidden flex-shrink-0 rounded-xs">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    {/* Details row */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-sans font-medium text-xs text-neutral-950 truncate tracking-wide">
                          {item.product.name}
                        </h4>
                        <p className="font-mono text-[9.5px] text-zinc-400 mt-1 uppercase">
                          Size: {item.selectedSize} · Color: {item.selectedColor.split(" ")[0]}
                        </p>
                      </div>

                      {/* Quantity switcher controls */}
                      <div className="flex items-center space-x-2.5 mt-2">
                        <button
                          id={`cart-qty-dec-${index}`}
                          onClick={() => handleQtyChange(index, -1)}
                          className="h-6 w-6 rounded-full border border-neutral-250 flex items-center justify-center text-xs font-bold hover:bg-neutral-50 transition-colors"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs text-neutral-800">
                          {item.qty}
                        </span>
                        <button
                          id={`cart-qty-inc-${index}`}
                          onClick={() => handleQtyChange(index, 1)}
                          className="h-6 w-6 rounded-full border border-neutral-250 flex items-center justify-center text-xs font-bold hover:bg-neutral-50 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Cost subtraction & delete */}
                    <div className="flex flex-col justify-between items-end">
                      <button
                        id={`cart-item-remove-${index}`}
                        onClick={() => handleRemoveFromCart(index)}
                        className="text-zinc-400 hover:text-red-700 transition-colors p-1"
                        title="Remove garment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                      <div className="text-right flex flex-col items-end">
                        {item.product.discountPercentage !== undefined && item.product.discountPercentage > 0 ? (
                          <>
                            <span className="font-mono text-[9px] text-neutral-400 line-through leading-none mb-0.5">
                              {formatPrice(item.product.price * item.qty * CURRENCY_RATES[currency])}
                            </span>
                            <span className="font-mono text-xs font-bold text-rose-600 leading-none">
                              {formatPrice(item.product.price * (1 - item.product.discountPercentage / 100) * item.qty * CURRENCY_RATES[currency])}
                            </span>
                          </>
                        ) : (
                          <span className="font-mono text-xs font-semibold text-neutral-900 tracking-wider">
                            {formatPrice(item.product.price * item.qty * CURRENCY_RATES[currency])}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div id="cart-drawer-empty" className="text-center py-20">
                  <ShoppingBag className="h-10 w-10 text-neutral-200 mx-auto mb-4" />
                  <p className="font-sans text-xs text-neutral-450 tracking-wider">
                    Your luxury atelier bag is empty.
                  </p>
                </div>
              )}
            </div>

            {/* Summary & Checkout trigger button */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-neutral-200 bg-white space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <span className="font-sans text-xs uppercase tracking-widest text-neutral-500 font-semibold">{t.orderTotal}</span>
                  <span className="font-mono text-lg font-bold text-neutral-950">{formatPrice(transformedSubtotal)}</span>
                </div>

                <button
                  id="cart-drawer-checkout-btn"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs tracking-widest uppercase font-medium py-4 rounded-sm shadow-lg shadow-neutral-950/15 flex items-center justify-center space-x-2.5 transform active:scale-98 transition-transform cursor-pointer"
                >
                  <span>PROCEED TO ONE-STEP DEPOSIT</span>
                  <ArrowRight className="h-4 w-4 animate-pulse" />
                </button>

                <div className="flex items-center justify-center space-x-1.5 text-[10px] font-mono text-neutral-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-zinc-450" />
                  <span>SECURE TRANSLATION COMPLIANCE REGISTERED</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}



      {/* Floating Scroll to Top button */}
      <button
        id="scroll-to-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 left-6 z-40 bg-white/90 hover:bg-neutral-150 text-neutral-900 p-3.5 rounded-full shadow-xl border border-neutral-100 flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
        title="Scroll to top"
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      {/* Detailed Modal Window */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          currentCurrency={currency}
          currentLanguage={language}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onNavigateToProduct={(p) => {
            setSelectedProduct(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {/* AI Stylist Assistant Sidebar wrapper */}
      <StylistAssistant
        currentLanguage={language}
        isOpen={isStylistOpen}
        onClose={() => setIsStylistOpen(false)}
        activeCart={cart}
        currentItem={selectedProduct}
      />

      {/* 1-Step Checkout process overlay */}
      <CheckoutModal
        currentLanguage={language}
        currentCurrency={currency}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderSuccess={handleSuccessfulOrder}
        contactPhone={contactPhone}
        contactWhatsApp={contactWhatsApp}
        contactEmail={contactEmail}
      />

      {/* Atelier Dynamic Admin Control Center */}
      {isAdminOpen && (
        <AdminPanel
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetProducts={handleResetProducts}
          onClose={() => setIsAdminOpen(false)}
          currency={currency}
          formatPrice={formatPrice}
          contactPhone={contactPhone}
          contactWhatsApp={contactWhatsApp}
          contactEmail={contactEmail}
          onUpdateContactSettings={handleUpdateContactSettings}
          adminPasscode={adminPasscode}
          onUpdatePasscode={handleUpdatePasscode}
        />
      )}

      {/* Customer Account & Membership Portal */}
      <CustomerPortal
        isOpen={isCustomerOpen}
        onClose={() => setIsCustomerOpen(false)}
        currency={currency}
        formatPrice={formatPrice}
        favoriteProducts={favoriteProducts}
        onRemoveFavorite={handleRemoveFavorite}
        currentLanguage={language}
      />

      {/* Elegant minimalist footer */}
      <footer className="bg-neutral-950 text-white border-t border-neutral-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <span className="font-sans text-lg tracking-[0.25em] font-semibold block">{t.brandName}</span>
            <p className="font-sans text-[11px] text-zinc-400 font-light leading-relaxed">
              Premium minimalist architectural tailoring, delivering sustainable, durable staples directly from Copenhagen.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <span className="font-mono text-[9px] tracking-widest uppercase text-stone-400 block mb-4">ATELIER DIRECTORIES</span>
            <ul className="space-y-2.5 font-sans text-xs text-zinc-300">
              <li><button onClick={() => setActiveView("shop")} className="hover:text-white transition-colors cursor-pointer">Explore Masterpieces / المعرض</button></li>

              <li><button onClick={() => setActiveView("tracker")} className="hover:text-white transition-colors cursor-pointer">Sovereign Air Tracker / التتبع الفوري</button></li>
              <li><button onClick={() => setIsCustomerOpen(true)} className="text-stone-300 hover:text-white transition-colors text-left font-semibold cursor-pointer">بوابة العضوية والعملاء / Member Cabin</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <span className="font-mono text-[9px] tracking-widest uppercase text-stone-400 block mb-4">CONTACT & DIRECT BOOKINGS / تواصل وحجز</span>
            <ul className="space-y-3 font-sans text-xs text-zinc-300">
              <li className="flex items-center space-x-1">
                <span className="text-zinc-500">📞 الدعم:</span>
                <a href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`} className="hover:text-white transition-colors font-mono">{contactPhone}</a>
              </li>
              <li className="flex items-center space-x-1">
                <span className="text-emerald-500 font-semibold">💬 واتساب:</span>
                <a href={`https://wa.me/${contactWhatsApp.replace(/[+\s()-]/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-stone-300 underline underline-offset-4 transition-colors font-semibold">اتصال مباشر</a>
              </li>
              <li className="flex items-center space-x-1">
                <span className="text-zinc-500">✉️ البريد:</span>
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors truncate block max-w-[150px]" title={contactEmail}>{contactEmail}</a>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <span className="font-mono text-[9px] tracking-widest uppercase text-stone-400 block">NEWSLETTER DEPOSIT</span>
            <p className="font-sans text-[11px] text-zinc-400 font-light">
              Receive private atelier sketches and limited capsule event updates.
            </p>
            <div className="flex border-b border-white/20 pb-1.5 focus-within:border-white transition-all">
              <input type="email" placeholder="your.email@gmail.com" className="bg-transparent border-none py-1 text-xs text-white placeholder-neutral-500 w-full outline-none" />
              <button className="text-white hover:text-neutral-305 transition-colors uppercase font-mono text-[10px] tracking-widest cursor-pointer pl-2">JOIN</button>
            </div>
          </div>

        </div>

        {/* copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 pt-8 border-t border-neutral-900/60 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-zinc-400">
          <span 
            className="cursor-pointer hover:text-neutral-200 select-none transition-colors border-b border-zinc-900 pb-0.5"
            title="Secret Administrative Challenge Trigger / الاستوديو الفني للمصمم"
            onClick={() => {
              const currentClicks = (window as any)._adminClicks || 0;
              if (currentClicks >= 4) {
                setIsAdminOpen(true);
                (window as any)._adminClicks = 0;
              } else {
                (window as any)._adminClicks = currentClicks + 1;
              }
            }}
          >
            © 2026 TOMSD COUTURE CO. ALL WORKSHOPS RESERVED.
          </span>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span>TERMS OF COMPLIANCE</span>
            <span>PRIVACY PROTOCOL</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
