/** Normalize IPv4-mapped IPv6 (::ffff:192.168.x.x) to IPv4 when possible. */
export function normalizeIp(raw: string): string {
  const ip = raw.trim();
  if (ip.startsWith("::ffff:")) return ip.slice(7);
  return ip;
}

export function isPrivateOrLocalIp(raw: string): boolean {
  const ip = normalizeIp(raw).toLowerCase();
  if (!ip) return true;
  if (ip === "localhost" || ip === "::1" || ip === "127.0.0.1" || ip === "0.0.0.0") {
    return true;
  }

  if (ip.includes(":")) {
    if (ip.startsWith("fe80:")) return true;
    if (ip.startsWith("fc") || ip.startsWith("fd")) return true;
    return false;
  }

  const parts = ip.split(".").map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    return true;
  }
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  return false;
}

export function isPublicIpv4(ip: string): boolean {
  const n = normalizeIp(ip);
  if (n.includes(":")) return false;
  return !isPrivateOrLocalIp(n);
}

type IpSource = Headers | { headers: Headers; ip?: string | null };

export function resolveClientIp(source: IpSource): string | null {
  const headers = "headers" in source ? source.headers : source;

  const fromMiddleware = headers.get("x-visitor-address");
  if (fromMiddleware) {
    const v = normalizeIp(fromMiddleware);
    if (v) return v;
  }

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    for (const part of forwarded.split(",")) {
      const v = normalizeIp(part);
      if (v && !isPrivateOrLocalIp(v)) return v;
    }
    const first = normalizeIp(forwarded.split(",")[0] ?? "");
    if (first) return first;
  }

  for (const key of [
    "cf-connecting-ip",
    "true-client-ip",
    "x-real-ip",
    "x-vercel-forwarded-for",
  ]) {
    const v = headers.get(key);
    if (v) {
      const n = normalizeIp(v);
      if (n) return n;
    }
  }

  if ("ip" in source && source.ip) {
    return normalizeIp(source.ip);
  }

  return null;
}
