"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { VisitorPayload } from "@/lib/visitor";
import type { IpGeoResult } from "@/lib/ip";

export type VisitorIpState = {
  loading: boolean;
  error: string | null;
  visitorIp: string | null;
  publicIpv4: string | null;
  publicIpv6: string | null;
  geo: IpGeoResult | null;
  source: VisitorPayload["source"] | null;
  refresh: () => Promise<void>;
};

const VisitorIpContext = createContext<VisitorIpState | null>(null);

async function fetchPublicIpv4FromBrowser(): Promise<string | null> {
  try {
    const res = await fetch("https://api4.ipify.org?format=json", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ip?: string };
    return data.ip ?? null;
  } catch {
    return null;
  }
}

async function fetchPublicIpv6FromBrowser(): Promise<string | null> {
  try {
    const res = await fetch("https://api6.ipify.org?format=json", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ip?: string };
    return data.ip ?? null;
  } catch {
    return null;
  }
}

async function fetchGeoForIp(ip: string): Promise<IpGeoResult | null> {
  const res = await fetch(`/api/ip?q=${encodeURIComponent(ip)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as IpGeoResult;
}

/**
 * Background loader: on every visit, calls /api/visitor (server reads request IP),
 * then falls back to browser-side public IP services when the request IP is local/private.
 */
export function VisitorIpProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitorIp, setVisitorIp] = useState<string | null>(null);
  const [publicIpv4, setPublicIpv4] = useState<string | null>(null);
  const [publicIpv6, setPublicIpv6] = useState<string | null>(null);
  const [geo, setGeo] = useState<IpGeoResult | null>(null);
  const [source, setSource] = useState<VisitorPayload["source"] | null>(null);
  const ran = useRef(false);

  const resolve = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const visitorRes = await fetch("/api/visitor", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!visitorRes.ok) {
        throw new Error(`Visitor API HTTP ${visitorRes.status}`);
      }
      const visitor = (await visitorRes.json()) as VisitorPayload;
      setVisitorIp(visitor.visitorIp);

      let ipv4 = visitor.publicIpv4;
      let ipv6 = visitor.publicIpv6;
      let resolvedGeo = visitor.geo;
      let resolvedSource = visitor.source;

      if (!ipv4 && visitor.isLocalRequest) {
        const [browserV4, browserV6] = await Promise.all([
          fetchPublicIpv4FromBrowser(),
          fetchPublicIpv6FromBrowser(),
        ]);
        if (browserV4) {
          ipv4 = browserV4;
          resolvedSource = "browser-fallback";
          resolvedGeo = await fetchGeoForIp(browserV4);
        }
        if (browserV6) ipv6 = browserV6;
      }

      setPublicIpv4(ipv4);
      setPublicIpv6(ipv6);
      setGeo(resolvedGeo);
      setSource(resolvedSource);

      if (!ipv4) {
        setError(
          "Could not detect public IPv4. Check network or ad-blockers blocking ipify.org."
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to detect IP");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    void resolve();
  }, [resolve]);

  const value = useMemo<VisitorIpState>(
    () => ({
      loading,
      error,
      visitorIp,
      publicIpv4,
      publicIpv6,
      geo,
      source,
      refresh: resolve,
    }),
    [loading, error, visitorIp, publicIpv4, publicIpv6, geo, source, resolve]
  );

  return (
    <VisitorIpContext.Provider value={value}>{children}</VisitorIpContext.Provider>
  );
}

export function useVisitorIp(): VisitorIpState {
  const ctx = useContext(VisitorIpContext);
  if (!ctx) {
    throw new Error("useVisitorIp must be used within VisitorIpProvider");
  }
  return ctx;
}
