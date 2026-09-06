"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  FileCheck,
  AlertCircle,
  Globe2,
  Languages,
  Award,
  ShieldCheck,
  Star,
  TrendingUp,
  CheckCircle,
  Bot,
  Sparkles,
} from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-teal-50 to-white py-20 md:py-28 px-4 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-3 mb-6 justify-center lg:justify-start">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 text-sm font-semibold animate-pulse"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              NEW: 24/7 AI Health Assistant
            </Badge>
            <Badge variant="secondary" className="bg-teal-100 text-teal-700 px-4 py-2 text-sm font-semibold">
              <Star className="w-4 h-4 mr-1 fill-teal-600" />
              5.0 Stars • 50+ Verified Reviews
            </Badge>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 px-4 py-2 text-sm font-semibold">
              <TrendingUp className="w-4 h-4 mr-1" />
              Same-day appointments available
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 px-4 py-2 text-sm font-semibold">
              <Languages className="w-4 h-4 mr-1" />
              10+ Languages Spoken
            </Badge>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 text-balance leading-tight">
                Finally, a doctor who speaks your language and has time for you
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 text-pretty leading-relaxed">
                Premium private healthcare designed exclusively for internationals in the Netherlands.
                <span className="font-semibold text-teal-600"> We speak 10+ languages</span> and provide the clarity and
                care you deserve.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                <p className="text-sm font-semibold text-amber-800">
                  ⚡ Only 12 intake slots left this month — Don't wait weeks at other clinics
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-teal-500 hover:bg-teal-600 text-white text-lg px-8 py-6 shadow-lg"
                >
                  <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                    Book Your Intake Now
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white">
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 border-2 border-white"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 border-2 border-white"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 border-2 border-white"></div>
                    <div className="w-10 h-10 rounded-full bg-teal-700 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      2K+
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">2,000+</span> expats trust us
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Languages className="w-8 h-8 text-teal-600" />
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">English, Dutch +8</span> more languages
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/modern-private-medical-clinic-office-with-professi.jpg"
                alt="Professional medical consultation at Expat Health Clinic private office"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Healthcare Partners & Network Section - kept the main one */}
      <section className="py-12 px-4 bg-white border-y">
        <div className="container mx-auto max-w-7xl">
          <p className="text-center text-sm font-semibold text-gray-700 mb-8 uppercase tracking-wide">
            Trusted Healthcare Partners & Network
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center">
            <Image
              src="/images/ms-fonderson-vert-100x-1024x544.jpg"
              alt="Huisartspraktijk M.S. Fonderson - Medical Partner"
              width={160}
              height={80}
              className="object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
            />
            <Image
              src="/images/humicon-logo-neu-2022-v4-1.jpg"
              alt="Humicon B.V. Medische Laboratoria - Lab Partner"
              width={160}
              height={80}
              className="object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
            />
            <Image
              src="/images/logo-expat-bevel-a4-clear-rgb-1024x559.png"
              alt="Expat Center Netherlands - Partner"
              width={160}
              height={80}
              className="object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
            />
            <Image
              src="/images/ric-logo-wit-met-zwarte-letters.svg"
              alt="Rotterdam International Center - Partner"
              width={160}
              height={80}
              className="object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 bg-white p-2"
            />
            <Image
              src="/images/apotheekglimlachlogo-e1730320028758.png"
              alt="Apotheek de Glimlach - Pharmacy Partner"
              width={160}
              height={80}
              className="object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
            />
            <Image
              src="/images/logo-insure-to-sudy-small.png"
              alt="InsureToStudy Alpina Group - Insurance Partner"
              width={160}
              height={80}
              className="object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
            />
            <Image
              src="/images/inscape-logo-1024x724.png"
              alt="Inscape - Healthcare Partner"
              width={160}
              height={80}
              className="object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
            />
            <Image
              src="/images/logo-brave-ones-black-1-e1743497970129-1024x232.png"
              alt="Brave Ones - Healthcare Partner"
              width={160}
              height={80}
              className="object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2">
              <Sparkles className="w-4 h-4 mr-1" />
              Powered by AI
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Meet Dr. Sabine Fonderson — Your 24/7 AI Health Assistant
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get instant answers to your health questions, navigate the Dutch healthcare system, and receive
              personalized guidance — anytime, anywhere. Powered by our medical director's expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Available 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get immediate responses to health questions at any time — no waiting for office hours.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Languages className="w-7 h-7 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Multilingual Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ask questions in your preferred language and get clear, understandable answers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-7 h-7 text-teal-600" />
                </div>
                <CardTitle className="text-lg">Expert Medical Knowledge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Based on Dr. Fonderson's years of experience helping expats navigate Dutch healthcare.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-9 h-9 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900">Start Chatting Now</h3>
                <p className="text-sm text-gray-600">Free to use • No appointment needed</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Click the chat widget in the bottom right corner to start a conversation with our AI health assistant. Ask
              about symptoms, healthcare navigation, appointment booking, or any health concern.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8"
                onClick={() => {
                  // This will trigger the widget to open
                  const widget = document.querySelector("elevenlabs-convai")
                  if (widget) {
                    ;(widget as any).startConversation?.()
                  }
                }}
              >
                <Bot className="w-5 h-5 mr-2" />
                Try AI Assistant Now
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8 bg-transparent">
                <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                  Or Book Human Appointment
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why 2,000+ Expats Choose Us</h2>
            <p className="text-lg text-gray-600">Healthcare that finally makes sense in the Netherlands</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-teal-600" />
                </div>
                <CardTitle className="text-lg">Comprehensive Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Starting from 30 minutes up to 90 minutes — no more rushed 10-minute consultations. Finally have time
                  to ask every question and get real answers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Languages className="w-7 h-7 text-teal-600" />
                </div>
                <CardTitle className="text-lg">Speak 10+ Languages Fluently</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  English, Dutch, German, French, Spanish, Italian, Polish, Romanian, Arabic, Hindi, and more. Be
                  understood perfectly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-7 h-7 text-teal-600" />
                </div>
                <CardTitle className="text-lg">Certified Dutch Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  All our physicians are fully licensed and registered with the Dutch BIG register. World-class
                  credentials.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Award className="w-7 h-7 text-teal-600" />
                </div>
                <CardTitle className="text-lg">Premium Partner Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Direct connections with top specialists, labs, and hospitals. Skip the confusion, get fast-tracked
                  care.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Globe2 className="w-7 h-7 text-teal-600" />
                </div>
                <CardTitle className="text-lg">3 Convenient Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Rotterdam, Eindhoven, and The Hague — choose the clinic closest to you or your workplace.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <FileCheck className="w-7 h-7 text-teal-600" />
                </div>
                <CardTitle className="text-lg">Clear Written Summaries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Leave with a complete medical summary in English you can share with your GP, family, or employer.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Our Premium Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Additional private care designed exclusively for internationals living in the Netherlands
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-teal-600" />
                </div>
                <CardTitle className="text-lg">Expat Deep Dive Consult</CardTitle>
                <CardDescription className="text-base">Comprehensive consultation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Thorough consultation with ample time to review your full medical history and address all your
                  questions.
                </p>
                <Button asChild className="w-full bg-teal-500 hover:bg-teal-600">
                  <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                    Book This Service
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Second Opinion & Medical Translation</CardTitle>
                <CardDescription className="text-base">Clear explanations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Review of diagnoses and treatment plans, with translation of Dutch medical letters into clear English.
                </p>
                <Button asChild className="w-full bg-teal-500 hover:bg-teal-600">
                  <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                    Book This Service
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Health Check for Expats</CardTitle>
                <CardDescription className="text-base">Evidence-based prevention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Focused health assessment with tailored lab tests based on your individual risk factors.
                </p>
                <Button asChild className="w-full bg-teal-500 hover:bg-teal-600">
                  <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                    Book This Service
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Care Navigation & System Coaching</CardTitle>
                <CardDescription className="text-base">Step-by-step guidance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Help understanding referrals, waiting lists, and how to navigate the Dutch healthcare system.
                </p>
                <Button asChild className="w-full bg-teal-500 hover:bg-teal-600">
                  <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                    Book This Service
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Corporate Expat Health Packages</CardTitle>
                <CardDescription className="text-base">For employers and HR teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Onboarding health consults for new hires, stress & burnout prevention, and medical navigation support
                  for families.
                </p>
                <Button asChild className="w-full bg-teal-500 hover:bg-teal-600">
                  <Link href="/contact">Contact for Corporate Packages</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">How It Works</h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Join 2,000+ expats who've taken control of their health in the Netherlands
          </p>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
              <Image
                src="/professional-private-clinic-office-consultation-ro.jpg"
                alt="Modern private clinic consultation space"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Book Online in 2 Minutes</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Choose your preferred time slot and location (Rotterdam, Eindhoven, or The Hague). Same-day or
                    same-week appointments usually available. No waiting weeks for an intake.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">60-90 Minute Deep Dive Consultation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Meet with a BIG-registered Dutch doctor who speaks your language fluently (English, Dutch, German,
                    Spanish, French, Italian, Polish, Romanian, Arabic, Hindi +). Review your complete medical history
                    and get every question answered.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Leave with Clarity and Confidence</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Receive a comprehensive written summary in English, actionable next steps, and ongoing support
                    navigating the Dutch healthcare system. Share your summary with your regular GP or family.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="py-16 px-4 bg-amber-50 border-y border-amber-200">
        <div className="container mx-auto max-w-5xl">
          <div className="flex gap-6">
            <AlertCircle className="w-10 h-10 text-amber-600 flex-shrink-0 mt-1" />
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                We do not replace your Dutch GP (huisarts)
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  <strong>Expat Health Clinic offers additional private care for expats.</strong> We are not a
                  replacement for your regular Dutch GP.
                </p>
                <p>You are strongly advised to stay registered with a regular GP (huisarts) for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Acute problems and emergencies</li>
                  <li>Chronic disease management</li>
                  <li>Repeat prescriptions (herhaalrecepten)</li>
                  <li>Evening, night, and weekend emergency care (ANW/huisartsenpost)</li>
                </ul>
                <p className="font-semibold">
                  Expat Health Clinic has no contracts with Dutch health insurers. Clients pay directly and may submit
                  the invoice to their own (international) insurer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">What Expats Are Saying</h2>
            <p className="text-lg text-gray-600">Real reviews from real patients on our booking platform</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">5.0 out of 5</span>
              <span className="text-gray-600">• 50+ verified reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Anonymous</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed italic">
                  "I felt extremely comfortable from the moment I walked in. The Doctor made a point of explaining the
                  process, and a bit about the Dutch healthcare system, and was very thorough to ensure all my needs
                  were addressed in the one appointment."
                </p>
                <p className="text-sm text-gray-500 mt-4">General Health Consultation</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg">
                    D
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dante</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed italic">
                  "I managed to book an appointment the same day 1 hour from the booked time slot, it took me about 5
                  minutes to be attended to when I got there and the doctor was super friendly and helpful.
                  Additionally, I could collect my prescribed goods at the pharmacy in the same building, making for an
                  easy and stress free experience. Thank you!"
                </p>
                <p className="text-sm text-gray-500 mt-4">General Health Consultation • 8 months ago</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Anonymous</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed italic">
                  "Dr. Fonderson is very thorough with her questions during consultation. Very helpful and I left my
                  appointment feeling more assured and informed."
                </p>
                <p className="text-sm text-gray-500 mt-4">General Health Consultation with Dr. Sabine Fonderson</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg">
                    C
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Cristina-Maria</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed italic">"Very caring doctor!"</p>
                <p className="text-sm text-muted-foreground mt-4">
                  Teleconsultation with Dr. Sabine Fonderson • 2 months ago
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Anonymous</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed italic">
                  "The Dr was very instructive and guided me with answers through all my questions. Would definetely
                  suggest!"
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  General Health Consultation with Dr. Sabine Fonderson • 2 months ago
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-teal-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <p className="text-lg font-semibold text-gray-900">Join 2,000+ satisfied expats</p>
                  <Button asChild className="bg-teal-500 hover:bg-teal-600 w-full">
                    <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                      Book Your Consultation
                    </a>
                  </Button>
                  <p className="text-sm text-muted-foreground">Same-week appointments available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-balance leading-tight">
            Finally, a doctor who speaks your language and has time for you
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 text-pretty leading-relaxed">
            Premium private healthcare designed exclusively for internationals in the Netherlands.
            <span className="font-semibold text-teal-600"> We speak 10+ languages</span> and provide the clarity and
            care you deserve.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
            <p className="text-sm font-semibold text-amber-800">
              ⚡ Limited availability this month — Book your intake consultation today
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600 text-white text-lg px-8 py-6">
              <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                Book Your Intake Now
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
              <Link href="#services">Explore Services</Link>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-teal-200 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-teal-300 border-2 border-white"></div>
                <div className="w-10 h-10 rounded-full bg-teal-400 border-2 border-white"></div>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">2,000+</span> expats served
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="w-8 h-8 text-teal-600" />
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">10+</span> languages spoken
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-teal-500 text-white">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Take Control of Your Health in the Netherlands
          </h2>
          <p className="text-xl text-teal-50 text-pretty">
            Same-week appointments available. Book your 60-90 minute deep dive consultation today and finally get the
            clarity you deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                Book Your Intake Now
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent"
            >
              <Link href="/contact">Ask Us Anything</Link>
            </Button>
          </div>
          <p className="text-sm text-teal-100 pt-4">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Trusted by 2,000+ expats • 10+ Languages • 3 Locations
          </p>
        </div>
      </section>
    </main>
  )
}
