import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Star, Languages, MapPin } from "lucide-react"

export const metadata = {
  title: "FAQ - Expat Health Clinic",
  description: "Frequently asked questions about private healthcare for expats in the Netherlands",
}

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <Badge variant="secondary" className="bg-teal-100 text-teal-700 px-4 py-2 text-sm font-semibold">
              <Star className="w-4 h-4 mr-1" />
              Trusted by 2,000+ expats
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-4 py-2 text-sm font-semibold">
              <Languages className="w-4 h-4 mr-1" />
              10+ Languages Spoken
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 px-4 py-2 text-sm font-semibold">
              <MapPin className="w-4 h-4 mr-1" />3 Locations in NL
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 text-pretty">
            Everything you need to know about premium expat healthcare in the Netherlands
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
                Expat Health Clinic provides premium additional care but cannot provide 24/7 emergency care or replace
                the full scope of services that a regular GP provides.
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
                Dutch insurance. Over 75% of our clients successfully receive partial or full reimbursement from their
                international insurers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                What if I don't have a GP yet?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                We can help you understand how to find and register with a Dutch GP (huisarts), and many of our 2,000+
                clients have used our navigation service for this exact purpose.
                <br />
                <br />
                While you're looking for a GP, we can provide consultations, but you should be aware that:
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>We cannot offer 24/7 emergency care</li>
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
                All information sharing is done with your explicit permission and in accordance with Dutch privacy laws
                (AVG/GDPR). Your health data security is our top priority.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                What languages do you speak?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                We speak <strong>10+ languages fluently</strong>, including:
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
                If you need consultation in another language, please let us know when booking and we'll do our best to
                accommodate you. Being understood in your native language makes all the difference in healthcare.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                How long does it take to get an appointment?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                <strong>Same-week appointments are usually available.</strong> We typically respond to booking requests
                within 2 business days and can often schedule you within 3-7 days.
                <br />
                <br />
                Unlike traditional GP practices with 2-3 week waiting times, we maintain availability specifically for
                expats who need prompt, quality care.
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
                We have <strong>3 convenient locations</strong> across the Netherlands:
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
                Yes! Over 60% of our clients are families who appreciate having their entire family seen by doctors who
                understand expat life.
                <br />
                <br />
                Each person will need their own appointment, but we can schedule them consecutively on the same day if
                preferred. Many families find this more convenient than managing multiple GP visits.
                <br />
                <br />
                We also offer special family packages through our corporate services with preferential rates. Contact us
                for more information about family care plans.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Are your doctors qualified and registered?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                <strong>Absolutely.</strong> All our physicians are:
                <br />
                <br />
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Fully licensed and registered with the Dutch BIG register</li>
                  <li>Trained in Dutch and/or international medical systems</li>
                  <li>Experienced in working with expat populations</li>
                  <li>Committed to evidence-based medicine and continuing education</li>
                </ul>
                <br />
                We maintain the highest professional standards and work with premium healthcare partners including
                Huisartspraktijk M.S. Fonderson, Rotterdam International Center, and leading Dutch medical laboratories.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12" className="border rounded-lg px-6 bg-white shadow-sm">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Why should I pay for private care when I have Dutch insurance?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Great question. Here's what 2,000+ expats have told us makes it worthwhile:
                <br />
                <br />
                <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
                  <li>
                    <strong>Time:</strong> 60-90 minute appointments vs. rushed 10-minute consultations
                  </li>
                  <li>
                    <strong>Language:</strong> Fluent English (and 9+ other languages) vs. basic medical Dutch
                  </li>
                  <li>
                    <strong>Understanding:</strong> Doctors who get expat life vs. cultural miscommunication
                  </li>
                  <li>
                    <strong>Speed:</strong> Same-week appointments vs. 2-3 week waiting times
                  </li>
                  <li>
                    <strong>Clarity:</strong> Detailed written summaries vs. brief, unclear notes
                  </li>
                  <li>
                    <strong>Navigation:</strong> System guidance vs. figuring it out alone
                  </li>
                </ul>
                <br />
                Think of it as premium healthcare that works the way you're used to—and many international insurers
                reimburse part or all of the cost.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-12 text-center space-y-4">
            <p className="text-muted-foreground mb-6 text-lg">
              Still have questions? Our team speaks your language and is ready to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600">
                <a href="https://expatclinic.trafft.com/" target="_blank" rel="noopener noreferrer">
                  Book Your Appointment
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              Join 2,000+ satisfied expats • Same-week availability • 10+ languages
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
