import { products, currency, deliveryFee } from "@/app/_lib/storefront-products";
import { supabaseAdminRequest } from "@/app/_lib/server/supabase-admin";

type CheckoutItem = {
  id: number;
  size: string;
  color: string;
  quantity: number;
};

type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  state: string;
};

type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    channel?: string;
    paid_at?: string;
    customer?: { email?: string };
    gateway_response?: string;
  };
};

type OrderRow = {
  id: string;
  order_number: string;
};

type PaymentRow = {
  id: string;
  order_id: string;
  status: "pending" | "authorized" | "paid" | "failed" | "refunded";
  amount: number;
  currency: string;
};

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getPaystackSecretKey() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) throw new Error("Paystack secret key is not configured.");
  return secretKey;
}

export function getSiteUrl(request?: Request) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (!request) return "http://localhost:3000";

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

export function buildCheckoutSummary(items: CheckoutItem[]) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your bag is empty.");
  }

  const normalizedItems = items.map((item) => {
    const product = products.find((candidate) => candidate.id === Number(item.id));
    const quantity = Number(item.quantity);

    if (!product) throw new Error("A product in your bag is no longer available.");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 25) {
      throw new Error("One of your item quantities is invalid.");
    }
    if (!product.sizes.includes(item.size)) throw new Error(`${product.name} size is invalid.`);
    if (!product.colors.includes(item.color)) throw new Error(`${product.name} colour is invalid.`);

    return {
      product,
      size: item.size,
      color: item.color,
      quantity,
      lineTotal: product.price * quantity,
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = deliveryFee(subtotal);
  const total = subtotal + shipping;

  return { items: normalizedItems, subtotal, shipping, total };
}

export async function initializePaystackCheckout(input: {
  customer: Customer;
  items: CheckoutItem[];
  request: Request;
}) {
  const customer = validateCustomer(input.customer);
  const summary = buildCheckoutSummary(input.items);
  const reference = `DK-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`.toUpperCase();
  const fullName = `${customer.firstName} ${customer.lastName}`.trim();
  const addressPayload = {
    recipient_name: fullName,
    phone: customer.phone,
    line1: customer.address,
    city: customer.city,
    state_region: customer.state,
    country: customer.country,
    country_code: customer.country.toLowerCase() === "nigeria" ? "NG" : null,
  };

  const [order] = await supabaseAdminRequest<OrderRow[]>("orders", {
    method: "POST",
    prefer: "return=representation",
    body: {
      customer_email: customer.email,
      customer_phone: customer.phone,
      currency,
      subtotal: summary.subtotal,
      shipping_total: summary.shipping,
      grand_total: summary.total,
      shipping_address: addressPayload,
      billing_address: addressPayload,
      customer_note: "Paystack checkout",
      metadata: {
        provider: "paystack",
        provider_reference: reference,
        source: "storefront",
      },
    },
  });

  await supabaseAdminRequest("order_items", {
    method: "POST",
    body: summary.items.map((item) => ({
      order_id: order.id,
      product_name: item.product.name,
      sku: `DK-${item.product.id}`,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unit_price: item.product.price,
      line_total: item.lineTotal,
      product_snapshot: {
        storefront_id: item.product.id,
        name: item.product.name,
        category: item.product.category,
        collection: item.product.collection,
        image: item.product.image,
        scripture: item.product.scripture,
      },
    })),
  });

  await supabaseAdminRequest("payments", {
    method: "POST",
    body: {
      order_id: order.id,
      provider: "paystack",
      provider_reference: reference,
      status: "pending",
      amount: summary.total,
      currency,
      metadata: {
        order_number: order.order_number,
        initialized_from: "storefront",
      },
    },
  });

  const siteUrl = getSiteUrl(input.request);
  const paystackResponse = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getPaystackSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(summary.total * 100),
      email: customer.email,
      currency,
      reference,
      callback_url: `${siteUrl}/payment/callback?reference=${encodeURIComponent(reference)}`,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
        customer_name: fullName,
        customer_phone: customer.phone,
        cart: summary.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      },
    }),
  });

  const payload = await paystackResponse.json() as PaystackInitializeResponse;
  if (!paystackResponse.ok || !payload.status || !payload.data?.authorization_url) {
    await markPaymentFailed(reference, payload);
    throw new Error(payload.message || "Paystack could not start this payment.");
  }

  return {
    authorizationUrl: payload.data.authorization_url,
    reference,
    orderNumber: order.order_number,
    total: summary.total,
  };
}

