import React, { useState } from "react";
import { Truck, Check, Package, MapPin, Search, Clipboard, Navigation, Ship } from "lucide-react";
import { Language, TRANSLATIONS } from "../types";

interface OrderTrackerProps {
  currentLanguage: Language;
  initialTrackingId?: string;
  onBackToShop: () => void;
}

interface TrackingStep {
  status: string;
  date: string;
  detail: string;
  completed: boolean;
  active: boolean;
  icon: any;
}

export default function OrderTracker({
  currentLanguage,
  initialTrackingId = "",
  onBackToShop
}: OrderTrackerProps) {
  const [searchVal, setSearchVal] = useState(initialTrackingId || "ATL-502941");
  const [searchedId, setSearchedId] = useState(initialTrackingId || "ATL-502941");
  const t = TRANSLATIONS[currentLanguage];

  // Mock database entries for tracking
  const MOCK_TRACKING_DB: { [key: string]: { steps: TrackingStep[]; location: string; estimate: string } } = {
    "ATL-502941": {
      location: "Copenhagen Central Logistics Hub, Denmark",
      estimate: "May 30, 2026 (In 2 Days)",
      steps: [
        { status: "Order Registered", date: "May 28, 2026 - 13:04", detail: "Authorized transaction deposit checked.", completed: true, active: false, icon: Check },
        { status: "Atelier Packing", date: "May 28, 2026 - 14:30", detail: "Garments selected, steamer treated, premium box sealed.", completed: true, active: false, icon: Package },
        { status: "In Transit", date: "May 29, 2026 - 06:15", detail: "DHL flight sovereign clearance completed.", completed: true, active: true, icon: Ship },
        { status: "Out for Courier", date: "Pending", detail: "Awaiting destination depot arrival.", completed: false, active: false, icon: Truck },
        { status: "Delivered", date: "Pending", detail: "Signature release confirmation.", completed: false, active: false, icon: MapPin }
      ]
    },
    "ATL-992015": {
      location: "Paris Charles de Gaulle Air Port depot, France",
      estimate: "May 29, 2026 (Tomorrow)",
      steps: [
        { status: "Order Registered", date: "May 27, 2026 - 09:12", detail: "Depot order queued.", completed: true, active: false, icon: Check },
        { status: "Atelier Packing", date: "May 27, 2026 - 11:45", detail: "Custom linen bags wrapped.", completed: true, active: false, icon: Package },
        { status: "In Transit", date: "May 28, 2026 - 05:00", detail: "En route to Paris Hub flight.", completed: true, active: false, icon: Ship },
        { status: "Out for Courier", date: "May 28, 2026 - 12:45", detail: "Loaded to sovereign electric van courier.", completed: true, active: true, icon: Truck },
        { status: "Delivered", date: "Pending", detail: "Requires direct address sign-off.", completed: false, active: false, icon: MapPin }
      ]
    }
  };

  const activeData = MOCK_TRACKING_DB[searchedId] || {
    location: "Unknown / Processing Atelier Receipt",
    estimate: "Evaluating package clearance (2-4 Days)",
    steps: [
      { status: "Order Registered", date: "Just now", detail: "Awaiting full institutional confirmation.", completed: true, active: true, icon: Check },
      { status: "Atelier Packing", date: "Queued", detail: "Awaiting next tailoring pack-out queue.", completed: false, active: false, icon: Package },
      { status: "In Transit", date: "Queued", detail: "Courier air assignment pending.", completed: false, active: false, icon: Ship },
      { status: "Out for Courier", date: "Queued", detail: "Awaiting local depot handoff.", completed: false, active: false, icon: Truck },
      { status: "Delivered", date: "Queued", detail: "Courier handoff.", completed: false, active: false, icon: MapPin }
    ]
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSearchedId(searchVal.trim());
    }
  };

  return (
    <div id="tracker-section" className="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-neutral-800 dark:text-stone-100">
      
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-450 dark:text-stone-400 uppercase block mb-3">
          DELIVERY METRICS & AIR FLEET
        </span>
        <h2 className="font-sans text-3xl font-light tracking-wide uppercase text-neutral-900 dark:text-stone-100 mb-4">
          Atelier Sovereign Tracking
        </h2>
        <p className="font-sans font-light text-xs text-neutral-600 dark:text-stone-300 leading-relaxed">
          Follow your signature monochrome garments from our Copenhagen design studio directly to your wardrobe.
        </p>
      </div>

      {/* Tracking Search Input field */}
      <form 
        id="tracker-search-form"
        onSubmit={handleSearchSubmit} 
        className="max-w-lg mx-auto bg-white dark:bg-stone-900 border border-neutral-250 dark:border-stone-800 p-1.5 flex items-center space-x-3 rounded-xs mb-12 shadow-sm focus-within:border-neutral-900 dark:focus-within:border-stone-200 transition-all"
      >
        <Search className="h-4 w-4 text-neutral-400 pl-1 w-5" />
        <input
          id="tracker-search-input"
          type="text"
          placeholder="Enter Atelier Tracking ID (e.g., ATL-502941)"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="flex-1 bg-transparent border-none text-xs text-neutral-800 dark:text-stone-100 tracking-wider font-mono outline-none py-2"
        />
        <button
          id="tracker-submit-btn"
          type="submit"
          className="bg-neutral-900 dark:bg-stone-100 hover:bg-neutral-800 dark:hover:bg-stone-200 text-white dark:text-neutral-950 font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-xs transition-colors cursor-pointer"
        >
          QUERY ID
        </button>
      </form>

      {/* Interactive Board */}
      <div id="tracker-board" className="bg-white dark:bg-stone-900 border border-neutral-100 dark:border-stone-800 rounded-sm p-6 sm:p-10 shadow-xl shadow-neutral-100 dark:shadow-none mb-10">
        
        {/* Info panel header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-8 border-b border-neutral-100 dark:border-stone-800 mb-10 text-xs text-neutral-800 dark:text-stone-200">
          <div>
            <span className="text-neutral-400 dark:text-stone-500 font-sans block mb-1">ATELIER ID</span>
            <span className="font-mono font-bold text-neutral-900 dark:text-stone-100 tracking-widest flex items-center space-x-1">
              <Clipboard className="h-3.5 w-3.5 text-zinc-400" />
              <span>{searchedId}</span>
            </span>
          </div>
          <div>
            <span className="text-neutral-400 dark:text-stone-500 font-sans block mb-1">SOVEREIGN ESTIMATE</span>
            <span className="font-sans font-semibold text-neutral-900 dark:text-stone-100 tracking-wide">
              {activeData.estimate}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 dark:text-stone-500 font-sans block mb-1">CURRENT DEPOT</span>
            <span className="font-sans font-medium text-neutral-900 dark:text-stone-100 truncate tracking-wide flex items-center space-x-1">
              <Navigation className="h-3.5 w-3.5 text-stone-500 flex-shrink-0" />
              <span>{activeData.location.split(",")[0]}</span>
            </span>
          </div>
        </div>

        {/* Vertical Timeline Progression */}
        <div id="tracker-timeline" className="relative pl-8 border-l border-neutral-200 dark:border-stone-800 ml-3 space-y-10">
          
          {activeData.steps.map((step, idx) => {
            const IconComp = step.icon;
            
            return (
              <div id={`tracking-step-${idx}`} key={idx} className="relative animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
                
                {/* Node icon */}
                <div 
                  id={`tracking-node-${idx}`}
                  className={`absolute -left-[45px] top-0 h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    step.completed 
                      ? "bg-neutral-900 dark:bg-stone-100 border-neutral-950 dark:border-stone-100 text-white dark:text-neutral-950" 
                      : step.active 
                        ? "bg-white dark:bg-stone-850 border-neutral-900 dark:border-stone-200 text-neutral-900 dark:text-stone-100 ring-4 ring-neutral-100 dark:ring-stone-800/40 animate-pulse" 
                        : "bg-white dark:bg-stone-900 border-neutral-200 dark:border-stone-850 text-zinc-300 dark:text-stone-605"
                  }`}
                >
                  <IconComp className="h-4.5 w-4.5" />
                </div>

                {/* Text attributes */}
                <div className="pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-1">
                    <h4 className={`text-sm tracking-wide uppercase ${step.completed || step.active ? "font-semibold text-neutral-900 dark:text-stone-100" : "font-light text-zinc-400 dark:text-stone-500"}`}>
                      {step.status}
                    </h4>
                    <span className="font-mono text-[10px] text-zinc-400 dark:text-stone-500">
                      {step.date}
                    </span>
                  </div>
                  <p className={`text-xs ${step.completed || step.active ? "text-neutral-550 dark:text-stone-300" : "text-zinc-350 dark:text-stone-605"}`}>
                    {step.detail}
                  </p>
                </div>

              </div>
            );
          })}

        </div>

      </div>

      <div className="text-center">
        <button
          id="tracker-back-shop-btn"
          onClick={onBackToShop}
          className="font-mono text-[10px] text-neutral-900 dark:text-stone-105 hover:text-neutral-500 dark:hover:text-stone-300 font-bold tracking-widest uppercase py-3 px-6 border border-neutral-900 dark:border-stone-100 cursor-pointer hover:bg-neutral-50 dark:hover:bg-stone-855 transition-colors"
        >
          RETURN TO ATELIER BOUTIQUE
        </button>
      </div>

    </div>
  );
}
