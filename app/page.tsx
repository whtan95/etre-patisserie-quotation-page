"use client"

import type { Dispatch, SetStateAction } from "react"
import { useEffect, useMemo, useState } from "react"

import { Header } from "@/components/header"
import { EventDetails } from "@/components/event-details"
import { BrandingAndMenu } from "@/components/branding-and-menu"
import { CustomerForm } from "@/components/customer-form"
import { HowItWorks } from "@/components/how-it-works"
import { AIAssistant } from "@/components/ai-assistant"
import type { EventData, BrandingData, MenuSelectionData, CustomerData, QuoteRequestData } from "@/lib/quote-types"

const STORAGE_KEY = "etre_quoteRequest_v2"

const emptyRequest: QuoteRequestData = {
  event: {
    eventName: "",
    eventDate: "",
    eventType: "",
    estimatedGuests: 0,
    takeOutSetupDate: "",
    takeOutDismantleDate: "",
    budgetPerPersonFromRm: "",
    budgetPerPersonToRm: "",
    eventLocation: "etre-cafe-kl",
    otherAreaName: "",
    otherVenueType: "",
  },
  branding: {
    includeBrandLogo: false,
    matchBrandColours: false,
    logoOnDessert: false,
    logoOnPackaging: false,
    logoOnOthers: false,
    logoOnOthersText: "",
    colourOnDessert: false,
    colourOnPackaging: false,
    colourOnOthers: false,
    colourOnOthersText: "",
  },
  menu: {
    customisationLevel: "",
    customisationNotes: "",
    referenceImageName: "",
    referenceImageDataUrl: "",
    categories: [],
    itemQuantities: {},
    dessertSize: "",
    drinks: [],
    drinksOtherText: "",
    packaging: "",
  },
  customer: {
    companyName: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  },
}

export default function QuoteRequestPage() {
  const [request, setRequest] = useState<QuoteRequestData>(emptyRequest)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const setEventData: Dispatch<SetStateAction<EventData>> = (updater) => {
    setRequest((prev) => ({ ...prev, event: typeof updater === "function" ? updater(prev.event) : updater }))
  }

  const setBranding: Dispatch<SetStateAction<BrandingData>> = (updater) => {
    setRequest((prev) => ({ ...prev, branding: typeof updater === "function" ? updater(prev.branding) : updater }))
  }

  const setMenu: Dispatch<SetStateAction<MenuSelectionData>> = (updater) => {
    setRequest((prev) => ({ ...prev, menu: typeof updater === "function" ? updater(prev.menu) : updater }))
  }

  const setCustomerData: Dispatch<SetStateAction<CustomerData>> = (updater) => {
    setRequest((prev) => ({ ...prev, customer: typeof updater === "function" ? updater(prev.customer) : updater }))
  }

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<QuoteRequestData>
        const brandingRaw = { ...emptyRequest.branding, ...(parsed.branding ?? {}) } as any
        // Backward-compat: older saves used `branding.requirement` ("none" | "brand-logo" | "brand-colour").
        if (typeof brandingRaw.requirement === "string") {
          if (brandingRaw.requirement === "brand-logo") {
            brandingRaw.includeBrandLogo = true
            brandingRaw.matchBrandColours = false
          } else if (brandingRaw.requirement === "brand-colour") {
            brandingRaw.includeBrandLogo = false
            brandingRaw.matchBrandColours = true
          } else {
            brandingRaw.includeBrandLogo = false
            brandingRaw.matchBrandColours = false
          }
          delete brandingRaw.requirement
        }
        setRequest({
          event: { ...emptyRequest.event, ...(parsed.event ?? {}) },
          branding: brandingRaw,
          menu: { ...emptyRequest.menu, ...(parsed.menu ?? {}) },
          customer: { ...emptyRequest.customer, ...(parsed.customer ?? {}) },
        })
      } catch {
        // ignore
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(request))
  }, [request, isLoaded])

  const footerYear = useMemo(() => new Date().getFullYear(), [])

  const submit = () => {
    setIsSubmitted(true)
    localStorage.setItem(`${STORAGE_KEY}_submittedAt`, new Date().toISOString())
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Custom Dessert Catering for your event
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            Share your event details and we will send you a personalised quote.
          </p>
        </div>

        <div className="space-y-8">
          <EventDetails eventData={request.event} setEventData={setEventData} />

          <BrandingAndMenu
            branding={request.branding}
            setBranding={setBranding}
            menu={request.menu}
            setMenu={setMenu}
          />

          <HowItWorks />

          <CustomerForm
            customerData={request.customer}
            setCustomerData={setCustomerData}
            onSubmit={submit}
            isSubmitted={isSubmitted}
          />
        </div>
      </main>

      <footer className="mt-16 border-t border-border bg-secondary py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-muted-foreground">{footerYear} Être Patisserie. All rights reserved.</p>
        </div>
      </footer>

      <AIAssistant />
    </div>
  )
}
