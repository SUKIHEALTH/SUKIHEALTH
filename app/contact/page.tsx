"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Mail, Phone, MapPin } from "lucide-react"


export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Construct email body with all form fields
    const emailSubject = encodeURIComponent(`Contact Form: ${formData.reason} - ${formData.name}`)
    const emailBody = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone || 'Not provided'}\n` +
      `Preferred Location: ${formData.location || 'Not specified'}\n` +
      `Registered with Dutch GP: ${formData.hasGp === 'yes' ? 'Yes' : formData.hasGp === 'no' ? 'No' : 'Not yet, but looking'}\n` +
      `Reason for Contact: ${formData.reason}\n\n` +
      `Message:\n${formData.message}`
    )

    // Open mailto link
    window.location.href = `mailto:care@expathealthclinic.com?subject=${emailSubject}&body=${emailBody}`

    toast({
      title: "Opening your email client...",
      description: "Please send the email to complete your inquiry.",
    })

    setIsSubmitting(false)
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">Get in Touch</h1>
          <p className="text-xl text-gray-600 text-pretty">
            Book your intake or ask a question. We'll respond within 2 business days.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Form</CardTitle>
                  <CardDescription>
                    Fill in the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+31 6 1234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Please use international format</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Preferred Location (optional)</Label>
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
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Are you already registered with a Dutch GP? *</Label>
                      <RadioGroup
                        value={formData.hasGp}
                        onValueChange={(value) => setFormData({ ...formData, hasGp: value })}
                        name="has-gp"
                        required
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="gp-yes" />
                          <Label htmlFor="gp-yes" className="font-normal cursor-pointer">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="gp-no" />
                          <Label htmlFor="gp-no" className="font-normal cursor-pointer">
                            No
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="not-yet" id="gp-not-yet" />
                          <Label htmlFor="gp-not-yet" className="font-normal cursor-pointer">
                            Not yet, but looking
                          </Label>
                        </div>
                      </RadioGroup>
                      <p className="text-xs text-muted-foreground">
                        We ask this because we strongly recommend having a regular GP for basic and emergency care.
                      </p>
                    </div>

                    <div className="space-y-2">
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
                          <SelectItem value="corporate">Corporate enquiry</SelectItem>
                          <SelectItem value="question">General question</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        placeholder="Tell us about your health concerns, questions, or what service you're interested in..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-sm text-gray-700">
                        We offer additional private care for expats. We strongly recommend staying registered with a
                        regular GP (huisarts) for basic and emergency care.
                      </AlertDescription>
                    </Alert>

                    <Button
                      type="submit"
                      className="w-full bg-teal-500 hover:bg-teal-600"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Email</p>
                      <a href="mailto:care@expathealthclinic.com" className="text-sm text-teal-600 hover:underline">
                        care@expathealthclinic.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Phone</p>
                      <a href="tel:+31852127955" className="text-sm text-teal-600 hover:underline">
                        +31 85 212 7955
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Locations</p>
                      <p className="text-sm text-muted-foreground">
                        Rotterdam
                        <br />
                        Eindhoven
                        <br />
                        The Hague
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We aim to respond to all enquiries within <strong className="text-gray-900">2 business days</strong>
                    .
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    For Emergencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    For urgent medical issues, contact your GP, the ANW/huisartsenpost (after hours), or call{" "}
                    <strong>112</strong> for emergencies.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
