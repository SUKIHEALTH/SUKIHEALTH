import Link from "next/link"
import { Instagram, Linkedin } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { CookiePreferencesLink } from "@/components/consent/cookie-preferences-link"

export function Footer() {
  const { legal } = siteConfig

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h2 className="font-bold text-lg mb-4 text-gray-900">Expat Health Clinic</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Private healthcare for expats in the Netherlands. Additional care alongside your regular GP.
            </p>
            <div className="flex gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-teal-600 flex items-center justify-center transition-colors group"
                aria-label="Follow us on Instagram (opens in a new tab)"
              >
                <Instagram className="w-5 h-5 text-gray-600 group-hover:text-white" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-teal-600 flex items-center justify-center transition-colors group"
                aria-label="Follow us on LinkedIn (opens in a new tab)"
              >
                <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-white" aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="font-bold text-lg mb-4 text-gray-900">Quick Links</h2>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/services" className="text-sm text-muted-foreground hover:text-teal-600">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-teal-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-teal-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/corporate-partners" className="text-sm text-muted-foreground hover:text-teal-600">
                  TPA & Corporate
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="font-bold text-lg mb-4 text-gray-900">Legal</h2>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-teal-600">
                  Privacy & Data Protection
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-teal-600">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/terms#complaints" className="text-sm text-muted-foreground hover:text-teal-600">
                  Complaints procedure
                </Link>
              </li>
              <li>
                <CookiePreferencesLink />
              </li>
            </ul>
          </nav>

          <address className="not-italic">
            <h2 className="font-bold text-lg mb-4 text-gray-900">Company details</h2>
            <dl className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div>
                <dt className="sr-only">Legal entity</dt>
                <dd>{legal.legalEntityName}</dd>
              </div>
              <div>
                <dt className="sr-only">Registered address</dt>
                <dd>{legal.registeredAddress}</dd>
              </div>
              <div className="flex gap-1">
                <dt>KvK:</dt>
                <dd>{legal.kvkNumber}</dd>
              </div>
              <div className="flex gap-1">
                <dt>BTW:</dt>
                <dd>{legal.btwNumber}</dd>
              </div>
              <div className="flex gap-1">
                <dt>AGB:</dt>
                <dd>{legal.agbCode}</dd>
              </div>
              <div className="flex gap-1">
                <dt>BIG:</dt>
                <dd>{legal.bigRegistration}</dd>
              </div>
              <div className="mt-2">
                <dt className="sr-only">Email</dt>
                <dd>
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-teal-600">
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Locations</dt>
                <dd>{siteConfig.locations.join(" | ")}, The Netherlands</dd>
              </div>
            </dl>
          </address>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col gap-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Important:</strong> Expat Health Clinic offers additional private care and does not replace your
            regular Dutch GP (huisarts). We have no contracts with Dutch health insurers; all services are self-pay and
            reimbursement depends on your own policy. We are not an emergency service. In a medical emergency call 112.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our website assistant ({siteConfig.aiAssistant.name}) is an automated tool for general information about
            our services. It is not a doctor, does not provide medical advice or diagnosis, and its answers do not create
            a treatment relationship.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
