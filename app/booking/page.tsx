"use client"

import React from "react"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Clock, 
  Upload, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Building,
  MapPin,
  Mail,
  Calendar,
  Hash,
  Truck,
  X,
  MessageSquare
} from "lucide-react"
import type { EventData, PricingData, CustomerData } from "@/app/page"

const TIME_SLOTS = [
  "8:30am - 10:00am",
  "10:00am - 11:30am",
  "11:30am - 1:00pm",
  "2:00pm - 3:30pm",
  "3:30pm - 5:00pm",
]

const SST_RATE = 0.08

interface BookingData {
  companyName: string
  billingAddress: string
  billingPostCode: string
  billingState: string
  deliveryAddress: string
  deliveryPostCode: string
  deliveryState: string
  email: string
  eventName: string
  projectId: string
  setupTimeSlot: string
  dismantleTimeSlot: string
  uploadedImage: string | null
  uploadedImageName: string
  specialRequest: string
  checkbox1: boolean
  checkbox2: boolean
  checkbox3: boolean
}

export default function BookingPage() {
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [pricingData, setPricingData] = useState<PricingData | null>(null)
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [bookingData, setBookingData] = useState<BookingData>({
    companyName: "",
    billingAddress: "",
    billingPostCode: "",
    billingState: "",
    deliveryAddress: "",
    deliveryPostCode: "",
    deliveryState: "",
    email: "",
    eventName: "",
    projectId: "",
    setupTimeSlot: "",
    dismantleTimeSlot: "",
    uploadedImage: null,
    uploadedImageName: "",
    specialRequest: "",
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  })

  // Generate random project ID
  const generateProjectId = () => {
    const prefix = "VE"
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}-${timestamp}-${random}`
  }

  // Load data from localStorage
  useEffect(() => {
    const savedEventData = localStorage.getItem("venus_eventData")
    const savedPricingData = localStorage.getItem("venus_pricingData")
    const savedCustomerData = localStorage.getItem("venus_customerData")
    const savedBookingData = localStorage.getItem("venus_bookingData")

    if (savedEventData) setEventData(JSON.parse(savedEventData))
    if (savedPricingData) setPricingData(JSON.parse(savedPricingData))
    if (savedCustomerData) setCustomerData(JSON.parse(savedCustomerData))
    
    if (savedBookingData) {
      setBookingData(JSON.parse(savedBookingData))
    } else {
      // Generate new project ID if no existing booking data
      setBookingData(prev => ({ ...prev, projectId: generateProjectId() }))
    }

    setIsLoading(false)
  }, [])

  // Save booking data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("venus_bookingData", JSON.stringify(bookingData))
    }
  }, [bookingData, isLoading])

  // Calculate pricing
  const calculatePricing = useMemo(() => {
    if (!eventData || !pricingData) return null

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

    const isSunday = (dateString: string): boolean => {
      if (!dateString) return false
      const date = new Date(dateString)
      return date.getDay() === 0
    }

    const sundayOTFee = (isSunday(eventData.setupDate) ? 300 : 0) + (isSunday(eventData.dismantleDate) ? 300 : 0)
    const durationExtensionFee = eventData.duration > 3 ? (eventData.duration - 3) * 300 : 0

    const items: { name: string; quantity: number | string; unitPrice: number; sst: number; total: number }[] = []

    // Tents
    if (pricingData.tent10x10.quantity > 0) {
      const base = pricingData.tent10x10.quantity * prices.tent10x10
      const sst = base * SST_RATE
      items.push({
        name: `Arabian Tent (10" x 10" ft) - ${pricingData.tent10x10.color}`,
        quantity: pricingData.tent10x10.quantity,
        unitPrice: prices.tent10x10,
        sst,
        total: base + sst,
      })
    }

    if (pricingData.tent20x20.quantity > 0) {
      const base = pricingData.tent20x20.quantity * prices.tent20x20
      const sst = base * SST_RATE
      items.push({
        name: `Arabian Tent (20" x 20" ft) - ${pricingData.tent20x20.color}`,
        quantity: pricingData.tent20x20.quantity,
        unitPrice: prices.tent20x20,
        sst,
        total: base + sst,
      })
    }

    if (pricingData.tent20x30.quantity > 0) {
      const base = pricingData.tent20x30.quantity * prices.tent20x30
      const sst = base * SST_RATE
      items.push({
        name: `Arabian Tent (20" x 30" ft) - ${pricingData.tent20x30.color}`,
        quantity: pricingData.tent20x30.quantity,
        unitPrice: prices.tent20x30,
        sst,
        total: base + sst,
      })
    }

    // Table Set
    if (pricingData.tableSet > 0) {
      const base = pricingData.tableSet * prices.tableSet
      const sst = base * SST_RATE
      items.push({
        name: "Table Set (10 plastic chairs + 4ft round table with red cloth)",
        quantity: pricingData.tableSet,
        unitPrice: prices.tableSet,
        sst,
        total: base + sst,
      })
    }

    // Long Table
    if (pricingData.longTable.quantity > 0) {
      const unitPrice = pricingData.longTable.withSkirting ? prices.longTableWithSkirting : prices.longTable
      const base = pricingData.longTable.quantity * unitPrice
      const sst = base * SST_RATE
      items.push({
        name: `Long Table (3ft x 6ft)${pricingData.longTable.withSkirting ? " with Skirting" : ""}`,
        quantity: pricingData.longTable.quantity,
        unitPrice,
        sst,
        total: base + sst,
      })
    }

    // Extra Chairs
    if (pricingData.extraChairs > 0) {
      const base = pricingData.extraChairs * prices.extraChairs
      const sst = base * SST_RATE
      items.push({
        name: "Extra Plastic Chair",
        quantity: pricingData.extraChairs,
        unitPrice: prices.extraChairs,
        sst,
        total: base + sst,
      })
    }

    // Cooler Fan
    if (pricingData.coolerFan > 0) {
      const base = pricingData.coolerFan * prices.coolerFan
      items.push({
        name: "Cooler Fan",
        quantity: pricingData.coolerFan,
        unitPrice: prices.coolerFan,
        sst: 0,
        total: base,
      })
    }

    // Public area fees
    if (eventData.areaType === "public") {
      // MBI Runner Fee
      items.push({
        name: "MBI Runner Fee",
        quantity: 1,
        unitPrice: prices.runnerFee,
        sst: 0,
        total: prices.runnerFee,
      })

      // MBI Permit
      if (eventData.duration > 0) {
        items.push({
          name: "MBI Permit Fee",
          quantity: `${eventData.duration} day(s)`,
          unitPrice: prices.mbiPermit,
          sst: 0,
          total: eventData.duration * prices.mbiPermit,
        })
      }

      // Parking
      if (pricingData.parkingLots > 0) {
        items.push({
          name: "MBI Parking Lots",
          quantity: pricingData.parkingLots,
          unitPrice: prices.mbiParking,
          sst: 0,
          total: pricingData.parkingLots * prices.mbiParking,
        })
      }
    }

    // Sunday OT Fee
    if (sundayOTFee > 0) {
      items.push({
        name: "Sunday OT Fee",
        quantity: sundayOTFee === 600 ? "2 days" : "1 day",
        unitPrice: 300,
        sst: 0,
        total: sundayOTFee,
      })
    }

    // Duration Extension Fee
    if (durationExtensionFee > 0) {
      items.push({
        name: "Duration Extension Fee",
        quantity: `${eventData.duration - 3} day(s)`,
        unitPrice: 300,
        sst: 0,
        total: durationExtensionFee,
      })
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const discount = subtotal * 0.05
    const totalAfterDiscount = subtotal - discount

    return { items, subtotal, discount, totalAfterDiscount }
  }, [eventData, pricingData])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBookingData(prev => ({
          ...prev,
          uploadedImage: reader.result as string,
          uploadedImageName: file.name
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const clearUploadedImage = () => {
    setBookingData(prev => ({
      ...prev,
      uploadedImage: null,
      uploadedImageName: ""
    }))
  }

  const canProceedToPayment = 
    bookingData.uploadedImage &&
    bookingData.checkbox1 &&
    bookingData.checkbox2 &&
    bookingData.checkbox3 &&
    bookingData.companyName &&
    bookingData.billingAddress &&
    bookingData.deliveryAddress &&
    bookingData.email &&
    bookingData.setupTimeSlot &&
    bookingData.dismantleTimeSlot

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!eventData || !pricingData || !calculatePricing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">No Booking Data Found</h1>
            <p className="text-muted-foreground mb-8">
              Please go back to the calculator and fill in your event details first.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-accent-foreground transition-all hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Calculator
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Calculator
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Booking Page</h1>
          <p className="mt-2 text-muted-foreground">Complete your booking to secure your 5% discount</p>
        </div>

        <div className="space-y-8">
          {/* Pro-forma Quotation Section */}
          <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
            <div className="border-b border-accent bg-accent px-6 py-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-accent-foreground">
                <FileText className="h-5 w-5" />
                Pro-Forma Quotation
              </h2>
            </div>

            <div className="p-6">
              {/* Event Summary */}
              <div className="mb-6 grid gap-4 rounded-xl bg-secondary/50 p-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Event Type</p>
                  <p className="font-semibold text-foreground">{eventData.eventType || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Estimated Guests</p>
                  <p className="font-semibold text-foreground">{eventData.estimatedGuests} pax</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Area Type</p>
                  <p className="font-semibold text-foreground">{eventData.areaType === "public" ? "Public Area" : "Private Area"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Location</p>
                  <p className="font-semibold text-foreground capitalize">{eventData.areaSelection.replace(/-/g, " ")}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="py-3 text-left text-sm font-bold text-foreground">Item</th>
                      <th className="py-3 text-center text-sm font-bold text-foreground">Qty</th>
                      <th className="py-3 text-right text-sm font-bold text-foreground">Unit Price</th>
                      <th className="py-3 text-right text-sm font-bold text-foreground">SST (8%)</th>
                      <th className="py-3 text-right text-sm font-bold text-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculatePricing.items.map((item, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 text-sm text-foreground">{item.name}</td>
                        <td className="py-3 text-center text-sm text-foreground">{item.quantity}</td>
                        <td className="py-3 text-right text-sm text-foreground">RM {item.unitPrice.toFixed(2)}</td>
                        <td className="py-3 text-right text-sm text-foreground">
                          {item.sst > 0 ? `RM ${item.sst.toFixed(2)}` : "-"}
                        </td>
                        <td className="py-3 text-right text-sm font-semibold text-foreground">RM {item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border">
                      <td colSpan={4} className="py-3 text-right text-sm font-bold text-foreground">Subtotal:</td>
                      <td className="py-3 text-right text-sm font-bold text-foreground">RM {calculatePricing.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td colSpan={4} className="py-3 text-right text-sm font-bold text-green-600">Less 5% Discount:</td>
                      <td className="py-3 text-right text-sm font-bold text-green-600">- RM {calculatePricing.discount.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-accent/20">
                      <td colSpan={4} className="py-4 text-right text-lg font-black text-foreground">TOTAL BILLABLE PRICE:</td>
                      <td className="py-4 text-right text-lg font-black text-accent">RM {calculatePricing.totalAfterDiscount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
            <div className="border-b border-accent bg-accent px-6 py-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-accent-foreground">
                <User className="h-5 w-5" />
                Additional Information
              </h2>
            </div>

            <div className="p-6 space-y-8">
              {/* Basic Info */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Building className="h-4 w-4" />
                    Customer (Company Name) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={bookingData.companyName}
                    onChange={(e) => setBookingData(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Your name or company name"
                    className="border-2 border-border bg-background transition-colors focus:border-accent"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Hash className="h-4 w-4" />
                    Project ID
                  </Label>
                  <Input
                    value={bookingData.projectId}
                    readOnly
                    className="border-2 border-border bg-secondary font-mono text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Mail className="h-4 w-4" />
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="border-2 border-border bg-background transition-colors focus:border-accent"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Calendar className="h-4 w-4" />
                    Event Name
                  </Label>
                  <Input
                    value={bookingData.eventName}
                    onChange={(e) => setBookingData(prev => ({ ...prev, eventName: e.target.value }))}
                    placeholder="e.g., Wedding Reception, Birthday Party"
                    className="border-2 border-border bg-background transition-colors focus:border-accent"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="rounded-xl border-2 border-border p-5">
                <h3 className="mb-4 font-bold text-foreground flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Billing Address
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-semibold text-foreground">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={bookingData.billingAddress}
                      onChange={(e) => setBookingData(prev => ({ ...prev, billingAddress: e.target.value }))}
                      placeholder="Full billing address"
                      className="border-2 border-border bg-background transition-colors focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Post Code</Label>
                    <Input
                      value={bookingData.billingPostCode}
                      onChange={(e) => setBookingData(prev => ({ ...prev, billingPostCode: e.target.value }))}
                      placeholder="e.g., 31400"
                      className="border-2 border-border bg-background transition-colors focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">State</Label>
                    <Input
                      value={bookingData.billingState}
                      onChange={(e) => setBookingData(prev => ({ ...prev, billingState: e.target.value }))}
                      placeholder="e.g., Perak"
                      className="border-2 border-border bg-background transition-colors focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="rounded-xl border-2 border-border p-5">
                <h3 className="mb-4 font-bold text-foreground flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Delivery Address (Event Location)
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-semibold text-foreground">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={bookingData.deliveryAddress}
                      onChange={(e) => setBookingData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                      placeholder="Full delivery/event location address"
                      className="border-2 border-border bg-background transition-colors focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Post Code</Label>
                    <Input
                      value={bookingData.deliveryPostCode}
                      onChange={(e) => setBookingData(prev => ({ ...prev, deliveryPostCode: e.target.value }))}
                      placeholder="e.g., 31400"
                      className="border-2 border-border bg-background transition-colors focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">State</Label>
                    <Input
                      value={bookingData.deliveryState}
                      onChange={(e) => setBookingData(prev => ({ ...prev, deliveryState: e.target.value }))}
                      placeholder="e.g., Perak"
                      className="border-2 border-border bg-background transition-colors focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
            <div className="border-b border-accent bg-accent px-6 py-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-accent-foreground">
                <Clock className="h-5 w-5" />
                Setup & Dismantle Time Slots
              </h2>
            </div>

            <div className="p-6">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Setup Time */}
                <div>
                  <h3 className="mb-4 font-bold text-foreground">
                    Setup Date: <span className="text-accent">{eventData.setupDate}</span> ({eventData.setupDayOfWeek})
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">Select your preferred setup time slot: <span className="text-red-500">*</span></p>
                  <div className="space-y-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={`setup-${slot}`}
                        onClick={() => setBookingData(prev => ({ ...prev, setupTimeSlot: slot }))}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-left transition-all ${
                          bookingData.setupTimeSlot === slot
                            ? "border-accent bg-accent/20 font-semibold text-foreground"
                            : "border-border bg-background text-foreground hover:border-accent/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                            bookingData.setupTimeSlot === slot ? "border-accent bg-accent" : "border-muted-foreground"
                          }`}>
                            {bookingData.setupTimeSlot === slot && (
                              <CheckCircle className="h-3 w-3 text-accent-foreground" />
                            )}
                          </div>
                          {slot}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dismantle Time */}
                <div>
                  <h3 className="mb-4 font-bold text-foreground">
                    Dismantle Date: <span className="text-accent">{eventData.dismantleDate}</span> ({eventData.dismantleDayOfWeek})
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">Select your preferred dismantle time slot: <span className="text-red-500">*</span></p>
                  <div className="space-y-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={`dismantle-${slot}`}
                        onClick={() => setBookingData(prev => ({ ...prev, dismantleTimeSlot: slot }))}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-left transition-all ${
                          bookingData.dismantleTimeSlot === slot
                            ? "border-accent bg-accent/20 font-semibold text-foreground"
                            : "border-border bg-background text-foreground hover:border-accent/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                            bookingData.dismantleTimeSlot === slot ? "border-accent bg-accent" : "border-muted-foreground"
                          }`}>
                            {bookingData.dismantleTimeSlot === slot && (
                              <CheckCircle className="h-3 w-3 text-accent-foreground" />
                            )}
                          </div>
                          {slot}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Request Section */}
          <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
            <div className="border-b border-accent bg-accent px-6 py-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-accent-foreground">
                <MessageSquare className="h-5 w-5" />
                Special Request
              </h2>
            </div>

            <div className="p-6">
              <Label className="text-sm font-semibold text-foreground mb-2 block">
                Any special requests or additional notes for your event?
              </Label>
              <Textarea
                value={bookingData.specialRequest}
                onChange={(e) => setBookingData(prev => ({ ...prev, specialRequest: e.target.value }))}
                placeholder="Enter any special requests, specific setup instructions, or additional information that would help us serve you better..."
                rows={5}
                className="border-2 border-border bg-background transition-colors focus:border-accent"
              />
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
            <div className="border-b border-accent bg-accent px-6 py-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-accent-foreground">
                <Upload className="h-5 w-5" />
                Photo Upload (Mandatory)
              </h2>
            </div>

            <div className="p-6">
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm font-semibold text-red-700">
                  <AlertCircle className="inline h-4 w-4 mr-2" />
                  Please attach a photo of the intended canopy setup location. The space must be sufficient to accommodate a minimum 3m x 3m area for lorry parking and setup purposes.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                {!bookingData.uploadedImage ? (
                  <label className="flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-accent/50 bg-accent/5 p-8 transition-colors hover:border-accent hover:bg-accent/10">
                    <Upload className="mb-4 h-12 w-12 text-accent" />
                    <span className="mb-2 text-lg font-semibold text-foreground">Click to upload photo</span>
                    <span className="text-sm text-muted-foreground">JPG, PNG up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="text-center">
                    <div className="mb-3 flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Photo uploaded successfully!</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{bookingData.uploadedImageName}</p>
                    <div className="relative inline-block">
                      <img
                        src={bookingData.uploadedImage || "/placeholder.svg"}
                        alt="Uploaded location"
                        className="max-h-48 rounded-lg border-2 border-border shadow-md"
                      />
                      <button
                        onClick={clearUploadedImage}
                        className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all hover:bg-red-600 hover:scale-110"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">Click the X button to remove and upload a different photo</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
            <div className="border-b border-accent bg-accent px-6 py-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-accent-foreground">
                <FileText className="h-5 w-5" />
                Terms & Conditions
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="checkbox1"
                  checked={bookingData.checkbox1}
                  onCheckedChange={(checked) => setBookingData(prev => ({ ...prev, checkbox1: checked as boolean }))}
                  className="mt-1"
                />
                <label htmlFor="checkbox1" className="text-sm text-foreground cursor-pointer">
                  I understand that the setup of the canopy requires sufficient space, and I confirm that I have allocated adequate space for the setup. In the event that the required space is not available and this affects the readiness time, your company shall not be held liable, provided there is proof that the space was not reserved.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="checkbox2"
                  checked={bookingData.checkbox2}
                  onCheckedChange={(checked) => setBookingData(prev => ({ ...prev, checkbox2: checked as boolean }))}
                  className="mt-1"
                />
                <label htmlFor="checkbox2" className="text-sm text-foreground cursor-pointer">
                  I understand that the preferred setup time and dismantling date selected are subject to availability and may not be final. In the event of any changes, your team will contact me to make the necessary adjustments.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="checkbox3"
                  checked={bookingData.checkbox3}
                  onCheckedChange={(checked) => setBookingData(prev => ({ ...prev, checkbox3: checked as boolean }))}
                  className="mt-1"
                />
                <label htmlFor="checkbox3" className="text-sm text-foreground cursor-pointer">
                  I understand that the requirement for a site visit is at your discretion. A site visit may or may not be conducted and is not mandatory.
                </label>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex flex-col items-center gap-4">
            {!canProceedToPayment && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Please complete all required fields, upload a photo, and accept all terms to proceed
              </p>
            )}
            
            <button
              disabled={!canProceedToPayment}
              className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-xl px-12 py-5 text-xl font-bold shadow-lg transition-all ${
                canProceedToPayment
                  ? "bg-primary text-primary-foreground hover:scale-105 hover:shadow-2xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <CreditCard className="h-6 w-6" />
              Proceed to Payment Gateway
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Total: <span className="font-bold text-accent text-lg">RM {calculatePricing.totalAfterDiscount.toFixed(2)}</span> (5% discount applied)
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-border bg-secondary py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-muted-foreground">
            2024 Venus Excellent Sdn Bhd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
