"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, KeyValueGrid, Button, Alert } from "@/components/ui/primitives";
import { useVisitorIp } from "@/components/visitor/visitor-ip-provider";

type ClientInfo = {
  browser: string;
  os: string;
  device: string;
  language: string;
  userAgent: string;
  screen: string;
  cookiesEnabled: boolean;
  jsEnabled: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  darkMode: boolean;
  connectionType?: string;
  rtt?: number;
  downlink?: number;
  saveData?: boolean;
  webrtcLocalIps: string[];
};

function parseUa(ua: string) {
  let browser = "Unknown";
  if (/Edg\//.test(ua)) browser = `Edge ${ua.match(/Edg\/([\d.]+)/)?.[1] ?? ""}`.trim();
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua))
    browser = `Chrome ${ua.match(/Chrome\/([\d.]+)/)?.[1] ?? ""}`.trim();
  else if (/Firefox\//.test(ua)) browser = `Firefox ${ua.match(/Firefox\/([\d.]+)/)?.[1] ?? ""}`.trim();
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua))
    browser = `Safari ${ua.match(/Version\/([\d.]+)/)?.[1] ?? ""}`.trim();

  let os = "Unknown";
  if (/Windows NT 10/.test(ua)) os = "Windows 10/11";
  else if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";

  let device = "Desktop";
  if (/Mobile|Android|iPhone/.test(ua)) device = "Mobile";
  else if (/iPad|Tablet/.test(ua)) device = "Tablet";

  return { browser, os, device };
}

async function detectWebRtcIps(): Promise<string[]> {
  if (typeof window === "undefined" || !window.RTCPeerConnection) return [];
  const ips = new Set<string>();
  try {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pc.createDataChannel("");
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await new Promise<void>((resolve) => {
      const timer = setTimeout(() => resolve(), 2000);
      pc.onicecandidate = (ev) => {
        if (!ev.candidate?.candidate) {
          clearTimeout(timer);
          resolve();
          return;
        }
        const m = ev.candidate.candidate.match(
          /(?:candidate:\d+ \d+ udp \d+ ([\d.a-fA-F:]+) \d+ typ host)/
        );
        if (m?.[1] && !m[1].startsWith("0.0.0.0")) ips.add(m[1]);
      };
    });
    pc.close();
  } catch {
    /* ignore */
  }
  return [...ips];
}

