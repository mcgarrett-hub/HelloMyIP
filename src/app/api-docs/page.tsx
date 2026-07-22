import { PageShell } from "@/components/layout/site-chrome";
import { Card } from "@/components/ui/primitives";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API",
  description: "HelloMyIP JSON API for IP, DNS, WHOIS, and ping.",
};

export default function ApiDocsPage() {
  return (
    <PageShell
      activeHref="/api-docs"
      title="API"
      description="Simple JSON endpoints for integrations and scripts."
    >
      <div className="space-y-6">
        <Card title="GET /api/ip">
          <p className="text-sm text-[var(--muted)]">
            Returns geo info for the caller&apos;s IP, or pass <code className="font-mono">?q=8.8.8.8</code>.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">{`{
  "ip": "8.8.8.8",
  "country": "United States",
  "isp": "Google LLC"
}`}</pre>
        </Card>
        <Card title="GET /api/dns">
          <p className="text-sm text-[var(--muted)]">
            <code className="font-mono">?name=google.com&type=A</code> or <code className="font-mono">?name=google.com&all=1</code>
          </p>
        </Card>
        <Card title="GET /api/whois">
          <p className="text-sm text-[var(--muted)]">
            <code className="font-mono">?q=google.com</code> or <code className="font-mono">?q=8.8.8.8</code> (RDAP)
          </p>
        </Card>
        <Card title="GET /api/ping">
          <p className="text-sm text-[var(--muted)]">MVP health/timestamp endpoint; full ICMP ping planned.</p>
        </Card>
      </div>
    </PageShell>
  );
}
