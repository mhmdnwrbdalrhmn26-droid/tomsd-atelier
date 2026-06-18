import React, { useState, useEffect } from "react";
import { ShoppingBag, Search, Compass, Globe, Sparkles, Truck, Sliders, User, Heart, Sun, Moon } from "lucide-react";
import { Currency, Language, TRANSLATIONS, CURRENCY_SYMBOLS, LANGUAGE_LABELS } from "../types";

interface NavigationProps {
  currentLanguage: Language;
  currentCurrency: Currency;
  onLanguageChange: (lang: Language) => void;
  onCurrencyChange: (curr: Currency) => void;
  cartCount: number;
  favoritesCount?: number;
  onCartClick: () => void;
  onStylistClick: () => void;
  onTrackerClick: () => void;
  onHomeClick: () => void;
  onShopClick: () => void;
  onAdminClick: () => void;
  onCustomerClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navigation({
  currentLanguage,
  currentCurrency,
  onLanguageChange,
  onCurrencyChange,
  cartCount,
  favoritesCount = 0,
  onCartClick,
  onStylistClick,
  onTrackerClick,
  onHomeClick,
  onShopClick,
  onAdminClick,
  onCustomerClick,
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleDarkMode
}: NavigationProps) {
  const t = TRANSLATIONS[currentLanguage];
  const [isLangToggleOpen, setIsLangToggleOpen] = useState(false);
  const [isCurrencyToggleOpen, setIsCurrencyToggleOpen] = useState(false);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setIsLangToggleOpen(false);
      setIsCurrencyToggleOpen(false);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-900 transition-colors">
      <div className="max-w-7xl mx-auto px-2 min-[375px]:px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand - Symmetrical Left */}
          <div className="flex items-center space-x-2 sm:space-x-6">
            <button 
              id="nav-brand-logo"
              onClick={onHomeClick}
              className="font-sans text-base min-[360px]:text-lg min-[400px]:text-xl md:text-2xl font-semibold tracking-[0.15em] md:tracking-[0.25em] text-neutral-900 dark:text-stone-100 transition-opacity hover:opacity-80"
            >
              {t.brandName}
            </button>
            <span className="hidden md:inline-block font-mono text-[10px] tracking-[0.15em] text-neutral-450 dark:text-neutral-500 uppercase pb-1 border-l border-neutral-200 dark:border-neutral-800 pl-4">
              {t.tagline}
            </span>
          </div>

          {/* Navigation links (Desktop) */}
          <nav className="hidden lg:flex space-x-8 font-sans text-xs tracking-widest uppercase text-neutral-600 dark:text-stone-400">
            <button id="nav-btn-home" onClick={onHomeClick} className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer font-light">
              {currentLanguage === Language.JA ? "エディトリアル" : currentLanguage === Language.FR ? "Éditorial" : currentLanguage === Language.DE ? "Kuration" : "Editorial"}
            </button>
            <button id="nav-btn-shop" onClick={onShopClick} className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer font-light">
              {currentLanguage === Language.JA ? "カタログ" : currentLanguage === Language.FR ? "Catalogue" : currentLanguage === Language.DE ? "Kollektionen" : "Masterpieces"}
            </button>

            <button 
              id="nav-btn-tracker"
              onClick={onTrackerClick}
              className="flex items-center space-x-1 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>{currentLanguage === Language.EN ? "TRACK" : t.trackingId.split(" ")[0]}</span>
            </button>
          </nav>

          {/* Controls - Symmetrical Right */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            
            {/* Search Box - Elegant minimalist line (Desktop) */}
            <div className="relative hidden md:flex items-center border-b border-neutral-250 dark:border-neutral-800 pb-1 mr-2 focus-within:border-neutral-900 dark:focus-within:border-white transition-all">
              <Search className="h-3.5 w-3.5 text-neutral-400 dark:text-stone-500 absolute left-0" />
              <input
                id="search-input"
                type="text"
                placeholder={
                  currentLanguage === Language.AR
                    ? "ابحث عن رونقك الخاص (Personal)..."
                    : currentLanguage === Language.EN
                    ? "Search masterpiece (Personal)..."
                    : "Rechercher..."
                }
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-5 pr-1 py-0.5 bg-transparent border-none text-xs text-neutral-800 dark:text-stone-200 placeholder-neutral-400 dark:placeholder-neutral-650 font-sans tracking-wide outline-none w-36 focus:w-48 transition-all"
              />
            </div>

            {/* Language Switcher */}
            <div className="relative group">
              <button 
                id="lang-selector-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangToggleOpen(!isLangToggleOpen);
                  setIsCurrencyToggleOpen(false);
                }}
                className="flex items-center space-x-0.5 p-1 rounded hover:bg-neutral-50 dark:hover:bg-stone-900 transition-colors text-neutral-700 dark:text-stone-300 hover:text-neutral-900 dark:hover:text-white"
              >
                <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="font-mono text-[9px] sm:text-[10px] font-medium uppercase">{currentLanguage}</span>
              </button>
              
