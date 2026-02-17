import localFont from "next/font/local";
import { Dancing_Script, Cairo } from "next/font/google";

export const cocogoose = localFont({
  src: "../../public/fonts/Cocogoose-Pro-Regular-trial.ttf",
  variable: "--font-cocogoose",
  display: "swap",
});

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-dancing-script",
  display: "swap",
});

export const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});
