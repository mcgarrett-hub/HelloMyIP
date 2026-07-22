export type WhoisResult = {
  query: string;
  kind: "domain" | "ip";
  raw?: string;
  owner?: string;
  registrar?: string;
  created?: string;
  updated?: string;
  expire?: string;
  nameServers?: string[];
  organization?: string;
  allocation?: string;
  abuseContact?: string;
  asn?: string;
  status?: string;
  error?: string;
};

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function pickEvents(
  events: unknown[],
  action: string
): string | undefined {
  if (!Array.isArray(events)) return undefined;
  for (const ev of events) {
    if (typeof ev !== "object" || ev === null) continue;
    const e = ev as { eventAction?: string; eventDate?: string };
    if (e.eventAction === action && e.eventDate) return e.eventDate;
  }
  return undefined;
}

function pickEntities(
  entities: unknown[],
  roles: string[]
): { vcard?: unknown; handle?: string } | undefined {
  if (!Array.isArray(entities)) return undefined;
  for (const ent of entities) {
    if (typeof ent !== "object" || ent === null) continue;
    const e = ent as { roles?: string[]; vcardArray?: unknown; handle?: string };
    if (e.roles?.some((r) => roles.includes(r))) return { vcard: e.vcardArray, handle: e.handle };
  }
  return undefined;
}

function vcardOrg(vcard: unknown): string | undefined {
  if (!Array.isArray(vcard) || vcard.length < 2) return undefined;
  const rows = vcard[1];
  if (!Array.isArray(rows)) return undefined;
  for (const row of rows) {
    if (Array.isArray(row) && row[0] === "fn") return String(row[3] ?? "");
    if (Array.isArray(row) && row[0] === "org") return String(row[3] ?? "");
  }
  return undefined;
}

export async function whoisDomain(domain: string): Promise<WhoisResult> {
  const q = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  try {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(q)}`, {
      headers: { Accept: "application/rdap+json" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return { query: q, kind: "domain", error: `RDAP HTTP ${res.status}` };
    }
    const data = (await res.json()) as Record<string, unknown>;
    const registrarEnt = pickEntities(data.entities as unknown[], ["registrar"]);
    const registrantEnt = pickEntities(data.entities as unknown[], ["registrant", "holder"]);
    const ns = (data.nameservers as { ldhName?: string }[] | undefined)?.map(
      (n) => n.ldhName?.replace(/\.$/, "") ?? ""
    ).filter(Boolean);

    return {
      query: q,
      kind: "domain",
      owner: vcardOrg(registrantEnt?.vcard) ?? registrantEnt?.handle,
      registrar: vcardOrg(registrarEnt?.vcard) ?? registrarEnt?.handle,
      created: pickEvents(data.events as unknown[], "registration"),
      updated: pickEvents(data.events as unknown[], "last changed"),
      expire: pickEvents(data.events as unknown[], "expiration"),
      nameServers: ns,
      status: Array.isArray(data.status) ? (data.status as string[]).join(", ") : undefined,
    };
  } catch (e) {
    return {
      query: q,
      kind: "domain",
      error: e instanceof Error ? e.message : "WHOIS lookup failed",
    };
  }
}

export async function whoisIp(ip: string): Promise<WhoisResult> {
  const q = ip.trim();
  try {
    const res = await fetch(`https://rdap.org/ip/${encodeURIComponent(q)}`, {
      headers: { Accept: "application/rdap+json" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return { query: q, kind: "ip", error: `RDAP HTTP ${res.status}` };
    }
    const data = (await res.json()) as Record<string, unknown>;
    const orgEnt = pickEntities(data.entities as unknown[], ["registrant", "administrative"]);
    const abuseEnt = pickEntities(data.entities as unknown[], ["abuse"]);

    return {
      query: q,
      kind: "ip",
      organization: vcardOrg(orgEnt?.vcard) ?? pickString(data, ["name"]),
      allocation: pickString(data, ["startAddress", "endAddress"])
        ? `${data.startAddress} – ${data.endAddress}`
        : undefined,
      abuseContact: abuseEnt?.handle,
      asn: typeof data.handle === "string" ? data.handle : undefined,
      nameServers: undefined,
    };
  } catch (e) {
    return {
      query: q,
      kind: "ip",
      error: e instanceof Error ? e.message : "WHOIS lookup failed",
    };
  }
}

export async function whoisLookup(query: string): Promise<WhoisResult> {
  const q = query.trim();
  const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(q) || q.includes(":");
  return isIp ? whoisIp(q) : whoisDomain(q);
}
