import { NextResponse } from "next/server";
import { DNS_RECORD_TYPES, type DnsRecordType } from "@/lib/constants";
import { lookupDns, lookupMultipleTypes } from "@/lib/dns";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name")?.trim();
  const all = searchParams.get("all") === "1";
  const type = (searchParams.get("type")?.trim().toUpperCase() ?? "A") as DnsRecordType;

  if (!name) {
    return NextResponse.json({ error: "Missing name parameter" }, { status: 400 });
  }

  if (all) {
    const results = await lookupMultipleTypes(name, [...DNS_RECORD_TYPES]);
    return NextResponse.json({ results });
  }

  if (!DNS_RECORD_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid record type" }, { status: 400 });
  }

  const result = await lookupDns(name, type);
  return NextResponse.json({ results: [result] });
}
