import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Expat Health Clinic - Private Healthcare for Expats in the Netherlands",
  description:
    "Long appointments, clear explanations, and support navigating the Dutch healthcare system. Additional private care for internationals and expats in the Netherlands.",
  keywords:
    "expat healthcare, private doctor Netherlands, English speaking doctor, Rotterdam, expat GP, international health, medical translation",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3LN6Z5QFNS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3LN6Z5QFNS');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        {children}
        <Footer />
        <Toaster />
        <Analytics />
        <elevenlabs-convai agent-id="agent_01jwhksefdfpn9yd5h8r19jxc4"></elevenlabs-convai>
      </body>
    </html>
  )
}
