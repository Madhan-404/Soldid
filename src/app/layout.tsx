import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WalletProvider } from "@/providers/WalletProvider";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soldid",
  description: "Secure Your Identity & Credentials on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <WalletProvider>
              {children}
          </WalletProvider>
        </ThemeProvider>
        <svg className="hidden">
          <filter id="pixelate-filter">
            <feFlood x="4" y="4" height="2" width="2"/>
            <feComposite width="10" height="10"/>
            <feTile result="a"/>
            <feComposite in="SourceGraphic" in2="a" operator="in"/>
            <feMorphology operator="dilate" radius="5"/>
          </filter>
        </svg>
        <Toaster />
      </body>
    </html>
  );
}
