import {
  ArrowRight,
  Camera,
  Check,
  Loader2,
  Mic,
  Pencil,
  Sparkles,
  Tag,
  Upload,
  Wand2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type NewProduct = {
  name: string;
  detail: string;
  price: string;
  status: string;
  image: string;
  tag: string;
};

export type FlowStep = "photo" | "voice" | "details" | "done";

/** Mock AI transcript + extraction — replaced by a real model later. */
const MOCK_TRANSCRIPT =
  "यह हाथ से बना नीला जामदानी दुपट्टा है, शुद्ध सूती धागे से बुना गया, बनाने में चार दिन लगे, कीमत लगभग दो हज़ार दो सौ रुपये।";

const MOCK_EXTRACTION = {
  name: "Hand-woven Jamdani Dupatta",
  detail: "Pure cotton, hand-woven over 4 days in Nadia, West Bengal",
  price: "2200",
  material: "Pure cotton with natural dyes",
  craftTime: "4 days",
};

const WAVE_BARS = [8, 16, 26, 14, 30, 11, 22, 9, 18, 27, 12, 20];

export function AddProductFlow({
  initialStep = "photo",
  onClose,
  onPublish,
}: {
  initialStep?: FlowStep;
  onClose: () => void;
  onPublish: (product: NewProduct) => void;
}) {
  const [step, setStep] = useState<FlowStep>(initialStep);
  const [rawPhoto, setRawPhoto] = useState<string | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [form, setForm] = useState({
    name: "",
    detail: "",
    price: "",
    material: "",
    craftTime: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  const handleFile = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setRawPhoto(url);
    setEnhanced(false);
    setEnhancing(true);
    // Mock AI background removal + relighting
    setTimeout(() => {
      setEnhancing(false);
      setEnhanced(true);
    }, 2200);
  };

  const stopRecording = () => {
    setRecording(false);
    setTranscribing(true);
    setTimeout(() => {
      setTranscribing(false);
      setTranscript(MOCK_TRANSCRIPT);
      setForm({
        name: MOCK_EXTRACTION.name,
        detail: MOCK_EXTRACTION.detail,
        price: MOCK_EXTRACTION.price,
        material: MOCK_EXTRACTION.material,
        craftTime: MOCK_EXTRACTION.craftTime,
      });
      setStep("details");
    }, 1800);
  };

  const publish = () => {
    onPublish({
      name: form.name || "Untitled craft",
      detail: form.detail || "Added with voice cataloging",
      price: `₹${Number(form.price || 0).toLocaleString("en-IN")}`,
      status: "Live",
      image: rawPhoto ?? "",
      tag: "AI Optimized",
    });
    setStep("done");
  };

  const stepIndex = { photo: 0, voice: 1, details: 2, done: 3 }[step];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-artisan-surface"
      role="dialog"
      aria-modal="true"
      aria-label="Add a new product"
    >
      <header className="shrink-0 border-b border-artisan-line px-6 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8">
        <div className="mx-auto flex max-w-2xl items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-artisan-clay">
              <Sparkles className="size-4" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                AI Studio
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {step === "photo" && "Step 1 · Add your photo"}
              {step === "voice" && "Step 2 · Just speak about it"}
              {step === "details" && "Step 3 · Check the details"}
              {step === "done" && "Your product is live"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {step === "photo" && "We remove the background and brighten it for you."}
              {step === "voice" &&
                "Speak in Hindi, Bengali, Marathi or English — we fill the form."}
              {step === "details" && "Edit anything that does not look right."}
              {step === "done" && "You can find it in My shop."}
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

        <div className="mx-auto mt-5 flex max-w-2xl gap-1.5" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? "bg-artisan-clay" : "bg-artisan-line"}`}
            />
          ))}
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-6 sm:px-8">
        {step === "photo" && (
          <div className="my-6">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />

            {!rawPhoto && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="grid min-h-44 w-full place-items-center rounded-2xl border-2 border-dashed border-artisan-clay/25 bg-artisan-sand p-5 text-center transition hover:border-artisan-clay/50"
              >
                <div>
                  <Camera className="mx-auto size-8 text-artisan-clay" />
                  <p className="mt-2 text-sm font-semibold">Take or choose a photo</p>
                  <p className="mt-1 text-xs text-muted-foreground">AI will make it shop-ready</p>
                </div>
              </button>
            )}

            {rawPhoto && (
              <div className="grid grid-cols-2 gap-3">
                <figure>
                  <div className="overflow-hidden rounded-2xl border border-artisan-line">
                    <img
                      src={rawPhoto}
                      alt="Original product photo"
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-2 text-center text-[11px] font-medium text-muted-foreground">
                    Original
                  </figcaption>
                </figure>
                <figure>
                  <div className="relative overflow-hidden rounded-2xl border-2 border-artisan-clay/30 bg-[repeating-conic-gradient(var(--artisan-line)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]">
                    <img
                      src={rawPhoto}
                      alt="AI enhanced product photo"
                      className={`aspect-square w-full object-cover transition duration-700 ${
                        enhanced
                          ? "scale-105 contrast-[1.08] saturate-[1.15] brightness-[1.06]"
                          : "blur-[2px] grayscale"
                      }`}
                    />
                    {enhancing && (
                      <div className="absolute inset-0 grid place-items-center bg-artisan-surface/70">
                        <div className="text-center">
                          <Loader2 className="mx-auto size-6 animate-spin text-artisan-clay" />
                          <p className="mt-2 text-[11px] font-semibold text-artisan-clay">
                            Removing background…
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <figcaption className="mt-2 text-center text-[11px] font-medium text-artisan-clay">
                    {enhanced ? "Enhanced · background removed" : "Enhancing"}
                  </figcaption>
                </figure>
              </div>
            )}

            {rawPhoto && (
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  className="h-11 flex-1 rounded-2xl border-artisan-line"
                >
                  <Upload /> Change photo
                </Button>
                {enhanced && (
                  <span className="flex items-center gap-1.5 rounded-2xl bg-artisan-success px-3 text-xs font-semibold text-artisan-success-foreground">
                    <Wand2 className="size-3.5" /> Shop-ready
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {step === "voice" && (
          <div className="my-6 rounded-2xl bg-artisan-sand p-6 text-center">
            {!transcribing && (
              <>
                <Button
                  onClick={() =>
                    recording ? stopRecording() : (setSeconds(0), setRecording(true))
                  }
                  aria-label={recording ? "Stop recording" : "Start recording"}
                  className={`mx-auto grid size-24 place-items-center rounded-full bg-artisan-clay text-artisan-clay-foreground shadow-lg shadow-artisan-clay/20 hover:bg-artisan-clay/90 ${
                    recording ? "animate-pulse" : ""
                  }`}
                >
                  <Mic className="size-9" />
                </Button>
                <p className="mt-4 text-sm font-semibold">
                  {recording
                    ? `Listening… ${seconds}s — tap when done`
                    : "Tap and describe your product"}
                </p>
                <div
                  className="mt-3 flex h-8 items-center justify-center gap-1.5"
                  aria-hidden="true"
                >
                  {WAVE_BARS.map((height, index) => (
                    <span
                      key={index}
                      className="w-1 rounded-full bg-artisan-clay transition-all duration-300"
                      style={{
                        height: recording ? height + ((seconds * 7 + index * 5) % 14) : 6,
                        opacity: recording ? 1 : 0.4,
                      }}
                    />
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Say the name, material, how long it took, and the price you want.
                </p>
              </>
            )}
            {transcribing && (
              <div className="py-10">
                <Loader2 className="mx-auto size-7 animate-spin text-artisan-clay" />
                <p className="mt-3 text-sm font-semibold">Understanding your voice…</p>
                <p className="mt-1 text-xs text-muted-foreground">Filling the listing for you</p>
              </div>
            )}
          </div>
        )}

        {step === "details" && (
          <div className="my-6 space-y-4">
            {transcript && (
              <div className="rounded-2xl bg-artisan-sand p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  What we heard
                </p>
                <p className="mt-1.5 text-sm leading-6">{transcript}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-artisan-clay">
              <Pencil className="size-3.5" />
              <span className="text-[11px] font-semibold">
                Auto-filled from your voice — edit if needed
              </span>
            </div>

            <Field
              label="Product name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
            <div>
              <Label htmlFor="detail" className="text-xs font-semibold">
                Description
              </Label>
              <Textarea
                id="detail"
                rows={3}
                value={form.detail}
                onChange={(event) => setForm({ ...form, detail: event.target.value })}
                className="mt-1.5 rounded-xl border-artisan-line bg-artisan-sand"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Material"
                value={form.material}
                onChange={(v) => setForm({ ...form, material: v })}
              />
              <Field
                label="Time to make"
                value={form.craftTime}
                onChange={(v) => setForm({ ...form, craftTime: v })}
              />
            </div>
            <Field
              label="Price (₹)"
              value={form.price}
              onChange={(v) => setForm({ ...form, price: v })}
            />

            <div className="rounded-2xl bg-artisan-moss/10 p-4">
              <div className="flex items-center gap-2 text-artisan-moss">
                <Tag className="size-4" />
                <span className="text-xs font-semibold">
                  Suggested price ₹2,450 — buyers pay this for similar work
                </span>
              </div>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="my-10 grid place-items-center">
            <div className="grid size-20 place-items-center rounded-full bg-artisan-success text-artisan-success-foreground">
              <Check className="size-9" />
            </div>
            <p className="mt-4 text-sm font-semibold">{form.name}</p>
            <p className="text-xs text-muted-foreground">Listed at ₹{form.price}</p>
          </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-artisan-line px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
        <div className="mx-auto max-w-2xl">
          {step === "photo" && (
            <Button
              disabled={!enhanced}
              onClick={() => setStep("voice")}
              className="h-12 w-full rounded-2xl bg-artisan-ink text-base font-bold text-artisan-clay-foreground hover:bg-artisan-ink/90 disabled:opacity-40"
            >
              Continue to voice <ArrowRight className="ml-auto" />
            </Button>
          )}
          {step === "voice" && (
            <Button
              variant="ghost"
              onClick={() => setStep("details")}
              className="h-12 w-full rounded-2xl text-sm font-semibold text-muted-foreground"
            >
              Skip and type it myself
            </Button>
          )}
          {step === "details" && (
            <Button
              onClick={publish}
              className="h-12 w-full rounded-2xl bg-artisan-clay text-base font-bold text-artisan-clay-foreground hover:bg-artisan-clay/90"
            >
              Publish to my shop <Check className="ml-auto" />
            </Button>
          )}
          {step === "done" && (
            <Button
              onClick={onClose}
              className="h-12 w-full rounded-2xl bg-artisan-ink text-base font-bold text-artisan-clay-foreground hover:bg-artisan-ink/90"
            >
              Done
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs font-semibold">{label}</Label>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-11 rounded-xl border-artisan-line bg-artisan-sand"
      />
    </div>
  );
}
