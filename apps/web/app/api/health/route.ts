import { NextResponse } from "next/server";
import { isDemoMode } from "@/server/config";

export async function GET() {
  return NextResponse.json({ status: "ok", demoMode: isDemoMode() });
}
