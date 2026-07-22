export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import type { VisitorPayload } from "@/lib/visitor";
import { isPrivateOrLocalIp, isPublicIpv4, resolveClientIp } from "@/lib/client-ip";
import { fetchIpGeo, type IpGeoResult } from "@/lib/ip";

export type { VisitorPayload };

export async function GET(req: Request) {
  const visitorIp = resolveClientIp(req.headers);
  const capturedAt = new Date().toISOString();

  let publicIpv4: string | null =
    visitorIp && isPublicIpv4(visitorIp) ? visitorIp : null;
  const publicIpv6 =
    visitorIp && visitorIp.includes(":") && !isPrivateOrLocalIp(visitorIp)
      ? visitorIp
      : null;

  let geo: IpGeoResult | null = null;

  if (publicIpv4) {
    geo = await fetchIpGeo(publicIpv4);
    if (geo.status && geo.status !== "success") {
      geo = null;
    }
  }

  const isLocalRequest = !publicIpv4 && (!visitorIp || isPrivateOrLocalIp(visitorIp));

  const body: VisitorPayload = {
    visitorIp,
    publicIpv4,
    publicIpv6,
    source: "request",
    isLocalRequest,
    geo,
    capturedAt,
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
