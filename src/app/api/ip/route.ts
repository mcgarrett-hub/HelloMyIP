export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { resolveClientIp } from "@/lib/client-ip";
import { fetchIpGeo } from "@/lib/ip";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const clientIp = resolveClientIp(req.headers);
  const result = await fetchIpGeo(q || clientIp || undefined);
  if (result.status && result.status !== "success") {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({
    ip: result.ip,
    country: result.country,
    countryCode: result.countryCode,
    city: result.city,
    region: result.region,
    isp: result.isp,
    org: result.org,
    asn: result.asn,
    timezone: result.timezone,
    lat: result.lat,
    lon: result.lon,
    reverseDns: result.reverseDns,
    hosting: result.hosting,
    proxy: result.proxy,
    mobile: result.mobile,
  });
}
