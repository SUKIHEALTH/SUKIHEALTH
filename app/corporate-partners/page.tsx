import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Shield,
  Globe2,
  FileCheck,
  Users,
  TrendingDown,
  Stethoscope,
  Video,
  FileText,
  CheckCircle,
  Handshake,
  Award,
  Languages,
  Anchor,
  Landmark,
  Briefcase,
  ShieldCheck,
  HeartPulse,
} from "lucide-react"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "TPA & Corporate Partners",
  description:
    "Expat Health Clinic works with third-party administrators, international private medical insurers and employers as a local primary care partner in the Netherlands.",
  alternates: { canonical: "/corporate-partners" },
}

const inquirySubject = encodeURIComponent("TPA/Corporate Partnership Inquiry - Expat Health Clinic")
const inquiryBody = encodeURIComponent(
  "Company Name: \nContact Person: \nEmail: \nPhone: \nType of Organization: [TPA / IPMI / Corporate HR / Other]\n\nServices of Interest:\n- [ ] Primary care & medical management\n- [ ] Occupational health & screening\n- [ ] Telehealth & remote medical advice\n- [ ] Claims reporting & integration\n- [ ] Executive health programs\n\nAdditional Information:\n",
)
const inquiryHref = `mailto:${siteConfig.email}?subject=${inquirySubject}&body=${inquiryBody}`

const highlights = [
  { icon: TrendingDown, title: "Primary care first", text: "Most requests are handled in-house; referrals only when clinically needed." },
  { icon: Languages, title: "Multilingual team", text: "English and Dutch, with further languages depending on the physician." },
  { icon: Globe2, title: "Three locations", text: "Rotterdam, Eindhoven and The Hague, plus video consultations." },
  { icon: FileText, title: "Clear reporting", text: "Itemised invoices and written medical reports after each visit." },
]

const partnerServices = [
  {
    icon: TrendingDown,
    title: "Primary Care & Medical Management",
    text: "We act as the first point of care for your members in the Netherlands. Our physicians handle the majority of requests in-house and refer to specialists only when clinically indicated, which helps contain costs without compromising care.",
    points: ["Clinical gatekeeper model based on Dutch guidelines", "Referral only when medically necessary", "Transparent pricing and itemised billing"],
  },
  {
    icon: Stethoscope,
    title: "Occupational Health & Screening",
    text: "Pre-employment and periodic medical examinations for sectors such as maritime, aviation and energy, carried out to the applicable standards you specify.",
    points: ["Pre-employment medical examinations", "Crew and workforce screenings", "Executive health programs"],
  },
  {
    icon: Video,
    title: "Telehealth & Remote Medical Advice",
    text: "Video consultations and remote medical advice for expatriates and travellers during our opening hours, complemented by in-person care at our clinics.",
    points: ["Video consultations with a BIG-registered doctor", "Multilingual remote support", "Escalation to in-person care when needed"],
  },
  {
    icon: FileText,
    title: "Claims Reporting",
    text: "Our administrative team provides timely medical reports and transparent invoices and can work with your claims platform on request.",
    points: ["Written medical reports after each visit", "Integration with your claims workflow on request", "Itemised, transparent invoices"],
  },
]

const benefits = [
  { icon: FileCheck, title: "Digital documentation", text: "Electronic records and reports, shared with your systems only with the patient's authorisation." },
  { icon: Languages, title: "Multilingual support", text: "Serving international members in English, Dutch and further languages depending on the physician." },
  { icon: Shield, title: "Risk management", text: "We support your medical risk assessment and case-management protocols." },
  { icon: Award, title: "BIG-registered physicians", text: "Our doctors are licensed and registered in the Dutch BIG register." },
]

