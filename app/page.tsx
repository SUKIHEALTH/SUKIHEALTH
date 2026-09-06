import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, FileCheck, AlertCircle, Globe2, Languages, Award, ShieldCheck, Star, CalendarCheck } from "lucide-react"
import { AiAssistantSection } from "@/components/home/ai-assistant-section"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

const partners = [
  { src: "/images/ms-fonderson-vert-100x-1024x544.jpg", alt: "Huisartspraktijk M.S. Fonderson" },
  { src: "/images/humicon-logo-neu-2022-v4-1.jpg", alt: "Humicon B.V. Medische Laboratoria" },
  { src: "/images/logo-expat-bevel-a4-clear-rgb-1024x559.png", alt: "Expat Center Netherlands" },
  { src: "/images/ric-logo-wit-met-zwarte-letters.svg", alt: "Rotterdam International Center", padded: true },
  { src: "/images/apotheekglimlachlogo-e1730320028758.png", alt: "Apotheek de Glimlach" },
  { src: "/images/logo-insure-to-sudy-small.png", alt: "InsureToStudy, Alpina Group" },
  { src: "/images/inscape-logo-1024x724.png", alt: "Inscape" },
  { src: "/images/logo-brave-ones-black-1-e1743497970129-1024x232.png", alt: "Brave Ones" },
]

const reasons = [
  {
    icon: Clock,
    title: "Unhurried consultations",
    text: "Consultations of 60 to 90 minutes, so there is time to review your history and answer every question.",
  },
  {
    icon: Languages,
    title: "Multilingual team",
    text: "Consultations in English and Dutch, with German, French, Spanish, Italian, Polish, Romanian, Arabic and Hindi available depending on the physician. Ask us when booking.",
  },
  {
    icon: ShieldCheck,
    title: "BIG-registered physicians",
    text: "Our doctors are licensed and registered in the Dutch BIG register. Registration numbers are listed in the footer and available on request.",
  },
  {
    icon: Award,
    title: "Established referral network",
    text: "Working relationships with laboratories, pharmacies and specialists, so next steps are clear and coordinated.",
  },
  {
    icon: Globe2,
    title: "Three locations",
    text: "Rotterdam, Eindhoven and The Hague, plus video consultations. Choose the clinic closest to home or work.",
  },
  {
    icon: FileCheck,
    title: "Clear written summaries",
    text: "Leave with a written summary in English that you can share with your GP, family or employer.",
  },
]

const services = [
  {
    title: "Expat Deep Dive Consult",
    subtitle: "Comprehensive consultation",
    text: "Thorough consultation with ample time to review your full medical history and address all your questions.",
  },
  {
    title: "Second Opinion & Medical Translation",
    subtitle: "Clear explanations",
    text: "Review of diagnoses and treatment plans, with translation of Dutch medical letters into clear English.",
  },
  {
    title: "Health Check for Expats",
    subtitle: "Evidence-based prevention",
    text: "Focused health assessment with tailored lab tests based on your individual risk factors.",
  },
  {
    title: "Care Navigation & System Coaching",
    subtitle: "Step-by-step guidance",
    text: "Help understanding referrals, waiting lists, and how to navigate the Dutch healthcare system.",
  },
]

const steps = [
  {
    title: "Book online",
    text: "Choose a time and location (Rotterdam, Eindhoven or The Hague) or a video consultation. Availability is shown live on our booking platform.",
  },
  {
    title: "60 to 90 minute consultation",
    text: "Meet a BIG-registered doctor who speaks your language. Review your complete medical history and get every question answered.",
  },
  {
    title: "Leave with clarity",
    text: "Receive a written summary in English, actionable next steps, and support navigating the Dutch healthcare system.",
  },
]

