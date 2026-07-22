import { NextResponse } from "next/server";

/**
 * MVP ping endpoint: measures HTTP round-trip to this API from the client.
 * Full ICMP ping requires a backend worker or edge service (roadmap).
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Use client-side fetch timing for MVP; ICMP ping planned.",
    timestamp: Date.now(),
  });
}
