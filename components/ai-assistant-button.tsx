"use client"

import { Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useConsent } from "@/components/consent/consent-provider"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

type AiAssistantButtonProps = {
  className?: string
  size?: "sm" | "default" | "lg"
  label?: string
}

export function AiAssistantButton({ className, size = "sm", label }: AiAssistantButtonProps) {
  const { status, openPreferences } = useConsent()

  const handleClick = () => {
    if (status !== "all") {
      openPreferences()
      return
    }
    const widget = document.querySelector("elevenlabs-convai") as (HTMLElement & { startConversation?: () => void }) | null
    widget?.startConversation?.()
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={handleClick}
      className={cn("gap-2 border-teal-200 text-teal-700 hover:bg-teal-50", className)}
      aria-label={`Open ${siteConfig.aiAssistant.name}. This is an automated assistant, not a doctor.`}
    >
      <Bot className="h-4 w-4" aria-hidden="true" />
      {label ?? siteConfig.aiAssistant.name}
    </Button>
  )
}