const idealFor = [
  { icon: Building2, title: "Third Party Administrators (TPAs)", text: "Local medical provider for members in the Netherlands" },
  { icon: Shield, title: "International Private Medical Insurers", text: "Primary care and cost containment partner" },
  { icon: Users, title: "Corporate HR departments", text: "Embassies, NGOs and multinationals with international staff" },
  { icon: Award, title: "Executive & family office services", text: "Discreet health programs for executives and their families" },
]

const industries = [
  { icon: Anchor, title: "Maritime & Aviation", text: "Direct medical provider in the Netherlands for seafarer and crew screenings.", points: ["Pre-employment medicals", "Fitness assessments", "Return-to-work assessments"] },
  { icon: Landmark, title: "Embassies & International Organisations", text: "Helping diplomatic and international staff and their families navigate Dutch healthcare.", points: ["Staff healthcare", "Family healthcare programs", "Culturally aware care"] },
  { icon: Briefcase, title: "Corporate & Executive", text: "Executive health screenings and family medical services.", points: ["Executive health programs", "Corporate wellness", "Priority scheduling"] },
  { icon: ShieldCheck, title: "Insurance & Assistance", text: "Remote medical advice combined with physical clinic access.", points: ["Telehealth during opening hours", "Physical clinic access", "Integrated care pathway"] },
  { icon: FileText, title: "Claims Management", text: "Streamlined reporting to reduce your administrative load.", points: ["Works with your claims platform on request", "Timely medical reporting", "Digital documentation"] },
  { icon: HeartPulse, title: "Accident & Health", text: "Prompt assessment and reporting for accident and health cases.", points: ["Prompt appointments, subject to availability", "Timely medical reporting", "Injury follow-up"] },
]

