// layout.tsx
import "./globals.css";
import { cocogoose, dancingScript } from "@/lib/fonts";
import GoogleAnalytics from "./analytics";
export const metadata = {
  title: "Nour Marketing Agency",
  description: "Building Better Brands Online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cocogoose.variable} ${dancingScript.variable}`}>
              <GoogleAnalytics />

      <body>{children}</body>
    </html>
  );
}
