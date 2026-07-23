import Link from "next/link";
import { MAIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ToolsSidebar } from "./tools-sidebar";
export { ToolsSidebar };

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-300">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
            IP
          </span>
          <span>HelloMyIP</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {MAIN_NAV.filter((n) =>
            ["/", "/ip-lookup", "/dns-lookup", "/whois", "/blog", "/api-docs"].includes(n.href)
          ).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-[var(--muted)] sm:px-6">
        <p>
          HelloMyIP — IP lookup, DNS, WHOIS, and network tools. Built with Next.js.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} HelloMyIP</p>
      </div>
    </footer>
  );
}

export function PageShell({
  title,
  description,
  activeHref,
  children,
}: {
  title: string;
  description?: string;
  activeHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6">
      <ToolsSidebar activeHref={activeHref} />
      <div className="min-w-0 flex-1 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-2 max-w-3xl text-[var(--muted)]">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export function ComingSoon({ title }: { title: string }) {
  return (
    <PageShell title={title} activeHref={undefined}>
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <p className="text-lg font-medium">Coming soon</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This tool is on the roadmap. MVP includes Home, IP Lookup, DNS, WHOIS, Blog, and API.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline"
        >
          Back to home
        </Link>
      </div>
    </PageShell>
  );
}
