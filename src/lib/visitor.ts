import type { IpGeoResult } from "@/lib/ip";

export type VisitorPayload = {
  visitorIp: string | null;
  publicIpv4: string | null;
  publicIpv6: string | null;
  source: "request" | "browser-fallback";
  isLocalRequest: boolean;
  geo: IpGeoResult | null;
  capturedAt: string;
};
