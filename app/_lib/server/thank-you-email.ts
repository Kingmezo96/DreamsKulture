type ThankYouEmailInput = {
  to: string;
  customerName: string;
  orderNumber: string;
  total: number;
  currency: string;
};

const money = (value: number, currency: string) => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency,
  maximumFractionDigits: 0,
}).format(value);

export function buildThankYouEmail({ customerName, orderNumber, total, currency }: ThankYouEmailInput) {
  const safeName = customerName || "there";
  const formattedTotal = money(total, currency);

  return {
    subject: `Thank you for your Dreams Kulture order ${orderNumber}`,
    html: `
      <div style="margin:0;padding:0;background:#f7f3ee;font-family:Inter,Arial,sans-serif;color:#111;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          <tr>
            <td align="center" style="padding:42px 18px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;border-collapse:collapse;background:#ffffff;">
                <tr>
                  <td style="padding:44px 34px 20px;text-align:center;">
                    <p style="margin:0 0 18px;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#8a7b6d;">Dreams Kulture</p>
                    <h1 style="margin:0;font-family:Georgia,serif;font-weight:400;font-size:42px;line-height:1.05;color:#111;">Thank you for your purchase.</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 34px 36px;text-align:center;">
                    <p style="margin:0 auto 22px;max-width:470px;font-size:16px;line-height:1.7;color:#444;">Hi ${safeName}, your order has been received and payment confirmed. We are preparing it with care and will update you as it moves forward.</p>
                    <div style="margin:0 auto 26px;padding:22px;border:1px solid #e5ded6;background:#fbfaf8;text-align:left;">
                      <p style="margin:0 0 10px;font-size:13px;color:#777;">Order number</p>
                      <strong style="display:block;margin-bottom:18px;font-size:20px;color:#111;">${orderNumber}</strong>
                      <p style="margin:0 0 10px;font-size:13px;color:#777;">Total paid</p>
                      <strong style="font-size:20px;color:#111;">${formattedTotal}</strong>
                    </div>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#555;">Need help? Reply to this email or message us on WhatsApp: +234 810 426 8019.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 34px;background:#111;color:#fff;text-align:center;">
                    <p style="margin:0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;">Faith-inspired pieces, made with intention.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
    text: `Hi ${safeName}, thank you for your Dreams Kulture purchase. Your order ${orderNumber} has been received and payment confirmed. Total paid: ${formattedTotal}.`,
  };
}

export async function sendThankYouEmail(input: ThankYouEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.THANK_YOU_FROM_EMAIL;

  if (!apiKey || !from) return { skipped: true };

  const email = buildThankYouEmail(input);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });

  if (!response.ok) {
    return { skipped: false, ok: false, error: await response.text() };
  }

  return { skipped: false, ok: true };
}