export async function verifyPaystackReference(reference: string) {
  const cleanReference = reference.trim();
  if (!cleanReference) throw new Error("Missing Paystack reference.");

  const [payment] = await supabaseAdminRequest<PaymentRow[]>(
    `payments?select=id,order_id,status,amount,currency&provider=eq.paystack&provider_reference=eq.${encodeURIComponent(cleanReference)}&limit=1`,
  );

  if (!payment) throw new Error("Payment reference was not found.");

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(cleanReference)}`, {
    headers: { Authorization: `Bearer ${getPaystackSecretKey()}` },
    cache: "no-store",
  });
  const payload = await response.json() as PaystackVerifyResponse;

  if (!response.ok || !payload.status || !payload.data) {
    await markPaymentFailed(cleanReference, payload);
    return { ok: false, status: "failed", message: payload.message || "Payment verification failed." };
  }

  const expectedAmount = Math.round(Number(payment.amount) * 100);
  const amountMatches = payload.data.amount === expectedAmount && payload.data.currency === payment.currency;
  const isSuccessful = payload.data.status === "success" && amountMatches;
  const nextPaymentStatus = isSuccessful ? "paid" : "failed";

  await supabaseAdminRequest(`payments?provider=eq.paystack&provider_reference=eq.${encodeURIComponent(cleanReference)}`, {
    method: "PATCH",
    body: {
      status: nextPaymentStatus,
      payment_method: payload.data.channel ?? null,
      paid_at: isSuccessful ? payload.data.paid_at ?? new Date().toISOString() : null,
      metadata: {
        verified_at: new Date().toISOString(),
        amount_matches: amountMatches,
        paystack_status: payload.data.status,
        gateway_response: payload.data.gateway_response,
        paystack: payload.data,
      },
    },
  });

  if (isSuccessful) {
    await supabaseAdminRequest(`orders?id=eq.${payment.order_id}`, {
      method: "PATCH",
      body: {
        status: "confirmed",
        placed_at: payload.data.paid_at ?? new Date().toISOString(),
        metadata: {
          provider: "paystack",
          provider_reference: cleanReference,
          payment_verified_at: new Date().toISOString(),
        },
      },
    });
  }

  return {
    ok: isSuccessful,
    status: nextPaymentStatus,
    message: isSuccessful ? "Payment confirmed." : "Payment was not successful.",
    reference: cleanReference,
  };
}

async function markPaymentFailed(reference: string, payload: unknown) {
  await supabaseAdminRequest(`payments?provider=eq.paystack&provider_reference=eq.${encodeURIComponent(reference)}`, {
    method: "PATCH",
    body: {
      status: "failed",
      metadata: {
        failed_at: new Date().toISOString(),
        paystack: payload,
      },
    },
  });
}

function validateCustomer(customer: Customer): Customer {
  const cleaned = {
    firstName: customer.firstName?.trim(),
    lastName: customer.lastName?.trim(),
    email: customer.email?.trim().toLowerCase(),
    phone: customer.phone?.trim(),
    country: customer.country?.trim(),
    address: customer.address?.trim(),
    city: customer.city?.trim(),
    state: customer.state?.trim(),
  };

  if (!cleaned.firstName || !cleaned.lastName || !cleaned.email || !cleaned.phone || !cleaned.country || !cleaned.address || !cleaned.city || !cleaned.state) {
    throw new Error("Please complete all delivery details.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
    throw new Error("Please enter a valid email address.");
  }

  return cleaned;
}
