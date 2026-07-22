import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  title,
  description,
}: {
  className?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm",
        className
      )}
    >
      {(title || description) && (
        <header className="border-b border-[var(--border)] px-5 py-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {description && (
            <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
          )}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function KeyValueGrid({
  rows,
}: {
  rows: { label: string; value: React.ReactNode; mono?: boolean }[];
}) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="rounded-lg bg-slate-50/80 p-3 dark:bg-slate-900/50">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            {row.label}
          </dt>
          <dd
            className={cn(
              "mt-1 break-all text-sm font-medium",
              row.mono && "font-mono text-xs sm:text-sm"
            )}
          >
            {row.value ?? "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50",
        variant === "primary" &&
          "bg-brand-600 text-white hover:bg-brand-700",
        variant === "secondary" &&
          "border border-[var(--border)] bg-[var(--card)] hover:bg-slate-50 dark:hover:bg-slate-800",
        className
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm shadow-sm outline-none ring-brand-500 placeholder:text-slate-400 focus:ring-2",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-brand-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Alert({
  variant = "info",
  children,
}: {
  variant?: "info" | "error" | "success";
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
    error: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
  };
  return (
    <div className={cn("rounded-lg border px-4 py-3 text-sm", styles[variant])}>
      {children}
    </div>
  );
}
