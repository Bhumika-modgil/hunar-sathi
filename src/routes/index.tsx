import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Camera,
  Check,
  ChevronRight,
  CircleUserRound,
  House,
  Languages,
  Mic,
  Package,
  Pencil,
  Sparkles,
  Store,
  Tag,
  X,
} from "lucide-react";
import { useState } from "react";

import avatar from "@/assets/artisan-avatar.jpg";
import saree from "@/assets/blue-silk-saree.jpg";
import vase from "@/assets/terracotta-vase.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kaarigar Saathi — Your artisan shop, made simpler" },
      {
        name: "description",
        content: "Manage your artisan shop with simple AI-assisted tools for photos, listings, and pricing.",
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

const products = [
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

function Index() {
  const [language, setLanguage] = useState("हिंदी");
  const [studioMode, setStudioMode] = useState<StudioMode | null>(null);
  const [recording, setRecording] = useState(false);
  const [saved, setSaved] = useState(false);

  const openStudio = (mode: StudioMode = "listing") => {
    setSaved(false);
    setStudioMode(mode);
  };

  return (
    <div className="min-h-screen bg-artisan-sand pb-28 text-artisan-ink">
      <header className="sticky top-0 z-20 border-b border-artisan-clay/10 bg-artisan-sand/90 px-5 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-artisan-clay">Namaste, Aarav</p>
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
            <img src={avatar} alt="Aarav's artisan profile" width={40} height={40} className="size-10 rounded-full border border-artisan-clay/20 object-cover" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 sm:px-8">
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
              <span className="rounded-lg bg-artisan-moss-foreground/15 px-2 py-1 font-medium">+12% this month</span>
              <span className="opacity-70">from 8 sales</span>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="relative overflow-hidden rounded-[28px] border-2 border-artisan-clay/10 bg-artisan-surface p-6 shadow-sm">
            <div className="relative z-10">
              <div className="mb-2 flex items-center gap-2 text-artisan-clay">
                <Sparkles className="size-4" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Your AI helper</span>
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Digitize a new product</h2>
              <p className="mt-1 max-w-[240px] text-sm leading-5 text-muted-foreground">Take a photo or tell us about your craft. We’ll help with the rest.</p>
              <Button onClick={() => openStudio()} className="mt-5 h-12 w-full rounded-2xl bg-artisan-clay text-base font-bold text-artisan-clay-foreground shadow-lg shadow-artisan-clay/25 hover:bg-artisan-clay/90">
                <Camera />
                Open AI Studio
                <ArrowRight className="ml-auto" />
              </Button>
            </div>
            <div className="absolute -bottom-12 -right-10 size-40 rounded-full bg-artisan-clay/10" />
            <div className="absolute -right-3 top-10 size-16 rounded-full border border-artisan-clay/10" />
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
            <Button variant="link" className="h-auto p-0 text-sm font-semibold text-artisan-clay hover:text-artisan-clay/80" onClick={() => openStudio("listing")}>
              View all <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {products.map((product) => <ProductRow key={product.name} product={product} />)}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-artisan-line bg-artisan-surface/60 p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-artisan-clay/10 text-artisan-clay"><Store className="size-5" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Your shop is getting noticed</p>
              <p className="mt-0.5 text-xs text-muted-foreground">4 new visitors this week</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        </section>
      </main>

      <BottomNav onAdd={() => openStudio()} />

      {studioMode && (
        <StudioSheet
          mode={studioMode}
          recording={recording}
          saved={saved}
          onClose={() => { setStudioMode(null); setRecording(false); }}
          onRecord={() => setRecording(!recording)}
          onSave={() => setSaved(true)}
          onModeChange={setStudioMode}
        />
      )}
    </div>
  );
}

function QuickTool({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick} className="h-auto min-h-24 flex-col gap-2 rounded-2xl border-artisan-line bg-artisan-surface px-2 py-4 text-artisan-ink shadow-sm hover:bg-artisan-clay/5 hover:text-artisan-clay">
      <span className="grid size-10 place-items-center rounded-full bg-artisan-sand text-artisan-clay">{icon}</span>
      <span className="text-[11px] font-semibold">{label}</span>
    </Button>
  );
}

function ProductRow({ product }: { product: (typeof products)[number] }) {
  const live = product.status === "Live";
  return (
    <article className="flex gap-4 rounded-2xl border border-artisan-line bg-artisan-surface p-3 shadow-sm">
      <img src={product.image} alt={product.name} width={96} height={96} loading="lazy" className="size-24 shrink-0 rounded-xl object-cover" />
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 text-sm font-bold leading-tight">{product.name}</h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${live ? "bg-artisan-success text-artisan-success-foreground" : "bg-artisan-warning text-artisan-warning-foreground"}`}>{product.status}</span>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{product.detail}</p>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-bold text-artisan-moss">{product.price}</span>
          <span className="truncate text-[10px] font-medium italic text-artisan-clay">{product.tag}</span>
        </div>
      </div>
    </article>
  );
}

function BottomNav({ onAdd }: { onAdd: () => void }) {
  return (
    <nav className="fixed bottom-5 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center justify-between rounded-3xl bg-artisan-ink p-3 text-artisan-clay-foreground shadow-2xl">
      <NavItem icon={<House />} label="Home" active />
      <NavItem icon={<Package />} label="Inventory" />
      <Button onClick={onAdd} aria-label="Add new product" className="-mt-12 size-16 shrink-0 rounded-full border-4 border-artisan-sand bg-artisan-clay p-0 text-artisan-clay-foreground shadow-lg hover:bg-artisan-clay/90"><Camera className="size-6" /></Button>
      <NavItem icon={<BarChart3 />} label="Insights" />
      <NavItem icon={<CircleUserRound />} label="Profile" />
    </nav>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return <Button variant="ghost" className={`h-auto min-w-0 flex-1 flex-col gap-1 px-1 py-1.5 text-artisan-clay-foreground hover:bg-artisan-clay-foreground/10 hover:text-artisan-clay-foreground ${active ? "text-artisan-clay" : "opacity-60"}`}><span>{icon}</span><span className="text-[10px] font-medium uppercase tracking-tight">{label}</span></Button>;
}

function StudioSheet({ mode, recording, saved, onClose, onRecord, onSave, onModeChange }: { mode: StudioMode; recording: boolean; saved: boolean; onClose: () => void; onRecord: () => void; onSave: () => void; onModeChange: (mode: StudioMode) => void }) {
  const content = {
    photo: { title: "Improve your photo", subtitle: "We’ll clean the background and brighten your product.", action: "Choose a photo", icon: <Camera /> },
    listing: { title: "Tell me about your product", subtitle: "Speak in Hindi, Bengali, Marathi, or English.", action: "Save this listing", icon: <Mic /> },
    price: { title: "Check your selling price", subtitle: "A simple suggestion based on your product and materials.", action: "Use this price", icon: <Tag /> },
  }[mode];

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-artisan-ink/45 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="AI Studio">
      <div className="w-full rounded-t-[32px] bg-artisan-surface px-6 pb-8 pt-3 shadow-2xl sm:mx-auto sm:max-w-2xl">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-artisan-line" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-artisan-clay"><Sparkles className="size-4" /><span className="text-[10px] font-semibold uppercase tracking-[0.18em]">AI Studio</span></div>
            <h2 className="font-display text-2xl font-bold tracking-tight">{saved ? "Your draft is ready" : content.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{saved ? "You can find it in My Shop." : content.subtitle}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close AI Studio" className="shrink-0 rounded-full text-muted-foreground"><X /></Button>
        </div>

        {!saved && mode === "listing" && <VoicePrompt recording={recording} onRecord={onRecord} />}
        {!saved && mode === "photo" && <PhotoPrompt />}
        {!saved && mode === "price" && <PricePrompt />}
        {saved && <div className="my-8 grid place-items-center"><div className="grid size-20 place-items-center rounded-full bg-artisan-success text-artisan-success-foreground"><Check className="size-9" /></div></div>}

        <div className="grid grid-cols-3 gap-2 border-t border-artisan-line pt-4">
          {(["photo", "listing", "price"] as StudioMode[]).map((item) => <Button key={item} variant={mode === item ? "secondary" : "ghost"} onClick={() => onModeChange(item)} className="h-9 rounded-xl text-xs capitalize">{item === "photo" ? "Photo" : item === "listing" ? "Listing" : "Price"}</Button>)}
        </div>
        <Button onClick={saved ? onClose : mode === "listing" ? onSave : onSave} className="mt-4 h-12 w-full rounded-2xl bg-artisan-ink text-base font-bold text-artisan-ink-foreground hover:bg-artisan-ink/90">{saved ? "Done" : content.action} {content.icon}</Button>
      </div>
    </div>
  );
}

function VoicePrompt({ recording, onRecord }: { recording: boolean; onRecord: () => void }) {
  return <div className="my-8 rounded-2xl bg-artisan-sand p-5 text-center"><Button onClick={onRecord} aria-label={recording ? "Stop recording" : "Start recording"} className={`mx-auto grid size-24 place-items-center rounded-full bg-artisan-clay text-artisan-clay-foreground shadow-lg shadow-artisan-clay/20 ${recording ? "animate-pulse" : ""}`}><Mic className="size-9" /></Button><p className="mt-4 text-sm font-semibold">{recording ? "Listening… tap when you’re done" : "Tap to describe your product"}</p><div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">{[6, 13, 20, 11, 17, 8, 14].map((height, index) => <span key={index} className={`w-1 rounded-full bg-artisan-clay ${recording ? "animate-pulse" : ""}`} style={{ height }} />)}</div></div>;
}

function PhotoPrompt() {
  return <div className="my-8 grid min-h-36 place-items-center rounded-2xl border-2 border-dashed border-artisan-clay/25 bg-artisan-sand p-5 text-center"><div><Camera className="mx-auto size-8 text-artisan-clay" /><p className="mt-2 text-sm font-semibold">Add a clear photo of your product</p><p className="mt-1 text-xs text-muted-foreground">AI will make it shop-ready</p></div></div>;
}

function PricePrompt() {
  return <div className="my-8 rounded-2xl bg-artisan-sand p-5"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Suggested selling price</p><div className="mt-2 flex items-end justify-between gap-4"><span className="font-display text-4xl font-bold text-artisan-moss">₹1,450</span><span className="rounded-lg bg-artisan-success px-2 py-1 text-xs font-medium text-artisan-success-foreground">Good range</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-artisan-line"><div className="h-full w-3/4 rounded-full bg-artisan-moss" /></div><p className="mt-3 text-xs text-muted-foreground">Based on similar handmade products and your material cost.</p></div>;
}