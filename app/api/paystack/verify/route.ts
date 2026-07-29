import { NextResponse } from "next/server";
import { verifyPaystackReference } from "@/app/_lib/server/paystack";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference") ?? "";

  try {
    const result = await verifyPaystackReference(reference);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, status: "failed", message: error instanceof Error ? error.message : "Unable to verify payment." },
      { status: 400 },
    );
  }
}
