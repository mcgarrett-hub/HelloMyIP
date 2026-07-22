import { NextResponse } from "next/server";

/**
 * Ping endpoint: dùng để đo round-trip time (RTT) qua HTTP từ client.
 * Không dùng ICMP vì trình duyệt không có quyền gửi raw socket —
 * đo bằng HTTP timing là cách chuẩn cho web-based speed test.
 */
export async function GET() {
  return new NextResponse(null, {
    status: 204, // không cần body, giúp response nhẹ và nhanh nhất có thể
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
    },
  });
}