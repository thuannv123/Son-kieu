import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Dancing_Script, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";

const montserrat = Montserrat({
  subsets:  ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display:  "swap",
});

const cormorant = Cormorant_Garamond({
  subsets:  ["latin", "vietnamese"],
  weight:   ["400", "500", "600"],
  variable: "--font-display",
  display:  "swap",
});

const dancingScript = Dancing_Script({
  subsets:  ["latin"],
  weight:   ["600", "700"],
  variable: "--font-cursive",
  display:  "swap",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.khudulichsonkieu.vn";
const GTM_ID = "GTM-5NHCB3KW";
const GA_ID = "G-E0563FK9L6";
const SOCIAL_IMAGE = "/opengraph-image";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  applicationName: "Sơn Kiều",

  title: {
    default:  "Khu Du Lịch Sinh Thái Sơn Kiều | Du Lịch Quảng Trị",
    template: "%s | Sơn Kiều",
  },
  description:
    "Khu Du Lịch Sinh Thái Sơn Kiều tại Trường Sơn, Quảng Trị: hang động, hồ suối tự nhiên, ẩm thực bản địa và trải nghiệm du lịch sinh thái cho gia đình, nhóm bạn.",

  openGraph: {
    type:        "website",
    siteName:    "Khu Du Lịch Sinh Thái Sơn Kiều",
    title:       "Khu Du Lịch Sinh Thái Sơn Kiều | Du Lịch Quảng Trị",
    description: "Khám phá khu du lịch sinh thái Sơn Kiều tại Trường Sơn, Quảng Trị với hang động, hồ suối tự nhiên, ẩm thực bản địa và hoạt động ngoài trời.",
    locale:      "vi_VN",
    url:         SITE,
    images: [{ url: SOCIAL_IMAGE, width: 1200, height: 630, alt: "Khu Du Lịch Sinh Thái Sơn Kiều" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Khu Du Lịch Sinh Thái Sơn Kiều | Du Lịch Quảng Trị",
    description: "Trải nghiệm du lịch sinh thái tại Sơn Kiều: hang động, hồ suối tự nhiên, ẩm thực bản địa và thiên nhiên Trường Sơn.",
    images:      [SOCIAL_IMAGE],
  },

  alternates: { canonical: SITE },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  authors: [{ name: "Khu Du Lịch Sinh Thái Sơn Kiều", url: SITE }],
  creator: "Khu Du Lịch Sinh Thái Sơn Kiều",
  publisher: "Khu Du Lịch Sinh Thái Sơn Kiều",
  category: "travel",
  keywords: [
    "Sơn Kiều",
    "Khu du lịch sinh thái Sơn Kiều",
    "du lịch Quảng Trị",
    "Trường Sơn Quảng Trị",
    "hang động Quảng Trị",
    "hồ suối tự nhiên",
    "du lịch sinh thái",
    "homestay Quảng Trị",
    "địa điểm du lịch Quảng Trị",
    "khu du lịch Trường Sơn",
  ],

  verification: {
    google: "HK53Pg8Ve3DcWu9t2LQCysCqAZiBU9R1LegXGDMcHCY",
  },

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

export const viewport: Viewport = {
  themeColor: "#10b981",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${montserrat.variable} ${cormorant.variable} ${dancingScript.variable}`}>
      <body className="font-sans antialiased">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script id="google-tag-manager" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-tag" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
