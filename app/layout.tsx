import { SessionProvider } from "next-auth/react";

import type { Metadata } from "next";
import { ReactNode } from "react";

import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/themeProvider";
import { interFont, spaceGrotesk } from "@/lib/font";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeFlow",
  description: "Better Alternative flow of StackOverflow",
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
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
      <body
        className={`antialiased ${interFont.className} ${spaceGrotesk.variable}`}
      >
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          themes={["dark", "light"]}
        >
          <SessionProvider session={session}>
            {children}

            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
