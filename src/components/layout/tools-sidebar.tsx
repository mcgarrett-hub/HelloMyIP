"use client";

import { useState } from "react";
import Link from "next/link";
import { MAIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ToolsSidebar({ activeHref }: { activeHref?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Nút hamburger - chỉ hiện dưới breakpoint lg */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-4 flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium lg:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Tools
      </button>

      {/* Lớp phủ tối khi mở drawer trên mobile */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: cố định + tĩnh trên desktop (lg trở lên), drawer trượt trên mobile */}
      <aside
        className={cn(
          "w-64 shrink-0",
          "fixed inset-y-0 left-0 z-50 -translate-x-full transition-transform duration-300",
          "lg:static lg:z-auto lg:translate-x-0 lg:transition-none",
          open && "translate-x-0"
        )}
      >
        <div className="h-full overflow-y-auto border-r border-[var(--border)] bg-[var(--card)] p-3 lg:sticky lg:top-20 lg:h-auto lg:rounded-xl lg:border">
          <div className="mb-2 flex items-center justify-between lg:hidden">
            <p className="px-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Tools
            </p>
            <button
              onClick={() => setOpen(false)}
              className="p-2"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="hidden px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)] lg:block">
            Tools
          </p>

          <ul className="space-y-0.5">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800",
                    activeHref === item.href &&
                      "bg-brand-50 font-medium text-brand-800 dark:bg-brand-950/50 dark:text-brand-200"
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge === "soon" && (
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] uppercase dark:bg-slate-700">
                      Soon
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}