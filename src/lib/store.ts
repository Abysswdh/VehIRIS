"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed store usable with `useSyncExternalStore`.
 * The server snapshot (and first client render) always uses `initial`, so
 * hydration stays consistent; the persisted value is picked up right after.
 */
export function createPersistentStore<T>(key: string, initial: T) {
  let value: T = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) value = JSON.parse(raw) as T;
    } catch {
      /* ignore corrupt storage */
    }
  };

  const store = {
    get(): T {
      load();
      return value;
    },
    getServer(): T {
      return initial;
    },
    set(next: T | ((prev: T) => T)) {
      load();
      value = typeof next === "function" ? (next as (p: T) => T)(value) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* storage full / disabled */
      }
      listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          loaded = false;
          load();
          listener();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
  return store;
}

export function useStore<T>(store: ReturnType<typeof createPersistentStore<T>>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}

/** True only after hydration on the client. */
const noopSubscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
