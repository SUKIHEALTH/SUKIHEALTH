"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

const gpLabels: Record<string, string> = {
  yes: "Yes",
  no: "No",
  "not-yet": "Not yet, but looking",
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consent, setConsent] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    hasGp: "yes",
    location: "",
    reason: "",
    message: "",
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!consent) return
    setIsSubmitting(true)

    const emailSubject = encodeURIComponent(`Contact Form: ${formData.reason} - ${formData.name}`)
    const emailBody = encodeURIComponent(
      `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone || "Not provided"}\n` +
        `Preferred Location: ${formData.location || "Not specified"}\n` +
        `Registered with Dutch GP: ${gpLabels[formData.hasGp] ?? formData.hasGp}\n` +
        `Reason for Contact: ${formData.reason}\n\n` +
        `Message:\n${formData.message}\n\n` +
        `Consent to processing given via website contact form.`,
    )

    window.location.href = `mailto:${siteConfig.email}?subject=${emailSubject}&body=${emailBody}`

    toast({
      title: "Opening your email client",
      description: "Please send the email to complete your enquiry.",
    })

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+31 6 1234 5678"
          aria-describedby="phone-hint"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <p id="phone-hint" className="text-xs text-muted-foreground">
          Please use international format
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="location">Preferred location (optional)</Label>
        <Select
          name="location"
          value={formData.location}
          onValueChange={(value) => setFormData({ ...formData, location: value })}
        >
          <SelectTrigger id="location">
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rotterdam">Rotterdam</SelectItem>
            <SelectItem value="eindhoven">Eindhoven</SelectItem>
            <SelectItem value="the-hague">The Hague</SelectItem>
            <SelectItem value="video">Video consultation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium leading-none mb-2">Are you already registered with a Dutch GP? *</legend>
        <RadioGroup
          value={formData.hasGp}
          onValueChange={(value) => setFormData({ ...formData, hasGp: value })}
          name="has-gp"
          required
          className="flex flex-col gap-2"
        >
          {Object.entries(gpLabels).map(([value, label]) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={`gp-${value}`} />
              <Label htmlFor={`gp-${value}`} className="font-normal cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <p className="text-xs text-muted-foreground">
          We ask this because we strongly recommend having a regular GP for basic and emergency care.
        </p>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reason">Reason for contact *</Label>
        <Select
          name="reason"
          required
          value={formData.reason}
          onValueChange={(value) => setFormData({ ...formData, reason: value })}
        >
          <SelectTrigger id="reason">
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="intake">Book an intake</SelectItem>
            <SelectItem value="corporate">Corporate or TPA enquiry</SelectItem>
            <SelectItem value="question">General question</SelectItem>
            <SelectItem value="records">Request my medical records</SelectItem>
            <SelectItem value="complaint">Complaint or feedback</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          aria-describedby="message-hint"
          placeholder="Tell us which service you are interested in or what you would like to ask."
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
        <p id="message-hint" className="text-xs text-muted-foreground">
          This form opens your own email program. Email is not fully secure, so please keep medical details to a
          minimum; you can share them safely during your appointment.
        </p>
      </div>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-700" aria-hidden="true" />
        <AlertDescription className="text-sm text-gray-700">
          We offer additional private care for expats and are not an emergency service. In an emergency call 112. We
          strongly recommend staying registered with a regular GP (huisarts).
        </AlertDescription>
      </Alert>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked === true)}
          aria-describedby="consent-description"
          required
        />
        <Label htmlFor="consent" id="consent-description" className="font-normal leading-relaxed cursor-pointer">
          I agree that Expat Health Clinic may process the details I provide, including any health information, to
          respond to my enquiry, as described in the{" "}
          <Link href="/privacy" className="underline underline-offset-4 text-teal-700">
            Privacy Policy
          </Link>
          . *
        </Label>
      </div>

      <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" size="lg" disabled={isSubmitting || !consent}>
        {isSubmitting ? "Opening email..." : "Send message"}
      </Button>
    </form>
  )
}
