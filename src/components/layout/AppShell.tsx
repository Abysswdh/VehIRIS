"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useSession } from "@/lib/app-state";
import { useHydrated } from "@/lib/store";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const hydrated = useHydrated();
  const router = useRouter();

  // Mock auth guard: bounce to login when there is no session.
  useEffect(() => {
    if (hydrated && !session) router.replace("/login");
  }, [hydrated, session, router]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-dvh">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-h-dvh flex-col lg:pl-[264px]">
        <Header onMenu={() => setOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto w-full max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
