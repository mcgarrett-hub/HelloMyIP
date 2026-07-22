import { DnsLookupTool } from "@/components/tools/dns-lookup-tool";
import { PageShell } from "@/components/layout/site-chrome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DNS Lookup",
  description: "Query A, AAAA, MX, NS, TXT, CNAME, SOA, PTR, SRV, and CAA records.",
};

export default function DnsLookupPage() {
  return (
    <PageShell
      activeHref="/dns-lookup"
      title="DNS Lookup"
      description="Look up DNS records for any domain using Google Public DNS (JSON API)."
    >
      <DnsLookupTool />
    </PageShell>
  );
}
