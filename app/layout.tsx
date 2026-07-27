import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "Dreams Kulture | Faith, Thoughtfully Worn";
  const description = "Faith-inspired apparel, prints and gifts designed in Nigeria and delivered worldwide.";

  return {
    metadataBase: new URL(origin),
    title,
    description,
    keywords: ["faith apparel Nigeria", "Christian gifts", "custom printing Lagos", "Dreams Kulture"],
    icons: {
      icon: "/dream-kulture-logo-stacked.jpeg",
      shortcut: "/dream-kulture-logo-stacked.jpeg",
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: origin,
      images: [{ url: `${origin}/og.png`, width: 1732, height: 908, alt: "Dreams Kulture — Faith, thoughtfully worn" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
