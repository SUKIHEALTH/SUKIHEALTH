export const siteConfig = {
  name: "Expat Health Clinic",
  url: "https://www.expathealthclinic.com",
  bookingUrl: "https://expatclinic.trafft.com/",
  email: "care@expathealthclinic.com",
  phone: "+31 85 212 7955",
  phoneHref: "tel:+31852127955",
  locations: ["Rotterdam", "Eindhoven", "The Hague"],
  social: {
    instagram: "https://www.instagram.com/expathealthclinic/",
    linkedin: "https://www.linkedin.com/company/expat-health-clinic/",
  },
  legal: {
    // Fill these in before going live: an auditor will look for them.
    legalEntityName: "Expat Health Clinic [legal entity name to be confirmed]",
    kvkNumber: "[KvK number to be added]",
    btwNumber: "[BTW/VAT number to be added]",
    agbCode: "[AGB code to be added]",
    registeredAddress: "[Registered address to be added], Rotterdam, The Netherlands",
    bigRegistration: "[BIG registration number(s) to be added]",
    complaintsBody: "[Wkkgz complaints officer / geschilleninstantie to be added]",
    dataProtectionContact: "privacy@expathealthclinic.com",
    lastUpdated: "6 September 2026",
  },
  analytics: {
    gaMeasurementId: "G-3LN6Z5QFNS",
  },
  aiAssistant: {
    name: "EHC Assistant",
    agentId: "agent_01jwhksefdfpn9yd5h8r19jxc4",
  },
} as const
