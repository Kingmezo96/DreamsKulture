import { NextResponse } from "next/server";
import { initializePaystackCheckout } from "@/app/_lib/server/paystack";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const checkout = await initializePaystackCheckout({
      customer: body.customer,
      items: body.items,
      request,
    });

    return NextResponse.json(checkout);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to start Paystack checkout." },
      { status: 400 },
    );
  }
}
