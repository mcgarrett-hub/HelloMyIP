import type { DnsRecordType } from "./constants";

export type DnsAnswer = {
  name: string;
  type: number;
  typeName: string;
  ttl: number;
  data: string;
};

export type DnsLookupResult = {
  name: string;
  type: DnsRecordType;
  status: number;
  answers: DnsAnswer[];
  authority?: DnsAnswer[];
  error?: string;
};

const TYPE_MAP: Record<DnsRecordType, number> = {
  A: 1,
  AAAA: 28,
  MX: 15,
  NS: 2,
  TXT: 16,
  CNAME: 5,
  SOA: 6,
  PTR: 12,
  SRV: 33,
  CAA: 257,
};

const REVERSE_TYPE: Record<number, DnsRecordType> = Object.fromEntries(
  Object.entries(TYPE_MAP).map(([k, v]) => [v, k as DnsRecordType])
) as Record<number, DnsRecordType>;

function normalizeName(name: string, type: DnsRecordType): string {
  const trimmed = name.trim().replace(/\.$/, "");
  if (type !== "PTR") return trimmed;
  if (trimmed.includes(".in-addr.arpa") || trimmed.includes(".ip6.arpa")) {
    return trimmed;
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(trimmed)) {
    return `${trimmed.split(".").reverse().join(".")}.in-addr.arpa`;
  }
  return trimmed;
}

export async function lookupDns(
  name: string,
  type: DnsRecordType
): Promise<DnsLookupResult> {
  const qname = normalizeName(name, type);
  const qtype = TYPE_MAP[type];
  const url = `https://dns.google/resolve?name=${encodeURIComponent(qname)}&type=${qtype}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(10000),
    });
    const json = (await res.json()) as {
      Status: number;
      Question?: { name: string; type: number }[];
      Answer?: { name: string; type: number; TTL: number; data: string }[];
      Authority?: { name: string; type: number; TTL: number; data: string }[];
    };

    const mapRow = (row: {
      name: string;
      type: number;
      TTL: number;
      data: string;
    }): DnsAnswer => ({
      name: row.name.replace(/\.$/, ""),
      type: row.type,
      typeName: REVERSE_TYPE[row.type] ?? String(row.type),
      ttl: row.TTL,
      data: row.data.replace(/\.$/, ""),
    });

    return {
      name: qname,
      type,
      status: json.Status,
      answers: (json.Answer ?? []).map(mapRow),
      authority: (json.Authority ?? []).map(mapRow),
      error: json.Status !== 0 && json.Status !== 3 ? `DNS status ${json.Status}` : undefined,
    };
  } catch (e) {
    return {
      name: qname,
      type,
      status: -1,
      answers: [],
      error: e instanceof Error ? e.message : "DNS lookup failed",
    };
  }
}

export async function lookupMultipleTypes(
  name: string,
  types: DnsRecordType[]
): Promise<DnsLookupResult[]> {
  return Promise.all(types.map((t) => lookupDns(name, t)));
}
