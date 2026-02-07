"use client"

import React from "react"

import type { EventData } from "@/app/page"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MapPin, Calendar, Users, Building2, Home, Info, AlertTriangle } from "lucide-react"

interface EventDetailsProps {
  eventData: EventData
  setEventData: React.Dispatch<React.SetStateAction<EventData>>
}

// Helper to check if a date is Sunday
const isSunday = (dateString: string): boolean => {
  if (!dateString) return false
  const date = new Date(dateString)
  return date.getDay() === 0
}

export function EventDetails({ eventData, setEventData }: EventDetailsProps) {
  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
        <div className="border-b border-accent bg-accent px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-accent-foreground">
            <Calendar className="h-5 w-5" />
            Event Details
          </h2>
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event-date" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Calendar className="h-4 w-4" />
                Event Date
              </Label>
              <Input
                id="event-date"
                type="date"
                value={eventData.eventDate}
                onChange={(e) => setEventData((prev) => ({ ...prev, eventDate: e.target.value }))}
                className="border-2 border-border bg-background transition-colors focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-type" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                Event Type
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-accent" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium text-destructive">We do not offer funeral services.</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Select
                value={eventData.eventType}
                onValueChange={(value) => setEventData((prev) => ({ ...prev, eventType: value }))}
              >
                <SelectTrigger className="border-2 border-border bg-background transition-colors focus:border-accent">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wedding">Wedding</SelectItem>
                  <SelectItem value="Party">Party</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Religious Ceremony">Religious Ceremony</SelectItem>
                  <SelectItem value="Festive">Festive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="setup-date" className="text-sm font-semibold text-foreground">
                Preferred Setup Date
              </Label>
              <Input
                id="setup-date"
                type="date"
                value={eventData.setupDate}
                onChange={(e) => setEventData((prev) => ({ ...prev, setupDate: e.target.value }))}
                className="border-2 border-border bg-background transition-colors focus:border-accent"
              />
              {isSunday(eventData.setupDate) && (
                <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  Additional OT fees charges (RM300) - see below
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dismantle-date" className="text-sm font-semibold text-foreground">
                Preferred Dismantle Date
              </Label>
              <Input
                id="dismantle-date"
                type="date"
                value={eventData.dismantleDate}
                onChange={(e) => setEventData((prev) => ({ ...prev, dismantleDate: e.target.value }))}
                className="border-2 border-border bg-background transition-colors focus:border-accent"
              />
              {isSunday(eventData.dismantleDate) && (
                <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  Additional OT fees charges (RM300) - see below
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Users className="h-4 w-4" />
                Estimated Guests Attending
              </Label>
              <Input
                id="guests"
                type="number"
                min="0"
                max="9999"
                value={eventData.estimatedGuests || ""}
                onChange={(e) =>
                  setEventData((prev) => ({
                    ...prev,
                    estimatedGuests: Math.min(9999, Math.max(0, parseInt(e.target.value) || 0)),
                  }))
                }
                placeholder="Enter number of guests"
                className="border-2 border-border bg-background transition-colors focus:border-accent"
              />
            </div>

            {/* Area Type Selection - Public or Private */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Building2 className="h-4 w-4" />
                Area Type
              </Label>
              <RadioGroup
                value={eventData.areaType}
                onValueChange={(value: "private" | "public") => setEventData((prev) => ({ ...prev, areaType: value }))}
                className="flex gap-4"
              >
                <div className="flex flex-1 items-center space-x-3 rounded-lg border-2 border-border p-4 transition-all hover:border-accent has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="flex cursor-pointer items-center gap-2 text-foreground">
                    <Home className="h-4 w-4" />
                    Private Area
                  </Label>
                </div>
                <div className="flex flex-1 items-center space-x-3 rounded-lg border-2 border-border p-4 transition-all hover:border-accent has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="flex cursor-pointer items-center gap-2 text-foreground">
                    <Building2 className="h-4 w-4" />
                    Public Area
                  </Label>
                </div>
              </RadioGroup>
              {eventData.areaType === "public" && (
                <p className="mt-2 rounded-lg bg-accent/10 p-3 text-sm font-medium text-foreground">
                  Public area requires MBI Permit (RM20/day), MBI Runner Fee (RM100), and parking fees
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MapPin className="h-4 w-4" />
                Location Area
              </Label>
              <RadioGroup
                value={eventData.areaSelection}
                onValueChange={(value) => setEventData((prev) => ({ ...prev, areaSelection: value }))}
                className="flex flex-wrap gap-3"
              >
                <div className="flex items-center space-x-2 rounded-lg border-2 border-border px-4 py-3 transition-all hover:border-accent has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                  <RadioGroupItem value="within-ipoh" id="within-ipoh" />
                  <Label htmlFor="within-ipoh" className="cursor-pointer text-foreground">
                    Within Ipoh Area
                  </Label>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 rounded-lg border-2 border-border px-4 py-3 transition-all hover:border-accent has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                    <RadioGroupItem value="within-perak" id="within-perak" />
                    <Label htmlFor="within-perak" className="cursor-pointer text-foreground">
                      Within Perak Area
                    </Label>
                  </div>
                  {eventData.areaSelection === "within-perak" && (
                    <p className="mt-1 pl-2 text-xs text-muted-foreground italic">
                      (Example: Teluk Intan, Manjung, Kampar, Batu Gajah)
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 rounded-lg border-2 border-border px-4 py-3 transition-all hover:border-accent has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                  <RadioGroupItem value="outside-perak" id="outside-perak" />
                  <Label htmlFor="outside-perak" className="cursor-pointer text-foreground">
                    Outside Perak Area
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
