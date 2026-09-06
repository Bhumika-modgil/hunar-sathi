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
import { useLanguage } from "@/lib/i18n";
import { enhanceProductPhoto } from "@/lib/enhance-photo";

export type NewProduct = {
  name: string;
  detail: string;
  price: string;
  status: string;
  image: string;
  tag: string;
  /**
   * Optional i18n keys for built-in sample products only. When present, the
   * UI displays the translated string for the current language instead of
   * `name`/`detail`/`tag`. Products a user creates through this flow don't
   * get these — their own typed or spoken words are shown as-is.
   */
  nameKey?: string;
  detailKey?: string;
  tagKey?: string;
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
  const { t } = useLanguage();
  const [rawPhoto, setRawPhoto] = useState<string | null>(null);
  const [enhancedPhoto, setEnhancedPhoto] = useState<string | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);
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

    if (rawPhoto) URL.revokeObjectURL(rawPhoto);
    if (enhancedPhoto) URL.revokeObjectURL(enhancedPhoto);

    const previewUrl = URL.createObjectURL(file);
    setRawPhoto(previewUrl);
    setEnhancedPhoto(null);
    setEnhanceError(null);
    setEnhanced(false);
    setEnhancing(true);

    const formData = new FormData();
    formData.set("image", file);

    enhanceProductPhoto({ data: formData })
      .then(async (response) => {
        if (!response.ok) {
          let message = "Photo enhancement isn't available right now.";
          try {
            const body = (await response.clone().json()) as { error?: string };
            if (body?.error) message = body.error;
          } catch {
            // Non-JSON error body — keep the generic message.
          }
          console.error("Photo enhancement failed:", message);
          setEnhanceError(message);
          setEnhanced(true); // don't block the flow — fall back to the original photo
          return;
        }

        const blob = await response.blob();
        setEnhancedPhoto(URL.createObjectURL(blob));
        setEnhanced(true);
      })
      .catch((error: unknown) => {
        console.error("Photo enhancement request failed:", error);
        setEnhanceError("Couldn't reach the photo enhancement service.");
        setEnhanced(true);
      })
      .finally(() => setEnhancing(false));
  };

  useEffect(() => {
    return () => {
      if (rawPhoto) URL.revokeObjectURL(rawPhoto);
      if (enhancedPhoto) URL.revokeObjectURL(enhancedPhoto);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      image: enhancedPhoto ?? rawPhoto ?? "",
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
                {t("addProduct.aiStudio")}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {step === "photo" && t("addProduct.step1Title")}
              {step === "voice" && t("addProduct.step2Title")}
              {step === "details" && t("addProduct.step3Title")}
              {step === "done" && t("addProduct.doneTitle")}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {step === "photo" && t("addProduct.step1Subtitle")}
              {step === "voice" && t("addProduct.step2Subtitle")}
              {step === "details" && t("addProduct.step3Subtitle")}
              {step === "done" && t("addProduct.doneSubtitle")}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t("addProduct.close")}
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
                  <p className="mt-2 text-sm font-semibold">{t("addProduct.takeOrChoosePhoto")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("addProduct.aiShopReady")}
                  </p>
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
                    {t("addProduct.original")}
                  </figcaption>
                </figure>
                <figure>
                  <div className="relative overflow-hidden rounded-2xl border-2 border-artisan-clay/30 bg-[repeating-conic-gradient(var(--artisan-line)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]">
                    <img
                      src={enhancedPhoto ?? rawPhoto}
                      alt="AI enhanced product photo"
                      className={`aspect-square w-full object-cover transition duration-700 ${
                        enhancing ? "blur-[2px] grayscale" : ""
                      }`}
                    />
                    {enhancing && (
                      <div className="absolute inset-0 grid place-items-center bg-artisan-surface/70">
                        <div className="text-center">
                          <Loader2 className="mx-auto size-6 animate-spin text-artisan-clay" />
                          <p className="mt-2 text-[11px] font-semibold text-artisan-clay">
                            {t("addProduct.removingBackground")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <figcaption className="mt-2 text-center text-[11px] font-medium text-artisan-clay">
                    {enhancing && t("addProduct.enhancing")}
                    {!enhancing && enhanced && !enhanceError && t("addProduct.enhanced")}
                    {!enhancing && enhanceError && t("addProduct.enhanceFallback")}
                  </figcaption>
                </figure>
              </div>
            )}

            {enhanceError && (
              <p className="mt-3 text-center text-xs text-muted-foreground">{enhanceError}</p>
            )}

            {rawPhoto && (
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  className="h-11 flex-1 rounded-2xl border-artisan-line"
                >
                  <Upload /> {t("addProduct.changePhoto")}
                </Button>
                {enhancedPhoto && !enhanceError && (
                  <span className="flex items-center gap-1.5 rounded-2xl bg-artisan-success px-3 text-xs font-semibold text-artisan-success-foreground">
                    <Wand2 className="size-3.5" /> {t("addProduct.shopReady")}
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
                  aria-label={
                    recording ? t("addProduct.stopRecording") : t("addProduct.startRecording")
                  }
                  className={`mx-auto grid size-24 place-items-center rounded-full bg-artisan-clay text-artisan-clay-foreground shadow-lg shadow-artisan-clay/20 hover:bg-artisan-clay/90 ${
                    recording ? "animate-pulse" : ""
                  }`}
                >
                  <Mic className="size-9" />
                </Button>
                <p className="mt-4 text-sm font-semibold">
                  {recording ? t("addProduct.listening", { seconds }) : t("addProduct.tapDescribe")}
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
                <p className="mt-4 text-xs text-muted-foreground">{t("addProduct.voiceHint")}</p>
              </>
            )}
            {transcribing && (
              <div className="py-10">
                <Loader2 className="mx-auto size-7 animate-spin text-artisan-clay" />
                <p className="mt-3 text-sm font-semibold">{t("addProduct.understandingVoice")}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("addProduct.fillingListing")}
                </p>
              </div>
            )}
          </div>
        )}

        {step === "details" && (
          <div className="my-6 space-y-4">
            {transcript && (
              <div className="rounded-2xl bg-artisan-sand p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  {t("addProduct.whatWeHeard")}
                </p>
                <p className="mt-1.5 text-sm leading-6">{transcript}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-artisan-clay">
              <Pencil className="size-3.5" />
              <span className="text-[11px] font-semibold">{t("addProduct.autoFilled")}</span>
            </div>

            <Field
              label={t("addProduct.productName")}
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
            <div>
              <Label htmlFor="detail" className="text-xs font-semibold">
                {t("addProduct.description")}
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
                label={t("addProduct.material")}
                value={form.material}
                onChange={(v) => setForm({ ...form, material: v })}
              />
              <Field
                label={t("addProduct.timeToMake")}
                value={form.craftTime}
                onChange={(v) => setForm({ ...form, craftTime: v })}
              />
            </div>
            <Field
              label={t("addProduct.priceLabel")}
              value={form.price}
              onChange={(v) => setForm({ ...form, price: v })}
            />

            <div className="rounded-2xl bg-artisan-moss/10 p-4">
              <div className="flex items-center gap-2 text-artisan-moss">
                <Tag className="size-4" />
                <span className="text-xs font-semibold">{t("addProduct.suggestedPrice")}</span>
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
            <p className="text-xs text-muted-foreground">
              {t("addProduct.listedAt", { price: form.price })}
            </p>
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
              {t("addProduct.continueToVoice")} <ArrowRight className="ml-auto" />
            </Button>
          )}
          {step === "voice" && (
            <Button
              variant="ghost"
              onClick={() => setStep("details")}
              className="h-12 w-full rounded-2xl text-sm font-semibold text-muted-foreground"
            >
              {t("addProduct.skipType")}
            </Button>
          )}
          {step === "details" && (
            <Button
              onClick={publish}
              className="h-12 w-full rounded-2xl bg-artisan-clay text-base font-bold text-artisan-clay-foreground hover:bg-artisan-clay/90"
            >
              {t("addProduct.publish")} <Check className="ml-auto" />
            </Button>
          )}
          {step === "done" && (
            <Button
              onClick={onClose}
              className="h-12 w-full rounded-2xl bg-artisan-ink text-base font-bold text-artisan-clay-foreground hover:bg-artisan-ink/90"
            >
              {t("addProduct.done")}
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