              {/* Elegant Dropdown */}
              <div 
                id="lang-dropdown" 
                className={`absolute right-0 top-full mt-1 w-28 bg-white dark:bg-stone-900 border border-neutral-100 dark:border-neutral-800 shadow-xl rounded-sm py-1 z-50 ${
                  isLangToggleOpen ? "block" : "hidden group-hover:block"
                }`}
              >
                {(Object.keys(Language) as Array<keyof typeof Language>).map((langKey) => (
                  <button
                    id={`lang-select-${langKey}`}
                    key={langKey}
                    onClick={(e) => {
                      e.stopPropagation();
                      onLanguageChange(Language[langKey]);
                      setIsLangToggleOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 font-sans text-[11px] transition-colors hover:bg-neutral-50 dark:hover:bg-stone-800 ${currentLanguage === Language[langKey] ? "font-semibold text-neutral-900 dark:text-white bg-neutral-50 dark:bg-stone-850" : "text-neutral-500 dark:text-neutral-400"}`}
                  >
                    {LANGUAGE_LABELS[Language[langKey]]}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Switcher */}
            <div className="relative groupAndButton group">
              <button 
                id="currency-selector-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCurrencyToggleOpen(!isCurrencyToggleOpen);
                  setIsLangToggleOpen(false);
                }}
                className="flex items-center space-x-0.5 p-1 rounded hover:bg-neutral-50 dark:hover:bg-stone-900 transition-colors font-mono text-[9px] sm:text-[10px] text-neutral-700 dark:text-stone-300 hover:text-neutral-900 dark:hover:text-white font-medium"
              >
                <span>{CURRENCY_SYMBOLS[currentCurrency]}</span>
                <span>{currentCurrency}</span>
              </button>
              <div 
                id="currency-dropdown" 
                className={`absolute right-0 top-full mt-1 w-24 bg-white dark:bg-stone-900 border border-neutral-100 dark:border-neutral-800 shadow-xl rounded-sm py-1 z-50 ${
                  isCurrencyToggleOpen ? "block" : "hidden group-hover:block"
                }`}
              >
                {Object.values(Currency).map((curr) => (
                  <button
                    id={`currency-select-${curr}`}
                    key={curr}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCurrencyChange(curr);
                      setIsCurrencyToggleOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 font-mono text-[10px] transition-colors hover:bg-neutral-50 dark:hover:bg-stone-800 ${curr === currentCurrency ? "font-semibold text-neutral-905 dark:text-white bg-neutral-50 dark:bg-stone-850" : "text-neutral-500 dark:text-neutral-400"}`}
                  >
                    {CURRENCY_SYMBOLS[curr]} {curr}
                  </button>
                ))}
              </div>
            </div>

            {/* Elegant Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleDarkMode();
              }}
              className="p-1 sm:p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-stone-900 text-neutral-700 dark:text-stone-300 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
              title={currentLanguage === Language.AR ? "مظهر الغرفة (تغيير السمة)" : "Toggle Theme (Dark/Light)"}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-amber-500 fill-amber-300" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700 dark:text-stone-400" />
              )}
            </button>

            {/* Quick Favorites Trigger */}
            <button
              id="favorites-nav-btn"
              onClick={onCustomerClick}
              className="flex items-center space-x-1 border border-rose-100 dark:border-rose-950 bg-rose-50/20 dark:bg-rose-950/10 hover:bg-rose-50 dark:hover:bg-rose-950/25 text-neutral-900 dark:text-stone-150 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-transform active:scale-95 cursor-pointer text-[10px] sm:text-[10.5px] font-sans font-medium tracking-wide shadow-sm"
              title={currentLanguage === Language.AR ? "الأرشيف المفضّل / المعجبات" : "Favorites Archive"}
            >
              <Heart className={`h-3.5 w-3.5 text-rose-600 ${favoritesCount > 0 ? "fill-rose-600 animate-pulse" : ""}`} />
              <span className="hidden md:inline font-semibold text-neutral-900 dark:text-stone-200">
                {currentLanguage === Language.AR ? "المفضلة" : "Favorites"}
              </span>
              {favoritesCount > 0 && (
                <span className="bg-rose-600 text-white rounded-full px-1 py-0.5 text-[8.5px] font-mono leading-none">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Customer Portal Trigger */}
            <button
              id="customer-portal-nav-btn"
              onClick={onCustomerClick}
              className="flex items-center space-x-1 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-stone-500 bg-white dark:bg-stone-900 hover:bg-neutral-50 dark:hover:bg-stone-850 text-neutral-900 dark:text-stone-150 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-transform active:scale-95 cursor-pointer text-[10px] sm:text-[10.5px] font-sans font-medium tracking-wide shadow-sm"
              title="Membership Portal / بوابة الأعضاء"
            >
              <User className="h-3.5 w-3.5 text-zinc-650 dark:text-stone-400" />
              <span className="hidden md:inline text-neutral-900 dark:text-stone-200 font-semibold">بوابة العضوية</span>
            </button>

            {/* Shopping Bag Button - Animated Pill */}
            <button
              id="cart-action-btn"
              onClick={onCartClick}
              className="flex items-center space-x-1.5 sm:space-x-2 bg-neutral-900 dark:bg-stone-100 hover:bg-neutral-800 dark:hover:bg-stone-200 text-white dark:text-stone-950 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-transform active:scale-95 cursor-pointer shadow-md shadow-neutral-900/10"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="font-sans text-[9.5px] sm:text-[10px] font-medium tracking-widest">{cartCount}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile-only Search Bar & Navigation Quick Submenu */}
      <div className="block md:hidden border-t border-neutral-100 dark:border-neutral-900 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md px-3 py-2 flex flex-col space-y-2">
        {/* Full-width Touch-friendly Search Bar */}
        <div className="relative flex items-center border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-stone-900 px-2.5 py-1.5 rounded-md focus-within:border-neutral-950 dark:focus-within:border-white transition-all shadow-xs">
          <Search className="h-3.5 w-3.5 text-neutral-400 dark:text-stone-500 absolute left-2.5" />
          <input
            id="mobile-search-input-field"
            type="text"
            placeholder={
              currentLanguage === Language.AR
                ? "ابحث في الروائع والمعرض..."
                : currentLanguage === Language.EN
                ? "Search Masterpieces..."
                : "Rechercher..."
            }
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-6 pr-1 w-full bg-transparent border-none text-[11.5px] text-neutral-800 dark:text-stone-200 placeholder-neutral-450 dark:placeholder-neutral-550 font-sans tracking-wide outline-none"
          />
        </div>
        
        {/* Mobile Horizontal scroll for Quick views (Home, Shop, Stylist, Track) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-[10px] uppercase font-sans tracking-wider text-neutral-600 dark:text-stone-400">
          <button 
            id="mobile-nav-home" 
            onClick={onHomeClick} 
            className="whitespace-nowrap bg-white dark:bg-stone-900 border border-neutral-150 dark:border-neutral-850 text-neutral-800 dark:text-stone-200 px-3 py-1.5 rounded-full cursor-pointer font-medium hover:bg-neutral-50 dark:hover:bg-stone-800 active:scale-95 transition-transform"
          >
            {currentLanguage === Language.AR ? "الرئيسية" : "Home"}
          </button>
          <button 
            id="mobile-nav-shop" 
            onClick={onShopClick} 
            className="whitespace-nowrap bg-white dark:bg-stone-900 border border-neutral-150 dark:border-neutral-850 text-neutral-800 dark:text-stone-200 px-3 py-1.5 rounded-full cursor-pointer font-medium hover:bg-neutral-50 dark:hover:bg-stone-800 active:scale-95 transition-transform"
          >
            {currentLanguage === Language.AR ? "المعرض المميز" : "Gallery"}
          </button>

          <button 
            id="mobile-nav-tracker" 
            onClick={onTrackerClick} 
            className="whitespace-nowrap bg-white dark:bg-stone-900 border border-neutral-150 dark:border-neutral-850 text-neutral-850 dark:text-stone-200 px-3 py-1.5 rounded-full cursor-pointer font-medium hover:bg-neutral-50 dark:hover:bg-stone-800 active:scale-95 transition-transform"
          >
            {currentLanguage === Language.AR ? "تتبع الشحنة" : "Track"}
          </button>
        </div>
      </div>
    </header>
  );
}
