"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Bot } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo-transparent-background.png"
            alt="Expat Health Clinic"
            width={50}
            height={50}
            className="h-12 w-12"
          />
          <div className="flex flex-col">
            <span className="font-bold text-xl text-gray-900 leading-tight">EXPAT</span>
            <span className="font-bold text-sm text-teal-600 leading-tight">HEALTH CLINIC</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Badge
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all"
            onClick={() => {
              const widget = document.querySelector("elevenlabs-convai")
              if (widget) {
                ;(widget as any).startConversation?.()
              }
            }}
          >
            <Bot className="w-3 h-3 mr-1" />
            AI Assistant
          </Badge>
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
            Home
          </Link>
          <Link href="/services" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
            Services
          </Link>
          <Link href="/faq" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
            FAQ
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
            Contact
          </Link>
          <Link href="/corporate-partners" className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors">
            TPA Partners
          </Link>
          <Button asChild className="bg-teal-500 hover:bg-teal-600 text-white">
            <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
              Book Now
            </a>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-6 mt-8">
              <Link href="/" className="text-lg font-medium text-gray-900 hover:text-teal-600">
                Home
              </Link>
              <Link href="/services" className="text-lg font-medium text-gray-900 hover:text-teal-600">
                Services
              </Link>
              <Link href="/faq" className="text-lg font-medium text-gray-900 hover:text-teal-600">
                FAQ
              </Link>
              <Link href="/contact" className="text-lg font-medium text-gray-900 hover:text-teal-600">
                Contact
              </Link>
              <Link href="/corporate-partners" className="text-lg font-medium text-gray-900 hover:text-teal-600">
                TPA Partners
              </Link>
              <Button asChild className="bg-teal-500 hover:bg-teal-600 text-white w-full">
                <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
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
