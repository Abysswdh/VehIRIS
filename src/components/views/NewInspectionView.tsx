"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type DragEvent } from "react";
import clsx from "clsx";
import { ArrowRight, Check, ChevronDown, ImagePlus, Loader2, ShieldCheck, Upload, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { toast } from "@/components/ui/Toaster";
import { fmt, useI18n } from "@/lib/i18n";
import { inspectionsStore, nextInspectionId } from "@/lib/app-state";
import { vehicles, type InspectionType } from "@/lib/mock-data";

interface Photo {
  id: number;
  url: string;
  name: string;
}

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png"];

export function NewInspectionView() {
  const { t } = useI18n();
  const router = useRouter();

  const [vehicle, setVehicle] = useState(`${vehicles[0].model}|${vehicles[0].plate}`);
  const [date, setDate] = useState("2026-10-26T10:42");
  const [type, setType] = useState<InspectionType>("return");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);
  const photosRef = useRef(photos);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  // Free object URLs when leaving the page.
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  const addFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    const valid = list.filter((f) => ACCEPTED.includes(f.type) && f.size <= MAX_BYTES);
    if (valid.length < list.length) toast(t.newInspection.invalidFile, "error");
    if (!valid.length) return;
    setPhotos((prev) => [...prev, ...valid.map((f) => ({ id: ++idRef.current, url: URL.createObjectURL(f), name: f.name }))]);
  };

  const removePhoto = (id: number) =>
    setPhotos((prev) => {
      const p = prev.find((x) => x.id === id);
      if (p) URL.revokeObjectURL(p.url);
      return prev.filter((x) => x.id !== id);
    });

  const clearAll = () =>
    setPhotos((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!analyzing && e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const step1Done = Boolean(vehicle && date);
  const step2Done = photos.length > 0;
  const currentStep = analyzing ? 3 : !step1Done ? 1 : !step2Done ? 2 : 3;

  const analyze = () => {
    if (!vehicle) return toast(t.newInspection.needVehicle, "error");
    if (!photos.length) return toast(t.newInspection.needPhotos, "error");
    setAnalyzing(true);
    window.setTimeout(() => {
      const [model, plate] = vehicle.split("|");
      const list = inspectionsStore.get();
      const id = nextInspectionId(list);
      inspectionsStore.set([
        { id, vehicle: model, plate, date, type, findings: Math.floor(Math.random() * 3), status: "pending" },
        ...list,
      ]);
      toast(fmt(t.newInspection.queued, { id }));
      router.push("/inspections");
    }, 2200);
  };

  const steps = [t.newInspection.step1, t.newInspection.step2, t.newInspection.step3];

  return (
    <>
      <PageHeader title={t.newInspection.title} subtitle={t.newInspection.sub} />

      {/* Stepper */}
      <ol className="card mb-5 flex animate-slide-up items-center gap-2 overflow-x-auto px-4 py-4 sm:gap-4 sm:px-6">
        {steps.map((label, i) => {
          const n = i + 1;
          const done = n < currentStep;
          const active = n === currentStep;
          return (
            <li key={label} className={clsx("flex items-center gap-2 sm:gap-4", i < steps.length - 1 && "flex-1")}>
              <span className="flex shrink-0 items-center gap-3">
                <span
                  className={clsx(
                    "grid size-9 place-items-center rounded-full text-xs font-bold transition-all duration-300",
                    active && "bg-brand-600 text-white shadow-brand ring-4 ring-brand-100",
                    done && "bg-brand-600 text-white",
                    !active && !done && (n === currentStep + 1 ? "bg-brand-50 text-brand-600" : "bg-slate-100 text-slate-400"),
                  )}
                >
                  {done ? <Check className="size-4" strokeWidth={3} /> : String(n).padStart(2, "0")}
                </span>
                <span className={clsx("text-sm whitespace-nowrap", active ? "font-bold text-slate-900" : done ? "font-semibold text-slate-700" : "font-medium text-slate-500")}>
                  {label}
                </span>
              </span>
              {i < steps.length - 1 && (
                <span className="relative hidden h-px min-w-6 flex-1 overflow-hidden bg-line sm:block">
                  <span className={clsx("absolute inset-0 origin-left bg-brand-500 transition-transform duration-500", done ? "scale-x-100" : "scale-x-0")} />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        {/* Details form */}
        <section className="card animate-slide-up p-5 sm:p-6" style={{ animationDelay: "60ms" }}>
          <h2 className="text-lg font-bold text-slate-900">{t.newInspection.details}</h2>
          <p className="mt-1 text-xs text-slate-500">{t.newInspection.detailsSub}</p>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="vehicle" className="field-label">{t.newInspection.vehicle}</label>
              <div className="relative">
                <select
                  id="vehicle"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  disabled={analyzing}
                  className="field appearance-none pr-10"
                >
                  <option value="" disabled>{t.newInspection.selectVehicle}</option>
                  {vehicles.map((v) => (
                    <option key={v.plate} value={`${v.model}|${v.plate}`}>
                      {v.model} • {v.plate}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div>
              <label htmlFor="inspection-date" className="field-label">{t.newInspection.date}</label>
              <input
                id="inspection-date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={analyzing}
                className="field"
              />
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="field-label">{t.newInspection.type}</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              {(["return", "pre"] as const).map((v) => {
                const selected = type === v;
                return (
                  <button
                    key={v}
                    id={`type-${v}`}
                    type="button"
                    aria-pressed={selected}
                    disabled={analyzing}
                    onClick={() => setType(v)}
                    className={clsx(
                      "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200",
                      selected
                        ? "border-brand-400 bg-brand-50 font-semibold text-brand-600 ring-4 ring-brand-50"
                        : "border-line bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700",
                    )}
                  >
                    <span className={clsx("transition-all duration-200", selected ? "w-4 opacity-100" : "w-0 opacity-0")}>
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                    {v === "return" ? t.newInspection.typeReturn : t.newInspection.typePre}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-7">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t.newInspection.photos}</h3>
                <p className="mt-1 text-xs text-slate-500">{t.newInspection.photosHint}</p>
              </div>
              {photos.length > 0 && !analyzing && (
                <button type="button" onClick={clearAll} className="text-xs font-semibold text-slate-500 hover:text-brand-600">
                  {t.newInspection.clearAll}
                </button>
              )}
            </div>

            <input
              ref={inputRef}
              id="photo-input"
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              multiple
              className="sr-only"
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
                e.target.value = "";
              }}
            />

            {photos.length === 0 ? (
              <button
                type="button"
                id="photo-dropzone"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={clsx(
                  "mt-4 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200",
                  dragging ? "scale-[1.01] border-brand-400 bg-brand-50/60" : "border-slate-200 bg-slate-50/60 hover:border-brand-300 hover:bg-brand-50/30",
                )}
              >
                <span className={clsx("grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-transform duration-300", dragging && "-translate-y-1 scale-110")}>
                  <Upload className="size-5" strokeWidth={2} />
                </span>
                <span className="mt-4 text-sm font-bold text-slate-800">{dragging ? t.newInspection.dropActive : t.newInspection.drop}</span>
                <span className="mt-1.5 text-xs text-slate-500">{t.newInspection.sides}</span>
              </button>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={clsx("mt-4 rounded-2xl border-2 border-dashed p-3 transition", dragging ? "border-brand-400 bg-brand-50/60" : "border-slate-200 bg-slate-50/60")}
              >
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {photos.map((p) => (
                    <li key={p.id} className="group relative aspect-[4/3] animate-slide-up overflow-hidden rounded-xl bg-slate-200 ring-1 ring-black/5">
                      <Image src={p.url} alt={p.name} fill unoptimized className="object-cover" />
                      {analyzing ? (
                        <span className="absolute inset-0 bg-ink-900/30">
                          <span className="absolute inset-y-0 w-1/3 animate-scan bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removePhoto(p.id)}
                          aria-label={t.newInspection.remove}
                          className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full bg-ink-900/70 text-white opacity-100 backdrop-blur transition hover:bg-brand-600 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                      <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-2 pt-4 pb-1.5 text-[10px] font-medium text-white">
                        {p.name}
                      </span>
                    </li>
                  ))}
                  {!analyzing && (
                    <li>
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white text-xs font-semibold text-slate-500 transition hover:border-brand-300 hover:text-brand-600"
                      >
                        <ImagePlus className="size-5" />
                        {t.newInspection.drop.split(" ")[0]}
                      </button>
                    </li>
                  )}
                </ul>
                <p className="mt-3 px-1 text-xs font-medium text-emerald-600">{fmt(t.newInspection.uploaded, { n: photos.length })}</p>
              </div>
            )}
          </div>
        </section>

        {/* Right column */}
        <aside className="flex flex-col gap-5">
          <section className="card animate-slide-up p-5 sm:p-6" style={{ animationDelay: "120ms" }}>
            <h2 className="text-lg font-bold text-slate-900">{t.newInspection.tipsTitle}</h2>
            <p className="mt-1 text-xs text-slate-500">{t.newInspection.tipsSub}</p>
            <ul className="mt-6 space-y-4">
              {[t.newInspection.tip1, t.newInspection.tip2, t.newInspection.tip3, t.newInspection.tip4].map((tip) => (
                <li key={tip} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Check className="size-4" strokeWidth={2.5} />
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <section className="animate-slide-up rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 sm:p-6" style={{ animationDelay: "180ms" }}>
            <h2 className="flex items-center gap-2 text-base font-bold text-brand-600">
              <ShieldCheck className="size-5" strokeWidth={2} />
              {t.newInspection.hitlTitle}
            </h2>
            <p className="mt-2.5 text-[13px] leading-relaxed text-slate-600">{t.newInspection.hitlBody}</p>
            <div className="mt-5 flex justify-end">
              <button
                id="analyze-vehicle"
                type="button"
                onClick={analyze}
                disabled={analyzing}
                className="btn-primary h-12 w-full px-6 sm:w-auto"
              >
                {analyzing ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" strokeWidth={2.5} />}
                {analyzing ? t.newInspection.analyzing : t.newInspection.analyze}
              </button>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
