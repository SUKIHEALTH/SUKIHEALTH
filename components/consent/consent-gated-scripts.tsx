"use client"

import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { siteConfig } from "@/lib/site-config"
import { useConsent } from "./consent-provider"

export function ConsentGatedScripts() {
  const { status } = useConsent()

  if (status !== "all") return null

  const gaId = siteConfig.analytics.gaMeasurementId

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
      <Analytics />
      <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="lazyOnload" />
      <elevenlabs-convai agent-id={siteConfig.aiAssistant.agentId} />
    </>
  )
}
