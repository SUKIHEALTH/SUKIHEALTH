"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Shield,
  Globe2,
  FileCheck,
  Clock,
  Users,
  TrendingDown,
  Stethoscope,
  Video,
  FileText,
  CheckCircle,
  ArrowRight,
  Handshake,
  Award,
  Languages,
  Anchor,
  Landmark,
  Briefcase,
  ShieldCheck,
  Zap,
  HeartPulse,
} from "lucide-react"
import Image from "next/image"

export default function CorporatePartnersPage() {
  const handlePartnerInquiry = () => {
    const emailSubject = encodeURIComponent("TPA/Corporate Partnership Inquiry - Expat Health Clinic")
    const emailBody = encodeURIComponent(
      `Company Name: \n` +
      `Contact Person: \n` +
      `Email: \n` +
      `Phone: \n` +
      `Type of Organization: [TPA / IPMI / Corporate HR / Other]\n\n` +
      `Services of Interest:\n` +
      `- [ ] Cost Containment & Medical Management\n` +
      `- [ ] Occupational Health & Screening\n` +
      `- [ ] Telehealth & Remote Medical Advice\n` +
      `- [ ] Claims Reporting & Integration\n` +
      `- [ ] Executive Health Programs\n\n` +
      `Additional Information:\n`
    )
    window.location.href = `mailto:care@expathealthclinic.com?subject=${emailSubject}&body=${emailBody}`
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 px-4 py-2">
                  <Building2 className="w-4 h-4 mr-1" />
                  Boutique TPA Services
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
                  <Globe2 className="w-4 h-4 mr-1" />
                  Netherlands-Based
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance leading-tight">
                Global Standards, Local Expertise
              </h1>
              <p className="text-xl text-slate-300 mb-4 text-pretty leading-relaxed">
                Your Partner in Medical Management and Cost Containment
              </p>
              <p className="text-lg text-slate-400 mb-8">
                We serve as the trusted local extension for Third Party Administrators (TPAs), International Private Medical Insurers (IPMI), and Corporate HR departments. Operating within the Dutch healthcare system, we act as a strict <span className="text-teal-400 font-semibold">Gatekeeper</span>, ensuring your members receive high-quality primary care while effectively managing medical costs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-teal-500 hover:bg-teal-600 text-white text-lg px-8 py-6"
                  onClick={handlePartnerInquiry}
                >
                  <Handshake className="w-5 h-5 mr-2" />
                  Become a Partner
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-slate-600 text-white hover:bg-slate-800">
                  <a href="tel:+31852127955">
                    Call Us: +31 85 212 7955
                  </a>
                </Button>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/professional-private-clinic-office-consultation-ro.jpg"
                  alt="Professional medical consultation in modern private clinic"
                  width={600}
                  height={450}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">90%+</p>
                    <p className="text-sm text-gray-600">Cost containment rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-teal-100 text-teal-700">The Cost-Efficient Local Gatekeeper</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Partner With Expat Health Clinic?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We position ourselves not just as a care provider, but as your <span className="font-semibold text-teal-600">Cost Containment Partner</span>. We prevent expensive hospital claims by treating 90%+ of issues at the primary care level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="w-8 h-8 text-teal-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-teal-600">90%+</CardTitle>
                <CardDescription className="text-base">Issues resolved at primary care level</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Languages className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-blue-600">10+</CardTitle>
                <CardDescription className="text-base">Languages spoken by our team</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Globe2 className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-purple-600">3</CardTitle>
                <CardDescription className="text-base">Strategic locations across NL</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-amber-600">24/7</CardTitle>
                <CardDescription className="text-base">AI-powered health assistance</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services for Partners */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services for Partners
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive medical management solutions designed for TPAs, IPMIs, and corporate clients
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <TrendingDown className="w-7 h-7 text-teal-600" />
                </div>
                <CardTitle className="text-xl">Cost Containment & Medical Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  We align with your cost control goals by acting as the primary point of care. Our clinic resolves the majority of medical requests in-house, significantly reducing claim costs associated with hospital admissions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Strict gatekeeper model prevents unnecessary referrals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">In-house treatment for 90%+ of primary care needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Transparent pricing and billing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Stethoscope className="w-7 h-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Occupational Health & Screening</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  We provide comprehensive pre-employment and re-employment medical examinations for industries including maritime, aviation, and oil & gas. We ensure compliance with industry best practices for your workforce.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Pre-employment medical examinations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Maritime and aviation crew screenings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Executive health programs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Video className="w-7 h-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Telehealth & Remote Medical Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Adopting a "phygital" approach (physical + digital), we offer secure video consultations and remote medical advice to expatriates and travelers, ensuring access to care wherever they are.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">24/7 AI-powered health assistant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Secure video consultations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Multilingual remote support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-amber-600" />
                </div>
                <CardTitle className="text-xl">Rapid Claims Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  We understand that "faster claims intake means faster response." Our administrative team is equipped to integrate with digital claims platforms to provide timely medical reports and transparent billing.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Digital claims platform integration (ECHO compatible)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Same-day medical reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">Transparent, itemized billing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-4 bg-white border-y border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <p className="text-center text-sm text-gray-500 mb-8 font-medium uppercase tracking-wide">Trusted by Leading Organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all">
            <Image src="/images/logo-expat-bevel-a4-clear-rgb-1024x559.png" alt="Expat Center Netherlands" width={140} height={60} className="h-12 w-auto object-contain" />
            <Image src="/images/ric-logo-wit-met-zwarte-letters.svg" alt="Rotterdam International Center" width={140} height={60} className="h-10 w-auto object-contain" />
            <Image src="/images/logo-brave-ones-black-1-e1743497970129-1024x232.png" alt="Brave Ones" width={120} height={40} className="h-8 w-auto object-contain" />
            <Image src="/images/inscape-logo-1024x724.png" alt="Inscape" width={100} height={60} className="h-12 w-auto object-contain" />
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-slate-100 text-slate-700">Partnership Benefits</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Partner With Us?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Digital Integration</h3>
                    <p className="text-gray-600">We utilize e-health records for seamless data exchange with your systems.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Languages className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Multilingual Support</h3>
                    <p className="text-gray-600">Serving the global expatriate community in 10+ languages.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Risk Management</h3>
                    <p className="text-gray-600">We support your risk assessment and liability management protocols.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">BIG-Registered Physicians</h3>
                    <p className="text-gray-600">All doctors are fully licensed and registered with the Dutch medical register.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Ideal For</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                  <Building2 className="w-8 h-8 text-teal-400" />
                  <div>
                    <p className="font-semibold">Third Party Administrators (TPAs)</p>
                    <p className="text-sm text-slate-300">AP Companies, Crawford & Company, Van Ameyde</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="font-semibold">International Private Medical Insurers</p>
                    <p className="text-sm text-slate-300">AXA Partners, Henner Group, Gallagher Bassett</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                  <Users className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="font-semibold">Corporate HR Departments</p>
                    <p className="text-sm text-slate-300">Embassies, NGOs, Multinationals</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                  <Award className="w-8 h-8 text-amber-400" />
                  <div>
                    <p className="font-semibold">Executive & Wealth Management</p>
                    <p className="text-sm text-slate-300">Family offices, High-net-worth individuals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry-Specific Solutions */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tailored Solutions by Industry
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We understand each industry has unique healthcare requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Anchor className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Maritime & Aviation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  We can be your direct medical provider in the Netherlands for seafarer and aviation crew screenings.
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Pre-employment medicals</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Crew fitness certificates</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Return-to-work assessments</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <Landmark className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Embassies & International Orgs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  We specialise in serving International Organisations and Embassies, helping your members navigate the Dutch healthcare system.
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-500" /> Diplomatic staff healthcare</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-500" /> Family healthcare programs</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-500" /> Cultural sensitivity</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                  <Briefcase className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Corporate & Executive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  We offer executive health screenings and family office medical services for your high-value clients.
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500" /> Executive health programs</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500" /> Corporate wellness</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500" /> VIP concierge service</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle className="text-lg">Insurance & Assistance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  We support your phygital strategy by providing both remote medical advice and immediate physical access.
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500" /> 24/7 telehealth support</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500" /> Physical clinic access</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-500" /> Integrated care pathway</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Claims Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  We are ready to integrate with your claims platform to streamline handling and reduce administrative costs.
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-500" /> ECHO platform compatible</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-500" /> Rapid claims reporting</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-500" /> Digital documentation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <HeartPulse className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">Accident & Health</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  We support your Medical Management programs with rapid reporting and fast claims intake for accident and health cases.
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-red-500" /> Same-day appointments</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-red-500" /> Rapid medical reporting</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-red-500" /> Injury management</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-teal-100 text-teal-700">Measurable Outcomes</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Results You Can Expect
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our gatekeeper model delivers tangible value to your organization and members
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <p className="text-4xl font-bold text-teal-600 mb-2">90%+</p>
              <p className="text-gray-700 font-medium">Cases resolved at primary care level</p>
              <p className="text-sm text-gray-500 mt-1">Avoiding costly hospital referrals</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <p className="text-4xl font-bold text-blue-600 mb-2">24-48h</p>
              <p className="text-gray-700 font-medium">Average claims reporting time</p>
              <p className="text-sm text-gray-500 mt-1">Faster than industry standard</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <p className="text-4xl font-bold text-purple-600 mb-2">10+</p>
              <p className="text-gray-700 font-medium">Languages supported</p>
              <p className="text-sm text-gray-500 mt-1">Serving global expatriates</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <p className="text-4xl font-bold text-amber-600 mb-2">5.0</p>
              <p className="text-gray-700 font-medium">Patient satisfaction rating</p>
              <p className="text-sm text-gray-500 mt-1">Based on verified reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Partner With Us?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Let us discuss how Expat Health Clinic can become your trusted local extension in the Netherlands. Contact our partnership team today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-teal-700 hover:bg-teal-50 text-lg px-8 py-6"
            >
              <a href="mailto:care@expathealthclinic.com?subject=TPA%2FCorporate%20Partnership%20Inquiry%20-%20Expat%20Health%20Clinic&body=Company%20Name%3A%20%0AContact%20Person%3A%20%0AEmail%3A%20%0APhone%3A%20%0AType%20of%20Organization%3A%20%5BTPA%20%2F%20IPMI%20%2F%20Corporate%20HR%20%2F%20Other%5D%0A%0AServices%20of%20Interest%3A%0A-%20%5B%20%5D%20Cost%20Containment%20%26%20Medical%20Management%0A-%20%5B%20%5D%20Occupational%20Health%20%26%20Screening%0A-%20%5B%20%5D%20Telehealth%20%26%20Remote%20Medical%20Advice%0A-%20%5B%20%5D%20Claims%20Reporting%20%26%20Integration%0A-%20%5B%20%5D%20Executive%20Health%20Programs%0A%0AAdditional%20Information%3A%0A">
                <Handshake className="w-5 h-5 mr-2" />
                Send Partnership Inquiry
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-teal-500">
              <a href="tel:+31852127955">
                Call: +31 85 212 7955
              </a>
            </Button>
          </div>
          <p className="text-teal-200 mt-6 text-sm">
            Or email us directly: <a href="mailto:care@expathealthclinic.com" className="underline hover:text-white">care@expathealthclinic.com</a>
          </p>
        </div>
      </section>
    </main>
  )
}
