import "./globals.css";
import { cocogoose } from "@/lib/fonts";

export const metadata = {
  title: "Your Website",
  description: "Built with Cocogoose",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cocogoose.variable}`}>
      <body>{children}</body>
    </html>
  );
}
