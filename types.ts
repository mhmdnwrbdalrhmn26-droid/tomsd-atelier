export enum Category {
  Outerwear = "Outerwear",
  Tailoring = "Tailoring",
  Knitwear = "Knitwear",
  Loungewear = "Loungewear",
  TShirts = "T-shirts",
  Jeans = "Jeans & Denim",
  Shoes = "Shoes & Footwear",
  Hats = "Hats & Headwear"
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number; // in USD base
  description: string;
  fabric: string;
  fit: string;
  sizes: string[];
  colors: string[]; // friendly label e.g., "Obsidian Black"
  colorHexes: { [key: string]: string }; // Hex map for elegant color dots
  images: string[]; // editorial image links (0 is main, 1 is alternative hover)
  completeTheLookIds: string[]; // matching complementary IDs
  curatedQuote: string; // design atelier specific remark
  stockCount?: number; // remaining pieces available
  discountPercentage?: number; // discount offer (e.g. 15 for 15% off)
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  qty: number;
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
  CAD = "CAD",
  EGP = "EGP",
  SAR = "SAR"
}

export const CURRENCY_SYMBOLS: { [key in Currency]: string } = {
  [Currency.USD]: "$",
  [Currency.EUR]: "€",
  [Currency.GBP]: "£",
  [Currency.JPY]: "¥",
  [Currency.CAD]: "CA$",
  [Currency.EGP]: "EGP ",
  [Currency.SAR]: "SAR "
};

export const CURRENCY_RATES: { [key in Currency]: number } = {
  [Currency.USD]: 1.0,
  [Currency.EUR]: 0.92,
  [Currency.GBP]: 0.79,
  [Currency.JPY]: 155.0,
  [Currency.CAD]: 1.37,
  [Currency.EGP]: 47.95,
  [Currency.SAR]: 3.75
};

export enum Language {
  EN = "EN",
  FR = "FR",
  DE = "DE",
  JA = "JA",
  AR = "AR"
}

export const LANGUAGE_LABELS: { [key in Language]: string } = {
  [Language.EN]: "English",
  [Language.FR]: "Français",
  [Language.DE]: "Deutsch",
  [Language.JA]: "日本語",
  [Language.AR]: "العربية"
};

