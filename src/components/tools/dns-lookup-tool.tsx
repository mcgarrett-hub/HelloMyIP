"use client";

import { useState } from "react";
import { DNS_RECORD_TYPES, type DnsRecordType } from "@/lib/constants";
import type { DnsLookupResult } from "@/lib/dns";
import { Alert, Button, Card, Input, Select } from "@/components/ui/primitives";

export function DnsLookupTool() {
  const [name, setName] = useState("google.com");
  const [type, setType] = useState<DnsRecordType>("A");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DnsLookupResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch(
        `/api/dns?name=${encodeURIComponent(name.trim())}&type=${encodeURIComponent(type)}`
      );
      const data = (await res.json()) as {
        results?: DnsLookupResult[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "DNS lookup failed");
      setResults(data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DNS lookup failed");
    } finally {
      setLoading(false);
    }
  }

  async function lookupAll() {
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch(
        `/api/dns?name=${encodeURIComponent(name.trim())}&all=1`
      );
      const data = (await res.json()) as {
        results?: DnsLookupResult[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "DNS lookup failed");
      setResults(data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DNS lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card title="DNS lookup">
        <form onSubmit={onSubmit} className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-[var(--muted)]">Domain or name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="google.com" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--muted)]">Record type</label>
            <Select value={type} onChange={(e) => setType(e.target.value as DnsRecordType)}>
              {DNS_RECORD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "…" : "Lookup"}
            </Button>
            <Button type="button" variant="secondary" disabled={loading} onClick={lookupAll}>
              All types
            </Button>
          </div>
        </form>
      </Card>

      {error && <Alert variant="error">{error}</Alert>}

      {results.map((block) => (
        <Card key={`${block.name}-${block.type}`} title={`${block.type} records`}>
          {block.error && <Alert variant="error">{block.error}</Alert>}
          {block.answers.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No answers (status {block.status}).</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">TTL</th>
                    <th className="py-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {block.answers.map((a, i) => (
                    <tr key={i} className="border-b border-[var(--border)]/60">
                      <td className="py-2 pr-4 font-mono text-xs">{a.name}</td>
                      <td className="py-2 pr-4">{a.ttl}</td>
                      <td className="py-2 font-mono text-xs break-all">{a.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
