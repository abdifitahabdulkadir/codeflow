import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/themeProvider";
import { interFont, spaceGrotesk } from "@/lib/font";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeFlow",
  description: "Better Alternative flow of StackOverflow",
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <SessionProvider session={session}>
        <body
          className={`antialiased ${interFont.className} ${spaceGrotesk.variable}`}
        >
          <ThemeProvider
            disableTransitionOnChange
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
          </ThemeProvider>

          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
