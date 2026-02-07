"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { EventDetails } from "@/components/event-details"
import { PricingTable } from "@/components/pricing-table"
import { TotalAndCostSection } from "@/components/total-and-cost-section"
import { CustomerForm } from "@/components/customer-form"
import { CatalogueSection } from "@/components/catalogue-section"
import { BookNowPanel } from "@/components/book-now-panel"
import { AIAssistant } from "@/components/ai-assistant"
import { Truck } from "lucide-react"

export interface EventData {
  eventDate: string
  dayOfWeek: string
  eventType: string
  setupDate: string
  setupDayOfWeek: string
  dismantleDate: string
  dismantleDayOfWeek: string
  estimatedGuests: number
  areaType: "private" | "public"
  areaSelection: string
  duration: number
}

export interface PricingData {
  tent10x10: { quantity: number; color: string }
  tent20x20: { quantity: number; color: string }
  tent20x30: { quantity: number; color: string }
  tableSet: number
  longTable: { quantity: number; withSkirting: boolean }
  extraChairs: number
  coolerFan: number
  parkingLots: number
}

export interface CustomerData {
  name: string
  phone: string
  email: string
  address: string
  notes: string
}

const SST_RATE = 0.08

// Tent capacity info (persons)
export const TENT_CAPACITY = {
  "10x10": 20,
  "20x20": 50,
  "20x30": 70,
}

// Table set capacity
export const TABLE_SET_CAPACITY = 10 // 1 table set fits 10 pax

