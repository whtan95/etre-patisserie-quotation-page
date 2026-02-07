"use client"

import React from "react"

import type { CustomerData } from "@/lib/quote-types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User, Phone, Mail, MapPin, FileText, HelpCircle, Send, CheckCircle2 } from "lucide-react"

interface CustomerFormProps {
  customerData: CustomerData
  setCustomerData: React.Dispatch<React.SetStateAction<CustomerData>>
  onSubmit: () => void
  isSubmitted: boolean
}

export function CustomerForm({ customerData, setCustomerData, onSubmit, isSubmitted }: CustomerFormProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-accent bg-card shadow-md">
      <div className="border-b border-accent bg-accent px-4 py-2.5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-accent-foreground">
          <HelpCircle className="h-4 w-4" />
          Contact Information
        </h2>
      </div>

      <div className="p-4">
        <p className="mb-4 text-xs text-muted-foreground">
          Have questions or need more information? Fill in your details below and we will get back to you.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="company-name" className="text-xs font-semibold text-foreground">
              Company Name
            </Label>
            <Input
              id="company-name"
              type="text"
              value={customerData.companyName}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, companyName: e.target.value }))}
              placeholder="Your company name (optional)"
              className="h-8 border border-border bg-background text-xs transition-colors focus:border-accent"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <User className="h-3 w-3" />
              Name (PIC)
            </Label>
            <Input
              id="name"
              type="text"
              value={customerData.name}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="PIC full name"
              className="h-8 border border-border bg-background text-xs transition-colors focus:border-accent"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Phone className="h-3 w-3" />
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={customerData.phone}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Your phone number"
              className="h-8 border border-border bg-background text-xs transition-colors focus:border-accent"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Mail className="h-3 w-3" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={customerData.email}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Your email address"
              className="h-8 border border-border bg-background text-xs transition-colors focus:border-accent"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <MapPin className="h-3 w-3" />
              Address
            </Label>
            <Input
              id="address"
              type="text"
              value={customerData.address}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Event location address"
              className="h-8 border border-border bg-background text-xs transition-colors focus:border-accent"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="notes" className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <FileText className="h-3 w-3" />
              Request Notes
            </Label>
            <Textarea
              id="notes"
              value={customerData.notes}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Any special requests or additional information..."
              rows={3}
              className="border border-border bg-background text-xs transition-colors focus:border-accent"
            />
          </div>
        </div>

        {/* Request a Quote Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onSubmit}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-foreground px-6 py-3 text-sm font-bold text-background shadow-md transition-all hover:scale-105 hover:shadow-lg"
          >
            {isSubmitted ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            <span>{isSubmitted ? "Request Sent" : "Request a Quote"}</span>
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-muted-foreground">
          Submitting this form doesn't confirm a booking. We'll reply within 24–48 hours with a quote.
        </p>
      </div>
    </div>
  )
}
