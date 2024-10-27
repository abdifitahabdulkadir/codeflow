import Navbar from "@/components/navigation/navbar/Navbar";
import { ThemeProvider } from "@/context/themeProvider";
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased ${interFont.className} ${spaceGrotesk.variable}`}
      >
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
