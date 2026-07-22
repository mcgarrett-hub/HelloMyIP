import { VisitorIpProvider } from "@/components/visitor/visitor-ip-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HelloMyIP — What Is My IP Address?",
    template: "%s | HelloMyIP",
  },
  description:
    "See your public IP address, ISP, location, DNS and WHOIS lookup tools, and network utilities.",
  metadataBase: new URL("https://hellomyip.example"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <VisitorIpProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </VisitorIpProvider>
      </body>
    </html>
  );
}
