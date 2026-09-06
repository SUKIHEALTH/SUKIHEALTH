import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Mail, Phone, MapPin } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Expat Health Clinic to book an intake, ask a question or discuss corporate and TPA services. Locations in Rotterdam, Eindhoven and The Hague.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-b from-teal-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-balance">Get in touch</h1>
          <p className="text-xl text-gray-600 text-pretty">
            Book your intake or ask a question. We aim to respond within 2 business days.
          </p>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Contact form</CardTitle>
                  <CardDescription>Fill in the form below and we will get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact information</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-sm">Email</p>
                      <a href={`mailto:${siteConfig.email}`} className="text-sm text-teal-700 hover:underline">
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-sm">Phone</p>
                      <a href={siteConfig.phoneHref} className="text-sm text-teal-700 hover:underline">
                        {siteConfig.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-sm">Locations</p>
                      <ul className="text-sm text-muted-foreground">
                        {siteConfig.locations.map((location) => (
                          <li key={location}>{location}</li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        Exact addresses are provided with your booking confirmation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We aim to respond to all enquiries within <strong className="text-gray-900">2 business days</strong>.
                    Complaints are handled under our{" "}
                    <Link href="/terms#complaints" className="text-teal-700 underline underline-offset-4">
                      complaints procedure
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-700" aria-hidden="true" />
                    For emergencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    For urgent medical issues, contact your GP, the huisartsenpost (after hours), or call{" "}
                    <strong>112</strong> for emergencies. This contact form is not monitored around the clock.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
