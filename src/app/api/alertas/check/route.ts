import { NextResponse } from "next/server";
import { runAlertEngine } from "@/services/alert-engine";

export async function POST() {
  const created = await runAlertEngine();
  return NextResponse.json({ created });
}
