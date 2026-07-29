import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { verifyPaystackReference } from "@/app/_lib/server/paystack";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey || !isValidSignature(rawBody, signature, secretKey)) {
    return NextResponse.json({ message: "Invalid webhook signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as { event?: string; data?: { reference?: string } };

  if (event.event === "charge.success" && event.data?.reference) {
    await verifyPaystackReference(event.data.reference);
  }

  return NextResponse.json({ received: true });
}

function isValidSignature(rawBody: string, signature: string, secretKey: string) {
  if (!signature) return false;
  const expected = createHmac("sha512", secretKey).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const signatureBuffer = Buffer.from(signature, "hex");

  return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
}
