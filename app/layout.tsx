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
  console.log("processId: ", process.pid);
  console.log("how long node js has running : ", process.uptime());
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
            themes={["dark", "light"]}
          >
            {children}
          </ThemeProvider>

          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
