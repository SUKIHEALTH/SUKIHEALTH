import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { ConsentProvider } from "@/components/consent/consent-provider"
import { CookieBanner } from "@/components/consent/cookie-banner"
import { ConsentGatedScripts } from "@/components/consent/consent-gated-scripts"
import { siteConfig } from "@/lib/site-config"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Expat Health Clinic - Private Healthcare for Expats in the Netherlands",
    template: "%s | Expat Health Clinic",
  },
  description:
    "Long appointments, clear explanations, and support navigating the Dutch healthcare system. Additional private care for internationals and expats in the Netherlands.",
  keywords:
    "expat healthcare, private doctor Netherlands, English speaking doctor, Rotterdam, expat GP, international health, medical translation",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NL",
    siteName: siteConfig.name,
    title: "Expat Health Clinic - Private Healthcare for Expats in the Netherlands",
    description:
      "Long appointments, clear explanations, and support navigating the Dutch healthcare system for internationals in the Netherlands.",
  },
  robots: { index: true, follow: true },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ConsentProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-teal-600 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>
          <Header />
          <div id="main-content">{children}</div>
          <Footer />
          <Toaster />
          <CookieBanner />
          <ConsentGatedScripts />
        </ConsentProvider>
      </body>
    </html>
  )
}
