import Link from "next/link";
import { PageShell } from "@/components/layout/site-chrome";
import { Card } from "@/components/ui/primitives";

const TOOLS = [
  "IP Calculator (CIDR/Subnet)",
  "CIDR Calculator",
  "IPv4 ↔ IPv6 Converter",
  "Binary ↔ Decimal Converter",
  "URL Encoder/Decoder",
  "Base64 Encoder/Decoder",
  "Hash Generator (MD5, SHA-1, SHA-256)",
  "UUID Generator",
  "Password Generator",
  "QR Code Generator",
  "JSON Formatter",
  "XML Formatter",
  "Timestamp Converter",
];

export default function ToolsPage() {
  return (
    <PageShell
      activeHref="/tools"
      title="More tools"
      description="Utility pages for SEO and power users (roadmap)."
    >
      <Card title="Planned utilities">
        <ul className="grid gap-2 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <li key={t} className="rounded-md border border-[var(--border)] px-3 py-2 text-sm">
              {t} <span className="text-xs text-[var(--muted)]">— soon</span>
            </li>
          ))}
        </ul>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline">
          Back to home
        </Link>
      </Card>
    </PageShell>
  );
}
