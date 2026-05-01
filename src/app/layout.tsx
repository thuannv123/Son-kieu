import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";

const montserrat = Montserrat({
  subsets:  ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display:  "swap",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sonkieu.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),

  title: {
    default:  "Khu Du Lịch Sinh Thái Sơn Kiều",
    template: "%s | Sơn Kiều",
  },
  description:
    "Khu Du Lịch Sinh Thái & Homestay Sơn Kiều tại Trường Sơn, Quảng Ninh, tỉnh Quảng Trị — nơi nghỉ dưỡng yên bình giữa thiên nhiên hoang sơ. Đặt vé trực tuyến — xác nhận tức thì.",

  openGraph: {
    type:        "website",
    siteName:    "Khu Du Lịch Sinh Thái Sơn Kiều",
    title:       "Khu Du Lịch Sinh Thái Sơn Kiều",
    description: "Homestay & khu du lịch sinh thái tại Trường Sơn, Quảng Ninh, tỉnh Quảng Trị — nơi nghỉ dưỡng yên bình giữa hang động, hồ bơi thiên nhiên và rừng nguyên sinh.",
    locale:      "vi_VN",
    url:         SITE,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Khu Du Lịch Sinh Thái Sơn Kiều" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Khu Du Lịch Sinh Thái Sơn Kiều",
    description: "Trải nghiệm thiên nhiên hoang sơ — hang động, hồ bơi thiên nhiên, rừng nguyên sinh.",
    images:      ["/og.jpg"],
  },

  alternates: { canonical: SITE },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="vi" className={montserrat.variable}>
      <body className="font-sans antialiased">
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        )}
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
