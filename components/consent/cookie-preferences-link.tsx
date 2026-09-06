"use client"

import { useConsent } from "./consent-provider"

export function CookiePreferencesLink() {
  const { openPreferences } = useConsent()
  return (
    <button
      type="button"
      onClick={openPreferences}
      className="text-sm text-muted-foreground hover:text-teal-600 text-left"
    >
      Cookie preferences
    </button>
  )
}
