"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

export type ConsentStatus = "unknown" | "essential" | "all"

const CONSENT_COOKIE = "ehc_cookie_consent"
const CONSENT_MAX_AGE_DAYS = 180

type ConsentContextValue = {
  status: ConsentStatus
  hasLoaded: boolean
  isBannerOpen: boolean
  acceptAll: () => void
  acceptEssential: () => void
  openPreferences: () => void
  closePreferences: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

function readConsentCookie(): ConsentStatus {
  if (typeof document === "undefined") return "unknown"
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${CONSENT_COOKIE}=`))
  const value = match?.split("=")[1]
  return value === "all" || value === "essential" ? value : "unknown"
}

function writeConsentCookie(status: Exclude<ConsentStatus, "unknown">) {
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60
  document.cookie = `${CONSENT_COOKIE}=${status}; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>("unknown")
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isBannerOpen, setIsBannerOpen] = useState(false)

  useEffect(() => {
    const stored = readConsentCookie()
    setStatus(stored)
    setIsBannerOpen(stored === "unknown")
    setHasLoaded(true)
  }, [])

  const acceptAll = useCallback(() => {
    writeConsentCookie("all")
    setStatus("all")
    setIsBannerOpen(false)
  }, [])

  const acceptEssential = useCallback(() => {
    writeConsentCookie("essential")
    setStatus("essential")
    setIsBannerOpen(false)
  }, [])

  const openPreferences = useCallback(() => setIsBannerOpen(true), [])
  const closePreferences = useCallback(() => {
    if (status !== "unknown") setIsBannerOpen(false)
  }, [status])

  return (
    <ConsentContext.Provider
      value={{ status, hasLoaded, isBannerOpen, acceptAll, acceptEssential, openPreferences, closePreferences }}
    >
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider")
  return ctx
}