const reviews = [
  {
    initial: "A",
    name: "Anonymous",
    service: "General Health Consultation",
    text: "I felt extremely comfortable from the moment I walked in. The Doctor made a point of explaining the process, and a bit about the Dutch healthcare system, and was very thorough to ensure all my needs were addressed in the one appointment.",
  },
  {
    initial: "D",
    name: "Dante",
    service: "General Health Consultation",
    text: "I managed to book an appointment the same day, it took me about 5 minutes to be attended to when I got there and the doctor was super friendly and helpful. I could collect my prescribed goods at the pharmacy in the same building, making for an easy and stress free experience.",
  },
  {
    initial: "A",
    name: "Anonymous",
    service: "General Health Consultation",
    text: "Dr. Fonderson is very thorough with her questions during consultation. Very helpful and I left my appointment feeling more assured and informed.",
  },
  {
    initial: "C",
    name: "Cristina-Maria",
    service: "Teleconsultation",
    text: "Very caring doctor!",
  },
  {
    initial: "A",
    name: "Anonymous",
    service: "General Health Consultation",
    text: "The Dr was very instructive and guided me with answers through all my questions. Would definitely suggest!",
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-gradient-to-b from-teal-50 to-white py-20 md:py-28 px-4 overflow-hidden">
        <div className="container mx-auto max-w-7xl flex flex-col gap-8">
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Badge variant="secondary" className="bg-teal-100 text-teal-800 px-4 py-2 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4 mr-1" aria-hidden="true" />
              BIG-registered doctors
            </Badge>
            <Badge variant="secondary" className="bg-teal-100 text-teal-800 px-4 py-2 text-sm font-semibold">
              <CalendarCheck className="w-4 h-4 mr-1" aria-hidden="true" />
              Online booking with live availability
            </Badge>
            <Badge variant="secondary" className="bg-teal-100 text-teal-800 px-4 py-2 text-sm font-semibold">
              <Languages className="w-4 h-4 mr-1" aria-hidden="true" />
              Multilingual team
            </Badge>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-balance leading-tight">
                A doctor who speaks your language and has time for you
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 text-pretty leading-relaxed">
                Private healthcare for internationals in the Netherlands, alongside your regular GP. Long appointments,
                clear explanations, and help navigating the Dutch system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white text-lg px-8 py-6 shadow-lg">
                  <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                    Book a consultation
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white">
                  <Link href="/services">Explore services and fees</Link>
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Not a replacement for your huisarts. Not an emergency service; in an emergency call 112.
              </p>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/modern-private-medical-clinic-office-with-professi.jpg"
                alt="Consultation room at Expat Health Clinic"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white border-y" aria-labelledby="partners-heading">
        <div className="container mx-auto max-w-7xl flex flex-col gap-8">
          <h2 id="partners-heading" className="text-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Organisations we work with
          </h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center">
            {partners.map((partner) => (
              <li key={partner.src}>
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={160}
                  height={80}
                  className={`h-auto w-40 object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 ${partner.padded ? "bg-white p-2" : ""}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AiAssistantSection />

      <section className="py-20 px-4 bg-white" aria-labelledby="why-heading">
        <div className="container mx-auto max-w-6xl flex flex-col gap-16">
          <div className="text-center flex flex-col gap-4">
            <h2 id="why-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
              Why expats choose us
            </h2>
            <p className="text-lg text-gray-600">Healthcare that finally makes sense in the Netherlands</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-teal-700" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4 bg-gray-50" aria-labelledby="services-heading">
        <div className="container mx-auto max-w-6xl flex flex-col gap-16">
          <div className="text-center flex flex-col gap-4">
            <h2 id="services-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
              Our services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Additional private care for internationals living in the Netherlands. Fees are listed on the Services page.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.text}</p>
                  <Button asChild className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                      Book this service
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Card className="md:col-span-2 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Corporate & TPA Health Packages</CardTitle>
                <CardDescription className="text-base">For employers, insurers and HR teams</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Onboarding health consults for new hires, stress and burnout prevention, and medical navigation support
                  for families.
                </p>
                <Button asChild className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  <Link href="/corporate-partners">Learn about corporate packages</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white" aria-labelledby="how-heading">
        <div className="container mx-auto max-w-6xl flex flex-col gap-16">
          <div className="text-center flex flex-col gap-4">
            <h2 id="how-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
              How it works
            </h2>
            <p className="text-lg text-gray-600">Three steps from booking to a clear plan</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
              <Image
                src="/professional-private-clinic-office-consultation-ro.jpg"
                alt="Private clinic consultation space"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <ol className="flex flex-col gap-8 order-1 lg:order-2">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-6">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-teal-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white" aria-hidden="true">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-amber-50 border-y border-amber-200" aria-labelledby="disclaimer-heading">
        <div className="container mx-auto max-w-5xl">
          <div className="flex gap-6">
            <AlertCircle className="w-10 h-10 text-amber-700 shrink-0 mt-1" aria-hidden="true" />
            <div className="flex flex-col gap-4">
              <h2 id="disclaimer-heading" className="text-2xl md:text-3xl font-bold text-gray-900">
                We do not replace your Dutch GP (huisarts)
              </h2>
              <div className="flex flex-col gap-3 text-gray-700 leading-relaxed">
                <p>
                  <strong>Expat Health Clinic offers additional private care for expats.</strong> We are not a
                  replacement for your regular Dutch GP.
                </p>
                <p>You are strongly advised to stay registered with a regular GP (huisarts) for:</p>
                <ul className="list-disc list-inside flex flex-col gap-2 ml-4">
                  <li>Acute problems and emergencies (call 112 in an emergency)</li>
                  <li>Chronic disease management</li>
                  <li>Repeat prescriptions (herhaalrecepten)</li>
                  <li>Evening, night and weekend care (huisartsenpost)</li>
                </ul>
                <p className="font-semibold">
                  Expat Health Clinic has no contracts with Dutch health insurers. Clients pay directly and may submit the
                  invoice to their own (international) insurer; reimbursement depends on your policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50" aria-labelledby="reviews-heading">
        <div className="container mx-auto max-w-6xl flex flex-col gap-16">
          <div className="text-center flex flex-col gap-4">
            <h2 id="reviews-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
              What patients say
            </h2>
            <p className="text-lg text-gray-600">
              Reviews left by patients on our{" "}
              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-teal-700"
              >
                booking platform
              </a>
              , reproduced with permission.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={`${review.name}-${index}`} className="border-none shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg"
                      aria-hidden="true"
                    >
                      {review.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <div className="flex gap-1" role="img" aria-label="Rated 5 out of 5 stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <blockquote className="text-muted-foreground leading-relaxed italic">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                  <p className="text-sm text-gray-500">{review.service}</p>
                </CardContent>
              </Card>
            ))}
            <Card className="border-none shadow-lg bg-teal-50">
              <CardContent className="pt-6">
                <div className="text-center flex flex-col gap-4">
                  <p className="text-lg font-semibold text-gray-900">Ready to book?</p>
                  <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white w-full">
                    <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                      Book your consultation
                    </a>
                  </Button>
                  <p className="text-sm text-muted-foreground">Live availability on our booking platform</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-teal-700 text-white" aria-labelledby="cta-heading">
        <div className="container mx-auto max-w-4xl text-center flex flex-col gap-6">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-balance">
            Take control of your health in the Netherlands
          </h2>
          <p className="text-xl text-teal-50 text-pretty">
            Book a 60 to 90 minute consultation and get the clarity you have been looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" variant="secondary" className="bg-white text-teal-700 hover:bg-gray-100 text-lg px-8 py-6">
              <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                Book a consultation
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent"
            >
              <Link href="/contact">Ask us a question</Link>
            </Button>
          </div>
          <p className="text-sm text-teal-50 pt-4">Rotterdam • Eindhoven • The Hague • Video consultations</p>
        </div>
      </section>
    </main>
  )
}
