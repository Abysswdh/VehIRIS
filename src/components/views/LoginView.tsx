"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CarIllustration } from "@/components/illustrations/CarIllustration";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { toast } from "@/components/ui/Toaster";
import { useI18n } from "@/lib/i18n";
import { sessionStore } from "@/lib/app-state";

export function LoginView() {
  const { t } = useI18n();
  const router = useRouter();

  const [email, setEmail] = useState("inspector@vehiris.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast(t.login.errEmail, "error");
      return;
    }
    if (!password || password.length < 6) {
      toast(t.login.errPassword, "error");
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      sessionStore.set({ email });
      toast(t.login.welcome);
      router.push("/dashboard");
    }, 700);
  };

  const handleForgot = () => {
    toast(t.login.forgotHint, "info");
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* LEFT COLUMN: Dark Hero Panel */}
      <section className="relative flex flex-1 flex-col justify-between overflow-hidden bg-ink-900 bg-grid px-6 py-8 text-white sm:px-12 lg:min-h-screen lg:px-16 xl:px-20">
        {/* Subtle radial background glow */}
        <div className="pointer-events-none absolute -top-40 -left-40 size-[500px] rounded-full bg-brand-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-10 right-0 size-[400px] rounded-full bg-brand-500/10 blur-[100px]" />

        {/* Top: Logo & Tagline */}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <Logo tone="dark" className="h-[32px] sm:h-[36px]" priority />
            <p className="mt-1 text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase sm:text-[11px]">
              {t.common.fullTagline}
            </p>
          </div>
          <div className="lg:hidden">
            <LanguageSwitcher tone="dark" />
          </div>
        </div>

        {/* Center: Hero Heading + Animated Car Section */}
        <div className="relative z-10 my-10 max-w-xl lg:my-auto">
          {/* Large Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl">
            {t.login.headline1}{" "}
            <span className="text-brand-500">{t.login.headline2}</span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            {t.login.sub}
          </p>

          {/* Car Graphic with dynamic floating scan cards */}
          <div className="relative mt-8 sm:mt-12">
            <CarIllustration className="w-full max-w-[560px] drop-shadow-2xl" />

            {/* Floating Badge 1: AI Scan Ready */}
            <div className="absolute top-8 right-2 sm:right-6 animate-float rounded-xl border border-white/10 bg-ink-900/90 px-3 py-2.5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="grid size-7 place-items-center rounded-lg bg-brand-500/20 text-brand-400">
                  <ScanLine className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{t.login.scanReady}</p>
                  <p className="text-[10px] text-slate-400">{t.login.scanSub}</p>
                </div>
              </div>
            </div>

            {/* Floating Badge 2: Inspector Verified */}
            <div
              className="absolute -bottom-4 left-2 sm:left-4 animate-float rounded-xl border border-white/10 bg-ink-900/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-md"
              style={{ animationDelay: "2s" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="grid size-7 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{t.login.verified}</p>
                  <p className="text-[10px] text-slate-400">{t.login.verifiedSub}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom feature pills */}
          <div className="mt-12 flex flex-wrap gap-2.5 pt-4">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300">
              <ScanLine className="size-3.5 text-brand-400" />
              <span>{t.login.featDamage}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <span>{t.login.featReview}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300">
              <FileText className="size-3.5 text-sky-400" />
              <span>{t.login.featReports}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-6 text-xs text-slate-500">
          <p>© 2026 VehIRIS. {t.login.builtFor}</p>
        </div>
      </section>

      {/* RIGHT COLUMN: Sign In Card Panel */}
      <section className="relative flex flex-1 flex-col justify-between bg-canvas px-4 py-8 sm:px-8 sm:py-12 lg:px-12 xl:px-16">
        {/* Top bar with Language switcher */}
        <div className="flex min-h-[36px] items-center justify-end">
          <div className="hidden sm:block">
            <LanguageSwitcher tone="light" />
          </div>
        </div>

        {/* Center: Login Form Card */}
        <div className="mx-auto my-auto w-full max-w-md py-8">
          <div className="card rounded-3xl p-6 sm:p-9 shadow-xl shadow-slate-900/5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t.login.welcome}
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
              {t.login.welcomeSub}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="field-label">
                  {t.login.email}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="inspector@vehiris.com"
                    className="field pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="field-label">
                  {t.login.password}
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••"
                    className="field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t.login.hidePassword : t.login.showPassword}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    {t.login.remember}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleForgot}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  {t.login.forgot}
                </button>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="submit-login"
                disabled={loading}
                className="btn-primary mt-3 h-12 w-full text-base font-bold shadow-brand"
              >
                <span>{loading ? t.login.signingIn : t.login.submit}</span>
                <ArrowRight className="size-4" strokeWidth={2.5} />
              </button>
            </form>
          </div>

          {/* Support note under the card */}
          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500">
              {t.login.needAccount}
            </p>
          </div>
        </div>


      </section>
    </div>
  );
}
