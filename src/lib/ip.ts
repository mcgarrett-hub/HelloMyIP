export type IpGeoResult = {
  ip: string;
  ipv6?: string | null;
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  timezone?: string;
  lat?: number;
  lon?: number;
  isp?: string;
  org?: string;
  as?: string;
  asn?: string;
  reverseDns?: string | null;
  hosting?: boolean;
  proxy?: boolean;
  mobile?: boolean;
  query?: string;
  status?: string;
  message?: string;
};

type IpApiResponse = {
  status: string;
  message?: string;
  query?: string;
  country?: string;
  countryCode?: string;
  regionName?: string;
  city?: string;
  timezone?: string;
  lat?: number;
  lon?: number;
  isp?: string;
  org?: string;
  as?: string;
  reverse?: string;
  hosting?: boolean;
  proxy?: boolean;
  mobile?: boolean;
};

function parseAsn(asField?: string): string | undefined {
  if (!asField) return undefined;
  const m = asField.match(/^AS(\d+)/i);
  return m ? m[1] : asField;
}

export async function fetchIpGeo(ip?: string): Promise<IpGeoResult> {
  const fields =
    "status,message,query,country,countryCode,regionName,city,timezone,lat,lon,isp,org,as,reverse,hosting,proxy,mobile";
  const url = ip
    ? `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=${fields}`
    : `http://ip-api.com/json/?fields=${fields}`;

  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    return { ip: ip ?? "", status: "error", message: `HTTP ${res.status}` };
  }

  const data = (await res.json()) as IpApiResponse;
  if (data.status !== "success") {
    return {
      ip: ip ?? data.query ?? "",
      status: data.status,
      message: data.message ?? "Lookup failed",
    };
  }

  return {
    ip: data.query ?? ip ?? "",
    country: data.country,
    countryCode: data.countryCode,
    region: data.regionName,
    city: data.city,
    timezone: data.timezone,
    lat: data.lat,
    lon: data.lon,
    isp: data.isp,
    org: data.org,
    as: data.as,
    asn: parseAsn(data.as),
    reverseDns: data.reverse ?? null,
    hosting: data.hosting,
    proxy: data.proxy,
    mobile: data.mobile,
    status: "success",
  };
}

export async function fetchReverseDns(ip: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(
        ip.split(".").reverse().join(".") + ".in-addr.arpa"
      )}&type=PTR`,
      { signal: AbortSignal.timeout(8000) }
    );
    const json = (await res.json()) as {
      Answer?: { data?: string }[];
    };
    const ptr = json.Answer?.[0]?.data;
    return ptr ? ptr.replace(/\.$/, "") : null;
  } catch {
    return null;
  }
}
