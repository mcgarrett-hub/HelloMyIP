import { HomeDashboard } from "@/components/home/home-dashboard";
import { PageShell } from "@/components/layout/site-chrome";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <PageShell
      activeHref="/"
      title="What is my IP?"
      description="Your public IP is read from each HTTP request (middleware), then enriched with geo data. On localhost, your browser resolves public IPv4 automatically."
    >
      <HomeDashboard />
    </PageShell>
  );
}
