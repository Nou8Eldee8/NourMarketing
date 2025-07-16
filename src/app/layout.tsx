// app/layout.tsx
import "./globals.css"; // لازم تستورد ملفات CSS هنا
import { cocogoose, dancingScript  } from "@/lib/fonts"; // تأكد من أن ده المسار الصحيح للخطوط
import Script from "next/script";

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
      <body className="bg-[#0f0215] text-[#fee3d8]">{children}</body>
    </html>
  );
}
