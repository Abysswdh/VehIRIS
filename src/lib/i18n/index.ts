"use client";

import { useCallback, useEffect } from "react";
import { createPersistentStore, useStore } from "@/lib/store";
import { dictionaries, type Locale } from "./dictionaries";

const localeStore = createPersistentStore<Locale>("vehiris-locale", "en");

/** Replace `{name}` placeholders in a translated string. */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function useI18n() {
  const locale = useStore(localeStore);
  const setLocale = useCallback((l: Locale) => localeStore.set(l), []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return { locale, setLocale, t: dictionaries[locale] };
}

export type { Locale };
