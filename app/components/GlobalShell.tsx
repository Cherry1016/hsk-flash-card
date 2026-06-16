"use client";

import { useAppShell } from "./AppShellContext";
import DrawerMenu from "./DrawerMenu";

export default function GlobalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { drawerOpen, setDrawerOpen } = useAppShell();

  return (
    <>
      <DrawerMenu />
      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>
      <main className="min-h-full">{children}</main>
    </>
  );
}
