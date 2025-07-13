import localFont from "next/font/local";
import { Dancing_Script } from "next/font/google";

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
