import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center px-4 py-20">
      <div className="container mx-auto max-w-xl text-center flex flex-col gap-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">404</p>
        <h1 className="text-4xl font-bold text-gray-900 text-balance">We could not find that page</h1>
        <p className="text-lg text-muted-foreground text-pretty">
          The page may have moved or no longer exists. Try one of the links below.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
