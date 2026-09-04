import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Camera,
  Check,
  ChevronRight,
  CircleUserRound,
  Eye,
  Globe,
  HelpCircle,
  House,
  Languages,
  LogOut,
  Mic,
  Package,
  Pencil,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Tag,
  TrendingUp,
  X,
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

type StudioMode = "photo" | "listing" | "price";
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
  },
  {
    name: "Terracotta Tribal Vase",
    detail: "Voice cataloging in progress",
    price: "₹1,200",
    status: "Draft",
    image: vase,
    tag: "Need Audio",
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

function Index() {
  const [language, setLanguage] = useState("हिंदी");
  const [studioMode, setStudioMode] = useState<StudioMode | null>(null);
  const [recording, setRecording] = useState(false);
  const [saved, setSaved] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep | null>(null);
  const [products, setProducts] = useState<NewProduct[]>(initialProducts);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [inventorySearch, setInventorySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const openStudio = (mode: StudioMode = "listing") => {
    if (mode === "price") {
      setSaved(false);
      setStudioMode("price");
      return;
    }
    setFlowStep(mode === "photo" ? "photo" : "voice");
  };

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
              Namaste, Aarav
            </p>
            <h1 className="font-display text-xl font-bold tracking-tight">Kaarigar Saathi</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "हिंदी" ? "English" : "हिंदी")}
              className="h-8 rounded-full bg-artisan-moss/10 px-3 text-xs font-medium text-artisan-moss hover:bg-artisan-moss/20 hover:text-artisan-moss"
            >
              <Languages />
              {language}
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
          <HomeTab
            products={products}
            openStudio={openStudio}
            onSeeAll={() => setActiveTab("inventory")}
          />
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

        {activeTab === "profile" && (
          <ProfileTab
            language={language}
            onLanguageToggle={() => setLanguage(language === "हिंदी" ? "English" : "हिंदी")}
            productCount={products.length}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} onAdd={() => setFlowStep("photo")} />

      {flowStep && (
        <AddProductFlow
          initialStep={flowStep}
          onClose={() => setFlowStep(null)}
          onPublish={(product) => setProducts((current) => [product, ...current])}
        />
      )}

      {studioMode && (
        <StudioSheet
          mode={studioMode}
          recording={recording}
          saved={saved}
          onClose={() => {
            setStudioMode(null);
            setRecording(false);
          }}
          onRecord={() => setRecording(!recording)}
          onSave={() => setSaved(true)}
          onModeChange={setStudioMode}
        />
      )}
    </div>
  );
}

