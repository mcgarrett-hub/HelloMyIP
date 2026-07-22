import { WhoisLookupTool } from "@/components/tools/whois-lookup-tool";
import { PageShell } from "@/components/layout/site-chrome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WHOIS Lookup",
  description: "WHOIS / RDAP lookup for domains and IP allocations.",
};

export default function WhoisPage() {
  return (
    <PageShell
      activeHref="/whois"
      title="WHOIS Lookup"
      description="Domain registration and IP allocation details via RDAP."
    >
      <WhoisLookupTool />
    </PageShell>
  );
}
