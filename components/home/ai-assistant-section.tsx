import { Bot, Clock, Languages, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AiAssistantButton } from "@/components/ai-assistant-button"
import { siteConfig } from "@/lib/site-config"

const features = [
  {
    icon: Clock,
    title: "Available around the clock",
    text: "Get answers about our services, locations, fees and how booking works, whenever it suits you.",
  },
  {
    icon: Languages,
    title: "Multilingual",
    text: "Ask in your preferred language and get clear, understandable answers about how we work.",
  },
  {
    icon: Info,
    title: "Practical guidance",
    text: "Learn how the Dutch healthcare system fits together and what to expect from a private consultation.",
  },
]

export function AiAssistantSection() {
  return (
    <section className="py-20 px-4 bg-teal-50/60" aria-labelledby="assistant-heading">
      <div className="container mx-auto max-w-6xl flex flex-col gap-12">
        <div className="text-center flex flex-col gap-4">
          <h2 id="assistant-heading" className="text-3xl md:text-4xl font-bold text-gray-900 text-balance">
            Questions about our clinic? Ask the {siteConfig.aiAssistant.name}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-pretty">
            Our automated website assistant answers general questions about services, locations, fees and booking. For
            anything about your own health, please book a consultation with one of our doctors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="border-none shadow-lg bg-white">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-teal-700" aria-hidden="true" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center">
              <Bot className="w-9 h-9 text-white" aria-hidden="true" />
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900">Start a conversation</h3>
              <p className="text-sm text-gray-600">Free to use • No appointment needed</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AiAssistantButton size="lg" label={`Open the ${siteConfig.aiAssistant.name}`} className="px-8" />
            <Button asChild size="lg" className="px-8 bg-teal-600 hover:bg-teal-700 text-white">
              <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">
                Book an appointment with a doctor
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            The {siteConfig.aiAssistant.name} is an automated tool provided by ElevenLabs and is loaded only with your
            cookie consent. It is not a doctor and does not give medical advice or diagnoses. Please do not share
            detailed medical information with it. In an emergency call 112.
          </p>
        </div>
      </div>
    </section>
  )
}
