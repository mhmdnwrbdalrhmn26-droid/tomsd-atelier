import React, { useState } from "react";
import { Plus, Edit3, Trash2, Camera, Check, ShieldAlert, Smartphone, Sliders, Layout, Info, Layers, RefreshCw, Lock, Unlock, Key, Phone, Mail, Settings, Eye, EyeOff } from "lucide-react";
import { Product, Category, Currency, CURRENCY_RATES } from "../types";

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetProducts: () => void;
  onClose: () => void;
  currency: Currency;
  formatPrice: (amount: number) => string;
  
  // Contact details & security props
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
  onUpdateContactSettings: (phone: string, whatsapp: string, email: string) => void;
  adminPasscode: string;
  onUpdatePasscode: (newPasscode: string) => void;
}

export default function AdminPanel({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetProducts,
  onClose,
  currency,
  formatPrice,
  contactPhone,
  contactWhatsApp,
  contactEmail,
  onUpdateContactSettings,
  adminPasscode,
  onUpdatePasscode
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"list" | "form" | "settings">("list");
  
  // Passcode Security States
  const [enteredPasscode, setEnteredPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("atelier_admin_authenticated") === "true";
  });
  const [securityError, setSecurityError] = useState("");
  const [showPasscodeChar, setShowPasscodeChar] = useState(false);

  // Settings State fields
  const [setFieldPhone, setSetFieldPhone] = useState(contactPhone);
  const [setFieldWhatsApp, setSetFieldWhatsApp] = useState(contactWhatsApp);
  const [setFieldEmail, setSetFieldEmail] = useState(contactEmail);
  const [setFieldPasscode, setSetFieldPasscode] = useState(adminPasscode);
  const [passcodeUpdateSuccess, setPasscodeUpdateSuccess] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>(Category.Outerwear);
  const [price, setPrice] = useState(250);
  const [priceInputCurrency, setPriceInputCurrency] = useState<"USD" | "EGP">("USD");
  const [stockCount, setStockCount] = useState<number>(4);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("");
  const [fit, setFit] = useState("");
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L"]);
  const [colors, setColors] = useState<string[]>(["Atelier Carbon", "Alabaster White"]);
  const [colorHexes, setColorHexes] = useState<{ [key: string]: string }>({
    "Atelier Carbon": "#1f2937",
    "Alabaster White": "#f3f4f6"
  });
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=700",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=700"
  ]);
  const [curatedQuote, setCuratedQuote] = useState("");

  // Temporary item custom sizes / color states for easier input
  const [newSizeInput, setNewSizeInput] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price);
    setPriceInputCurrency("USD");
    setStockCount(product.stockCount !== undefined ? product.stockCount : 4);
    setDiscountPercentage(product.discountPercentage !== undefined ? product.discountPercentage : 0);
    setDescription(product.description || "");
    setFabric(product.fabric || "");
    setFit(product.fit || "");
    setSizes(product.sizes || []);
    setColors(product.colors || []);
    setColorHexes(product.colorHexes || {});
    setImages(product.images || []);
    setCuratedQuote(product.curatedQuote || "");
    setActiveTab("form");
  };

  const handleCreateNewClick = () => {
    setEditingId(null);
    setName("");
    setCategory(Category.Outerwear);
    setPrice(250);
    setPriceInputCurrency("USD");
    setStockCount(4);
    setDiscountPercentage(0);
    setDescription("");
    setFabric("");
    setFit("");
    setSizes(["S", "M", "L"]);
    setColors(["Atelier Carbon"]);
    setColorHexes({ "Atelier Carbon": "#1f2937" });
    setImages([
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=700"
    ]);
    setCuratedQuote("");
    setActiveTab("form");
  };

  const handleAddSize = () => {
    if (newSizeInput && !sizes.includes(newSizeInput)) {
      setSizes([...sizes, newSizeInput]);
      setNewSizeInput("");
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter((s) => s !== sizeToRemove));
  };

  const handleAddColor = () => {
    if (newColorName && !colors.includes(newColorName)) {
      setColors([...colors, newColorName]);
      setColorHexes({
        ...colorHexes,
        [newColorName]: newColorHex
      });
      setNewColorName("");
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setColors(colors.filter((c) => c !== colorToRemove));
    const updatedHexes = { ...colorHexes };
    delete updatedHexes[colorToRemove];
    setColorHexes(updatedHexes);
  };

  const handleAddImage = () => {
    if (newImageUrl) {
      setImages([...images, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (idx: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== idx));
    }
  };

  const handleCurrencyToggle = (targetCurr: "USD" | "EGP") => {
    if (priceInputCurrency === targetCurr) return;
    if (targetCurr === "EGP") {
      setPrice(Math.round(price * CURRENCY_RATES[Currency.EGP] * 100) / 100);
    } else {
      setPrice(Math.round((price / CURRENCY_RATES[Currency.EGP]) * 100) / 100);
    }
    setPriceInputCurrency(targetCurr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please specify name.");

    // Convert to standard base USD currency on saving
    const finalPriceUSD = priceInputCurrency === "EGP"
      ? Number(price) / CURRENCY_RATES[Currency.EGP]
      : Number(price);

    const productPayload: Product = {
      id: editingId || `custom-${Date.now()}`,
      name: name.trim(),
      category,
      price: Number(finalPriceUSD),
      description: description.trim(),
      fabric: fabric.trim() || "100% Premium Organic Textile",
      fit: fit.trim() || "Relaxed structural fit",
      sizes,
      colors,
      colorHexes,
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=700"],
      completeTheLookIds: [],
      curatedQuote: curatedQuote.trim() || "A beautiful structural staple for the timeless wardrobe.",
      stockCount: Number(stockCount),
      discountPercentage: Number(discountPercentage)
    };

    if (editingId) {
      onUpdateProduct(productPayload);
      alert("Product updated successfully! / تم حفظ التعديلات بنجاح");
    } else {
      onAddProduct(productPayload);
      alert("New masterpiece added successfully! / تم إضافة المنتج بنجاح");
    }

    setEditingId(null);
    setActiveTab("list");
  };

  const handleVerifyPasscode = () => {
    if (enteredPasscode === adminPasscode) {
      setIsAuthenticated(true);
      sessionStorage.setItem("atelier_admin_authenticated", "true");
      setSecurityError("");
    } else {
      setSecurityError("رمز مرور غير صحيح. يرجى المحاولة مرة أخرى أو مراجعة المشرف الفني. / Incorrect passcode.");
    }
  };

  const handleKeypadPress = (digit: string) => {
    setSecurityError("");
    if (digit === "C") {
      setEnteredPasscode("");
    } else {
      if (enteredPasscode.length < 8) {
        setEnteredPasscode(enteredPasscode + digit);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div id="admin-security-lock-container" className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex justify-center items-center p-4">
        <div id="admin-security-lock-card" className="w-full max-w-md bg-white shadow-2xl rounded-sm border border-neutral-205 overflow-hidden text-neutral-900 animate-fade-in my-auto">
          <div className="bg-neutral-950 p-6 text-white text-center border-b border-neutral-900 relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-neutral-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer text-xs font-mono font-bold"
            >
              × CLOSE / إغلاق
            </button>
            <Lock className="h-10 w-10 text-stone-300 mx-auto mb-3 animate-pulse" />
            <h1 className="font-sans text-lg tracking-wider uppercase font-light">
              نظام الأمان والتوثيق للمصمم الفني
            </h1>
            <span className="font-mono text-[9px] tracking-widest text-zinc-400 block mt-1 uppercase">
              COUTURE OWNER SECURITY VERIFICATION
            </span>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-xs font-medium text-neutral-800 leading-relaxed font-sans">
                صلاحيات تعديل الأسعار، ومواصفات الملابس الكلاسيكية، وتغيير أرقام التواصل تقتصر على مالك الأتيليه والمشرف الفني فقط.
              </p>
              <p className="text-[11px] text-zinc-400 leading-normal font-sans italic text-stone-400">
                Changes to prices and masterpieces require supervisor passcode.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleVerifyPasscode(); }} className="space-y-4">
              <div className="space-y-1.5 text-center">
                <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-semibold font-mono">
                  ENTER SECURE PASSCODE / أدخل الرمز السري للمشرف
                </label>
                <div className="relative max-w-xs mx-auto flex items-center border border-neutral-300 rounded-sm bg-neutral-50 p-1 focus-within:border-neutral-900 focus-within:bg-white transition-all">
                  <Key className="h-4 w-4 text-zinc-400 mx-2" />
                  <input
                    type={showPasscodeChar ? "text" : "password"}
                    value={enteredPasscode}
                    onChange={(e) => {
                      setSecurityError("");
                      setEnteredPasscode(e.target.value);
                    }}
                    maxLength={14}
                    placeholder="••••"
                    className="w-full bg-transparent py-2 px-1 text-center font-mono text-base font-bold tracking-widest text-neutral-900 outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscodeChar(!showPasscodeChar)}
                    className="text-zinc-400 hover:text-neutral-900 p-2 text-xs font-semibold cursor-pointer"
                    title="Toggle Visibility"
                  >
                    {showPasscodeChar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {securityError && (
                  <p className="text-[11.5px] font-semibold mt-2 bg-red-50 py-1.5 px-3 rounded-xs leading-relaxed text-red-700">
                    {securityError}
                  </p>
                )}
              </div>

              {/* Responsive Keypad of at least 48px key nodes */}
              <div className="max-w-xs mx-auto grid grid-cols-3 gap-2 pt-2">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0"].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeypadPress(digit)}
                    className="h-12 w-full flex items-center justify-center border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-400 text-neutral-800 rounded-sm font-semibold transition-all transform active:scale-95 text-sm font-mono cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="submit"
                  className="h-12 w-full flex items-center justify-center bg-zinc-900 hover:bg-black text-white rounded-sm font-semibold transition-all transform active:scale-95 text-xs font-sans tracking-widest uppercase cursor-pointer"
                >
                  دخول
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-[9.5px] text-zinc-400 font-mono">
                  Default owner code is <strong className="text-zinc-650">1926</strong> (Changeable in system settings tab after auth)
                </p>
              </div>
              
              <div className="pt-2 flex justify-between space-x-2 border-t border-neutral-150">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full border border-neutral-200 hover:bg-neutral-50 py-3 text-[10px] uppercase font-mono tracking-widest text-neutral-500 rounded-xs transition-colors cursor-pointer"
                >
                  ← Close Store View
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-panel-container" className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/80 backdrop-blur-sm flex justify-center items-start p-4 sm:p-6 md:p-10">
      <div id="admin-studio-card" className="w-full max-w-5xl bg-white shadow-2xl rounded-sm border border-neutral-200 overflow-hidden my-4">
        
        {/* Banner/Header */}
        <div className="bg-neutral-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-900 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <Sliders className="h-5 w-5 text-stone-300" />
              <span className="font-mono text-[9px] tracking-[0.3em] text-neutral-400 uppercase">
                ATELIER SYSTEM MANAGEMENT
              </span>
            </div>
            <h1 className="font-sans text-2xl font-light tracking-wider uppercase">
              لوحة التحكم والاستوديو الإداري
            </h1>
            <p className="font-sans text-[11px] text-zinc-400 font-light mt-1">
              Add signature garments, fix listing typos, and preview mobile responsive properties.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              id="admin-reset-system"
              onClick={() => {
                if (window.confirm("Restore original atelier products? / هل تريد استعادة المنتجات الأصلية؟")) {
                  onResetProducts();
                }
              }}
              className="flex items-center space-x-1.5 border border-stone-800 hover:border-neutral-700 bg-neutral-900/60 font-mono text-[10px] tracking-widest uppercase px-3.5 py-2 text-stone-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>استعادة الافتراضي</span>
            </button>
            <button
              id="admin-close-panel"
              onClick={onClose}
              className="bg-white hover:bg-neutral-100 text-neutral-950 font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-xs transition-transform transform active:scale-97 font-bold cursor-pointer"
            >
              إغلاق لوحة التحكم
            </button>
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="border-b border-neutral-150 bg-neutral-50 px-6 sm:px-8 flex flex-wrap gap-x-6 gap-y-1">
          <button
            id="admin-tab-list"
            onClick={() => setActiveTab("list")}
            className={`py-4 font-mono text-[10.5px] uppercase tracking-widest border-b-2 font-bold transition-all cursor-pointer ${activeTab === "list" ? "border-neutral-950 text-neutral-950" : "border-transparent text-neutral-400 hover:text-black"}`}
          >
            كتالوج المنتجات الحالية ({products.length})
          </button>
          <button
            id="admin-tab-form"
            onClick={handleCreateNewClick}
            className={`py-4 font-mono text-[10.5px] uppercase tracking-widest border-b-2 font-bold transition-all cursor-pointer ${activeTab === "form" && !editingId ? "border-neutral-950 text-neutral-950" : "border-transparent text-neutral-400 hover:text-black"}`}
          >
            إضافة قطعة ملابس جديدة +
          </button>
          <button
            id="admin-tab-settings"
            onClick={() => {
              setActiveTab("settings");
              setPasscodeUpdateSuccess(false);
            }}
            className={`py-4 font-mono text-[10.5px] uppercase tracking-widest border-b-2 font-bold transition-all cursor-pointer ${activeTab === "settings" ? "border-neutral-950 text-neutral-950" : "border-transparent text-neutral-400 hover:text-black"}`}
          >
            إعدادات التواصل والأمان ⚙️
          </button>
          {editingId && (
            <button
              className="py-4 font-mono text-[10.5px] uppercase tracking-widest border-b-2 font-bold border-stone-500 text-stone-800"
              disabled
            >
              تعديل: {name.slice(0, 15)}...
            </button>
          )}
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8">
          
          {/* TAB 1: PRODUCT LISTING & MANAGEMENT */}
          {activeTab === "list" && (
            <div className="space-y-6">
              
              {/* Responsive checklist alert */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-sm flex items-start space-x-3 text-xs text-neutral-700">
                <Smartphone className="h-5 w-5 text-emerald-800 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-950">مؤشرات الهواتف الذكية ممتازة (100% Mobile Ready)</h4>
                  <p className="text-zinc-650 mt-1 leading-relaxed">
                    Designed dynamically. Every grid uses single-column auto-flow on handhelds, with large 48px touch targets for cart actions and swipeable menus. Any edits made here apply instantly to mobile views.
                  </p>
                </div>
              </div>

              {/* Grid-based product list */}
              <div className="overflow-x-auto border border-neutral-150 rounded-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50/70 border-b border-neutral-150 font-sans uppercase tracking-wider text-neutral-600">
                      <th className="p-4 font-semibold">الصورة المعروضة</th>
                      <th className="p-4 font-semibold">اسم القطعة والمجموعة</th>
                      <th className="p-4 font-semibold">السعر</th>
                      <th className="p-4 font-semibold">العيار والقماش</th>
                      <th className="p-4 font-semibold">المقاسات والألوان المتاحة</th>
                      <th className="p-4 font-semibold text-right">الإجراءات والتحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-150">
                    {products.map((p) => (
                      <tr id={`admin-row-${p.id}`} key={p.id} className="hover:bg-neutral-50/40 transition-colors">
                        {/* Thumbnail */}
                        <td className="p-4">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="h-14 w-10 object-cover bg-neutral-100 border rounded-xs shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        
                        {/* Name/Category */}
                        <td className="p-4">
                          <div className="font-semibold text-neutral-900 text-sm">{p.name}</div>
                          <div className="font-mono text-[9px] text-stone-400 mt-1 uppercase">
                            ID: {p.id} · <span className="text-stone-600 font-bold">{p.category}</span>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="p-4 font-mono font-bold text-neutral-900 text-sm">
                          {formatPrice(p.price)}
                        </td>

                        {/* fabric/fit */}
                        <td className="p-4 max-w-[180px]">
                          <div className="truncate text-stone-700">{p.fabric}</div>
                          <div className="text-[10px] text-stone-400 truncate">{p.fit}</div>
                        </td>

                        {/* sizes & colors dots */}
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 mb-1.5">
                            {p.sizes.map((s) => (
                              <span key={s} className="bg-neutral-100 text-neutral-800 text-[10px] px-1.5 py-0.5 rounded-xs font-mono">
                                {s}
                              </span>
                            ))}
                          </div>
                          
                          {/* Color preview dots */}
                          <div className="flex items-center space-x-1">
                            {p.colors.map((c) => (
                              <span
                                key={c}
                                className="h-3 w-3 rounded-full border border-neutral-300 block"
                                style={{ backgroundColor: p.colorHexes[c] || "#cccccc" }}
                                title={c}
                              />
                            ))}
                          </div>
                        </td>

                        {/* Edit Buttons */}
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              id={`admin-edit-btn-${p.id}`}
                              onClick={() => handleEditClick(p)}
                              className="bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] tracking-widest uppercase py-2 px-3.5 rounded-xs flex items-center space-x-1 cursor-pointer transition-colors"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>تعديل الأخطاء</span>
                            </button>
                            <button
                              id={`admin-delete-btn-${p.id}`}
                              onClick={() => {
                                if (window.confirm(`Delete masterpiece "${p.name}"?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="border border-neutral-200 hover:border-red-200 hover:bg-red-50 text-neutral-500 hover:text-red-700 font-mono text-[10px] tracking-widest uppercase py-2 px-3 rounded-xs cursor-pointer transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {products.length === 0 && (
                <div className="text-center py-16 bg-neutral-50 border border-dashed rounded-xs border-neutral-250">
                  <Info className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                  <p className="font-sans text-xs text-stone-500">
                    No masterpieces loaded currently. Click "إضافة قطعة ملابس جديدة" or Restore Default.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: CREATE / EDIT PRODUCT FORM */}
          {activeTab === "form" && (
            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
              
              <div className="bg-neutral-50 p-4 border rounded-sm">
                <h3 className="font-sans text-sm font-semibold text-neutral-900 mb-1">
                  {editingId ? "قالب تعديل القطعة (Fixing mistakes)" : "استمارة حياكة وتصنيع فستان أو قطعة كلاسيكية جديدة"}
                </h3>
                <p className="font-sans text-[11px] text-neutral-500 leading-relaxed">
                  Enter parameters aligned to our high-end monochrome vision. Prices entered here correspond to the base USD amount and will automatically scale into EUR, GBP, JPY, and CAD instantly via the exchange framework!
                </p>
              </div>

              {/* Grid 1: Basic Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-stone-600 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                    اسم قطعة الموضة (Product Name) *
                  </label>
                  <input
                    id="form-product-name"
                    type="text"
                    required
                    placeholder="e.g. Drape Collar Heavy Cashmere Robe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-neutral-250 p-3 text-xs outline-none focus:border-black rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                    المجموعة / الصنف (Category)
                  </label>
                  <select
                    id="form-product-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-white border border-neutral-250 p-3 text-xs outline-none focus:border-black rounded-xs"
                  >
                    {Object.values(Category).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-sans text-xs font-semibold uppercase tracking-wider mb-2 flex justify-between">
                    <span>سعر القطعة (Garment Price) *</span>
                    <span className="text-[10px] text-neutral-400 font-normal">اختر عملة الإدخال</span>
                  </label>
                  
                  <div className="flex border border-neutral-250 rounded-xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleCurrencyToggle("USD")}
                      className={`px-3 text-xs font-mono font-bold transition-colors cursor-pointer ${
                        priceInputCurrency === "USD"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCurrencyToggle("EGP")}
                      className={`px-3 text-xs font-mono font-bold transition-colors cursor-pointer border-l border-neutral-200 ${
                        priceInputCurrency === "EGP"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      EGP (جنيه)
                    </button>
                    <input
                      id="form-product-price"
                      type="number"
                      min={1}
                      max={200000}
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-white p-3 text-xs outline-none focus:bg-neutral-50/50 font-mono font-semibold"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 block mt-1">
                    {priceInputCurrency === "EGP" 
                      ? `يعادل تقريباً ${(price / CURRENCY_RATES[Currency.EGP]).toFixed(2)} دولار أمريكي`
                      : `يعادل تقريباً ${(price * CURRENCY_RATES[Currency.EGP]).toFixed(2)} جنيه مصري`}
                  </span>
                </div>
              </div>

              {/* Grid: Stock & Discounts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-stone-600 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                    القطع المتبقية في الورشة (Remaining Stock Pieces) *
                  </label>
                  <input
                    id="form-product-stock"
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={stockCount}
                    onChange={(e) => setStockCount(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-250 p-3 text-xs outline-none focus:border-black rounded-xs font-mono font-semibold"
                    placeholder="مثال: 4"
                  />
                  <span className="text-[10px] text-neutral-400 block mt-1">المخزون المتبقي الذي سيظهر للعميل لحثه على الشراء</span>
                </div>

                <div>
                  <label className="block text-stone-600 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                    عمل عرض خصم بنسبة % (Promo Discount Percentage)
                  </label>
                  <input
                    id="form-product-discount"
                    type="number"
                    min={0}
                    max={95}
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-250 p-3 text-xs outline-none focus:border-black rounded-xs font-mono font-semibold"
                    placeholder="ضع 0 لعدم وجود خصم"
                  />
                  <span className="text-[10px] text-neutral-400 block mt-1">مثال: اكتب 15 لعمل خصم 15% على هذا المنتج</span>
                </div>
              </div>

              {/* Grid 2: Descriptions & Textiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-stone-600 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                    الوصف التفصيلي (Luxury Description)
                  </label>
                  <textarea
                    id="form-product-desc"
                    rows={4}
                    placeholder="Describe architecture, drape, texture qualities..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white border border-neutral-250 p-3 text-xs outline-none focus:border-black rounded-xs resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-stone-600 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                      مكونات القماش (Fabric Weave Composition)
                    </label>
                    <input
                      id="form-product-fabric"
                      type="text"
                      placeholder="e.g. 100% Belgian Organic Linen, 10-ply Cashmere"
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      className="w-full bg-white border border-neutral-250 p-3 text-xs outline-none focus:border-black rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                      القصة ووضع الموديل (Silhouette Fit & Profile)
                    </label>
                    <input
                      id="form-product-fit"
                      type="text"
                      placeholder="e.g. Relaxed architectural drape, Oversized tailoring"
                      value={fit}
                      onChange={(e) => setFit(e.target.value)}
                      className="w-full bg-white border border-neutral-250 p-3 text-xs outline-none focus:border-black rounded-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Aesthetic attributes (Sizes, Colors, Image Slots) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4 border-t border-neutral-100">
                
                {/* Size Manager */}
                <div>
                  <label className="block text-stone-600 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                    المقاسات المدعومة (Supported Sizes)
                  </label>
                  
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {sizes.map((sz) => (
                      <span key={sz} className="inline-flex items-center bg-neutral-100 px-2 py-1 rounded-xs text-xs font-mono">
                        <span>{sz}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(sz)}
                          className="ml-1.5 text-zinc-400 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-1.5">
                    <input
                      id="form-new-size-input"
                      type="text"
                      placeholder="e.g. S, 42, M"
                      value={newSizeInput}
                      onChange={(e) => setNewSizeInput(e.target.value)}
                      className="flex-1 bg-white border border-neutral-250 p-2 text-xs outline-none rounded-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="bg-neutral-950 text-white font-mono text-[10px] uppercase tracking-widest px-3 hover:bg-neutral-800 transition-colors"
                    >
                      إضافة
                    </button>
                  </div>
                </div>

                {/* Color Spectrum Manager */}
                <div>
                  <label className="block text-stone-600 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                    مجموعة الألوان (Aesthetic Colors)
                  </label>
                  
                  <div className="space-y-2 mb-3">
                    {colors.map((c) => (
                      <div key={c} className="flex items-center justify-between bg-neutral-50 px-2 py-1 border border-stone-200 rounded-sm text-xs select-none">
                        <div className="flex items-center space-x-2">
                          <span className="h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: colorHexes[c] || "#ccc" }} />
                          <span className="font-mono text-[10.5px]">{c}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(c)}
                          className="text-neutral-450 hover:text-red-700 font-extrabold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 border-t border-neutral-150 pt-2">
                    <div className="flex space-x-1.5">
                      <input
                        id="form-new-color-name"
                        type="text"
                        placeholder="Color label (e.g. Rosewood)"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        className="flex-1 bg-white border border-neutral-250 p-2 text-xs outline-none rounded-xs"
                      />
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="h-8 w-8 border border-neutral-250 cursor-pointer p-0.5 rounded-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="w-full bg-neutral-900 text-white font-mono text-[9px] uppercase tracking-widest py-1.5 hover:bg-neutral-800 transition-colors"
                    >
                      أضف اللون الجديد
                    </button>
                  </div>
                </div>

                {/* Image URLs */}
                <div>
                  <label className="block text-stone-600 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                    روابط الصور (Unsplash Editorial URLs)
                  </label>
                  
                  <div className="space-y-1.5 mb-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="flex items-center space-x-2 border p-1 rounded-sm">
                        <img src={img} className="h-8 w-6 object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                        <span className="truncate flex-1 font-mono text-[9px] text-stone-400">{img}</span>
                        {images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-red-650 hover:text-red-900 font-bold px-1 text-xs"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-1.5">
                    <input
                      id="form-new-img-url"
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 bg-white border border-neutral-250 p-2 text-xs outline-none rounded-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="bg-neutral-950 text-white font-mono text-[10px] uppercase tracking-widest px-3 hover:bg-neutral-800 transition-colors"
                    >
                      أدخل رابط
                    </button>
                  </div>
                </div>

              </div>

              {/* Curated Coach / Director Quote */}
              <div className="pt-4 border-t border-neutral-100">
                <label className="block text-stone-600 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                  ملاحظة المصمم الخاصة (Design Atelier Quote / Curated Insight)
                </label>
                <input
                  id="form-product-quote"
                  type="text"
                  placeholder="e.g. Sourced from high-altitude regenerative farms, focusing on weightless protection."
                  value={curatedQuote}
                  onChange={(e) => setCuratedQuote(e.target.value)}
                  className="w-full bg-white border border-neutral-250 p-3 text-xs outline-none focus:border-black rounded-xs"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3 justify-end pt-6 border-t border-neutral-150">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setActiveTab("list");
                  }}
                  className="px-6 py-3 border font-mono text-[11px] uppercase tracking-widest text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  إلغاء التغيير
                </button>
                <button
                  id="form-submit-btn"
                  type="submit"
                  className="bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs tracking-widest uppercase font-semibold py-3.5 px-8 rounded-sm shadow-md cursor-pointer transition-colors active:scale-98"
                >
                  {editingId ? "حفظ التعديلات وتصحيح الأخطاء ✓" : "تأكيد وإضافة القطعة للكتالوج +"}
                </button>
              </div>

            </form>
          )}

          {/* TAB 3: CONTACT & SECURITY SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-8 max-w-2xl mx-auto py-4">
              <div className="bg-neutral-50 p-5 border border-neutral-200 rounded-sm">
                <div className="flex items-center space-x-2.5 mb-2">
                  <ShieldAlert className="h-5 w-5 text-neutral-900" />
                  <h3 className="font-sans text-sm font-semibold text-neutral-900">
                    أرقام التواصل وإدارة الأمان الفني للمتجر
                  </h3>
                </div>
                <p className="font-sans text-[11px] text-zinc-500 leading-relaxed">
                  هنا يمكنك تعيين وتحديث قنوات التواصل المباشرة لعملائك لضمان تجربة حجز متكاملة ومباشرة تحت إشرافك، بالإضافة إلى تعديل رمز الأمان السري الذي يحمي الأسعار وعمليات التعديل.
                </p>
              </div>

              {/* Secure Settings Form */}
              <div className="space-y-6">
                
                {/* Section 1: Customer Contact Numbers */}
                <div className="p-6 border border-neutral-150 rounded-sm bg-white space-y-4">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-neutral-400 font-bold block border-b pb-2">
                    قنوات تواصل العملاء (Customer Support Channels)
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-650 font-sans text-xs font-semibold mb-2">
                        رقم هاتف الاتصال المباشر (Phone Call Live)
                      </label>
                      <div className="flex items-center border border-neutral-250 bg-white p-1 rounded-xs">
                        <Phone className="h-4 w-4 text-zinc-400 mx-2.5" />
                        <input
                          type="text"
                          value={setFieldPhone}
                          onChange={(e) => setSetFieldPhone(e.target.value)}
                          className="w-full bg-transparent p-2 text-xs outline-none"
                          placeholder="مثال: +249117442964"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-650 font-sans text-xs font-semibold mb-2">
                        رقم الواتساب المباشر للطلبات (WhatsApp Link API)
                      </label>
                      <div className="flex items-center border border-neutral-250 bg-white p-1 rounded-xs">
                        <Smartphone className="h-4 w-4 text-emerald-600 mx-2.5" />
                        <input
                          type="text"
                          value={setFieldWhatsApp}
                          onChange={(e) => setSetFieldWhatsApp(e.target.value)}
                          className="w-full bg-transparent p-2 text-xs outline-none font-mono"
                          placeholder="مثال: 249117442964"
                        />
                      </div>
                      <span className="text-[9px] text-zinc-400 block mt-1">
                        أدخل الرقم فقط بدون رمز زائد أو أصفار دولية إضافية بشكل صحيح تلافياً للمشاكل.
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-650 font-sans text-xs font-semibold mb-2">
                      البريد الإلكتروني لاستقبال الطلبات الفنية (E-mail Address)
                    </label>
                    <div className="flex items-center border border-neutral-250 bg-white p-1 rounded-xs">
                      <Mail className="h-4 w-4 text-zinc-400 mx-2.5" />
                      <input
                        type="email"
                        value={setFieldEmail}
                        onChange={(e) => setSetFieldEmail(e.target.value)}
                        className="w-full bg-transparent p-2 text-xs outline-none"
                        placeholder="your.email@gmail.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Owner Security Credentials */}
                <div className="p-6 border border-neutral-150 rounded-sm bg-white space-y-4">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-neutral-400 font-bold block border-b pb-2">
                    حماية لوحة التحكم وتغيير الأسعار (Owner Security Passcode)
                  </span>

                  <div>
                    <label className="block text-zinc-650 font-sans text-xs font-semibold mb-2">
                      تعديل رمز المرور السري الخاص بك (Passcode Security Code)
                    </label>
                    <div className="flex items-center border border-neutral-250 bg-white p-1 rounded-xs">
                      <Key className="h-4 w-4 text-zinc-400 mx-2.5" />
                      <input
                        type="text"
                        value={setFieldPasscode}
                        onChange={(e) => {
                          setSetFieldPasscode(e.target.value);
                          setPasscodeUpdateSuccess(false);
                        }}
                        className="w-full bg-transparent p-2 text-xs font-mono tracking-widest outline-none font-semibold text-neutral-900"
                        placeholder="مثال: 1926"
                      />
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-1.5 leading-relaxed">
                      هذا الرمز يحمي جميع الصلاحيات من العبث. احفظ الرمز جيداً. يرجى استخدام أرقام لسهولة الإدخال على الكيباد الافتراضي للهواتف.
                    </span>
                  </div>
                </div>

                {/* Apply Settings buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSetFieldPhone(contactPhone);
                      setSetFieldWhatsApp(contactWhatsApp);
                      setSetFieldEmail(contactEmail);
                      setSetFieldPasscode(adminPasscode);
                      alert("تمت استعادة القيم السابقة / Reverted unsaved settings");
                    }}
                    className="px-5 py-3 border font-mono text-[11px] uppercase tracking-widest text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!setFieldPasscode.trim()) {
                        alert("الرجاء تحديد رمز مرور صالح / Specify a valid passcode");
                        return;
                      }
                      onUpdateContactSettings(setFieldPhone.trim(), setFieldWhatsApp.trim(), setFieldEmail.trim());
                      onUpdatePasscode(setFieldPasscode.trim());
                      setPasscodeUpdateSuccess(true);
                      alert("تم الحفظ بنجاح! جميع أرقام التواصل والرموز مشفرة ومحدثة الآن تحت إشرافك. / Changes saved safely!");
                    }}
                    className="bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs tracking-widest uppercase font-semibold py-3.5 px-7 rounded-sm shadow-md transition-colors cursor-pointer"
                  >
                    حفظ التغييرات الأمنية للتواصل والمشرف الفني
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
