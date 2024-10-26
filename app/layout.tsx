import { interFont, spaceGrotesk } from "@/lib/font";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeFlow",
  description: "Better Alternative flow of StackOverflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${interFont.variable} ${spaceGrotesk.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
