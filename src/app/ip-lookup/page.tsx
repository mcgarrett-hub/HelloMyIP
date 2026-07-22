import { IpLookupTool } from "@/components/tools/ip-lookup-tool";
import { PageShell } from "@/components/layout/site-chrome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IP Lookup",
  description: "Look up geolocation, ISP, ASN, and reverse DNS for any IPv4 address.",
};

export default function IpLookupPage() {
  return (
    <PageShell
      activeHref="/ip-lookup"
      title="IP Lookup"
      description="Enter any public IP to see country, city, ISP, ASN, hosting/proxy hints, and a map."
    >
      <IpLookupTool />
    </PageShell>
  );
}
