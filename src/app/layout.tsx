// layout.tsx
import "./globals.css";
import { cocogoose, dancingScript } from "@/lib/fonts";

export const metadata = {
  title: "Your Website",
  description: "Built with Cocogoose and Dancing Script",
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
