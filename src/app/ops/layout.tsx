"use client";

import { Cairo } from "next/font/google";
import { Tajawal } from "next/font/google";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cairo.className} min-h-screen text-white p-6`}>
      <main>{children}</main>
    </div>
  );
}
