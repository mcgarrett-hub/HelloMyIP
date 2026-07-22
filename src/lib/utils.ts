import { resolveClientIp } from "@/lib/client-ip";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function isValidIpv4(value: string): boolean {
  const parts = value.trim().split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^\d+$/.test(p)) return false;
    const n = Number(p);
    return n >= 0 && n <= 255;
  });
}

export function isValidDomain(value: string): boolean {
  const v = value.trim().toLowerCase();
  if (!v || v.length > 253) return false;
  if (isValidIpv4(v)) return false;
  return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(v);
}

export function looksLikeIpOrDomain(value: string): boolean {
  const v = value.trim();
  return isValidIpv4(v) || isValidDomain(v) || v.includes(":");
}

export function getClientIpFromHeaders(headers: Headers): string | null {
  return resolveClientIp(headers);
}

export function formatKeyLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