export function HomeDashboard() {
  const { loading, error, visitorIp, publicIpv4, publicIpv6, geo, source, refresh } =
    useVisitorIp();
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [requestHeaders, setRequestHeaders] = useState<Record<string, string>>({});

  useEffect(() => {
    const ua = navigator.userAgent;
    const parsed = parseUa(ua);
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string; rtt?: number; downlink?: number; saveData?: boolean } }).connection;

    void detectWebRtcIps().then((webrtcLocalIps) => {
      setClient({
        ...parsed,
        language: navigator.language,
        userAgent: ua,
        screen: `${window.screen.width} × ${window.screen.height}`,
        cookiesEnabled: navigator.cookieEnabled,
        jsEnabled: true,
        localStorage: (() => {
          try {
            localStorage.setItem("__hmip", "1");
            localStorage.removeItem("__hmip");
            return true;
          } catch {
            return false;
          }
        })(),
        sessionStorage: (() => {
          try {
            sessionStorage.setItem("__hmip", "1");
            sessionStorage.removeItem("__hmip");
            return true;
          } catch {
            return false;
          }
        })(),
        darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
        connectionType: conn?.effectiveType,
        rtt: conn?.rtt,
        downlink: conn?.downlink,
        saveData: conn?.saveData,
        webrtcLocalIps,
      });
    });

    fetch("/api/headers")
      .then((r) => r.json())
      .then((data: { headers?: Record<string, string> }) =>
        setRequestHeaders(data.headers ?? {})
      )
      .catch(() => setRequestHeaders({}));
  }, []);

  const vpnHint = useMemo(() => {
    if (!geo) return loading ? "Loading…" : "—";
    if (geo.proxy) return "Possible proxy/VPN (heuristic)";
    if (geo.hosting) return "Hosting/datacenter IP";
    return "No proxy flag from geo API";
  }, [geo, loading]);

  const ipSourceLabel =
    source === "request"
      ? "From your HTTP request (via middleware)"
      : source === "browser-fallback"
        ? "Public IPv4 via browser (local/dev fallback)"
        : "Detecting…";

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error">
          {error}{" "}
          <button type="button" className="underline" onClick={() => void refresh()}>
            Retry
          </button>
        </Alert>
      )}

      <Card
        title="Your IP Address"
        description={ipSourceLabel}
      >
        {loading && !publicIpv4 ? (
          <p className="text-sm text-[var(--muted)]">Reading your IP from the current request…</p>
        ) : (
          <KeyValueGrid
            rows={[
              {
                label: "IPv4 (public)",
                value: publicIpv4 ?? "—",
                mono: true,
              },
              {
                label: "IPv6 (public)",
                value: publicIpv6 ?? "Not detected",
                mono: true,
              },
              {
                label: "IP on this request",
                value: visitorIp ?? "—",
                mono: true,
              },
              { label: "ISP", value: geo?.isp },
              { label: "Country", value: geo?.country },
              { label: "City", value: geo?.city },
              { label: "Timezone", value: geo?.timezone },
              {
                label: "Coordinates",
                value:
                  geo?.lat != null && geo?.lon != null
                    ? `${geo.lat}, ${geo.lon}`
                    : "—",
              },
              { label: "ASN", value: geo?.asn ?? geo?.as },
              { label: "Reverse DNS", value: geo?.reverseDns, mono: true },
              { label: "Organization", value: geo?.org },
              { label: "VPN / Proxy hint", value: vpnHint },
            ]}
          />
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" disabled={loading} onClick={() => void refresh()}>
            Refresh IP
          </Button>
        </div>
        {geo?.lat != null && geo?.lon != null && (
          <p className="mt-4 text-sm">
            <a
              className="font-medium text-brand-600 hover:underline"
              href={`https://www.google.com/maps?q=${geo.lat},${geo.lon}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </p>
        )}
      </Card>

      {client && (
        <>
          <Card title="Browser & device" description="Detected in your browser (client-side).">
            <KeyValueGrid
              rows={[
                { label: "Browser", value: client.browser },
                { label: "OS", value: client.os },
                { label: "Device", value: client.device },
                { label: "Language", value: client.language },
                { label: "Screen", value: client.screen },
                { label: "Cookies", value: client.cookiesEnabled ? "Enabled" : "Disabled" },
                { label: "JavaScript", value: "Enabled" },
                { label: "Local Storage", value: client.localStorage ? "Available" : "Unavailable" },
                { label: "Session Storage", value: client.sessionStorage ? "Available" : "Unavailable" },
                { label: "Dark mode", value: client.darkMode ? "Preferred" : "Not preferred" },
                { label: "User-Agent", value: client.userAgent, mono: true },
              ]}
            />
          </Card>

          <Card title="Network (JavaScript)" description="From the Network Information API when available.">
            <KeyValueGrid
              rows={[
                { label: "Connection type", value: client.connectionType ?? "Unknown" },
                { label: "RTT (ms)", value: client.rtt ?? "—" },
                { label: "Downlink (Mbps)", value: client.downlink ?? "—" },
                { label: "Save-Data mode", value: client.saveData ? "On" : "Off" },
                {
                  label: "WebRTC local IPs",
                  value: client.webrtcLocalIps.length ? client.webrtcLocalIps.join(", ") : "None / blocked",
                  mono: true,
                },
              ]}
            />
          </Card>
        </>
      )}

      <Card title="HTTP request headers" description="Headers your browser sent to this site.">
        {Object.keys(requestHeaders).length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Loading headers…</p>
        ) : (
          <pre className="max-h-96 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
            {Object.entries(requestHeaders)
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n")}
          </pre>
        )}
      </Card>
    </div>
  );
}
