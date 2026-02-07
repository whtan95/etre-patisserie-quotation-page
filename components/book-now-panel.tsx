"use client"

import { Shield, Lock, CreditCard, CheckCircle } from "lucide-react"
import Link from "next/link"

export function BookNowPanel() {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-primary bg-card shadow-2xl">
      {/* Secure Header Bar */}
      <div className="bg-primary px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary-foreground">
          <Lock className="h-4 w-4" />
          <span className="text-sm font-semibold">Secure Booking</span>
        </div>
        <div className="flex items-center gap-4 text-primary-foreground/80 text-xs">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            SSL Protected
          </span>
        </div>
      </div>

      <div className="p-8">
        {/* Main Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Book Now & Save
          </h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-lg font-bold text-green-700">Get 5% Discount</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Complete your booking online and receive an exclusive 5% discount on your total order.
          </p>
        </div>

        {/* Benefits List */}
        <div className="grid gap-3 mb-8 max-w-md mx-auto">
          <div className="flex items-center gap-3 text-sm text-foreground">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Instant confirmation and project ID</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Priority scheduling for your event</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Secure payment via trusted gateway</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/booking"
            className="inline-flex items-center gap-3 rounded-lg bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
          >
            <CreditCard className="h-5 w-5" />
            Proceed to Secure Booking
          </Link>
          <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Lock className="h-3 w-3" />
            Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  )
}
