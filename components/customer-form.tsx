"use client"

import React from "react"

import type { CustomerData } from "@/app/page"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User, Phone, Mail, MapPin, FileText, MessageCircle, HelpCircle } from "lucide-react"

interface CustomerFormProps {
  customerData: CustomerData
  setCustomerData: React.Dispatch<React.SetStateAction<CustomerData>>
  generateWhatsAppMessage: () => string
}

export function CustomerForm({ customerData, setCustomerData, generateWhatsAppMessage }: CustomerFormProps) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
      <div className="border-b border-accent bg-accent px-6 py-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-accent-foreground">
          <HelpCircle className="h-5 w-5" />
          Further Inquiry
        </h2>
      </div>

      <div className="p-6">
        <p className="mb-6 text-sm text-muted-foreground">
          Have questions or need more information? Fill in your details below and we will get back to you.
        </p>
        
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="h-4 w-4" />
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={customerData.name}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your full name"
              className="border-2 border-border bg-background transition-colors focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Phone className="h-4 w-4" />
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={customerData.phone}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Your phone number"
              className="border-2 border-border bg-background transition-colors focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={customerData.email}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Your email address"
              className="border-2 border-border bg-background transition-colors focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Input
              id="address"
              type="text"
              value={customerData.address}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Event location address"
              className="border-2 border-border bg-background transition-colors focus:border-accent"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="h-4 w-4" />
              Request Notes
            </Label>
            <Textarea
              id="notes"
              value={customerData.notes}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Any special requests or additional information..."
              rows={4}
              className="border-2 border-border bg-background transition-colors focus:border-accent"
            />
          </div>
        </div>

        {/* Get Official Quote Button - Inside Customer Details */}
        <div className="mt-8 flex justify-center">
          <a
            href={`https://wa.me/60123456789?text=${generateWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-10 py-5 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <MessageCircle className="h-6 w-6" />
            <span>GET OFFICIAL QUOTE</span>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#128C7E] to-[#25D366] opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Click to send your event details via WhatsApp for an official quotation
        </p>
      </div>
    </div>
  )
}
