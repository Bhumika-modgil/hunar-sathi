import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Camera,
  ChevronRight,
  CircleUserRound,
  Eye,
  Globe,
  HelpCircle,
  House,
  Languages,
  LogOut,
  Package,
  Pencil,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts";

import avatar from "@/assets/artisan-avatar.jpg";
import saree from "@/assets/blue-silk-saree.jpg";
import vase from "@/assets/terracotta-vase.jpg";
import { AddProductFlow, type FlowStep, type NewProduct } from "@/components/AddProductFlow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LanguageProvider, useLanguage, type TranslationKey } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kaarigar Saathi — Your artisan shop, made simpler" },
      {
        name: "description",
        content:
          "Manage your artisan shop with simple AI-assisted tools for photos, listings, and pricing.",
      },
      { property: "og:title", content: "Kaarigar Saathi — Your artisan shop, made simpler" },
      {
        property: "og:description",
        content: "Simple AI-assisted tools that help artisans bring their work to more buyers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Tab = "home" | "inventory" | "insights" | "profile";
type StatusFilter = "All" | "Live" | "Draft";

const initialProducts: NewProduct[] = [
  {
    name: "Blue Silk Chanderi Saree",
    detail: "Hand-woven with gold zari threads",
    price: "₹8,500",
    status: "Live",
    image: saree,
    tag: "AI Optimized",
    nameKey: "products.saree.name",
    detailKey: "products.saree.detail",
    tagKey: "tag.aiOptimized",
  },
  {
    name: "Terracotta Tribal Vase",
    detail: "Voice cataloging in progress",
    price: "₹1,200",
    status: "Draft",
    image: vase,
    tag: "Need Audio",
    nameKey: "products.vase.name",
    detailKey: "products.vase.detail",
    tagKey: "tag.needAudio",
  },
];

const WEEKLY_SALES = [
  { week: "W1", amount: 4200 },
  { week: "W2", amount: 6800 },
  { week: "W3", amount: 5100 },
  { week: "W4", amount: 9600 },
  { week: "W5", amount: 7400 },
  { week: "W6", amount: 9750 },
];

/**
 * Sample products carry `nameKey`/`detailKey`/`tagKey` so they can be shown
 * in the active language. Products the user creates themselves don't have
 * these keys, so their own words are returned unchanged.
 */
function useLocalizedProduct(product: NewProduct) {
  const { t } = useLanguage();
  return {
    name: product.nameKey ? t(product.nameKey as TranslationKey) : product.name,
    detail: product.detailKey ? t(product.detailKey as TranslationKey) : product.detail,
    tag: product.tagKey ? t(product.tagKey as TranslationKey) : product.tag,
  };
}

function Index() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}

