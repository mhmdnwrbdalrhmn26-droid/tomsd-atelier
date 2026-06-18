import React, { useState } from "react";
import { X, Check, CreditCard, Shield, Truck, Landmark } from "lucide-react";
import { CartItem, Currency, Language, TRANSLATIONS, CURRENCY_RATES, CURRENCY_SYMBOLS } from "../types";

interface CheckoutModalProps {
  currentLanguage: Language;
  currentCurrency: Currency;
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (orderId: string) => void;
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail: string;
}

export default function CheckoutModal({
  currentLanguage,
  currentCurrency,
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
  contactPhone,
  contactWhatsApp,
  contactEmail
}: CheckoutModalProps) {
  const [shippingAddress, setShippingAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [ccNumber, setCcNumber] = useState("");
  const [ccExpiry, setCcExpiry] = useState("");
  const [ccCVC, setCcCVC] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bespoke Tailoring Customizations States
  const [isBespokeEnabled, setIsBespokeEnabled] = useState(false);
  const [monogramLetters, setMonogramLetters] = useState("");
  const [customLining, setCustomLining] = useState("Obsidian Silk");
  const [customFittingNotes, setCustomFittingNotes] = useState("");

  const t = TRANSLATIONS[currentLanguage];

  if (!isOpen) return null;

  // Pricing math converted with dynamic product discounts
  const subtotalBase = cartItems.reduce((acc, curr) => {
    const discount = curr.product.discountPercentage || 0;
    const finalPrice = curr.product.price * (1 - discount / 100);
    return acc + finalPrice * curr.qty;
  }, 0);
  const conversionRate = CURRENCY_RATES[currentCurrency];
  const subtotalTransformed = subtotalBase * conversionRate;
  const totalTransformed = subtotalTransformed;

  const formatPrice = (amount: number) => {
    return amount.toLocaleString(undefined, {
      style: "currency",
      currency: currentCurrency,
      maximumFractionDigits: currentCurrency === Currency.JPY ? 0 : 2
    });
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress || !fullName || !ccNumber || !emailAddress) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Generate unique random Atelier tracking number
      const randomOrderId = `ATL-${Math.floor(100000 + Math.random() * 900000)}`;
      onOrderSuccess(randomOrderId);
    }, 2500);
  };

  return (
    <div id="checkout-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto animate-fade-in text-neutral-900 dark:text-stone-100">
      <div id="checkout-container" className="relative w-full max-w-4xl bg-white dark:bg-stone-900 text-neutral-900 dark:text-stone-100 rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row border dark:border-stone-800">
        
        {/* Close Button */}
        <button
          id="checkout-close-btn"
          onClick={onClose}
          className="absolute right-4 top-4 z-40 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-stone-800 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Column: Checkout Inputs Form */}
        <form 
          id="checkout-form"
          onSubmit={handleCheckoutSubmit}
          className="w-full md:w-3/5 p-4 sm:p-6 md:p-8 lg:p-10"
        >
          <h2 className="font-sans text-xl font-light tracking-widest uppercase mb-1 text-neutral-900 dark:text-stone-100">
            {t.oneStepCheckout}
          </h2>
          <span className="font-mono text-[9px] tracking-widest text-[#a8a29e] dark:text-stone-450 block mb-8">
            DIRECT LUXURY AIR SHIPMENT CORE DEPOSIT
          </span>

          <div className="space-y-5">
            {/* Full Name & email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-[10px] tracking-widest uppercase text-neutral-550 dark:text-stone-400 mb-1.5 font-semibold">
                  {currentLanguage === Language.AR ? "اسم المستلم" : "Recipient Name"}
                </label>
                <input
                  id="checkout-input-name"
                  type="text"
                  required
                  placeholder={currentLanguage === Language.AR ? "مثال: جوناه ميرسر" : "e.g., Jonathan Mercer"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full font-sans text-xs bg-neutral-50 dark:bg-stone-950/50 border border-neutral-250 dark:border-stone-800 py-3 px-4 rounded-xs outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white text-neutral-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block font-sans text-[10px] tracking-widest uppercase text-neutral-550 dark:text-stone-400 mb-1.5 font-semibold">
                  {currentLanguage === Language.AR ? "البريد الإلكتروني" : "Email Address"}
                </label>
                <input
                  id="checkout-input-email"
                  type="email"
                  required
                  placeholder={currentLanguage === Language.AR ? "مثال: name@atelier.com" : "e.g., j.mercer@atelier.com"}
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full font-sans text-xs bg-neutral-50 dark:bg-stone-950/50 border border-neutral-250 dark:border-stone-800 py-3 px-4 rounded-xs outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white text-neutral-900 dark:text-stone-100"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block font-sans text-[10px] tracking-widest uppercase text-neutral-550 dark:text-stone-400 mb-1.5 font-semibold">
                {t.shippingAddress}
              </label>
              <textarea
                id="checkout-input-address"
                required
                rows={2}
                placeholder={currentLanguage === Language.AR ? "مثال: 22 شارع سارتو، الطابق الثاني، الرياض، المملكة العربية السعودية" : "22 Sarto Plaza, 2nd Floor, Copenhagen, Denmark"}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full font-sans text-xs bg-neutral-50 dark:bg-stone-950/50 border border-neutral-250 dark:border-stone-800 py-3 px-4 rounded-xs outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white text-neutral-900 dark:text-stone-100"
              />
            </div>

            {/* Bespoke Royal Customization Interactive Tool */}
            <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xs p-4 sm:p-5 transition-all">
              <label className="flex items-start space-x-3 rtl:space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBespokeEnabled}
                  onChange={(e) => setIsBespokeEnabled(e.target.checked)}
                  className="mt-1 h-4 w-4 bg-transparent border-amber-500 rounded-xs text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <div className="flex-1 min-w-0 select-none">
                  <span className="block font-sans text-xs font-bold text-amber-800 dark:text-amber-500 tracking-wide">
                    {currentLanguage === Language.AR ? "✦ تفعيل خدمات الخياطة والتفصيل اليدوي الراقي" : "✦ ENABLE ROYAL BESPOKE TAILORING SERVICES"}
                  </span>
                  <span className="block font-sans text-[10px] text-zinc-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                    {currentLanguage === Language.AR 
                      ? "يتيح لك هذا الخيار تخصيص بطانة القطع الداخلية بالحرير الطبيعي وتطريز الحروف الأولى لاسمك يدوياً داخل المعطف أو السترة مجاناً." 
                      : "Complimentary master tailor hand-stitch monogramming, customized premium silk inner lining, and exact fit measurements alterations."
                    }
                  </span>
                </div>
              </label>

              {isBespokeEnabled && (
                <div className="mt-4 pt-4 border-t border-amber-500/10 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in text-[11px]">
                  {/* Monogram letters */}
                  <div>
                    <label className="block font-sans text-[9px] uppercase tracking-widest text-[#a8a29e] mb-1 font-bold">
                      {currentLanguage === Language.AR ? "تطريز الحروف الأولى (مثال: ن.ع)" : "HAND-EMBROIDERED MONOGRAM (e.g., J.M)"}
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder={currentLanguage === Language.AR ? "أدخل حرفين أو ثلاثة" : "Up to 3 Letters"}
                      value={monogramLetters}
                      onChange={(e) => setMonogramLetters(e.target.value)}
                      className="w-full bg-white dark:bg-stone-900 border border-amber-500/20 rounded-xs py-2 px-3 text-xs focus:border-amber-500 outline-none font-mono text-neutral-950 dark:text-white"
                    />
                  </div>

                  {/* Lining Selector */}
                  <div>
                    <label className="block font-sans text-[9px] uppercase tracking-widest text-[#a8a29e] mb-1 font-bold">
                      {currentLanguage === Language.AR ? "نوع وخامة بطانة الحرير" : "PREMIUM SILK INNER LINING"}
                    </label>
                    <select
                      value={customLining}
                      onChange={(e) => setCustomLining(e.target.value)}
                      className="w-full bg-white dark:bg-stone-900 border border-amber-500/20 rounded-xs py-2 px-3 text-xs focus:border-amber-500 outline-none text-neutral-900 dark:text-stone-100"
                    >
                      <option value="Obsidian Silk">{currentLanguage === Language.AR ? "حرير أوبسيديان الأسود الملكي" : "Obsidian Imperial Black Silk"}</option>
                      <option value="Alabaster Satin">{currentLanguage === Language.AR ? "ساتان المرمر العاجي الفاخر" : "Alabaster Ivory Satin"}</option>
                      <option value="Sovereign Gold">{currentLanguage === Language.AR ? "حرير سيسيل الذهبي الإمبراطوري" : "Sovereign Gold Cecile Silk"}</option>
                    </select>
                  </div>

                  {/* Sizing alterations notes */}
                  <div className="sm:col-span-2">
                    <label className="block font-sans text-[9px] uppercase tracking-widest text-[#a8a29e] mb-1 font-bold">
                      {currentLanguage === Language.AR ? "تعليمات الخياطة وتعديلات الطول (أو تدوين قياسات الصدر والأكمام)" : "CUSTOM LENGTH ALTERATIONS, SLEEVE DETAILS & MEASUREMENTS"}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={currentLanguage === Language.AR ? "مثال: تقصير الأكمام بمقدار 2 سم، أو زيادة طول المعطف الكلي بمقدار 3 سم." : "e.g., Shorten sleeves by 1.5cm, add extra hidden compartment sleeve, or overall height fit requirements."}
                      value={customFittingNotes}
                      onChange={(e) => setCustomFittingNotes(e.target.value)}
                      className="w-full bg-white dark:bg-stone-900 border border-amber-500/20 rounded-xs py-2 px-3 text-xs focus:border-amber-500 outline-none text-neutral-950 dark:text-white font-sans"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment (Simulated credit card) */}
            <div>
              <label className="block font-sans text-[10px] tracking-widest uppercase text-neutral-550 dark:text-stone-400 mb-1.5 font-semibold flex items-center justify-between">
                <span>{t.paymentMethod}</span>
                <span className="flex space-x-1 items-center">
                  <Shield className="h-3 w-3 text-emerald-500 animate-pulse" />
                  <span className="font-mono text-[8px] text-emerald-650 dark:text-emerald-450 uppercase">
                    {currentLanguage === Language.AR ? "اتصال مشفر آمن بـ 256 بت SSL" : "256-Bit SSL Secured"}
                  </span>
                </span>
              </label>
              
              <div className="bg-neutral-50 dark:bg-stone-950/30 border border-neutral-220 dark:border-stone-800 rounded-xs p-4 space-y-4">
                <div className="relative">
                  <CreditCard className="h-4.5 w-4.5 absolute left-3 top-3.5 text-zinc-400" />
                  <input
                    id="checkout-input-cardnumber"
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    value={ccNumber}
                    onChange={(e) => setCcNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900 border border-neutral-250 dark:border-stone-800 text-xs text-neutral-900 dark:text-stone-100 font-mono outline-none focus:border-black dark:focus:border-white rounded-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    id="checkout-input-expiry"
                    type="text"
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    value={ccExpiry}
                    onChange={(e) => setCcExpiry(e.target.value)}
                    className="w-full py-3 px-4 bg-white dark:bg-stone-900 border border-neutral-250 dark:border-stone-800 text-xs text-neutral-900 dark:text-stone-100 font-mono outline-none focus:border-black dark:focus:border-white rounded-xs"
                  />
                  <input
                    id="checkout-input-cvc"
                    type="password"
                    required
                    placeholder="CVC"
                    maxLength={3}
                    value={ccCVC}
                    onChange={(e) => setCcCVC(e.target.value)}
                    className="w-full py-3 px-4 bg-white dark:bg-stone-900 border border-neutral-250 dark:border-stone-800 text-xs text-neutral-900 dark:text-stone-100 font-mono outline-none focus:border-black dark:focus:border-white rounded-xs"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Secure compliance disclaimer banner */}
          <div className="mt-6 flex space-x-2.5 items-start font-mono text-[9px] text-zinc-400 dark:text-stone-450 leading-relaxed">
            <Landmark className="h-4 w-4 text-zinc-400 dark:text-stone-400 flex-shrink-0" />
            <span>
              {currentLanguage === Language.AR ? (
                "بالنقر على 'تأكيد وإرسال الطلب'، فإنك توافق على شروط التفصيل اليدوي المخصصة للقطع وحساب مبالغ التأمين المعتمدة لنسيج الكوتور. تشمل جميع ملابس الأتيليه فترة تجريبية مخصصة مدتها 30 يوماً مع شحن سريع مجاني لك كافة أنحاء العالم عبر طائراتنا الشريكة."
              ) : (
                "By clicking \"Submit Atelier Order\", you approve charging of deposit with authorized credit institution. Handcrafted garments feature dedicated 30-day trial fitting with complementary global couriers."
              )}
            </span>
          </div>

          <button
            id="checkout-submit-order-btn"
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full bg-neutral-950 dark:bg-stone-100 hover:bg-neutral-900 dark:hover:bg-stone-200 text-white dark:text-neutral-950 py-4 text-xs font-medium uppercase tracking-widest rounded-sm transition-all transform active:scale-98 cursor-pointer disabled:opacity-40"
          >
            {isSubmitting 
              ? (currentLanguage === Language.AR ? "جاري معالجة معاملة التأمين الدقيق..." : "PROCESSING TRANSACTION DEPOT...") 
              : t.payNow.toUpperCase()
            }
          </button>
        </form>

        {/* Right Column: Order Summary Checklist */}
        <div className="w-full md:w-2/5 bg-neutral-50/70 dark:bg-stone-950/40 p-4 sm:p-6 md:p-8 lg:p-10 border-t md:border-t-0 md:border-l border-neutral-100 dark:border-stone-800 flex flex-col justify-between">
          <div>
            <h3 className="font-sans text-xs font-semibold tracking-widest uppercase mb-6 pb-2 border-b border-neutral-200 dark:border-stone-800 text-neutral-900 dark:text-stone-100">
              {t.orderBag}
            </h3>

            {/* Shopping bag list */}
            <div className="max-h-[30vh] overflow-y-auto space-y-4 mb-8 pr-1">
              {cartItems.map((item, idx) => (
                <div id={`checkout-summary-item-${item.product.id}-${idx}`} key={idx} className="flex space-x-3 text-xs leading-tight">
                  <div className="h-16 w-12 bg-neutral-200 dark:bg-stone-800 overflow-hidden flex-shrink-0 rounded-xs border dark:border-stone-830">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-medium text-neutral-800 dark:text-stone-100 truncate">{item.product.name}</h4>
                    <p className="font-mono text-[10px] text-zinc-400 dark:text-stone-450 mt-1 uppercase">
                      {currentLanguage === Language.AR ? `المقاس: ${item.selectedSize} · اللون: ${item.selectedColor.split(" ")[0]}` : `Size: ${item.selectedSize} · Color: ${item.selectedColor.split(" ")[0]}`}
                    </p>
                    <p className="font-sans text-[10px] text-neutral-500 dark:text-stone-300 mt-1">
                      {currentLanguage === Language.AR ? `الكمية: ${item.qty}` : `Qty: ${item.qty}`}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-neutral-900 dark:text-stone-100">
                    {formatPrice(
                      item.product.price * 
                      (1 - (item.product.discountPercentage || 0) / 100) * 
                      item.qty * 
                      conversionRate
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Symmetrical Pricing Layout lines */}
          <div className="space-y-3.5 border-t border-neutral-200 dark:border-stone-800 pt-6 text-neutral-800 dark:text-stone-200">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-neutral-500 dark:text-stone-400">
                {currentLanguage === Language.AR ? "المجموع الفرعي" : "Subtotal"}
              </span>
              <span className="font-mono font-medium text-neutral-900 dark:text-stone-100">{formatPrice(subtotalTransformed)}</span>
            </div>

            <div className="flex justify-between text-sm font-sans pt-3.5 border-t border-neutral-200 dark:border-stone-800">
              <span className="font-semibold text-neutral-900 dark:text-stone-100">{t.orderTotal}</span>
              <span className="font-mono font-bold text-neutral-950 dark:text-stone-50 text-base">{formatPrice(totalTransformed)}</span>
            </div>

            <div className="mt-4 p-4 bg-white/70 dark:bg-stone-900/60 border border-neutral-200 dark:border-stone-800 rounded-sm flex space-x-2.5 items-center">
              <Truck className="h-4.5 w-4.5 text-[#fb923c] dark:text-amber-500 flex-shrink-0" />
              <div className="font-mono text-[9px] text-zinc-500 dark:text-stone-400 leading-normal">
                <span className="font-bold text-neutral-800 dark:text-stone-200">
                  {currentLanguage === Language.AR ? "شحن جوي سريع مكفول" : "GUARANTEED AIR DELIVERY"}
                </span>
                <p>
                  {currentLanguage === Language.AR 
                    ? "الوصول المتوقع: خلال 2-3 أيام عمل بواسطة أسطول DHL Sovereign السريع والممتاز للهواء الملكي." 
                    : "Est: Arrival in 2-3 business days with DHL Sovereign express flight service."
                  }
                </p>
              </div>
            </div>

            {/* Premium Client Communication Buttons */}
            <div className="mt-6 border-t border-neutral-200/80 dark:border-stone-800 pt-5 space-y-3">
              <span className="font-mono text-[9px] tracking-widest text-[#a8a29e] dark:text-stone-450 uppercase font-bold block">
                CUSTOMER SERVICE / خدمة العملاء المباشرة
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${contactWhatsApp.replace(/[+\s()-]/g, "")}?text=مرحباً%20أتيليه%20كوتور!%20أود%20طلب%20تفصيل%20الملابس%20التالية:%20${encodeURIComponent(cartItems.map(item => `${item.product.name} (Qty: ${item.qty}, Size: ${item.selectedSize}, Color: ${item.selectedColor})`).join(", "))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-[10px] font-sans font-bold tracking-wider transition-all transform active:scale-97 text-center shadow-sm cursor-pointer"
                >
                  💬 واتساب
                </a>
                <a
                  href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}
                  className="flex items-center justify-center space-x-1.5 p-3 bg-neutral-900 dark:bg-stone-100 hover:bg-neutral-850 dark:hover:bg-stone-200 text-white dark:text-neutral-950 rounded-sm text-[10px] font-sans font-bold tracking-wider transition-all transform active:scale-97 text-center shadow-sm cursor-pointer"
                >
                  📞 اتصال تلفوني
                </a>
              </div>
              <p className="text-[9.5px] text-zinc-505 dark:text-stone-400 font-sans text-center leading-relaxed">
                تواصل معنا مباشرة لتأكيد المقاسات وتنسيق موعد مع المصمم الفني للعلامة التجارية.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