export default function EventCalculator() {
  const [eventData, setEventData] = useState<EventData>({
    eventDate: "",
    dayOfWeek: "",
    eventType: "",
    setupDate: "",
    setupDayOfWeek: "",
    dismantleDate: "",
    dismantleDayOfWeek: "",
    estimatedGuests: 0,
    areaType: "private",
    areaSelection: "within-ipoh",
    duration: 0,
  })

  const [pricingData, setPricingData] = useState<PricingData>({
    tent10x10: { quantity: 0, color: "White" },
    tent20x20: { quantity: 0, color: "White" },
    tent20x30: { quantity: 0, color: "White" },
    tableSet: 0,
    longTable: { quantity: 0, withSkirting: false },
    extraChairs: 0,
    coolerFan: 0,
    parkingLots: 0,
  })

  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  })

  const [isGenerated, setIsGenerated] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEventData = localStorage.getItem("venus_eventData")
    const savedPricingData = localStorage.getItem("venus_pricingData")
    const savedCustomerData = localStorage.getItem("venus_customerData")
    const savedIsGenerated = localStorage.getItem("venus_isGenerated")

    if (savedEventData) setEventData(JSON.parse(savedEventData))
    if (savedPricingData) setPricingData(JSON.parse(savedPricingData))
    if (savedCustomerData) setCustomerData(JSON.parse(savedCustomerData))
    if (savedIsGenerated) setIsGenerated(JSON.parse(savedIsGenerated))
    
    setIsLoaded(true)
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("venus_eventData", JSON.stringify(eventData))
    }
  }, [eventData, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("venus_pricingData", JSON.stringify(pricingData))
    }
  }, [pricingData, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("venus_customerData", JSON.stringify(customerData))
    }
  }, [customerData, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("venus_isGenerated", JSON.stringify(isGenerated))
    }
  }, [isGenerated, isLoaded])

  const calculateDuration = (setup: string, dismantle: string): number => {
    if (!setup || !dismantle) return 0
    const setupDate = new Date(setup)
    const dismantleDate = new Date(dismantle)
    const diffTime = dismantleDate.getTime() - setupDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays > 0 ? diffDays : 0
  }

  const getDayOfWeek = (dateString: string): string => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[date.getDay()]
  }

  const isSunday = (dateString: string): boolean => {
    if (!dateString) return false
    const date = new Date(dateString)
    return date.getDay() === 0
  }

  const handleGenerate = () => {
    const duration = calculateDuration(eventData.setupDate, eventData.dismantleDate)
    const dayOfWeek = getDayOfWeek(eventData.eventDate)
    const setupDayOfWeek = getDayOfWeek(eventData.setupDate)
    const dismantleDayOfWeek = getDayOfWeek(eventData.dismantleDate)
    setEventData((prev) => ({ ...prev, duration, dayOfWeek, setupDayOfWeek, dismantleDayOfWeek }))
    setIsGenerated(true)
  }

  // Calculate Sunday OT fees
  const sundayOTFee = useMemo(() => {
    let fee = 0
    if (isSunday(eventData.setupDate)) fee += 300
    if (isSunday(eventData.dismantleDate)) fee += 300
    return fee
  }, [eventData.setupDate, eventData.dismantleDate])

  // Calculate duration extension fee (beyond 3 days)
  const durationExtensionFee = useMemo(() => {
    if (eventData.duration <= 3) return 0
    return (eventData.duration - 3) * 300
  }, [eventData.duration])

  // Calculate recommended table sets based on guests
  const recommendedTableSets = useMemo(() => {
    if (eventData.estimatedGuests <= 0) return 0
    return Math.ceil(eventData.estimatedGuests / TABLE_SET_CAPACITY)
  }, [eventData.estimatedGuests])

  // Calculate current tent capacity
  const currentTentCapacity = useMemo(() => {
    return (
      pricingData.tent10x10.quantity * TENT_CAPACITY["10x10"] +
      pricingData.tent20x20.quantity * TENT_CAPACITY["20x20"] +
      pricingData.tent20x30.quantity * TENT_CAPACITY["20x30"]
    )
  }, [pricingData.tent10x10.quantity, pricingData.tent20x20.quantity, pricingData.tent20x30.quantity])

  // Calculate remaining capacity needed for tents
  const remainingTentCapacity = useMemo(() => {
    if (eventData.estimatedGuests <= 0) return 0
    return Math.max(0, eventData.estimatedGuests - currentTentCapacity)
  }, [eventData.estimatedGuests, currentTentCapacity])

  // Calculate current table set capacity
  const currentTableSetCapacity = useMemo(() => {
    return pricingData.tableSet * TABLE_SET_CAPACITY
  }, [pricingData.tableSet])

  // Calculate remaining capacity needed for table sets
  const remainingTableSetCapacity = useMemo(() => {
    if (eventData.estimatedGuests <= 0) return 0
    return Math.max(0, eventData.estimatedGuests - currentTableSetCapacity)
  }, [eventData.estimatedGuests, currentTableSetCapacity])

  const calculatePricing = () => {
    const prices = {
      tent10x10: 220,
      tent20x20: 250,
      tent20x30: 300,
      tableSet: 100,
      longTable: 15,
      longTableWithSkirting: 30,
      extraChairs: 5,
      coolerFan: 200,
      mbiPermit: 20,
      mbiParking: 10,
      runnerFee: 100,
    }

    const tent10x10Base = pricingData.tent10x10.quantity * prices.tent10x10
    const tent20x20Base = pricingData.tent20x20.quantity * prices.tent20x20
    const tent20x30Base = pricingData.tent20x30.quantity * prices.tent20x30
    const tableSetBase = pricingData.tableSet * prices.tableSet
    const longTablePrice = pricingData.longTable.withSkirting ? prices.longTableWithSkirting : prices.longTable
    const longTableBase = pricingData.longTable.quantity * longTablePrice
    const extraChairsBase = pricingData.extraChairs * prices.extraChairs
    const coolerFanBase = pricingData.coolerFan * prices.coolerFan

    const tent10x10SST = tent10x10Base * SST_RATE
    const tent20x20SST = tent20x20Base * SST_RATE
    const tent20x30SST = tent20x30Base * SST_RATE
    const tableSetSST = tableSetBase * SST_RATE
    const longTableSST = longTableBase * SST_RATE
    const extraChairsSST = extraChairsBase * SST_RATE

    // Public area fees - only if public area selected
    const isPublicArea = eventData.areaType === "public"
    const mbiPermitTotal = isPublicArea ? eventData.duration * prices.mbiPermit : 0
    const mbiParkingTotal = isPublicArea ? pricingData.parkingLots * prices.mbiParking : 0
    const runnerFeeTotal = isPublicArea ? prices.runnerFee : 0

    return {
      tent10x10: { base: tent10x10Base, sst: tent10x10SST, total: tent10x10Base + tent10x10SST },
      tent20x20: { base: tent20x20Base, sst: tent20x20SST, total: tent20x20Base + tent20x20SST },
      tent20x30: { base: tent20x30Base, sst: tent20x30SST, total: tent20x30Base + tent20x30SST },
      tableSet: { base: tableSetBase, sst: tableSetSST, total: tableSetBase + tableSetSST },
      longTable: { base: longTableBase, sst: longTableSST, total: longTableBase + longTableSST },
      extraChairs: { base: extraChairsBase, sst: extraChairsSST, total: extraChairsBase + extraChairsSST },
      coolerFan: { base: coolerFanBase, sst: 0, total: coolerFanBase },
      mbiPermit: { base: mbiPermitTotal, sst: 0, total: mbiPermitTotal },
      mbiParking: { base: mbiParkingTotal, sst: 0, total: mbiParkingTotal },
      runnerFee: { base: runnerFeeTotal, sst: 0, total: runnerFeeTotal },
      sundayOT: { base: sundayOTFee, sst: 0, total: sundayOTFee },
      durationExtension: { base: durationExtensionFee, sst: 0, total: durationExtensionFee },
      grandTotal:
        tent10x10Base +
        tent10x10SST +
        tent20x20Base +
        tent20x20SST +
        tent20x30Base +
        tent20x30SST +
        tableSetBase +
        tableSetSST +
        longTableBase +
        longTableSST +
        extraChairsBase +
        extraChairsSST +
        coolerFanBase +
        mbiPermitTotal +
        mbiParkingTotal +
        runnerFeeTotal +
        sundayOTFee +
        durationExtensionFee,
    }
  }

  const pricing = calculatePricing()
  const costPerGuest = eventData.estimatedGuests > 0 ? pricing.grandTotal / eventData.estimatedGuests : 0

  const generateWhatsAppMessage = () => {
    const message = `Hello Venus Excellent Sdn Bhd,

I would like to request an official quote for my event:

*EVENT DETAILS*
- Event Date: ${eventData.eventDate} (${eventData.dayOfWeek})
- Event Type: ${eventData.eventType}
- Setup Date: ${eventData.setupDate} (${eventData.setupDayOfWeek})${isSunday(eventData.setupDate) ? " [SUNDAY - OT charges apply]" : ""}
- Dismantle Date: ${eventData.dismantleDate} (${eventData.dismantleDayOfWeek})${isSunday(eventData.dismantleDate) ? " [SUNDAY - OT charges apply]" : ""}
- Duration: ${eventData.duration} days${eventData.duration > 3 ? ` [Extension fee applies for ${eventData.duration - 3} extra day(s)]` : ""}
- Estimated Guests: ${eventData.estimatedGuests}
- Area Type: ${eventData.areaType === "public" ? "Public Area" : "Private Area"}
- Location: ${eventData.areaSelection}

*ITEMS REQUESTED*
${pricingData.tent10x10.quantity > 0 ? `- Arabian Tent (10" x 10" ft) (${pricingData.tent10x10.color}): ${pricingData.tent10x10.quantity}` : ""}
${pricingData.tent20x20.quantity > 0 ? `- Arabian Tent (20" x 20" ft) (${pricingData.tent20x20.color}): ${pricingData.tent20x20.quantity}` : ""}
${pricingData.tent20x30.quantity > 0 ? `- Arabian Tent (20" x 30" ft) (${pricingData.tent20x30.color}): ${pricingData.tent20x30.quantity}` : ""}
${pricingData.tableSet > 0 ? `- Table Set (10 chairs + 4ft round table): ${pricingData.tableSet}` : ""}
${pricingData.longTable.quantity > 0 ? `- Long Table 3ft x 6ft ${pricingData.longTable.withSkirting ? "(with skirting)" : ""}: ${pricingData.longTable.quantity}` : ""}
${pricingData.extraChairs > 0 ? `- Extra Chairs: ${pricingData.extraChairs}` : ""}
${pricingData.coolerFan > 0 ? `- Cooler Fan: ${pricingData.coolerFan}` : ""}
${eventData.areaType === "public" ? `- MBI Runner Fee: RM100` : ""}
${eventData.areaType === "public" ? `- MBI Permit: Yes (${eventData.duration} days)` : ""}
${eventData.areaType === "public" && pricingData.parkingLots > 0 ? `- Parking Lots: ${pricingData.parkingLots}` : ""}
${sundayOTFee > 0 ? `- Sunday OT Fee: RM${sundayOTFee}` : ""}
${durationExtensionFee > 0 ? `- Duration Extension Fee: RM${durationExtensionFee}` : ""}

*ESTIMATED TOTAL: RM ${pricing.grandTotal.toFixed(2)}*

*CUSTOMER DETAILS*
- Name: ${customerData.name}
- Phone: ${customerData.phone}
- Email: ${customerData.email}
- Address: ${customerData.address}
${customerData.notes ? `- Notes: ${customerData.notes}` : ""}

Please provide me with an official quotation. Thank you!`

    return encodeURIComponent(message)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Simple Calculator for Private Events
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-muted-foreground">
            Calculate your event rental costs instantly. Get accurate estimates for tents, tables, and equipment.
          </p>
        </div>

        <div className="space-y-8">
          <EventDetails eventData={eventData} setEventData={setEventData} />

          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              className="group relative overflow-hidden rounded-xl bg-accent px-10 py-4 text-lg font-bold text-accent-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10">Generate Estimate</span>
            </button>
          </div>

          {isGenerated && eventData.dayOfWeek && (
            <div className="rounded-2xl border-2 border-accent bg-accent/10 p-6 shadow-sm">
              <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8 lg:gap-12">
                <div className="text-center">
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Event Day</p>
                  <p className="text-2xl font-bold text-foreground">{eventData.dayOfWeek}</p>
                </div>
                <div className="hidden h-12 w-px bg-border md:block" />
                <div className="text-center">
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Setup Date</p>
                  <p className="text-lg font-bold text-foreground">{eventData.setupDayOfWeek}</p>
                  {isSunday(eventData.setupDate) && (
                    <p className="text-xs font-semibold text-red-600">+RM300 OT charges applies</p>
                  )}
                </div>
                <div className="hidden h-12 w-px bg-border md:block" />
                <div className="text-center">
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Dismantle Date</p>
                  <p className="text-lg font-bold text-foreground">{eventData.dismantleDayOfWeek}</p>
                  {isSunday(eventData.dismantleDate) && (
                    <p className="text-xs font-semibold text-red-600">+RM300 OT charges applies</p>
                  )}
                </div>
                <div className="hidden h-12 w-px bg-border md:block" />
                <div className="text-center">
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Duration</p>
                  <p className="text-2xl font-bold text-foreground">{eventData.duration} day(s)</p>
                  {eventData.duration > 3 && (
                    <p className="text-xs font-semibold text-red-600">+RM{durationExtensionFee} extension fee</p>
                  )}
                </div>
                <div className="hidden h-12 w-px bg-border md:block" />
                <div className="text-center">
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Transportation</p>
                  <div className="flex items-center justify-center gap-2">
                    <Truck className="h-4 w-4 text-foreground" />
                    {eventData.areaSelection === "outside-perak" ? (
                      <p className="text-sm font-bold text-red-600">Contact us for Exact Price</p>
                    ) : (
                      <p className="text-sm font-bold text-green-600">Free of Charge</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <PricingTable
            pricingData={pricingData}
            setPricingData={setPricingData}
            pricing={pricing}
            duration={eventData.duration}
            isPublicArea={eventData.areaType === "public"}
            estimatedGuests={eventData.estimatedGuests}
            recommendedTableSets={recommendedTableSets}
            remainingTentCapacity={remainingTentCapacity}
            remainingTableSetCapacity={remainingTableSetCapacity}
            currentTentCapacity={currentTentCapacity}
            currentTableSetCapacity={currentTableSetCapacity}
            sundayOTFee={sundayOTFee}
            durationExtensionFee={durationExtensionFee}
            setupDate={eventData.setupDate}
            dismantleDate={eventData.dismantleDate}
          />

          <TotalAndCostSection
            total={pricing.grandTotal}
            costPerGuest={costPerGuest}
            guests={eventData.estimatedGuests}
          />

          {/* Book Now Panel - Before Customer Details */}
          <BookNowPanel />

          <CustomerForm
            customerData={customerData}
            setCustomerData={setCustomerData}
            generateWhatsAppMessage={generateWhatsAppMessage}
          />

          <CatalogueSection />
        </div>
      </main>

      <footer className="mt-16 border-t border-border bg-secondary py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-muted-foreground">
            2024 Venus Excellent Sdn Bhd. All rights reserved.
          </p>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}