export default function CorporatePartnersPage() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-slate-900 py-20 md:py-28 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-teal-500/20 text-teal-200 border-teal-500/30 px-4 py-2">
                  <Building2 className="w-4 h-4 mr-1" aria-hidden="true" />
                  TPA & Corporate Services
                </Badge>
                <Badge className="bg-teal-500/20 text-teal-200 border-teal-500/30 px-4 py-2">
                  <Globe2 className="w-4 h-4 mr-1" aria-hidden="true" />
                  Netherlands-based
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white text-balance leading-tight">
                Your local primary care partner in the Netherlands
              </h1>
              <p className="text-xl text-slate-200 text-pretty leading-relaxed">
                Medical management and cost containment for TPAs, insurers and employers
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                We act as a local extension for Third Party Administrators, International Private Medical Insurers and
                corporate HR teams. Working within the Dutch healthcare system, our BIG-registered physicians provide
                high-quality primary care for your members while helping you manage medical costs responsibly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white text-lg px-8 py-6">
                  <a href={inquiryHref}>
                    <Handshake className="w-5 h-5 mr-2" aria-hidden="true" />
                    Send a partnership enquiry
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-slate-500 text-white hover:bg-slate-800">
                  <a href={siteConfig.phoneHref}>Call {siteConfig.phone}</a>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/corporate-partnership-meeting-modern-office-profes.jpg"
                alt="Partnership meeting in a modern office"
                width={600}
                height={450}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white" aria-labelledby="value-heading">
        <div className="container mx-auto max-w-6xl flex flex-col gap-12">
          <div className="text-center flex flex-col gap-4">
            <h2 id="value-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
              Why partner with Expat Health Clinic?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-pretty">
              We aim to be more than a care provider: a primary care partner that resolves what can be resolved at the
              first line, and refers onward only when your member needs it.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="border-none shadow-lg text-center">
                <CardHeader className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-teal-700" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50" aria-labelledby="partner-services-heading">
        <div className="container mx-auto max-w-6xl flex flex-col gap-16">
          <div className="text-center flex flex-col gap-4">
            <h2 id="partner-services-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
              Our services for partners
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Medical management solutions for TPAs, IPMIs and corporate clients
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {partnerServices.map(({ icon: Icon, title, text, points }) => (
              <Card key={title} className="border-none shadow-lg">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-teal-700" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-gray-600 leading-relaxed">{text}</p>
                  <ul className="flex flex-col gap-2">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-sm text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white border-y border-gray-100" aria-labelledby="network-heading">
        <div className="container mx-auto max-w-6xl flex flex-col gap-8">
          <h2 id="network-heading" className="text-center text-sm text-gray-600 font-medium uppercase tracking-wide">
            Organisations we work with
          </h2>
          <ul className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all">
            <li><Image src="/images/logo-expat-bevel-a4-clear-rgb-1024x559.png" alt="Expat Center Netherlands" width={140} height={60} className="h-12 w-auto object-contain" /></li>
            <li><Image src="/images/ric-logo-wit-met-zwarte-letters.svg" alt="Rotterdam International Center" width={140} height={60} className="h-10 w-auto object-contain" /></li>
            <li><Image src="/images/logo-brave-ones-black-1-e1743497970129-1024x232.png" alt="Brave Ones" width={120} height={40} className="h-8 w-auto object-contain" /></li>
            <li><Image src="/images/inscape-logo-1024x724.png" alt="Inscape" width={100} height={60} className="h-12 w-auto object-contain" /></li>
          </ul>
        </div>
      </section>

      <section className="py-20 px-4 bg-white" aria-labelledby="benefits-heading">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 id="benefits-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
                Partnership benefits
              </h2>
              <ul className="flex flex-col gap-6">
                {benefits.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-teal-700" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{title}</h3>
                      <p className="text-gray-600">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col gap-6">
              <h3 className="text-2xl font-bold">Who we work with</h3>
              <ul className="flex flex-col gap-4">
                {idealFor.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                    <Icon className="w-8 h-8 text-teal-300 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-slate-200">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50" aria-labelledby="industries-heading">
        <div className="container mx-auto max-w-6xl flex flex-col gap-16">
          <div className="text-center flex flex-col gap-4">
            <h2 id="industries-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
              Solutions by sector
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Each sector has its own healthcare requirements</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map(({ icon: Icon, title, text, points }) => (
              <Card key={title} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-teal-700" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-sm text-gray-600">{text}</p>
                  <ul className="text-sm text-gray-700 flex flex-col gap-2">
                    {points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white" aria-labelledby="scope-heading">
        <div className="container mx-auto max-w-4xl flex flex-col gap-4">
          <h2 id="scope-heading" className="text-2xl font-bold text-gray-900">
            Scope of our services
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Expat Health Clinic provides primary and preventive care during opening hours. We are not an emergency
            service and do not provide out-of-hours care; members should contact 112 or the regional huisartsenpost in an
            emergency. Performance figures for a partnership (case resolution rates, reporting times) are agreed and
            reported under the partnership agreement rather than advertised. Patient data is shared with partner
            organisations only with the patient&apos;s authorisation, in line with our{" "}
            <Link href="/privacy" className="text-teal-700 underline underline-offset-4">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-teal-700 underline underline-offset-4">
              Terms & Conditions
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-teal-700" aria-labelledby="partner-cta-heading">
        <div className="container mx-auto max-w-4xl text-center flex flex-col gap-6">
          <h2 id="partner-cta-heading" className="text-3xl md:text-4xl font-bold text-white">
            Ready to partner with us?
          </h2>
          <p className="text-xl text-teal-50 max-w-2xl mx-auto">
            Let us discuss how Expat Health Clinic can become your local extension in the Netherlands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-teal-700 hover:bg-teal-50 text-lg px-8 py-6">
              <a href={inquiryHref}>
                <Handshake className="w-5 h-5 mr-2" aria-hidden="true" />
                Send partnership enquiry
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-teal-600">
              <a href={siteConfig.phoneHref}>Call {siteConfig.phone}</a>
            </Button>
          </div>
          <p className="text-teal-50 text-sm">
            Or email us directly:{" "}
            <a href={`mailto:${siteConfig.email}`} className="underline hover:text-white">
              {siteConfig.email}
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
