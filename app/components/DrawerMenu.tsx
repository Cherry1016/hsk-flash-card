"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppShell } from "./AppShellContext";

export default function DrawerMenu() {
  const { drawerOpen, setDrawerOpen } = useAppShell();
  const pathname = usePathname();
  const router = useRouter();

  const isFlashcardPage = pathname === "/flashcard";
  const isGuessPage = pathname === "/guess";
  const isStudyPage = isFlashcardPage || isGuessPage;

  const handleNavigation = (href: string) => {
    router.push(href);
    setDrawerOpen(false);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="text-lg font-semibold text-slate-900">Menu</div>
        <button
          className="rounded-full border border-slate-200 px-2 py-1 text-sm text-slate-700 hover:bg-slate-100"
          onClick={() => setDrawerOpen(false)}
        >
          Close
        </button>
      </div>
      <div className="space-y-2 p-4">
        <>
          <button
            className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium ${isFlashcardPage ? "bg-slate-900 text-white" : "border bg-white text-slate-900"}`}
            onClick={() => handleNavigation("/flashcard")}
          >
            Flashcard Mode
          </button>
          <button
            className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium ${isGuessPage ? "bg-slate-900 text-white" : "border bg-white text-slate-900"}`}
            onClick={() => handleNavigation("/guess")}
          >
            Guess from Meaning
          </button>
          <Link
            href="/"
            className="block rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
            onClick={() => setDrawerOpen(false)}
          >
            Setting Levels
          </Link>
        </>
        <Link
          href="/bookmarks"
          className="block rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
          onClick={() => setDrawerOpen(false)}
        >
          Bookmarks
        </Link>
      </div>
    </div>
  );
}
