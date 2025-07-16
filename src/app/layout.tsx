// layout.tsx
import "./globals.css";
import { cocogoose, dancingScript } from "@/lib/fonts";

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
      <body>{children}</body>
    </html>
  );
}