function AppShell() {
  const { language, toggleLanguage, t } = useLanguage();
  const [flowStep, setFlowStep] = useState<FlowStep | null>(null);
  const [products, setProducts] = useState<NewProduct[]>(initialProducts);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [inventorySearch, setInventorySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesStatus = statusFilter === "All" || product.status === statusFilter;
      const matchesSearch = product.name.toLowerCase().includes(inventorySearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [products, inventorySearch, statusFilter]);

  const liveCount = products.filter((p) => p.status === "Live").length;
  const draftCount = products.filter((p) => p.status === "Draft").length;

  return (
    <div className="min-h-screen bg-artisan-sand pb-28 text-artisan-ink">
      <header className="sticky top-0 z-20 border-b border-artisan-clay/10 bg-artisan-sand/90 px-5 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-artisan-clay">
              {t("header.greeting", { name: "Aarav" })}
            </p>
            <h1 className="font-display text-xl font-bold tracking-tight">Kaarigar Saathi</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="h-8 rounded-full bg-artisan-moss/10 px-3 text-xs font-medium text-artisan-moss hover:bg-artisan-moss/20 hover:text-artisan-moss"
            >
              <Languages />
              {language === "en" ? "English" : "हिंदी"}
            </Button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              aria-label="Open profile"
              className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-artisan-clay"
            >
              <img
                src={avatar}
                alt="Aarav's artisan profile"
                width={40}
                height={40}
                className="size-10 rounded-full border border-artisan-clay/20 object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 sm:px-8">
        {activeTab === "home" && (
          <HomeTab products={products} onSeeAll={() => setActiveTab("inventory")} />
        )}

        {activeTab === "inventory" && (
          <InventoryTab
            products={filteredProducts}
            totalCount={products.length}
            liveCount={liveCount}
            draftCount={draftCount}
            search={inventorySearch}
            onSearchChange={setInventorySearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onAdd={() => setFlowStep("photo")}
          />
        )}

        {activeTab === "insights" && <InsightsTab products={products} liveCount={liveCount} />}

        {activeTab === "profile" && <ProfileTab productCount={products.length} />}
      </main>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} onAdd={() => setFlowStep("photo")} />

      {flowStep && (
        <AddProductFlow
          initialStep={flowStep}
          onClose={() => setFlowStep(null)}
          onPublish={(product) => setProducts((current) => [product, ...current])}
        />
      )}
    </div>
  );
}

function HomeTab({ products, onSeeAll }: { products: NewProduct[]; onSeeAll: () => void }) {
  const { t } = useLanguage();
  return (
    <>
      <section className="pt-6">
        <div className="rounded-[28px] bg-artisan-moss p-6 text-artisan-moss-foreground shadow-xl shadow-artisan-moss/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm opacity-70">{t("home.totalEarnings")}</p>
              <h2 className="mt-1 font-display text-4xl font-bold tracking-tight">₹42,850</h2>
            </div>
            <div className="rounded-xl bg-artisan-moss-foreground/15 p-2.5">
              <BarChart3 className="size-5" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs">
            <span className="rounded-lg bg-artisan-moss-foreground/15 px-2 py-1 font-medium">
              {t("home.monthlyGrowth")}
            </span>
            <span className="opacity-70">{t("home.fromSales", { count: 8 })}</span>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight">{t("home.myShop")}</h2>
          <Button
            variant="link"
            className="h-auto p-0 text-sm font-semibold text-artisan-clay hover:text-artisan-clay/80"
            onClick={onSeeAll}
          >
            {t("home.seeAll")} <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {products.slice(0, 3).map((product) => (
            <ProductRow key={product.name} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-artisan-line bg-artisan-surface/60 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-artisan-clay/10 text-artisan-clay">
            <Store className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{t("home.shopNoticed")}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("home.newVisitors", { count: 4 })}
            </p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
      </section>
    </>
  );
}

function InventoryTab({
  products,
  totalCount,
  liveCount,
  draftCount,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAdd,
}: {
  products: NewProduct[];
  totalCount: number;
  liveCount: number;
  draftCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  onAdd: () => void;
}) {
  const { t } = useLanguage();
  const filters: { value: StatusFilter; label: string }[] = [
    { value: "All", label: t("inventory.filterAll") },
    { value: "Live", label: t("status.live") },
    { value: "Draft", label: t("status.draft") },
  ];

  return (
    <>
      <section className="pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight">{t("inventory.title")}</h2>
          <Button
            onClick={onAdd}
            size="sm"
            className="h-9 rounded-xl bg-artisan-clay px-3 text-xs font-bold text-artisan-clay-foreground hover:bg-artisan-clay/90"
          >
            <Camera className="size-4" /> {t("inventory.addProduct")}
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("inventory.productsInShop", { count: totalCount })}
        </p>
      </section>

      <section className="mt-5 grid grid-cols-3 gap-3">
        <StatChip label={t("inventory.total")} value={totalCount} />
        <StatChip label={t("status.live")} value={liveCount} tone="success" />
        <StatChip label={t("status.draft")} value={draftCount} tone="warning" />
      </section>

      <section className="mt-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("inventory.searchPlaceholder")}
            aria-label={t("inventory.searchPlaceholder")}
            className="h-11 rounded-2xl border-artisan-line bg-artisan-surface pl-10"
          />
        </div>
        <div className="mt-3 flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => onStatusFilterChange(filter.value)}
              className={`h-8 rounded-full px-3 text-xs font-semibold transition ${
                statusFilter === filter.value
                  ? "bg-artisan-ink text-artisan-clay-foreground"
                  : "bg-artisan-surface text-muted-foreground hover:text-artisan-ink"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 space-y-4 pb-2">
        {products.length > 0 ? (
          products.map((product) => <ProductRow key={product.name} product={product} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-artisan-clay/25 bg-artisan-surface p-8 text-center">
            <Package className="mx-auto size-8 text-artisan-clay/60" />
            <p className="mt-2 text-sm font-semibold">{t("inventory.noMatchTitle")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("inventory.noMatchSubtitle")}</p>
          </div>
        )}
      </section>
    </>
  );
}

function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone?: "success" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "text-artisan-moss"
      : tone === "warning"
        ? "text-artisan-warning-foreground"
        : "text-artisan-ink";
  return (
    <div className="rounded-2xl border border-artisan-line bg-artisan-surface p-3 text-center shadow-sm">
      <p className={`font-display text-2xl font-bold ${toneClass}`}>{value}</p>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function InsightsTab({ products, liveCount }: { products: NewProduct[]; liveCount: number }) {
  const { t } = useLanguage();
  const topProduct = products[0];
  const localizedTop = useLocalizedProduct(
    topProduct ?? { name: "", detail: "", price: "", status: "", image: "", tag: "" },
  );
  return (
    <>
      <section className="pt-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">{t("insights.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("insights.subtitle")}</p>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        <InsightCard
          icon={<BarChart3 className="size-5" />}
          label={t("insights.totalEarnings")}
          value="₹42,850"
          hint={t("insights.growthHint")}
        />
        <InsightCard
          icon={<TrendingUp className="size-5" />}
          label={t("insights.sales")}
          value="8"
          hint={t("insights.salesHint")}
        />
        <InsightCard
          icon={<Eye className="size-5" />}
          label={t("insights.visitors")}
          value="146"
          hint={t("insights.visitorsHint")}
        />
        <InsightCard
          icon={<Package className="size-5" />}
          label={t("insights.liveListings")}
          value={String(liveCount)}
          hint={t("insights.liveListingsHint", { count: products.length })}
        />
      </section>

      <section className="mt-8 rounded-[28px] border-2 border-artisan-clay/10 bg-artisan-surface p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {t("insights.weeklyEarnings")}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-artisan-ink">₹9,750</p>
          </div>
          <span className="rounded-lg bg-artisan-success px-2 py-1 text-xs font-medium text-artisan-success-foreground">
            {t("insights.thisWeek")}
          </span>
        </div>
        <div className="mt-4 h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEKLY_SALES} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--artisan-line)" />
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <Bar dataKey="amount" radius={[8, 8, 8, 8]} fill="var(--artisan-moss)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {topProduct && (
        <section className="mt-6">
          <h3 className="mb-3 font-display text-lg font-bold tracking-tight">
            {t("insights.bestSeller")}
          </h3>
          <article className="flex items-center gap-4 rounded-2xl border border-artisan-line bg-artisan-surface p-3 shadow-sm">
            <img
              src={topProduct.image}
              alt={localizedTop.name}
              width={64}
              height={64}
              className="size-16 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{localizedTop.name}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-artisan-clay">
                <Star className="size-3.5 fill-artisan-clay" />
                <span className="font-medium">{t("insights.ratingAndViews")}</span>
              </div>
            </div>
            <span className="shrink-0 font-bold text-artisan-moss">{topProduct.price}</span>
          </article>
        </section>
      )}
    </>
  );
}

function InsightCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-artisan-line bg-artisan-surface p-4 shadow-sm">
      <div className="grid size-9 place-items-center rounded-xl bg-artisan-clay/10 text-artisan-clay">
        {icon}
      </div>
      <p className="mt-3 font-display text-xl font-bold tracking-tight">{value}</p>
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-[10px] font-semibold text-artisan-moss">{hint}</p>
    </div>
  );
}

function ProfileTab({ productCount }: { productCount: number }) {
  const { language, toggleLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);

  return (
    <>
      <section className="pt-6">
        <div className="flex items-center gap-4 rounded-[28px] border-2 border-artisan-clay/10 bg-artisan-surface p-5 shadow-sm">
          <img
            src={avatar}
            alt="Aarav's artisan profile"
            width={64}
            height={64}
            className="size-16 shrink-0 rounded-full border border-artisan-clay/20 object-cover"
          />
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-lg font-bold tracking-tight">Aarav Sharma</h2>
            <p className="truncate text-sm text-muted-foreground">Nadia, West Bengal · Weaver</p>
            <div className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-artisan-clay">
              <ShieldCheck className="size-3.5" /> {t("profile.verifiedArtisan")}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("profile.editProfile")}
            className="shrink-0 rounded-full text-muted-foreground hover:text-artisan-clay"
          >
            <Pencil className="size-4" />
          </Button>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-3 gap-3">
        <StatChip label={t("profile.products")} value={productCount} />
        <StatChip label={t("profile.sales")} value={8} tone="success" />
        <StatChip label={t("profile.rating")} value="4.8" />
      </section>

      <section className="mt-8">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          {t("profile.preferences")}
        </h3>
        <div className="overflow-hidden rounded-2xl border border-artisan-line bg-artisan-surface shadow-sm">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex w-full items-center gap-3 border-b border-artisan-line px-4 py-3.5 text-left hover:bg-artisan-sand/60"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-artisan-clay/10 text-artisan-clay">
              <Globe className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{t("profile.appLanguage")}</span>
              <span className="block text-xs text-muted-foreground">
                {t("profile.tapToSwitch")}
              </span>
            </span>
            <span className="shrink-0 text-sm font-semibold text-artisan-clay">
              {language === "en" ? "English" : "हिंदी"}
            </span>
          </button>

          <div className="flex w-full items-center gap-3 border-b border-artisan-line px-4 py-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-artisan-clay/10 text-artisan-clay">
              <Sparkles className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{t("profile.notifications")}</span>
              <span className="block text-xs text-muted-foreground">
                {t("profile.notificationsHint")}
              </span>
            </span>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
              aria-label={t("profile.notifications")}
            />
          </div>

          <button
            type="button"
            className="flex w-full items-center gap-3 border-b border-artisan-line px-4 py-3.5 text-left hover:bg-artisan-sand/60"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-artisan-clay/10 text-artisan-clay">
              <Share2 className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{t("profile.shareShop")}</span>
              <span className="block text-xs text-muted-foreground">
                {t("profile.shareShopHint")}
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-artisan-sand/60"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-artisan-clay/10 text-artisan-clay">
              <HelpCircle className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{t("profile.helpSupport")}</span>
              <span className="block text-xs text-muted-foreground">
                {t("profile.helpSupportHint")}
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </div>
      </section>

      <section className="mt-6">
        <Button
          variant="outline"
          className="h-12 w-full rounded-2xl border-artisan-line text-sm font-semibold text-muted-foreground hover:text-artisan-clay"
        >
          <LogOut className="size-4" /> {t("profile.logout")}
        </Button>
      </section>
    </>
  );
}

function ProductRow({ product }: { product: NewProduct }) {
  const { t } = useLanguage();
  const localized = useLocalizedProduct(product);
  const live = product.status === "Live";
  return (
    <article className="flex gap-4 rounded-2xl border border-artisan-line bg-artisan-surface p-3 shadow-sm">
      <img
        src={product.image}
        alt={localized.name}
        width={96}
        height={96}
        loading="lazy"
        className="size-24 shrink-0 rounded-xl object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 text-sm font-bold leading-tight">{localized.name}</h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${live ? "bg-artisan-success text-artisan-success-foreground" : "bg-artisan-warning text-artisan-warning-foreground"}`}
            >
              {live ? t("status.live") : t("status.draft")}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{localized.detail}</p>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-bold text-artisan-moss">{product.price}</span>
          <span className="truncate text-[10px] font-medium italic text-artisan-clay">
            {localized.tag}
          </span>
        </div>
      </div>
    </article>
  );
}

function BottomNav({
  activeTab,
  onChange,
  onAdd,
}: {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
  onAdd: () => void;
}) {
  const { t } = useLanguage();
  return (
    <nav className="fixed bottom-5 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center justify-between rounded-3xl bg-artisan-ink p-3 text-artisan-clay-foreground shadow-2xl">
      <NavItem
        icon={<House />}
        label={t("nav.home")}
        active={activeTab === "home"}
        onClick={() => onChange("home")}
      />
      <NavItem
        icon={<Package />}
        label={t("nav.inventory")}
        active={activeTab === "inventory"}
        onClick={() => onChange("inventory")}
      />
      <Button
        onClick={onAdd}
        aria-label={t("nav.addProduct")}
        className="-mt-12 size-16 shrink-0 rounded-full border-4 border-artisan-sand bg-artisan-clay p-0 text-artisan-clay-foreground shadow-lg hover:bg-artisan-clay/90"
      >
        <Camera className="size-6" />
      </Button>
      <NavItem
        icon={<BarChart3 />}
        label={t("nav.insights")}
        active={activeTab === "insights"}
        onClick={() => onChange("insights")}
      />
      <NavItem
        icon={<CircleUserRound />}
        label={t("nav.profile")}
        active={activeTab === "profile"}
        onClick={() => onChange("profile")}
      />
    </nav>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`h-auto min-w-0 flex-1 flex-col gap-1 rounded-2xl px-1 py-2 text-artisan-clay-foreground hover:bg-artisan-clay-foreground/10 hover:text-artisan-clay-foreground ${
        active ? "bg-artisan-clay-foreground/10 text-artisan-clay" : "opacity-60"
      }`}
    >
      <span>{icon}</span>
      <span className="text-[10px] font-medium uppercase tracking-tight">{label}</span>
    </Button>
  );
}