// UI Translations
export const TRANSLATIONS = {
  [Language.EN]: {
    brandName: "TOMSD ATELIER",
    tagline: "ARCHITECTURAL FORM & SILENT LUXURY",
    heroHeading: "The Summer Atelier Collection",
    heroSubtitle: "A study in structure, drape, and premium organic textiles.",
    shopCollection: "Shop Collection",
    newArrivals: "New Arrivals",
    bestSellers: "Atelier Favorites",
    categories: "Collections",
    allProducts: "All Masterpieces",
    filterSize: "Size",
    filterColor: "Color Palette",
    filterFit: "Silhouette Fit",
    filterFabric: "Fabric Composition",
    filterPrice: "Max Price",
    addToCart: "Add to Atelier Bag",
    addedToCart: "Added",
    sizeGuide: "Atelier Size Guide",
    completeLook: "Complete the Look",
    complimentaryAdvice: "Atelier Curation Advice",
    oneStepCheckout: "Atelier 1-Step Checkout",
    orderBag: "Atelier Shopping Bag",
    orderTotal: "Atelier Total",
    shippingAddress: "Shipping Destination",
    paymentMethod: "Payment Profile",
    payNow: "Submit Atelier Order",
    trackingId: "Atelier Tracking Number",
    orderPlaced: "Order Registered",
    atelierPreparing: "Atelier Packing",
    shipped: "In Transit",
    delivered: "Delivered",
    stylistName: "Atelier Personal Stylist",
    stylistPlaceholder: "Ask our in-house stylist about fit, layering, fabric drape..."
  },
  [Language.FR]: {
    brandName: "TOMSD ATELIER",
    tagline: "FORME ARCHITECTURALE & LUXE SILENCIEUX",
    heroHeading: "La Collection Été Atelier",
    heroSubtitle: "Une étude sur la structure, le drapé et les textiles biologiques d'exception.",
    shopCollection: "Découvrir la Collection",
    newArrivals: "Nouveautés",
    bestSellers: "Favoris de l'Atelier",
    categories: "Collections",
    allProducts: "Tous les Chefs-d'œuvre",
    filterSize: "Taille",
    filterColor: "Palette de Couleurs",
    filterFit: "Coupe Silhouette",
    filterFabric: "Composition Tissus",
    filterPrice: "Prix Maximum",
    addToCart: "Ajouter au Sac Atelier",
    addedToCart: "Ajouté",
    sizeGuide: "Guide des Tailles",
    completeLook: "Compléter le Look",
    complimentaryAdvice: "Conseil de Curation",
    oneStepCheckout: "Paiement en 1 Étape",
    orderBag: "Votre Sac d'Achat",
    orderTotal: "Total Atelier",
    shippingAddress: "Adresse de Livraison",
    paymentMethod: "Mode de Paiement",
    payNow: "Valider la Commande",
    trackingId: "Numéro de Suivi",
    orderPlaced: "Commande Validée",
    atelierPreparing: "Préparation Atelier",
    shipped: "En Transit",
    delivered: "Livré",
    stylistName: "Styliste Personnel de l'Atelier",
    stylistPlaceholder: "Demandez à notre styliste la coupe, les matières, les drapés..."
  },
  [Language.DE]: {
    brandName: "TOMSD ATELIER",
    tagline: "ARCHITEKTONISCHE FORM & STILLE LUXUS",
    heroHeading: "Die Atelier Sommer-Kollektion",
    heroSubtitle: "Eine Studie in Struktur, Faltenwurf und organischen Premium-Textilien.",
    shopCollection: "Kollektion Entdecken",
    newArrivals: "Neuheiten",
    bestSellers: "Atelier Favoriten",
    categories: "Kollektionen",
    allProducts: "Alle Meisterwerke",
    filterSize: "Größe",
    filterColor: "Farbpalette",
    filterFit: "Silhouette Passform",
    filterFabric: "Stoffzusammensetzung",
    filterPrice: "Maximaler Preis",
    addToCart: "In die Atelier Tasche legen",
    addedToCart: "Hinzugefügt",
    sizeGuide: "Größentabelle",
    completeLook: "Vervollständige den Look",
    complimentaryAdvice: "Kuratorische Ratschläge",
    oneStepCheckout: "1-Schritt Kasse",
    orderBag: "Einkaufstasche",
    orderTotal: "Gesamtsumme",
    shippingAddress: "Lieferadresse",
    paymentMethod: "Zahlungsprofil",
    payNow: "Bestellung Absenden",
    trackingId: "Atelier Sendungsnummer",
    orderPlaced: "Bestellung Eingegangen",
    atelierPreparing: "Atelier Verpackung",
    shipped: "Unterwegs",
    delivered: "Zugestellt",
    stylistName: "Persönlicher Atelier-Stylist",
    stylistPlaceholder: "Fragen Sie unseren Stylisten nach Schnitt, Stoffen und Lagen..."
  },
  [Language.JA]: {
    brandName: "TOMSD ATELIER",
    tagline: "建築学的フォルム と 静かなるラグジュアリー",
    heroHeading: "サマー・アトリエ・コレクション",
    heroSubtitle: "構造、ドレープ、端麗なオーガニックテキスタイルへの探求。",
    shopCollection: "コレクションを見る",
    newArrivals: "新作",
    bestSellers: "アトリエの定番",
    categories: "カテゴリー",
    allProducts: "すべての逸品",
    filterSize: "サイズ",
    filterColor: "カラーパレット",
    filterFit: "シルエット・フィット",
    filterFabric: "布地の組成",
    filterPrice: "上限価格",
    addToCart: "アトリエバッグに追加する",
    addedToCart: "追加済み",
    sizeGuide: "サイズガイド",
    completeLook: "トータルコーディネート",
    complimentaryAdvice: "コーディネートアドバイス",
    oneStepCheckout: "ワンスレッド決済",
    orderBag: "ショッピングバッグ",
    orderTotal: "アトリエ総額",
    shippingAddress: "お届け先住所",
    paymentMethod: "お支払い方法",
    payNow: "アトリエ注文を送信する",
    trackingId: "追跡番号",
    orderPlaced: "受注完了",
    atelierPreparing: "アトリエ荷造り",
    shipped: "配送中",
    delivered: "配達完了",
    stylistName: "アトリエ パーソナルスタイリスト",
    stylistPlaceholder: "サイズ感、レイヤリング、生地のドレープなどをお気軽にお尋ねください..."
  },
  [Language.AR]: {
    brandName: "TOMSD ATELIER",
    tagline: "الشكل الهيكلي والرفاهية الصامتة",
    heroHeading: "تشكيلة الصيف من الأتيليه",
    heroSubtitle: "دراسة في البنية والقصات المنسدلة والمنسوجات العضوية الفاخرة.",
    shopCollection: "تسوق المجموعة",
    newArrivals: "وصل حديثاً",
    bestSellers: "القطع المفضلة",
    categories: "المجموعات",
    allProducts: "روائع الأتيليه",
    filterSize: "المقاس",
    filterColor: "مجموعة الألوان",
    filterFit: "القصة والمظهر",
    filterFabric: "تكوين القماش",
    filterPrice: "الحد الأقصى للسعر",
    addToCart: "إضافة إلى حقيبة الأتيليه",
    addedToCart: "تمت الإضافة",
    sizeGuide: "دليل المقاسات",
    completeLook: "أكمل المظهر المنسق",
    complimentaryAdvice: "نصيحة المنسق الشخصي",
    oneStepCheckout: "الدفع السريع بخطوة واحدة",
    orderBag: "حقيبة تسوق الأتيليه",
    orderTotal: "إجمالي الأتيليه",
    shippingAddress: "عنوان الشحن",
    paymentMethod: "ملف الدفع",
    payNow: "تأكيد وإرسال الطلب",
    trackingId: "رقم التتبع للطلب",
    orderPlaced: "تم تسجيل الطلب",
    atelierPreparing: "تغليف وتجهيز الأتيليه",
    shipped: "في الطريق إليك",
    delivered: "تم التوصيل بنجاح",
    stylistName: "المنسق الشخصي للأتيليه",
    stylistPlaceholder: "اسأل منسقنا الشخصي عن القصات، تنسيق الملابس، الخامات..."
  }
};
