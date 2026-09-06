import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "hi";

/**
 * Every user-facing string in the app lives here, keyed by a dot-path name.
 * Add a new string by adding one entry with both `en` and `hi` values, then
 * call `t("your.key")` anywhere inside <LanguageProvider>.
 *
 * Use `{{name}}` placeholders for dynamic values, e.g. t("home.fromSales", { count: 8 }).
 */
const translations = {
  "nav.home": { en: "Home", hi: "होम" },
  "nav.inventory": { en: "Inventory", hi: "इन्वेंटरी" },
  "nav.insights": { en: "Insights", hi: "इनसाइट्स" },
  "nav.profile": { en: "Profile", hi: "प्रोफ़ाइल" },
  "nav.addProduct": { en: "Add new product", hi: "नया उत्पाद जोड़ें" },

  "header.greeting": { en: "Namaste, {{name}}", hi: "नमस्ते, {{name}}" },

  "home.totalEarnings": { en: "Total earnings", hi: "कुल कमाई" },
  "home.monthlyGrowth": { en: "+12% this month", hi: "इस महीने +12%" },
  "home.fromSales": { en: "from {{count}} sales", hi: "{{count}} बिक्री से" },
  "home.myShop": { en: "My shop", hi: "मेरी दुकान" },
  "home.seeAll": { en: "See all", hi: "सभी देखें" },
  "home.shopNoticed": { en: "Your shop is getting noticed", hi: "आपकी दुकान पर ध्यान जा रहा है" },
  "home.newVisitors": {
    en: "{{count}} new visitors this week",
    hi: "इस सप्ताह {{count}} नए विज़िटर",
  },

  "inventory.title": { en: "Inventory", hi: "इन्वेंटरी" },
  "inventory.productsInShop": {
    en: "{{count}} products in your shop",
    hi: "आपकी दुकान में {{count}} उत्पाद",
  },
  "inventory.addProduct": { en: "Add product", hi: "उत्पाद जोड़ें" },
  "inventory.total": { en: "Total", hi: "कुल" },
  "inventory.searchPlaceholder": { en: "Search your products", hi: "अपने उत्पाद खोजें" },
  "inventory.filterAll": { en: "All", hi: "सभी" },
  "inventory.noMatchTitle": { en: "No products match", hi: "कोई उत्पाद नहीं मिला" },
  "inventory.noMatchSubtitle": {
    en: "Try a different search or filter.",
    hi: "अलग खोज या फ़िल्टर आज़माएँ।",
  },

  "insights.title": { en: "Insights", hi: "इनसाइट्स" },
  "insights.subtitle": {
    en: "How your shop is doing this month",
    hi: "इस महीने आपकी दुकान कैसा कर रही है",
  },
  "insights.totalEarnings": { en: "Total earnings", hi: "कुल कमाई" },
  "insights.growthHint": { en: "+12% vs last month", hi: "पिछले महीने से +12%" },
  "insights.sales": { en: "Sales", hi: "बिक्री" },
  "insights.salesHint": { en: "+2 this month", hi: "इस महीने +2" },
  "insights.visitors": { en: "Shop visitors", hi: "दुकान विज़िटर" },
  "insights.visitorsHint": { en: "4 new this week", hi: "इस सप्ताह 4 नए" },
  "insights.liveListings": { en: "Live listings", hi: "लाइव लिस्टिंग" },
  "insights.liveListingsHint": { en: "of {{count}} total", hi: "कुल {{count}} में से" },
  "insights.weeklyEarnings": { en: "Earnings, last 6 weeks", hi: "कमाई, पिछले 6 सप्ताह" },
  "insights.thisWeek": { en: "This week", hi: "इस सप्ताह" },
  "insights.bestSeller": { en: "Your best seller", hi: "आपकी सबसे ज़्यादा बिकने वाली वस्तु" },
  "insights.ratingAndViews": {
    en: "4.8 · 12 views this week",
    hi: "4.8 · इस सप्ताह 12 बार देखा गया",
  },

  "profile.verifiedArtisan": { en: "Verified artisan", hi: "सत्यापित कारीगर" },
  "profile.editProfile": { en: "Edit profile", hi: "प्रोफ़ाइल संपादित करें" },
  "profile.products": { en: "Products", hi: "उत्पाद" },
  "profile.sales": { en: "Sales", hi: "बिक्री" },
  "profile.rating": { en: "Rating", hi: "रेटिंग" },
  "profile.preferences": { en: "Preferences", hi: "प्राथमिकताएँ" },
  "profile.appLanguage": { en: "App language", hi: "ऐप की भाषा" },
  "profile.tapToSwitch": { en: "Tap to switch", hi: "बदलने के लिए टैप करें" },
  "profile.notifications": { en: "Notifications", hi: "सूचनाएं" },
  "profile.notificationsHint": {
    en: "New orders and messages",
    hi: "नए ऑर्डर और संदेश",
  },
  "profile.shareShop": { en: "Share your shop", hi: "अपनी दुकान शेयर करें" },
  "profile.shareShopHint": {
    en: "Send your shop link to buyers",
    hi: "खरीदारों को अपनी दुकान का लिंक भेजें",
  },
  "profile.helpSupport": { en: "Help & support", hi: "सहायता और समर्थन" },
  "profile.helpSupportHint": { en: "Guides and contact", hi: "गाइड और संपर्क" },
  "profile.logout": { en: "Log out", hi: "लॉग आउट" },

  "status.live": { en: "Live", hi: "लाइव" },
  "status.draft": { en: "Draft", hi: "ड्राफ़्ट" },

  "products.saree.name": { en: "Blue Silk Chanderi Saree", hi: "नीली रेशमी चंदेरी साड़ी" },
  "products.saree.detail": {
    en: "Hand-woven with gold zari threads",
    hi: "सोने की ज़री के धागों से हाथ से बुनी गई",
  },
  "products.vase.name": { en: "Terracotta Tribal Vase", hi: "टेराकोटा आदिवासी फूलदान" },
  "products.vase.detail": {
    en: "Voice cataloging in progress",
    hi: "आवाज़ से सूचीकरण जारी है",
  },
  "tag.aiOptimized": { en: "AI Optimized", hi: "AI अनुकूलित" },
  "tag.needAudio": { en: "Need Audio", hi: "ऑडियो चाहिए" },

  "addProduct.aiStudio": { en: "AI Studio", hi: "AI स्टूडियो" },
  "addProduct.close": { en: "Close AI Studio", hi: "AI स्टूडियो बंद करें" },
  "addProduct.step1Title": { en: "Step 1 · Add your photo", hi: "चरण 1 · अपनी फ़ोटो जोड़ें" },
  "addProduct.step1Subtitle": {
    en: "We remove the background and brighten it for you.",
    hi: "हम बैकग्राउंड हटाकर फ़ोटो को उजला बना देंगे।",
  },
  "addProduct.step2Title": {
    en: "Step 2 · Just speak about it",
    hi: "चरण 2 · बस इसके बारे में बोलें",
  },
  "addProduct.step2Subtitle": {
    en: "Speak in Hindi, Bengali, Marathi or English — we fill the form.",
    hi: "हिंदी, बंगाली, मराठी या अंग्रेज़ी में बोलें — हम फॉर्म भर देंगे।",
  },
  "addProduct.step3Title": { en: "Step 3 · Check the details", hi: "चरण 3 · विवरण जांचें" },
  "addProduct.step3Subtitle": {
    en: "Edit anything that does not look right.",
    hi: "जो सही न लगे उसे बदल दें।",
  },
  "addProduct.doneTitle": { en: "Your product is live", hi: "आपका उत्पाद लाइव है" },
  "addProduct.doneSubtitle": { en: "You can find it in My shop.", hi: "यह आपकी दुकान में मिलेगा।" },

  "addProduct.takeOrChoosePhoto": { en: "Take or choose a photo", hi: "फ़ोटो लें या चुनें" },
  "addProduct.aiShopReady": {
    en: "AI will make it shop-ready",
    hi: "AI इसे दुकान के लिए तैयार करेगा",
  },
  "addProduct.original": { en: "Original", hi: "मूल" },
  "addProduct.removingBackground": {
    en: "Removing background…",
    hi: "बैकग्राउंड हटाया जा रहा है…",
  },
  "addProduct.enhanced": {
    en: "Enhanced · background removed",
    hi: "बेहतर · बैकग्राउंड हटाया गया",
  },
  "addProduct.enhancing": { en: "Enhancing", hi: "बेहतर बनाया जा रहा है" },
  "addProduct.enhanceFallback": {
    en: "Enhancement unavailable · using original",
    hi: "सुधार उपलब्ध नहीं · मूल फ़ोटो का उपयोग",
  },
  "addProduct.changePhoto": { en: "Change photo", hi: "फ़ोटो बदलें" },
  "addProduct.shopReady": { en: "Shop-ready", hi: "दुकान के लिए तैयार" },

  "addProduct.listening": {
    en: "Listening… {{seconds}}s — tap when done",
    hi: "सुन रहे हैं… {{seconds}} सेकंड — पूरा होने पर टैप करें",
  },
  "addProduct.startRecording": { en: "Start recording", hi: "रिकॉर्डिंग शुरू करें" },
  "addProduct.stopRecording": { en: "Stop recording", hi: "रिकॉर्डिंग बंद करें" },
  "addProduct.tapDescribe": {
    en: "Tap and describe your product",
    hi: "टैप करें और अपने उत्पाद के बारे में बताएं",
  },
  "addProduct.voiceHint": {
    en: "Say the name, material, how long it took, and the price you want.",
    hi: "नाम, सामग्री, बनने में लगा समय, और कीमत बताएं।",
  },
  "addProduct.understandingVoice": {
    en: "Understanding your voice…",
    hi: "आपकी आवाज़ समझी जा रही है…",
  },
  "addProduct.fillingListing": {
    en: "Filling the listing for you",
    hi: "आपके लिए लिस्टिंग भरी जा रही है",
  },

  "addProduct.whatWeHeard": { en: "What we heard", hi: "हमने क्या सुना" },
  "addProduct.autoFilled": {
    en: "Auto-filled from your voice — edit if needed",
    hi: "आपकी आवाज़ से अपने आप भरा गया — ज़रूरत हो तो बदलें",
  },
  "addProduct.productName": { en: "Product name", hi: "उत्पाद का नाम" },
  "addProduct.description": { en: "Description", hi: "विवरण" },
  "addProduct.material": { en: "Material", hi: "सामग्री" },
  "addProduct.timeToMake": { en: "Time to make", hi: "बनने में समय" },
  "addProduct.priceLabel": { en: "Price (₹)", hi: "कीमत (₹)" },
  "addProduct.suggestedPrice": {
    en: "Suggested price ₹2,450 — buyers pay this for similar work",
    hi: "सुझाई गई कीमत ₹2,450 — खरीदार ऐसे काम के लिए इतना देते हैं",
  },
  "addProduct.listedAt": { en: "Listed at ₹{{price}}", hi: "₹{{price}} में सूचीबद्ध" },

  "addProduct.continueToVoice": { en: "Continue to voice", hi: "आवाज़ की ओर बढ़ें" },
  "addProduct.skipType": { en: "Skip and type it myself", hi: "छोड़ें, मैं खुद टाइप करूँगा" },
  "addProduct.publish": { en: "Publish to my shop", hi: "अपनी दुकान में प्रकाशित करें" },
  "addProduct.done": { en: "Done", hi: "हो गया" },
} as const;

export type TranslationKey = keyof typeof translations;

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/{{(.*?)}}/g, (_, key: string) => String(vars[key.trim()] ?? ""));
}

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const value = useMemo<LanguageContextValue>(() => {
    const t = (key: TranslationKey, vars?: Record<string, string | number>) =>
      interpolate(translations[key][language], vars);
    return {
      language,
      toggleLanguage: () => setLanguage((current) => (current === "en" ? "hi" : "en")),
      t,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside a <LanguageProvider>");
  }
  return context;
}
