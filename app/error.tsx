"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-[60vh] flex items-center px-4 py-20">
      <div className="container mx-auto max-w-xl text-center flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-gray-900 text-balance">Something went wrong</h1>
        <p className="text-lg text-muted-foreground text-pretty">
          An unexpected error occurred. You can try again, or contact us if the problem continues. In a medical
          emergency, call 112.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="bg-teal-600 hover:bg-teal-700 text-white">
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
