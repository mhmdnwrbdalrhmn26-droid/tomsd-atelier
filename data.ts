import { Product, Category } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "coat-01",
    name: "Architectural Double-Breasted Wool Coat",
    category: Category.Outerwear,
    price: 490,
    description: "An oversized double-breasted coat crafted from ultra-dense Italian virgin wool. Features statement drop shoulders, clean raw-edge construction, and broad notch lapels. Engineered to create a dramatic architectural column silhouette without packing weight.",
    fabric: "85% Virgin Wool, 15% Cashmere Blend",
    fit: "Oversized structural fit",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Atelier Carbon", "Alabaster White", "Warm Taupe"],
    colorHexes: {
      "Atelier Carbon": "#1f2937",
      "Alabaster White": "#f3f4f6",
      "Warm Taupe": "#a8a29e"
    },
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=700", // main
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=700"  // alt
    ],
    completeTheLookIds: ["knit-01", "trousers-01", "boots-01"],
    curatedQuote: "The crown jewel of our tailoring workshop, focusing on perfect weight distribution and a sweeping architectural hem."
  },
  {
    id: "trench-01",
    name: "Minimalist Cashmere Trench Overcoat",
    category: Category.Outerwear,
    price: 580,
    description: "A purified, unlined wrap trench belt coat with elegant long lines. Exquisitely soft cashmere knit composition that flows and ripples gracefully with motion. Zero exposed hardware for complete visual minimalism.",
    fabric: "70% Organic Mercerized Cashmere, 30% Mulberry Silk",
    fit: "Relaxed fluid silhouette",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Stone Gray", "Atelier Carbon", "Desert Sand"],
    colorHexes: {
      "Stone Gray": "#78716c",
      "Atelier Carbon": "#111827",
      "Desert Sand": "#d7ccc8"
    },
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=700",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=700"
    ],
    completeTheLookIds: ["dress-01", "boots-01"],
    curatedQuote: "Softness designed to be felt. It wears like a protective yet delicate second-skin blanket of luxury texture."
  },
  {
    id: "knit-01",
    name: "Unisex heavy Cashmere Mockneck Sweater",
    category: Category.Knitwear,
    price: 290,
    description: "A heavy-gauge mockneck sweater styled with a structural stand-up collar. Sourced from high-altitude regenerative cashmere farms. Softly brushed surface and dense ribbed cuffs for an absolute snug premium hand-feel.",
    fabric: "100% Pure Grade-A Cashmere",
    fit: "Boxy relaxed drape",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Alabaster White", "Stone Gray", "Midnight Obsidian"],
    colorHexes: {
      "Alabaster White": "#f9fafb",
      "Stone Gray": "#6b7280",
      "Midnight Obsidian": "#0f172a"
    },
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=700",
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=700"
    ],
    completeTheLookIds: ["trousers-02", "boots-01"],
    curatedQuote: "A heavy-weight sweater with a structured neck that keeps its architectural shape through generations."
  },
  {
    id: "blazer-01",
    name: "Structured Tailored Blazer",
    category: Category.Tailoring,
    price: 360,
    description: "A pristine tailored blazer with sharp, padded shoulders and a modern single-button overlap closure. Lined with premium breathability Bemberg lining. Minimalist welt waist pockets and custom-cast hidden horn fasteners.",
    fabric: "90% Worsted Merino Wool, 10% Linen",
    fit: "Sharp tailored fit",
    sizes: ["S", "M", "L"],
    colors: ["Atelier Carbon", "Stone Gray"],
    colorHexes: {
      "Atelier Carbon": "#1f2937",
      "Stone Gray": "#737373"
    },
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=700",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=700"
    ],
    completeTheLookIds: ["trousers-01", "knit-01"],
    curatedQuote: "An anchor piece for the contemporary minimalist. Blends traditional masculine tailoring with effortless elegant lines."
  },
  {
    id: "trousers-01",
    name: "Organic Linen Pleated Trousers",
    category: Category.Tailoring,
    price: 195,
    description: "Sleek high-waisted trousers with double forward-facing pleats and a relaxed wide leg profile. Loomed from certified organic Belgian flax. Perfectly drapes over sneakers or point boots, offering superb organic ventilation.",
    fabric: "100% Certified Organic Belgian Linen",
    fit: "Wide-leg fluid fit",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Warm Taupe", "Atelier Carbon", "Alabaster White"],
    colorHexes: {
      "Warm Taupe": "#a8a29e",
      "Atelier Carbon": "#111827",
      "Alabaster White": "#f9fafb"
    },
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=700",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=700"
    ],
    completeTheLookIds: ["blazer-01", "knit-01"],
    curatedQuote: "Belgian flax loomed at a moderate density to remain cool, while holding a pristine, structural pressed crease."
  },
  {
    id: "trousers-02",
    name: "Cashmere Ribbed Knit Lounge Pants",
    category: Category.Loungewear,
    price: 240,
    description: "Cozy knit-to-shape loungewear trousers featuring a comfortable wide elastic waistband and subtle modern rib stitch. An elevated approach to indoor comfort that looks equally immaculate for high-street walks.",
    fabric: "90% Organic Cashmere, 10% Lycra for shape retention",
    fit: "Relaxed slouchy drapery",
    sizes: ["S", "M", "L"],
    colors: ["Desert Sand", "Atelier Carbon"],
    colorHexes: {
      "Desert Sand": "#e5e5e5",
      "Atelier Carbon": "#1f2937"
    },
    images: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=700",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=700"
    ],
    completeTheLookIds: ["knit-01", "boots-01"],
    curatedQuote: "The art of non-effort. Uncompromising comfort tailored beautifully to keep the lines sharp and sophisticated."
  },
  {
    id: "boots-01",
    name: "Architectural Calfskin Chelsea Boots",
    category: Category.Loungewear, // styled as lifestyle accessory
    price: 380,
    description: "Premium smooth full-grain calfskin boots in a flawless high pull-on ankle height. Custom-sculpted chisel toe profile, micro-stacked custom leather heel, and flexible elasticized side core vents. Built in Italy with traditional Blake-stitch longevity.",
    fabric: "100% Full-Grain Calfskin Leather",
    fit: "True to structural scale",
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: ["Midnight Obsidian", "Stone Gray"],
    colorHexes: {
      "Midnight Obsidian": "#090d16",
      "Stone Gray": "#57534e"
    },
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=700",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=700"
    ],
    completeTheLookIds: ["coat-01", "trousers-01"],
    curatedQuote: "A premium leather anchor. It instantly pulls relaxed clothing into a formal, highly styled architectural statement."
  },
  {
    id: "dress-01",
    name: "Sateen Flowing Slip Dress",
    category: Category.Tailoring,
    price: 320,
    description: "An elegant minimal slip dress cut on the bias from high-sheen satin. Falls to a beautiful midi hem with spaghetti straps and a subtle scoop neckline. Simple elegance at its most pure and absolute form.",
    fabric: "100% Mulberry Silk Crepe Satin",
    fit: "Fluid body-skimming fit",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Stone Gray", "Alabaster White"],
    colorHexes: {
      "Stone Gray": "#525252",
      "Alabaster White": "#fafafa"
    },
    images: [
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=700",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=700"
    ],
    completeTheLookIds: ["trench-01", "boots-01"],
    curatedQuote: "A master class in bias-cutting. The fluid mulberry silk catches light from multiple angles, creating a quiet yet radiant aura."
  }
];
