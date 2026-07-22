"use client";

import { useState } from "react";
import type { WhoisResult } from "@/lib/whois";
import { Alert, Button, Card, Input, KeyValueGrid } from "@/components/ui/primitives";

export function WhoisLookupTool() {
  const [query, setQuery] = useState("google.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WhoisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/whois?q=${encodeURIComponent(query.trim())}`);
      const data = (await res.json()) as WhoisResult;
      if (!res.ok) throw new Error(data.error ?? "WHOIS lookup failed");
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "WHOIS lookup failed");
    } finally {
      setLoading(false);
    }
  }

  const rows =
    result?.kind === "domain"
      ? [
          { label: "Owner", value: result.owner },
          { label: "Registrar", value: result.registrar },
          { label: "Created", value: result.created },
          { label: "Updated", value: result.updated },
          { label: "Expire", value: result.expire },
          {
            label: "Name servers",
            value: result.nameServers?.join(", "),
            mono: true,
          },
          { label: "Status", value: result.status },
        ]
      : result
        ? [
            { label: "Allocation", value: result.allocation },
            { label: "Organization", value: result.organization },
            { label: "Abuse contact", value: result.abuseContact },
            { label: "ASN / handle", value: result.asn, mono: true },
          ]
        : [];

  return (
    <div className="space-y-6">
      <Card title="WHOIS lookup" description="Domain or IP via RDAP (registrar/regional registry data).">
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="google.com or 8.8.8.8"
          />
          <Button type="submit" disabled={loading} className="sm:w-40">
            {loading ? "…" : "Lookup"}
          </Button>
        </form>
      </Card>

      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card title={`WHOIS: ${result.query} (${result.kind})`}>
          <KeyValueGrid rows={rows} />
        </Card>
      )}
    </div>
  );
}