function HomeTab({
  products,
  openStudio,
  onSeeAll,
}: {
  products: NewProduct[];
  openStudio: (mode?: StudioMode) => void;
  onSeeAll: () => void;
}) {
  return (
    <>
      <section className="pt-6">
        <div className="rounded-[28px] bg-artisan-moss p-6 text-artisan-moss-foreground shadow-xl shadow-artisan-moss/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm opacity-70">Total earnings</p>
              <h2 className="mt-1 font-display text-4xl font-bold tracking-tight">₹42,850</h2>
            </div>
            <div className="rounded-xl bg-artisan-moss-foreground/15 p-2.5">
              <BarChart3 className="size-5" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs">
            <span className="rounded-lg bg-artisan-moss-foreground/15 px-2 py-1 font-medium">
              +12% this month
            </span>
            <span className="opacity-70">from 8 sales</span>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-3 gap-3">
        <QuickTool icon={<Camera />} label="Fix photo" onClick={() => openStudio("photo")} />
        <QuickTool icon={<Mic />} label="Voice listing" onClick={() => openStudio("listing")} />
        <QuickTool icon={<Tag />} label="Check price" onClick={() => openStudio("price")} />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight">My shop</h2>
          <Button
            variant="link"
            className="h-auto p-0 text-sm font-semibold text-artisan-clay hover:text-artisan-clay/80"
            onClick={onSeeAll}
          >
            See all <ChevronRight className="size-4" />
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
            <p className="text-sm font-semibold">Your shop is getting noticed</p>
            <p className="mt-0.5 text-xs text-muted-foreground">4 new visitors this week</p>
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
  return (
    <>
      <section className="pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight">Inventory</h2>
          <Button
            onClick={onAdd}
            size="sm"
            className="h-9 rounded-xl bg-artisan-clay px-3 text-xs font-bold text-artisan-clay-foreground hover:bg-artisan-clay/90"
          >
            <Camera className="size-4" /> Add product
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalCount} product{totalCount === 1 ? "" : "s"} in your shop
        </p>
      </section>

      <section className="mt-5 grid grid-cols-3 gap-3">
        <StatChip label="Total" value={totalCount} />
        <StatChip label="Live" value={liveCount} tone="success" />
        <StatChip label="Draft" value={draftCount} tone="warning" />
      </section>

      <section className="mt-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search your products"
            aria-label="Search your products"
            className="h-11 rounded-2xl border-artisan-line bg-artisan-surface pl-10"
          />
        </div>
        <div className="mt-3 flex gap-2">
          {(["All", "Live", "Draft"] as StatusFilter[]).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onStatusFilterChange(filter)}
              className={`h-8 rounded-full px-3 text-xs font-semibold transition ${
                statusFilter === filter
                  ? "bg-artisan-ink text-artisan-clay-foreground"
                  : "bg-artisan-surface text-muted-foreground hover:text-artisan-ink"
              }`}
            >
              {filter}
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
            <p className="mt-2 text-sm font-semibold">No products match</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different search or filter.</p>
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
  const topProduct = products[0];
  return (
    <>
      <section className="pt-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">Insights</h2>
        <p className="mt-1 text-sm text-muted-foreground">How your shop is doing this month</p>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        <InsightCard
          icon={<BarChart3 className="size-5" />}
          label="Total earnings"
          value="₹42,850"
          hint="+12% vs last month"
        />
        <InsightCard
          icon={<TrendingUp className="size-5" />}
          label="Sales"
          value="8"
          hint="+2 this month"
        />
        <InsightCard
          icon={<Eye className="size-5" />}
          label="Shop visitors"
          value="146"
          hint="4 new this week"
        />
        <InsightCard
          icon={<Package className="size-5" />}
          label="Live listings"
          value={String(liveCount)}
          hint={`of ${products.length} total`}
        />
      </section>

      <section className="mt-8 rounded-[28px] border-2 border-artisan-clay/10 bg-artisan-surface p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Earnings, last 6 weeks
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-artisan-ink">₹9,750</p>
          </div>
          <span className="rounded-lg bg-artisan-success px-2 py-1 text-xs font-medium text-artisan-success-foreground">
            This week
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
          <h3 className="mb-3 font-display text-lg font-bold tracking-tight">Your best seller</h3>
          <article className="flex items-center gap-4 rounded-2xl border border-artisan-line bg-artisan-surface p-3 shadow-sm">
            <img
              src={topProduct.image}
              alt={topProduct.name}
              width={64}
              height={64}
              className="size-16 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{topProduct.name}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-artisan-clay">
                <Star className="size-3.5 fill-artisan-clay" />
                <span className="font-medium">4.8 · 12 views this week</span>
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

function ProfileTab({
  language,
  onLanguageToggle,
  productCount,
}: {
  language: string;
  onLanguageToggle: () => void;
  productCount: number;
}) {
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
              <ShieldCheck className="size-3.5" /> Verified artisan
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit profile"
            className="shrink-0 rounded-full text-muted-foreground hover:text-artisan-clay"
          >
            <Pencil className="size-4" />
          </Button>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-3 gap-3">
        <StatChip label="Products" value={productCount} />
        <StatChip label="Sales" value={8} tone="success" />
        <StatChip label="Rating" value="4.8" />
      </section>

      <section className="mt-8">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Preferences
        </h3>
        <div className="overflow-hidden rounded-2xl border border-artisan-line bg-artisan-surface shadow-sm">
          <button
            type="button"
            onClick={onLanguageToggle}
            className="flex w-full items-center gap-3 border-b border-artisan-line px-4 py-3.5 text-left hover:bg-artisan-sand/60"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-artisan-clay/10 text-artisan-clay">
              <Globe className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">App language</span>
              <span className="block text-xs text-muted-foreground">Tap to switch</span>
            </span>
            <span className="shrink-0 text-sm font-semibold text-artisan-clay">{language}</span>
          </button>

          <div className="flex w-full items-center gap-3 border-b border-artisan-line px-4 py-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-artisan-clay/10 text-artisan-clay">
              <Sparkles className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">Notifications</span>
              <span className="block text-xs text-muted-foreground">New orders and messages</span>
            </span>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
              aria-label="Toggle notifications"
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
              <span className="block text-sm font-semibold">Share your shop</span>
              <span className="block text-xs text-muted-foreground">
                Send your shop link to buyers
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
              <span className="block text-sm font-semibold">Help & support</span>
              <span className="block text-xs text-muted-foreground">Guides and contact</span>
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
          <LogOut className="size-4" /> Log out
        </Button>
      </section>
    </>
  );
}

function QuickTool({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-auto min-h-24 flex-col gap-2 rounded-2xl border-artisan-line bg-artisan-surface px-2 py-4 text-artisan-ink shadow-sm hover:bg-artisan-clay/5 hover:text-artisan-clay"
    >
      <span className="grid size-10 place-items-center rounded-full bg-artisan-sand text-artisan-clay">
        {icon}
      </span>
      <span className="text-[11px] font-semibold">{label}</span>
    </Button>
  );
}

function ProductRow({ product }: { product: NewProduct }) {
  const live = product.status === "Live";
  return (
    <article className="flex gap-4 rounded-2xl border border-artisan-line bg-artisan-surface p-3 shadow-sm">
      <img
        src={product.image}
        alt={product.name}
        width={96}
        height={96}
        loading="lazy"
        className="size-24 shrink-0 rounded-xl object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 text-sm font-bold leading-tight">{product.name}</h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${live ? "bg-artisan-success text-artisan-success-foreground" : "bg-artisan-warning text-artisan-warning-foreground"}`}
            >
              {product.status}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{product.detail}</p>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-bold text-artisan-moss">{product.price}</span>
          <span className="truncate text-[10px] font-medium italic text-artisan-clay">
            {product.tag}
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
  return (
    <nav className="fixed bottom-5 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center justify-between rounded-3xl bg-artisan-ink p-3 text-artisan-clay-foreground shadow-2xl">
      <NavItem
        icon={<House />}
        label="Home"
        active={activeTab === "home"}
        onClick={() => onChange("home")}
      />
      <NavItem
        icon={<Package />}
        label="Inventory"
        active={activeTab === "inventory"}
        onClick={() => onChange("inventory")}
      />
      <Button
        onClick={onAdd}
        aria-label="Add new product"
        className="-mt-12 size-16 shrink-0 rounded-full border-4 border-artisan-sand bg-artisan-clay p-0 text-artisan-clay-foreground shadow-lg hover:bg-artisan-clay/90"
      >
        <Camera className="size-6" />
      </Button>
      <NavItem
        icon={<BarChart3 />}
        label="Insights"
        active={activeTab === "insights"}
        onClick={() => onChange("insights")}
      />
      <NavItem
        icon={<CircleUserRound />}
        label="Profile"
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

function StudioSheet({
  mode,
  recording,
  saved,
  onClose,
  onRecord,
  onSave,
  onModeChange,
}: {
  mode: StudioMode;
  recording: boolean;
  saved: boolean;
  onClose: () => void;
  onRecord: () => void;
  onSave: () => void;
  onModeChange: (mode: StudioMode) => void;
}) {
  const content = {
    photo: {
      title: "Improve your photo",
      subtitle: "We’ll clean the background and brighten your product.",
      action: "Choose a photo",
      icon: <Camera />,
    },
    listing: {
      title: "Tell me about your product",
      subtitle: "Speak in Hindi, Bengali, Marathi, or English.",
      action: "Save this listing",
      icon: <Mic />,
    },
    price: {
      title: "Check your selling price",
      subtitle: "A simple suggestion based on your product and materials.",
      action: "Use this price",
      icon: <Tag />,
    },
  }[mode];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-artisan-ink/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="AI Studio"
    >
      <div className="w-full rounded-t-[32px] bg-artisan-surface px-6 pb-8 pt-3 shadow-2xl sm:mx-auto sm:max-w-2xl">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-artisan-line" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-artisan-clay">
              <Sparkles className="size-4" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                AI Studio
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {saved ? "Your draft is ready" : content.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {saved ? "You can find it in My Shop." : content.subtitle}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close AI Studio"
            className="shrink-0 rounded-full text-muted-foreground"
          >
            <X />
          </Button>
        </div>

        {!saved && mode === "listing" && <VoicePrompt recording={recording} onRecord={onRecord} />}
        {!saved && mode === "photo" && <PhotoPrompt />}
        {!saved && mode === "price" && <PricePrompt />}
        {saved && (
          <div className="my-8 grid place-items-center">
            <div className="grid size-20 place-items-center rounded-full bg-artisan-success text-artisan-success-foreground">
              <Check className="size-9" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 border-t border-artisan-line pt-4">
          {(["photo", "listing", "price"] as StudioMode[]).map((item) => (
            <Button
              key={item}
              variant={mode === item ? "secondary" : "ghost"}
              onClick={() => onModeChange(item)}
              className="h-9 rounded-xl text-xs capitalize"
            >
              {item === "photo" ? "Photo" : item === "listing" ? "Listing" : "Price"}
            </Button>
          ))}
        </div>
        <Button
          onClick={saved ? onClose : mode === "listing" ? onSave : onSave}
          className="mt-4 h-12 w-full rounded-2xl bg-artisan-ink text-base font-bold text-artisan-ink-foreground hover:bg-artisan-ink/90"
        >
          {saved ? "Done" : content.action} {content.icon}
        </Button>
      </div>
    </div>
  );
}

function VoicePrompt({ recording, onRecord }: { recording: boolean; onRecord: () => void }) {
  return (
    <div className="my-8 rounded-2xl bg-artisan-sand p-5 text-center">
      <Button
        onClick={onRecord}
        aria-label={recording ? "Stop recording" : "Start recording"}
        className={`mx-auto grid size-24 place-items-center rounded-full bg-artisan-clay text-artisan-clay-foreground shadow-lg shadow-artisan-clay/20 ${recording ? "animate-pulse" : ""}`}
      >
        <Mic className="size-9" />
      </Button>
      <p className="mt-4 text-sm font-semibold">
        {recording ? "Listening… tap when you’re done" : "Tap to describe your product"}
      </p>
      <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
        {[6, 13, 20, 11, 17, 8, 14].map((height, index) => (
          <span
            key={index}
            className={`w-1 rounded-full bg-artisan-clay ${recording ? "animate-pulse" : ""}`}
            style={{ height }}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoPrompt() {
  return (
    <div className="my-8 grid min-h-36 place-items-center rounded-2xl border-2 border-dashed border-artisan-clay/25 bg-artisan-sand p-5 text-center">
      <div>
        <Camera className="mx-auto size-8 text-artisan-clay" />
        <p className="mt-2 text-sm font-semibold">Add a clear photo of your product</p>
        <p className="mt-1 text-xs text-muted-foreground">AI will make it shop-ready</p>
      </div>
    </div>
  );
}

function PricePrompt() {
  return (
    <div className="my-8 rounded-2xl bg-artisan-sand p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        Suggested selling price
      </p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <span className="font-display text-4xl font-bold text-artisan-moss">₹1,450</span>
        <span className="rounded-lg bg-artisan-success px-2 py-1 text-xs font-medium text-artisan-success-foreground">
          Good range
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-artisan-line">
        <div className="h-full w-3/4 rounded-full bg-artisan-moss" />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Based on similar handmade products and your material cost.
      </p>
    </div>
  );
}
