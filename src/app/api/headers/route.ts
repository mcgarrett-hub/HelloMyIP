import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const host = req.headers.get("host") ?? "";
  const interesting = [
    "x-visitor-address",
    "host",
    "user-agent",
    "accept",
    "accept-language",
    "accept-encoding",
    "connection",
    "cache-control",
    "sec-ch-ua",
    "sec-ch-ua-mobile",
    "sec-ch-ua-platform",
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
  ];

  const headers: Record<string, string> = {};
  for (const key of interesting) {
    const v = req.headers.get(key);
    if (v) headers[key] = v;
  }
  headers["host"] = host;

  return NextResponse.json({ headers });
}
