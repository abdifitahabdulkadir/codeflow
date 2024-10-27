import LocalFont from "next/font/local";
export const interFont = LocalFont({
  src: "../app/fonts/inter.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 700 800 900",
});

export const spaceGrotesk = LocalFont({
  src: "../app/fonts/space_grotestk.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 700",
});
