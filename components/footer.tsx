import Link from "next/link"
import { Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Expat Health Clinic</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Private healthcare for expats in the Netherlands. Additional care alongside your regular GP.
            </p>
            {/* Social Media Links */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/expathealthclinic/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-teal-500 flex items-center justify-center transition-colors group"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-600 group-hover:text-white" />
              </a>
              <a
                href="https://www.linkedin.com/company/expat-health-clinic/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-teal-500 flex items-center justify-center transition-colors group"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
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
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://expathealthclinic.com/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-teal-600"
                >
                  Privacy & Data Protection
                </a>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-teal-600">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Rotterdam | Eindhoven | The Hague</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-1">The Netherlands</p>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-8 pt-8 border-t">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Important:</strong> Expat Health Clinic offers additional private care and does not replace your
            regular Dutch GP (huisarts). We have no contracts with Dutch health insurers. All services are self-pay.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            © {new Date().getFullYear()} Expat Health Clinic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
