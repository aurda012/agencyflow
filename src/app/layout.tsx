import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

import { DM_Mono } from "next/font/google";
import { DM_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ModalProvider } from "@/components/providers/ModalProvider";

import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: "AgencyFlow",
  description: "All in one Agency Solution",
};

const fontSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const fontMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          "relative h-full font-sans antialiased min-h-screen",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            showSpinner={false}
            color="#006eff"
            shadow="0 0 10px #006eff,0 0 5px #006eff"
            crawlSpeed={150}
            speed={150}
          />
          <ModalProvider>{children}</ModalProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
