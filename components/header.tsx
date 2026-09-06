"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { AiAssistantButton } from "@/components/ai-assistant-button"
import { siteConfig } from "@/lib/site-config"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/corporate-partners", label: "TPA & Corporate" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav aria-label="Main navigation" className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo-transparent-background.png"
            alt=""
            width={50}
            height={50}
            className="h-12 w-12"
            priority
          />
          <span className="flex flex-col whitespace-nowrap">
            <span className="font-bold text-xl text-gray-900 leading-tight">EXPAT</span>
            <span className="font-bold text-sm text-teal-600 leading-tight">HEALTH CLINIC</span>
          </span>
          <span className="sr-only">Expat Health Clinic home</span>
        </Link>

        <div className="hidden lg:flex items-center gap-5">
          <AiAssistantButton />
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
            <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
              Book Now
            </a>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="flex flex-col gap-6 mt-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-lg font-medium text-gray-900 hover:text-teal-600">
                  {item.label}
                </Link>
              ))}
              <AiAssistantButton size="default" className="w-full justify-center" />
              <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white w-full">
                <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Book Now
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
