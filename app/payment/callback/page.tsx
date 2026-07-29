import Link from "next/link";
import { verifyPaystackReference } from "@/app/_lib/server/paystack";

export const dynamic = "force-dynamic";

type PaymentCallbackPageProps = {
  searchParams: Promise<{ reference?: string }>;
};

export default async function PaymentCallbackPage({ searchParams }: PaymentCallbackPageProps) {
  const { reference = "" } = await searchParams;
  let result: Awaited<ReturnType<typeof verifyPaystackReference>>;

  try {
    result = await verifyPaystackReference(reference);
  } catch (error) {
    result = {
      ok: false,
      status: "failed",
      message: error instanceof Error ? error.message : "We could not verify this payment.",
      reference,
    };
  }

  return (
    <main className="payment-status-page">
      <section className="payment-status-card">
        <span className={`payment-status-icon ${result.ok ? "payment-status-icon--success" : "payment-status-icon--failed"}`}>
          {result.ok ? "✓" : "!"}
        </span>
        <p className="category-subtitle"><b>paystack</b> checkout</p>
        <h1>{result.ok ? "Payment confirmed" : "Payment not completed"}</h1>
        <p>{result.message}</p>
        {result.reference && <small>Reference: {result.reference}</small>}
        <div className="payment-status-actions">
          <Link className="mol-button" href="/"><span>Return home</span></Link>
          <Link className="read-more" href="/#shop">Continue shopping</Link>
        </div>
      </section>
    </main>
  );
}
