import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, FileSearch, Activity, Compass, Building2, Info, Video } from "lucide-react"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Private healthcare services for expats in the Netherlands, including deep dive consultations, second opinions, health checks, and care navigation.",
  alternates: { canonical: "/services" },
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-teal-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">Our Services</h1>
              <p className="text-xl text-gray-600 text-pretty leading-relaxed">
                Additional private care designed specifically for internationals and expats in the Netherlands
              </p>
            </div>
            <div className="relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/professional-private-medical-clinic-reception-offi.jpg"
                alt="Expat Health Clinic professional office environment"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Important Info Banner */}
      <section className="px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <Alert className="border-teal-200 bg-teal-50">
            <Info className="h-5 w-5 text-teal-600" aria-hidden="true" />
            <AlertDescription className="text-gray-700 leading-relaxed">
              All services are self-pay. We do not have contracts with Dutch health insurers. Current fees are shown on
              our booking platform before you confirm. You will receive an itemised invoice you may submit to your own
              (international) insurer; reimbursement depends on your policy. See our{" "}
              <Link href="/terms" className="text-teal-700 underline underline-offset-4">
                Terms & Conditions
              </Link>{" "}
              for cancellation and payment terms.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-6xl space-y-16">
          {/* Expat Deep Dive Consult */}
          <div id="deep-dive" className="scroll-mt-20">
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-2 relative h-64 lg:h-auto">
                  <Image
                    src="/medical-professional-in-modern-private-clinic-offi.jpg"
                    alt="Comprehensive consultation in private clinic office"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-3">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-7 h-7 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl md:text-3xl mb-2">Expat Deep Dive Consult</CardTitle>
                        <p className="text-teal-600 font-semibold">60–90 minutes</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      Our signature service: a comprehensive consultation where we actually have time to listen. Review
                      your full medical history, discuss previous reports and lab results, and ask all the questions you
                      need answered.
                    </p>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">What you get:</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>60-90 minute unhurried consultation</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Full medical history review</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Discussion of previous reports, letters, and lab results</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Clear explanation of your health concerns in English</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Written summary with clear next steps</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4">
                      <Button asChild className="bg-teal-500 hover:bg-teal-600" size="lg">
                        <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                          Book This Service
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>

          {/* Second Opinion */}
          <div id="second-opinion" className="scroll-mt-20">
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-2 relative h-64 lg:h-auto order-2 lg:order-1">
                  <Image
                    src="/medical-documents-review-in-bright-modern-clinic-o.jpg"
                    alt="Medical document review in clinic office"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-3 order-1 lg:order-2">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <FileSearch className="w-7 h-7 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl md:text-3xl mb-2">
                          Second Opinion & Medical Translation
                        </CardTitle>
                        <p className="text-teal-600 font-semibold">Clear explanations in English</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      Bring your medical letters, diagnoses, or treatment plans—especially those in Dutch—and we'll help
                      you understand them. Get a clear explanation in English and, if helpful, a second medical opinion.
                    </p>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">What you get:</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Review of previous diagnoses and treatment plans</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Translation and explanation of Dutch medical letters</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Clear explanation in plain English</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Second medical opinion when appropriate</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4">
                      <Button asChild className="bg-teal-500 hover:bg-teal-600" size="lg">
                        <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                          Book This Service
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>

          {/* Health Check */}
          <div id="health-check" className="scroll-mt-20">
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-2 relative h-64 lg:h-auto">
                  <Image
                    src="/health-screening-in-modern-private-clinic-office-c.jpg"
                    alt="Health assessment in private clinic office"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-3">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <Activity className="w-7 h-7 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl md:text-3xl mb-2">Expat Health Check</CardTitle>
                        <p className="text-teal-600 font-semibold">Evidence-based prevention</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      A realistic, evidence-based preventive health assessment—not a commercial check-up package. We
                      tailor lab tests and screening to your individual risk factors, age, and medical history.
                    </p>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">What you get:</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Detailed medical questionnaire</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Focused physical examination</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Tailored lab tests based on your risk profile</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Clear written report with actionable advice</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4">
                      <Button asChild className="bg-teal-500 hover:bg-teal-600" size="lg">
                        <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                          Book This Service
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>

          {/* Care Navigation */}
          <div id="navigation" className="scroll-mt-20">
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-2 relative h-64 lg:h-auto order-2 lg:order-1">
                  <Image
                    src="/healthcare-consultation-modern-clinic-office-profe.jpg"
                    alt="Healthcare navigation consultation in clinic office"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-3 order-1 lg:order-2">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <Compass className="w-7 h-7 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl md:text-3xl mb-2">Care Navigation & System Coaching</CardTitle>
                        <p className="text-teal-600 font-semibold">Step-by-step guidance</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      Lost in the Dutch healthcare system? We'll guide you step by step—helping you understand
                      referrals, waiting lists, specialist options, and cross-border care between the Netherlands and
                      your home country.
                    </p>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">What you get:</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Explanation of how the Dutch healthcare system works</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Help understanding referrals and waiting lists</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Support with cross-border care options</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4">
                      <Button asChild className="bg-teal-500 hover:bg-teal-600" size="lg">
                        <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                          Book This Service
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>

          {/* Telemedicine */}
          <div id="telemedicine" className="scroll-mt-20">
            <Card className="border-none shadow-xl overflow-hidden ring-2 ring-teal-500">
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-2 relative h-64 lg:h-auto">
                  <Image
                    src="/video-consultation-doctor-laptop-home.png"
                    alt="Patient at home having a video consultation with a doctor on a laptop"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-3">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-teal-700 flex items-center justify-center flex-shrink-0">
                        <Video className="w-7 h-7 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl md:text-3xl mb-2">Video Consultation (Telemedicine)</CardTitle>
                        <p className="text-teal-600 font-semibold">From anywhere in the Netherlands</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      Every service above except the physical health check can also be delivered by secure video call.
                      You get the same BIG-registered doctor, the same unhurried format and the same written summary,
                      without the travel.
                    </p>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">How it works:</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1" aria-hidden="true">
                            •
                          </span>
                          <span>Select the video option when booking; you receive a private, encrypted video link</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1" aria-hidden="true">
                            •
                          </span>
                          <span>Join from a laptop, tablet or phone with a camera; no app installation required</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1" aria-hidden="true">
                            •
                          </span>
                          <span>Share documents or Dutch medical letters in advance so the doctor can prepare</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1" aria-hidden="true">
                            •
                          </span>
                          <span>
                            If a physical examination is needed, the doctor will advise an in-person visit or a referral
                            to your GP
                          </span>
                        </li>
                      </ul>
                    </div>

                    <p className="text-sm text-gray-600">
                      You must be physically in the Netherlands during the consultation. Video consultations are not
                      suitable for emergencies; in an emergency call 112.
                    </p>

                    <div className="pt-4">
                      <Button asChild className="bg-teal-500 hover:bg-teal-600" size="lg">
                        <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                          Book a Video Consultation
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>

          {/* Corporate */}
          <div id="corporate" className="scroll-mt-20">
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-2 relative h-64 lg:h-auto">
                  <Image
                    src="/corporate-wellness-modern-professional-medical-off.jpg"
                    alt="Corporate health services in professional clinic"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-3">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-7 h-7 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl md:text-3xl mb-2">Corporate & TPA Health Packages</CardTitle>
                        <p className="text-teal-600 font-semibold">For employers, insurers and HR teams</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      Support your international employees with comprehensive health services designed for expat needs.
                      Help new hires settle in, prevent burnout, and navigate the Dutch healthcare system smoothly.
                    </p>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Services for employers:</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Onboarding health consultations for new international hires</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Stress and burnout prevention programs</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Medical navigation support for employees and families</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4">
                      <Button asChild className="bg-teal-500 hover:bg-teal-600" size="lg">
                        <Link href="/corporate-partners">Learn about corporate packages</Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-teal-500 text-white">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Not sure which service you need?</h2>
          <p className="text-xl text-teal-50 text-pretty">
            Contact us and we'll help you find the right option for your situation.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
