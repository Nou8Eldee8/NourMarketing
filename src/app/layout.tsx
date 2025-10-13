import "./globals.css";
import { cocogoose, dancingScript } from "@/lib/fonts";
import Script from "next/script";
import MetaPixel from "./components/MetaPixel"; // ✅ Pixel component

export const metadata = {
  title: "Nour Marketing Agency",
  description: "We build better brands online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cocogoose.variable} ${dancingScript.variable}`}
    >
      <head>
        <meta name="facebook-domain-verification" content="wqduv4g0pp6s2vqeq7vkpgj5ij129r" />
        {/* ---- Meta Pixel ---- */}
        <MetaPixel />

        {/* ---- Google Analytics ---- */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V43RWR6MTV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V43RWR6MTV');
          `}
        </Script>
      </head>

      <body className="bg-[#0f0215] text-[#fee3d8]">
        {children}
      </body>
    </html>
  );
}
