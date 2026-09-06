import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ShieldCheck, Languages, MapPin } from "lucide-react"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about private healthcare for expats in the Netherlands",
  alternates: { canonical: "/faq" },
}

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <Badge variant="secondary" className="bg-teal-100 text-teal-800 px-4 py-2 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4 mr-1" aria-hidden="true" />
              BIG-registered doctors
            </Badge>
            <Badge variant="secondary" className="bg-teal-100 text-teal-800 px-4 py-2 text-sm font-semibold">
              <Languages className="w-4 h-4 mr-1" aria-hidden="true" />
              Multilingual team
            </Badge>
            <Badge variant="secondary" className="bg-teal-100 text-teal-800 px-4 py-2 text-sm font-semibold">
              <MapPin className="w-4 h-4 mr-1" aria-hidden="true" />
              Rotterdam, Eindhoven, The Hague
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 text-pretty">
            Everything you need to know about private expat healthcare in the Netherlands
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Are you my new GP (huisarts)?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                <strong>No.</strong> We offer <strong>additional</strong> private care for expats. We are not a
                replacement for your regular Dutch GP (huisarts).
                <br />
                <br />
                You still need a regular GP for:
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Basic and acute medical problems</li>
                  <li>Chronic disease management</li>
                  <li>Repeat prescriptions (herhaalrecepten)</li>
                  <li>Evening, night, and weekend emergencies (ANW/huisartsenpost)</li>
                </ul>
                <br />
                We work alongside your GP to provide additional support, second opinions, and help navigating the Dutch
                healthcare system.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Do I still need a regular Dutch GP?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                <strong>Yes, absolutely.</strong> We strongly recommend that all clients stay registered with a regular
                Dutch GP (huisarts) for:
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Basic healthcare needs</li>
                  <li>Acute and emergency care (including ANW/huisartsenpost)</li>
                  <li>Chronic disease management and monitoring</li>
                  <li>Long-term maintenance prescriptions</li>
                </ul>
                <br />
                Expat Health Clinic provides additional care but does not provide emergency or out-of-hours care and
                cannot replace the full scope of services that a regular GP provides.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Do you have contracts with Dutch health insurers?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                <strong>No.</strong> Expat Health Clinic has <strong>no contracts with Dutch health insurers</strong>.
                All services are <strong>self-pay</strong>.
                <br />
                <br />
                You will receive a detailed invoice that you may submit to your own (international) insurance for
                potential reimbursement. However, reimbursement is between you and your insurer—we cannot guarantee
                coverage.
                <br />
                <br />
                Many international health insurance plans offer more flexibility for private consultations than standard
                Dutch basic insurance. Check your policy conditions or ask your insurer before booking if reimbursement
                matters to you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                What if I don't have a GP yet?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                We can help you understand how to find and register with a Dutch GP (huisarts); our Care Navigation
                service is often used for exactly this purpose.
                <br />
                <br />
                While you're looking for a GP, we can provide consultations, but you should be aware that:
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>We cannot offer emergency or out-of-hours care</li>
                  <li>We cannot provide long-term chronic care management</li>
                  <li>You may face gaps in care coverage</li>
                </ul>
                <br />
                We strongly advise finding a regular GP as soon as possible for your safety and continuity of care. Our
                Care Navigation service can guide you through this process step by step.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Can you prescribe medication?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes, our BIG-registered doctors can prescribe medication in line with Dutch medical guidelines and
                professional standards.
                <br />
                <br />
                However, for <strong>long-term maintenance prescriptions</strong> (like for chronic conditions), we
                recommend coordinating with your regular GP to ensure continuity of care and monitoring.
                <br />
                <br />
                We can provide initial prescriptions, short-term prescriptions, or help you understand your current
                medications and treatment plans.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Do you share information with my GP or specialist?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                With your consent, absolutely. We can write a clear, comprehensive summary letter in English or Dutch
                that you may forward to your GP, specialist, or other healthcare providers.
                <br />
                <br />
                This helps ensure continuity of care and allows your regular doctors to have a complete picture of your
                health. We believe in collaborative care and supporting—not replacing—your existing healthcare team.
                <br />
                <br />
                All information sharing is done with your explicit permission and in accordance with the GDPR (AVG) and
                the WGBO. See our <Link href="/privacy" className="text-teal-700 underline underline-offset-4">Privacy
                Policy</Link> for details on how we handle medical data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                What languages do you speak?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Consultations are held in <strong>English or Dutch</strong>. Depending on the physician, the following
                languages are also available:
                <br />
                <br />
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>
                    <strong>English</strong> (primary consultation language)
                  </li>
                  <li>
                    <strong>Dutch</strong> (Nederlands)
                  </li>
                  <li>
                    <strong>German</strong> (Deutsch)
                  </li>
                  <li>
                    <strong>French</strong> (Français)
                  </li>
                  <li>
                    <strong>Spanish</strong> (Español)
                  </li>
                  <li>
                    <strong>Italian</strong> (Italiano)
                  </li>
                  <li>
                    <strong>Polish</strong> (Polski)
                  </li>
                  <li>
                    <strong>Romanian</strong> (Română)
                  </li>
                  <li>
                    <strong>Arabic</strong> (العربية)
                  </li>
                  <li>
                    <strong>Hindi</strong> (हिन्दी)
                  </li>
                </ul>
                <br />
                Please state your preferred language when booking so we can match you with the right physician. If you
                need another language, let us know and we will tell you honestly whether we can accommodate it.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                How long does it take to get an appointment?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Live availability is shown on our online booking platform, so you can see the next open slot before you
                book. We typically respond to email booking requests within 2 business days.
                <br />
                <br />
                For urgent (but non-emergency) concerns, please mention this in your booking request and we'll do our
                best to accommodate you sooner.
                <br />
                <br />
                <strong>
                  For emergencies, always contact your GP, the ANW/huisartsenpost (after hours), or call 112.
                </strong>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Where are you located?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                We see patients at <strong>three locations</strong> in the Netherlands and by video consultation:
                <br />
                <br />
                <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
                  <li>
                    <strong>Rotterdam</strong> - Our main clinic, easily accessible by public transport and car
                  </li>
                  <li>
                    <strong>Eindhoven</strong> - Serving the Brainport region and surrounding areas
                  </li>
                  <li>
                    <strong>The Hague</strong> - Convenient for international organizations and embassies
                  </li>
                </ul>
                <br />
                Exact location details and parking information will be provided when you book your appointment. Choose
                the location most convenient for you or your workplace.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Can I bring my family members?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes. We regularly see families and are used to caring for children and adults who are new to the Dutch
                system.
                <br />
                <br />
                Each person needs their own appointment, but we can schedule them consecutively on the same day if
                preferred. For children under 16, a parent or guardian must be present and give consent.
                <br />
                <br />
                Family arrangements are also available through our corporate services. Contact us for details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Are your doctors qualified and registered?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                <strong>Yes.</strong> Our physicians are:
                <br />
                <br />
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Licensed and registered in the Dutch BIG register (numbers listed in the footer and available on request)</li>
                  <li>Trained in Dutch and/or international medical systems</li>
                  <li>Experienced in working with international patients</li>
                  <li>Committed to evidence-based medicine and continuing education</li>
                </ul>
                <br />
                You can verify any BIG registration yourself at{" "}
                <a href="https://www.bigregister.nl" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline underline-offset-4">
                  bigregister.nl
                </a>
                . We work with partners including Huisartspraktijk M.S. Fonderson, Rotterdam International Center and
                Dutch medical laboratories.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Why should I pay for private care when I have Dutch insurance?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Our patients tell us these are the reasons it is worthwhile for them:
                <br />
                <br />
                <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
                  <li>
                    <strong>Time:</strong> 60-90 minute appointments with room for every question
                  </li>
                  <li>
                    <strong>Language:</strong> Consultations in English or Dutch, with other languages available
                  </li>
                  <li>
                    <strong>Understanding:</strong> Doctors who are familiar with the realities of expat life
                  </li>
                  <li>
                    <strong>Clarity:</strong> A detailed written summary you can share with your GP or family
                  </li>
                  <li>
                    <strong>Navigation:</strong> Guidance through referrals, waiting lists and insurance questions
                  </li>
                </ul>
                <br />
                Private care complements, rather than replaces, the care covered by your Dutch insurance. Some
                international insurers reimburse part of the cost; check your own policy.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-12 text-center space-y-4">
            <p className="text-muted-foreground mb-6 text-lg">
              Still have questions? Our team speaks your language and is ready to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
                <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Book your appointment
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              Rotterdam • Eindhoven • The Hague • Video consultations
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
