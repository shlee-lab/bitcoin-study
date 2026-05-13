import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bitcoin-study.vercel.app";
const ogImageUrl = "/og/bitcoin-study-v3.png";

export const metadata: Metadata = {
  title: "Bitcoin Study",
  description: "1 BTC 전송으로 이해하는 Bitcoin",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Bitcoin Study",
    description: "1 BTC 전송으로 이해하는 Bitcoin",
    url: siteUrl,
    siteName: "Bitcoin Study",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        secureUrl: ogImageUrl,
        type: "image/png",
        width: 1200,
        height: 630,
        alt: "Bitcoin Study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitcoin Study",
    description: "1 BTC 전송으로 이해하는 Bitcoin",
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-text">{children}</body>
    </html>
  );
}
