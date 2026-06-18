import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, User, HelpCircle, Flame } from "lucide-react";
import { Product, CartItem, Language, TRANSLATIONS } from "../types";

interface StylistAssistantProps {
  currentLanguage: Language;
  isOpen: boolean;
  onClose: () => void;
  activeCart: CartItem[];
  currentItem: Product | null;
}

interface Message {
  role: "user" | "stylist";
  text: string;
}

export default function StylistAssistant({
  currentLanguage,
  isOpen,
  onClose,
  activeCart,
  currentItem
}: StylistAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "stylist",
      text: currentLanguage === Language.AR
        ? "مرحباً بكم في صالون الأتيليه الخاص للتنسيق الشخصي. أنا منسق الأزياء الشخصي الخاص بك لتقديم النصائح الكلاسيكية وتنسيق ملابس السهرة الفاخرة والقصات المناسبة لك. تفضل بطرح أسئلتك حول الأقمشة، الطبقات، والقصات."
        : "Welcome to the Atelier Private Styling Lounge. I am your personal fashion coordinate assistant. Ask me questions on garment pairing, fabric drapes, fit scaling, or layering."
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[currentLanguage];

  // Quick advice chips for easy tapping
  const RECOMMENDED_QUERIES = [
    "Recommend a layered coat outfit",
    "Describe wool vs cashmere fabric texture",
    "How does the tailored blazer fit?",
    "Recommend items to complete the look"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputVal;
    if (!textToSend.trim()) return;

    if (!customText) setInputVal("");
    
    // Add user message to chat state
    const userMsg: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Call our Express server endpoint which talks securely to the Gemini SDK
      const response = await fetch("/api/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          activeCart: activeCart.map((item) => ({ name: item.product.name, qty: item.qty })),
          currentItem: currentItem
        })
      });

      if (!response.ok) {
        throw new Error("Styling service temporarily unavailable.");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "stylist", text: data.response }]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "stylist",
          text: "Atelier workshops are currently under severe demand. We suggest pairing our Double-Breasted Wool coat with organic trousers for an immediate sleek result."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="stylist-sidebar-backdrop" className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex justify-end">
      
      {/* Sidebar Panel container */}
      <div 
        id="stylist-sidebar-panel"
        className="w-full max-w-md bg-white dark:bg-stone-900 text-zinc-900 dark:text-stone-100 h-full shadow-2xl flex flex-col justify-between border-l border-neutral-100 dark:border-stone-800 animate-slide-in"
      >
        
        {/* Header bar */}
        <div className="p-5 border-b border-neutral-100 dark:border-stone-800 flex justify-between items-center bg-stone-900 text-white">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="h-4 w-4 text-stone-200 animate-pulse" />
            <div>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-neutral-50 mb-0.5">
                {t.stylistName}
              </h3>
              <p className="font-mono text-[9px] text-stone-400">
                AURA CODES & ARTISAN COUTURE GUIDE
              </p>
            </div>
          </div>
          <button
            id="stylist-close-btn"
            onClick={onClose}
            className="text-stone-300 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current contextual indicator */}
        {(currentItem || activeCart.length > 0) && (
          <div className="bg-stone-50 dark:bg-stone-950 px-5 py-2.5 border-b border-neutral-150 dark:border-stone-800 font-mono text-[9px] text-zinc-500 dark:text-stone-400 tracking-wide flex flex-col space-y-1">
            {currentItem && (
              <div className="flex items-center space-x-1 justify-between">
                <span>Inspecting: <strong className="text-black dark:text-stone-100">{currentItem.name}</strong></span>
              </div>
            )}
            {activeCart.length > 0 && (
              <span>Bag Status: <strong className="text-black dark:text-stone-100">{activeCart.length} item(s) present</strong></span>
            )}
          </div>
        )}

        {/* Chat History Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-neutral-50/50 dark:bg-stone-950/20">
          
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%] flex space-x-2.5">
                
                {m.role === "stylist" && (
                  <div className="h-7 w-7 bg-zinc-900 dark:bg-stone-800 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-neutral-250 dark:border-stone-700 animate-pulse">
                    <Sparkles className="h-3.5 w-3.5 text-stone-200" />
                  </div>
                )}
                
                <div className={`p-4 rounded-sm text-[11.5px] line-clamp-none whitespace-pre-line leading-relaxed font-sans shadow-xs ${m.role === "user" ? "bg-neutral-900 dark:bg-stone-100 text-white dark:text-neutral-950 font-light rounded-tr-none" : "bg-white dark:bg-stone-900 border border-neutral-150/70 dark:border-stone-800 text-zinc-800 dark:text-stone-200 rounded-tl-none font-normal"}`}>
                  {m.text}
                </div>

              </div>
            </div>
          ))}

          {/* Loading bubble placeholder */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] flex space-x-2.5 items-center">
                <div className="h-7 w-7 bg-zinc-900 dark:bg-stone-800 rounded-full flex items-center justify-center flex-shrink-0 animate-spin">
                  <Sparkles className="h-3.5 w-3.5 text-stone-200 animate-pulse" />
                </div>
                <div className="p-3.5 bg-neutral-150 dark:bg-stone-800 text-xs font-mono text-zinc-400 dark:text-stone-400 tracking-wider rounded-sm rounded-tl-none">
                  Drafting styling advice...
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Recommended Suggestion chips */}
        <div className="p-4 border-t border-neutral-100 dark:border-stone-800 bg-white dark:bg-stone-900">
          <span className="font-mono text-[8px] tracking-widest text-[#a8a29e] dark:text-stone-500 uppercase block mb-2">
            CONCIERGE RECOMMENDED TOPICS:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pb-1">
            {RECOMMENDED_QUERIES.map((q) => (
              <button
                id={`stylist-chip-${q.replace(/\s+/g, "-").toLowerCase().slice(0, 20)}`}
                key={q}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="bg-neutral-50 dark:bg-stone-850 hover:bg-neutral-900 dark:hover:bg-stone-100 hover:text-white dark:hover:text-stone-950 transition-all text-zinc-650 dark:text-stone-300 px-2.5 py-1 text-[9.5px] font-mono tracking-wide rounded-full border border-neutral-200 dark:border-stone-800 cursor-pointer disabled:opacity-50 inline-block"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 border-t border-neutral-100 dark:border-stone-800 bg-neutral-50 dark:bg-stone-950/40 flex items-center space-x-2.5">
          <input
            id="stylist-text-input"
            type="text"
            placeholder={t.stylistPlaceholder}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-white dark:bg-stone-900 border border-neutral-205 dark:border-stone-800 rounded-sm py-3 px-4 text-xs font-sans text-neutral-800 dark:text-stone-100 tracking-wide placeholder-neutral-450 dark:placeholder-stone-500 focus:outline-none focus:border-neutral-900 dark:focus:border-white focus:ring-1 focus:ring-neutral-950"
          />
          <button
            id="stylist-submit-send"
            onClick={() => handleSendMessage()}
            disabled={!inputVal.trim() || isLoading}
            className="bg-neutral-950 dark:bg-stone-100 hover:bg-neutral-900 dark:hover:bg-stone-200 text-white dark:text-neutral-950 p-3 rounded-full transition-transform active:scale-90 cursor-pointer disabled:opacity-30 disabled:scale-100 animate-fade-in"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
