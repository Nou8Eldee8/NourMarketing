// src/lib/fonts.ts
import localFont from "next/font/local";

export const cocogoose = localFont({
  src: [
    {
      path: "../fonts/Cocogoose-Pro-Regular-trial.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Cocogoose-Pro-Bold-trial.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Cocogoose-Pro-Light-trial.ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-cocogoose",
  display: "swap",
});
