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
                <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2121470391589911');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2121470391589911&ev=PageView&noscript=1"
          />
        </noscript>
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
