"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useConsent } from "./consent-provider"

export function CookieBanner() {
  const { hasLoaded, isBannerOpen, status, acceptAll, acceptEssential, closePreferences } = useConsent()

  if (!hasLoaded || !isBannerOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background shadow-lg"
    >
      <div className="container mx-auto flex flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1 md:max-w-2xl">
          <h2 id="cookie-banner-title" className="text-base font-semibold text-foreground">
            Your privacy choices
          </h2>
          <p id="cookie-banner-description" className="text-sm leading-relaxed text-muted-foreground">
            We use essential cookies to make this site work. With your permission we also use analytics cookies
            (Google Analytics, Vercel Analytics) and load our AI assistant, which is provided by ElevenLabs. Nothing
            optional is loaded until you choose. Read more in our{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={acceptEssential}>
            Essential only
          </Button>
          <Button className="bg-teal-600 text-white hover:bg-teal-700" onClick={acceptAll}>
            Accept all
          </Button>
          {status !== "unknown" && (
            <Button variant="ghost" onClick={closePreferences}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
