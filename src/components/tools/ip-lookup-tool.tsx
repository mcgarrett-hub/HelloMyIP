"use client";

import { useState } from "react";
import { Alert, Button, Card, Input, KeyValueGrid } from "@/components/ui/primitives";
import type { IpGeoResult } from "@/lib/ip";

export function IpLookupTool() {
  const [query, setQuery] = useState("8.8.8.8");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IpGeoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/ip?q=${encodeURIComponent(query.trim())}`);
      const data = (await res.json()) as IpGeoResult & { error?: string };
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Lookup failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Look up any IP">
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="8.8.8.8"
            aria-label="IP address"
          />
          <Button type="submit" disabled={loading} className="sm:w-40">
            {loading ? "Looking up…" : "Lookup"}
          </Button>
        </form>
      </Card>

      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card title={`Results for ${result.ip}`}>
          <KeyValueGrid
            rows={[
              { label: "Country", value: result.country },
              { label: "City", value: result.city },
              { label: "Region", value: result.region },
              { label: "ISP", value: result.isp },
              { label: "Organization", value: result.org },
              { label: "ASN", value: result.asn ?? result.as },
              { label: "Reverse DNS", value: result.reverseDns, mono: true },
              { label: "Hosting?", value: result.hosting ? "Yes" : "No" },
              { label: "Proxy/VPN?", value: result.proxy ? "Likely" : "No flag" },
              { label: "Mobile?", value: result.mobile ? "Yes" : "No" },
              {
                label: "Latitude",
                value: result.lat != null ? String(result.lat) : "—",
              },
              {
                label: "Longitude",
                value: result.lon != null ? String(result.lon) : "—",
              },
            ]}
          />
          {result.lat != null && result.lon != null && (
            <iframe
              title="Map"
              className="mt-4 h-64 w-full rounded-lg border border-[var(--border)]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${result.lat},${result.lon}&z=10&output=embed`}
            />
          )}
        </Card>
      )}
    </div>
  );
}
