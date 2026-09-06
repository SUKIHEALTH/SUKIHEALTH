import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage, LegalSection } from "@/components/legal/legal-page"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for private medical services provided by Expat Health Clinic in the Netherlands, including appointments, fees, cancellations, liability and our complaints procedure.",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  const { legal } = siteConfig

  return (
    <LegalPage
      title="Terms & Conditions"
      intro="These terms apply to all private medical services, website use and corporate or TPA services provided by Expat Health Clinic. By booking an appointment or using our website you agree to these terms. Dutch healthcare law, in particular the Medical Treatment Contracts Act (WGBO) and the Healthcare Quality, Complaints and Disputes Act (Wkkgz), always applies alongside these terms."
      lastUpdated={legal.lastUpdated}
    >
      <LegalSection id="provider" title="1. About us">
        <p>
          Services are provided by {legal.legalEntityName}, KvK {legal.kvkNumber}, AGB code {legal.agbCode}, with its
          registered address at {legal.registeredAddress}. Our physician is registered in the Dutch BIG register under
          number {legal.bigRegistration}, which you can verify at{" "}
          <a href="https://www.bigregister.nl" target="_blank" rel="noopener noreferrer">
            bigregister.nl
          </a>
          . We provide care at our locations in {siteConfig.locations.join(", ")} and by video consultation.
        </p>
      </LegalSection>

      <LegalSection id="scope" title="2. Nature of our services">
        <ul>
          <li>
            We offer <strong>additional private medical care</strong>. We are not a huisartsenpraktijk and do not replace
            your regular Dutch GP (huisarts). Every resident of the Netherlands should remain registered with a huisarts.
          </li>
          <li>
            We are <strong>not an emergency service</strong> and do not offer 24/7 care. In a medical emergency call 112;
            outside office hours contact your regional huisartsenpost.
          </li>
          <li>
            We have <strong>no contracts with Dutch health insurers</strong>. All services are self-pay. Whether your
            insurer reimburses part of an invoice depends on your own policy; we cannot guarantee reimbursement.
          </li>
          <li>
            Prescriptions and referrals are issued only when medically appropriate in the professional judgement of the
            treating physician.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="appointments" title="3. Appointments, cancellations and no-shows">
        <ul>
          <li>Appointments are booked via our online booking platform, by email or by telephone.</li>
          <li>
            You may cancel or reschedule free of charge up to <strong>24 hours</strong> before the appointment.
          </li>
          <li>
            Cancellations within 24 hours, or failure to attend, may be charged at up to 100% of the consultation fee,
            because the time has been reserved for you and cannot be offered to another patient.
          </li>
          <li>
            If we need to cancel, we will offer an alternative date or a full refund of any prepaid fee.
          </li>
          <li>Please bring valid identification and, where relevant, your insurance details to your first visit.</li>
        </ul>
      </LegalSection>

      <LegalSection id="fees" title="4. Fees and payment">
        <ul>
          <li>
            Current fees are shown on our <Link href="/services">Services</Link> page and booking platform before you
            confirm a booking. Prices include VAT where applicable; most medical services are VAT-exempt.
          </li>
          <li>
            Payment is due at the time of booking or immediately after the consultation unless agreed otherwise in
            writing (for example under a corporate or TPA agreement).
          </li>
          <li>
            Additional services requested during a consultation (e.g. laboratory tests, extended time) are charged at the
            published rate and agreed with you beforehand.
          </li>
          <li>
            Overdue invoices may be subject to statutory interest and reasonable collection costs in accordance with
            Dutch law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="obligations" title="5. Your responsibilities">
        <ul>
          <li>Provide accurate and complete information about your health, medication and medical history.</li>
          <li>Follow agreed treatment advice and inform us of any changes in your condition.</li>
          <li>Treat our staff and other patients with respect; we may refuse service in cases of abusive behaviour.</li>
        </ul>
      </LegalSection>

      <LegalSection id="records" title="6. Medical records and confidentiality">
        <p>
          We keep a medical record for every patient as required by the WGBO and retain it for at least 20 years. All
          staff are bound by professional secrecy. Information is shared with third parties, including your huisarts,
          insurer or employer, only with your explicit permission or where the law requires. Details are in our{" "}
          <Link href="/privacy">Privacy & Data Protection Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection id="corporate" title="7. Corporate, insurer and TPA services">
        <p>
          Where an employer, insurer or third-party administrator (TPA) contracts our services, a separate written
          agreement governs fees, reporting and data sharing. The patient always retains their rights under the WGBO and
          GDPR, and medical information is shared with the contracting organisation only to the extent the patient has
          authorised.
        </p>
      </LegalSection>

      <LegalSection id="ai-assistant" title="8. Website and automated assistant">
        <ul>
          <li>
            The content of this website is general information and does not constitute medical advice or a treatment
            relationship.
          </li>
          <li>
            The {siteConfig.aiAssistant.name} is an automated conversational tool provided by ElevenLabs. It is{" "}
            <strong>not a doctor</strong>, has no access to your medical record, and must not be relied on for diagnosis,
            treatment decisions or emergencies. Its answers may be incomplete or incorrect. Always verify important
            information with a qualified healthcare professional.
          </li>
          <li>
            The assistant is loaded only with your consent. Please do not share detailed medical information with it.
          </li>
          <li>Links to third-party websites are provided for convenience; we are not responsible for their content.</li>
        </ul>
      </LegalSection>

      <LegalSection id="liability" title="9. Liability">
        <p>
          We provide our services with the care expected of a competent healthcare professional and carry professional
          liability insurance. Our liability is limited to the amount paid out under that insurance, except where Dutch
          law does not permit such limitation (for example in cases of intent or gross negligence). We are not liable for
          damage caused by inaccurate or incomplete information provided by the patient, by third parties such as
          laboratories or insurers, or by the use of the website or automated assistant outside its stated purpose.
        </p>
      </LegalSection>

      <LegalSection id="complaints" title="10. Complaints and disputes (Wkkgz)">
        <p>
          If you are not satisfied with our care, please tell us first. Contact us at{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or speak to your treating physician. We aim to
          respond within two weeks and to resolve complaints within six weeks.
        </p>
        <p>
          In accordance with the Wkkgz, we are affiliated with an independent, recognised complaints and disputes
          scheme:{" "}
          <a href={legal.complaintsUrl} target="_blank" rel="noopener noreferrer">
            {legal.complaintsBody}
          </a>
          . Through this scheme you can contact an independent complaints officer and, if the complaint is not
          resolved, submit it to the disputes body. This procedure is free of charge for patients.
        </p>
        <p>
          You may additionally report concerns to the Dutch Health and Youth Care Inspectorate (IGJ) via the{" "}
          <a href="https://www.landelijkmeldpuntzorg.nl" target="_blank" rel="noopener noreferrer">
            Landelijk Meldpunt Zorg
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="law" title="11. Governing law and changes">
        <p>
          These terms are governed by Dutch law. Disputes that are not resolved through the complaints procedure are
          submitted to the competent court in the Netherlands. We may update these terms; the version in force at the
          time of your booking applies. The date at the top of this page shows the latest version.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
