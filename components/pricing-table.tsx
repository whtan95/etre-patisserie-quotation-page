"use client"

import React from "react"

import type { PricingData } from "@/app/page"
import { TENT_CAPACITY, TABLE_SET_CAPACITY } from "@/app/page"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Info, Wind, FileText, Car, AlertCircle, Clock } from "lucide-react"
import { CanopyIcon, RoundTableWithChairsIcon, LongTableIcon, PlasticChairIcon } from "@/components/icons"

// Tent images
const TENT_IMAGES = {
  "10x10": "/images/tent-10x10.jpg",
  "20x20": "/images/tent-20x20.jpg",
  "20x30": "/images/tent-20x30.jpg",
}

// Tent light info
const TENT_LIGHTS = {
  "10x10": { fans: 1, lights: 2 },
  "20x20": { fans: 1, lights: 4 },
  "20x30": { fans: 1, lights: 4 },
}

interface PricingTableProps {
  pricingData: PricingData
  setPricingData: React.Dispatch<React.SetStateAction<PricingData>>
  pricing: {
    tent10x10: { base: number; sst: number; total: number }
    tent20x20: { base: number; sst: number; total: number }
    tent20x30: { base: number; sst: number; total: number }
    tableSet: { base: number; sst: number; total: number }
    longTable: { base: number; sst: number; total: number }
    extraChairs: { base: number; sst: number; total: number }
    coolerFan: { base: number; sst: number; total: number }
    mbiPermit: { base: number; sst: number; total: number }
    mbiParking: { base: number; sst: number; total: number }
    runnerFee: { base: number; sst: number; total: number }
    sundayOT: { base: number; sst: number; total: number }
    durationExtension: { base: number; sst: number; total: number }
  }
  duration: number
  isPublicArea: boolean
  estimatedGuests: number
  recommendedTableSets: number
  remainingTentCapacity: number
  remainingTableSetCapacity: number
  currentTentCapacity: number
  currentTableSetCapacity: number
  sundayOTFee: number
  durationExtensionFee: number
  setupDate: string
  dismantleDate: string
}

const tentColors = ["White", "Red", "Yellow"]

function TentInfoDialog({ size, imageUrl }: { size: string; imageUrl: string }) {
  const sizeKey = size.replace(/[" ft]/g, "") as keyof typeof TENT_LIGHTS
  const lights = TENT_LIGHTS[sizeKey] || { fans: 1, lights: 1 }
  const capacity = TENT_CAPACITY[sizeKey as keyof typeof TENT_CAPACITY]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="inline-flex items-center justify-center">
          <Info className="h-4 w-4 text-accent hover:text-accent/80 transition-colors" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Arabian Tent ({size} ft)</h3>
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={`Arabian Tent ${size} layout`}
            className="w-full rounded-lg border border-border"
          />
          <div className="space-y-2 text-sm">
            <p className="font-medium">Includes:</p>
            <ul className="list-inside list-disc text-muted-foreground">
              <li>{lights.fans} ceiling fan</li>
              <li>{lights.lights} fluorescent light{lights.lights > 1 ? "s" : ""}</li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              Capacity: {capacity} persons
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TableSetInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="inline-flex items-center justify-center">
          <Info className="h-4 w-4 text-accent hover:text-accent/80 transition-colors" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Table Set</h3>
          <div className="flex justify-center p-6 bg-secondary rounded-lg">
            <RoundTableWithChairsIcon className="h-32 w-32 text-foreground" />
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Includes:</p>
            <ul className="list-inside list-disc text-muted-foreground">
              <li>10 plastic chairs</li>
              <li>1 x 4ft round table</li>
              <li>Red cloth provided</li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              Fits {TABLE_SET_CAPACITY} persons per set
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PricingTable({
  pricingData,
  setPricingData,
  pricing,
  duration,
  isPublicArea,
  estimatedGuests,
  recommendedTableSets,
  remainingTentCapacity,
  remainingTableSetCapacity,
  currentTentCapacity,
  currentTableSetCapacity,
  sundayOTFee,
  durationExtensionFee,
  setupDate,
  dismantleDate,
}: PricingTableProps) {
  const remainingTableSets = Math.ceil(remainingTableSetCapacity / TABLE_SET_CAPACITY)

  // Helper to check if a date is Sunday
  const isSunday = (dateString: string): boolean => {
    if (!dateString) return false
    const date = new Date(dateString)
    return date.getDay() === 0
  }

  return (
    <div className="space-y-6">
      {/* BASICS Section */}
      <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
        <div className="border-b border-accent bg-accent px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-accent-foreground">
            <CanopyIcon className="h-6 w-6" />
            BASICS
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary">
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-foreground">Element</th>
                <th className="p-4 text-center text-sm font-bold uppercase tracking-wider text-foreground">Quantity</th>
                <th className="p-4 text-right text-sm font-bold uppercase tracking-wider text-foreground">Unit Price</th>
                <th className="p-4 text-right text-sm font-bold uppercase tracking-wider text-foreground">SST (8%)</th>
                <th className="p-4 text-right text-sm font-bold uppercase tracking-wider text-foreground">Sub-Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Arabian Tent 10x10 */}
              <tr className="transition-colors hover:bg-secondary/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                      <CanopyIcon className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">Arabian Tent (10" x 10" ft)</span>
                        <TentInfoDialog size="10x10" imageUrl={TENT_IMAGES["10x10"]} />
                      </div>
                      <Select
                        value={pricingData.tent10x10.color}
                        onValueChange={(value) =>
                          setPricingData((prev) => ({
                            ...prev,
                            tent10x10: { ...prev.tent10x10, color: value },
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2 h-8 w-28 border border-border text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tentColors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {estimatedGuests > 0 && remainingTentCapacity > 0 && (
                    <div className="mt-2 rounded-lg bg-accent/10 px-3 py-2 text-xs">
                      <div className="flex items-center gap-1 text-foreground">
                        <AlertCircle className="h-3 w-3" />
                        <span>Remaining: {remainingTentCapacity} pax needed</span>
                      </div>
                    </div>
                  )}
                </td>
                <td className="p-4 text-center">
                  <Input
                    type="number"
                    min="0"
                    value={pricingData.tent10x10.quantity || ""}
                    onChange={(e) =>
                      setPricingData((prev) => ({
                        ...prev,
                        tent10x10: { ...prev.tent10x10, quantity: parseInt(e.target.value) || 0 },
                      }))
                    }
                    className="mx-auto w-20 border-border text-center font-medium"
                  />
                </td>
                <td className="p-4 text-right font-medium text-foreground">RM 220</td>
                <td className="p-4 text-right text-muted-foreground">
                  RM {pricing.tent10x10.sst.toFixed(2)}
                </td>
                <td className="p-4 text-right text-lg font-bold text-foreground">
                  RM {pricing.tent10x10.total.toFixed(2)}
                </td>
              </tr>

              {/* Arabian Tent 20x20 */}
              <tr className="transition-colors hover:bg-secondary/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                      <CanopyIcon className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">Arabian Tent (20" x 20" ft)</span>
                        <TentInfoDialog size="20x20" imageUrl={TENT_IMAGES["20x20"]} />
                      </div>
                      <Select
                        value={pricingData.tent20x20.color}
                        onValueChange={(value) =>
                          setPricingData((prev) => ({
                            ...prev,
                            tent20x20: { ...prev.tent20x20, color: value },
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2 h-8 w-28 border border-border text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tentColors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <Input
                    type="number"
                    min="0"
                    value={pricingData.tent20x20.quantity || ""}
                    onChange={(e) =>
                      setPricingData((prev) => ({
                        ...prev,
                        tent20x20: { ...prev.tent20x20, quantity: parseInt(e.target.value) || 0 },
                      }))
                    }
                    className="mx-auto w-20 border-border text-center font-medium"
                  />
                </td>
                <td className="p-4 text-right font-medium text-foreground">RM 250</td>
                <td className="p-4 text-right text-muted-foreground">
                  RM {pricing.tent20x20.sst.toFixed(2)}
                </td>
                <td className="p-4 text-right text-lg font-bold text-foreground">
                  RM {pricing.tent20x20.total.toFixed(2)}
                </td>
              </tr>

              {/* Arabian Tent 20x30 */}
              <tr className="transition-colors hover:bg-secondary/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                      <CanopyIcon className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">Arabian Tent (20" x 30" ft)</span>
                        <TentInfoDialog size="20x30" imageUrl={TENT_IMAGES["20x30"]} />
                      </div>
                      <Select
                        value={pricingData.tent20x30.color}
                        onValueChange={(value) =>
                          setPricingData((prev) => ({
                            ...prev,
                            tent20x30: { ...prev.tent20x30, color: value },
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2 h-8 w-28 border border-border text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tentColors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <Input
                    type="number"
                    min="0"
                    value={pricingData.tent20x30.quantity || ""}
                    onChange={(e) =>
                      setPricingData((prev) => ({
                        ...prev,
                        tent20x30: { ...prev.tent20x30, quantity: parseInt(e.target.value) || 0 },
                      }))
                    }
                    className="mx-auto w-20 border-border text-center font-medium"
                  />
                </td>
                <td className="p-4 text-right font-medium text-foreground">RM 300</td>
                <td className="p-4 text-right text-muted-foreground">
                  RM {pricing.tent20x30.sst.toFixed(2)}
                </td>
                <td className="p-4 text-right text-lg font-bold text-foreground">
                  RM {pricing.tent20x30.total.toFixed(2)}
                </td>
              </tr>

              {/* Tent capacity summary */}
              {estimatedGuests > 0 && (
                <tr className="bg-accent/5">
                  <td colSpan={5} className="p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-foreground">
                          Tent Capacity: {currentTentCapacity}/{estimatedGuests} pax
                        </span>
                        {remainingTentCapacity > 0 ? (
                          <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                            Need {remainingTentCapacity} more pax
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Sufficient
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {/* Table Set */}
              <tr className="transition-colors hover:bg-secondary/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                      <RoundTableWithChairsIcon className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">Table Set</span>
                        <TableSetInfoDialog />
                      </div>
                    </div>
                  </div>
                  {estimatedGuests > 0 && (
                    <div className="mt-2 rounded-lg bg-accent/10 px-3 py-2 text-xs">
                      <div className="text-foreground">
                        <span className="font-medium">Suggested: {recommendedTableSets} set(s)</span>
                        <span className="text-muted-foreground"> for {estimatedGuests} guests (1 set = 10 pax)</span>
                      </div>
                      {remainingTableSets > 0 && pricingData.tableSet < recommendedTableSets && (
                        <div className="mt-1 flex items-center gap-1 text-foreground">
                          <AlertCircle className="h-3 w-3" />
                          <span>Remaining: {remainingTableSets} set(s) ({remainingTableSetCapacity} pax)</span>
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="p-4 text-center">
                  <Input
                    type="number"
                    min="0"
                    value={pricingData.tableSet || ""}
                    onChange={(e) =>
                      setPricingData((prev) => ({
                        ...prev,
                        tableSet: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="mx-auto w-20 border-border text-center font-medium"
                  />
                </td>
                <td className="p-4 text-right font-medium text-foreground">RM 100</td>
                <td className="p-4 text-right text-muted-foreground">
                  RM {pricing.tableSet.sst.toFixed(2)}
                </td>
                <td className="p-4 text-right text-lg font-bold text-foreground">
                  RM {pricing.tableSet.total.toFixed(2)}
                </td>
              </tr>

              {/* Table set capacity summary */}
              {estimatedGuests > 0 && (
                <tr className="bg-accent/5">
                  <td colSpan={5} className="p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-foreground">
                          Table Set Capacity: {currentTableSetCapacity}/{estimatedGuests} pax
                        </span>
                        {remainingTableSetCapacity > 0 ? (
                          <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                            Need {remainingTableSets} more set(s)
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Sufficient
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD-ONS Section */}
      <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
        <div className="border-b border-accent bg-accent px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-accent-foreground">
            <Wind className="h-6 w-6" />
            ADD-ONS
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary">
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-foreground">Element</th>
                <th className="p-4 text-center text-sm font-bold uppercase tracking-wider text-foreground">Quantity</th>
                <th className="p-4 text-right text-sm font-bold uppercase tracking-wider text-foreground">Unit Price</th>
                <th className="p-4 text-right text-sm font-bold uppercase tracking-wider text-foreground">SST (8%)</th>
                <th className="p-4 text-right text-sm font-bold uppercase tracking-wider text-foreground">Sub-Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* Long Table */}
              <tr className="transition-colors hover:bg-secondary/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                      <LongTableIcon className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <span className="font-bold text-foreground">Long Table (3ft x 6ft)</span>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            id="skirting"
                            checked={pricingData.longTable.withSkirting}
                            onCheckedChange={(checked) =>
                              setPricingData((prev) => ({
                                ...prev,
                                longTable: { ...prev.longTable, withSkirting: checked },
                              }))
                            }
                          />
                          <Label htmlFor="skirting" className="cursor-pointer text-sm text-foreground">
                            Add Skirting (+RM15)
                          </Label>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {pricingData.longTable.withSkirting ? "RM30/table with skirting" : "RM15/table without skirting"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <Input
                    type="number"
                    min="0"
                    value={pricingData.longTable.quantity || ""}
                    onChange={(e) =>
                      setPricingData((prev) => ({
                        ...prev,
                        longTable: { ...prev.longTable, quantity: parseInt(e.target.value) || 0 },
                      }))
                    }
                    className="mx-auto w-20 border-border text-center font-medium"
                  />
                </td>
                <td className="p-4 text-right font-medium text-foreground">
                  RM {pricingData.longTable.withSkirting ? "30" : "15"}
                </td>
                <td className="p-4 text-right text-muted-foreground">
                  RM {pricing.longTable.sst.toFixed(2)}
                </td>
                <td className="p-4 text-right text-lg font-bold text-foreground">
                  RM {pricing.longTable.total.toFixed(2)}
                </td>
              </tr>

              {/* Extra Chairs */}
              <tr className="transition-colors hover:bg-secondary/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                      <PlasticChairIcon className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <span className="font-bold text-foreground">Extra Chairs</span>
                      <p className="mt-1 text-xs text-muted-foreground">Plastic chairs (add-on)</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <Input
                    type="number"
                    min="0"
                    value={pricingData.extraChairs || ""}
                    onChange={(e) =>
                      setPricingData((prev) => ({
                        ...prev,
                        extraChairs: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="mx-auto w-20 border-border text-center font-medium"
                  />
                </td>
                <td className="p-4 text-right font-medium text-foreground">RM 5</td>
                <td className="p-4 text-right text-muted-foreground">
                  RM {pricing.extraChairs.sst.toFixed(2)}
                </td>
                <td className="p-4 text-right text-lg font-bold text-foreground">
                  RM {pricing.extraChairs.total.toFixed(2)}
                </td>
              </tr>

              {/* Cooler Fan */}
              <tr className="transition-colors hover:bg-secondary/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                      <Wind className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <span className="font-bold text-foreground">Cooler Fan</span>
                      <p className="mt-1 text-xs text-muted-foreground">Industrial cooler fan</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <Input
                    type="number"
                    min="0"
                    value={pricingData.coolerFan || ""}
                    onChange={(e) =>
                      setPricingData((prev) => ({
                        ...prev,
                        coolerFan: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="mx-auto w-20 border-border text-center font-medium"
                  />
                </td>
                <td className="p-4 text-right font-medium text-foreground">RM 200</td>
                <td className="p-4 text-right text-xs text-muted-foreground">
                  No SST
                </td>
                <td className="p-4 text-right text-lg font-bold text-foreground">
                  RM {pricing.coolerFan.total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ADDITIONAL CHARGES Section */}
      <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
        <div className="border-b border-accent bg-accent px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-accent-foreground">
            <FileText className="h-6 w-6" />
            ADDITIONAL CHARGES
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary">
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider text-foreground">Element</th>
                <th className="p-4 text-center text-sm font-bold uppercase tracking-wider text-foreground">Quantity</th>
                <th className="p-4 text-right text-sm font-bold uppercase tracking-wider text-foreground">Unit Price</th>
                <th className="p-4 text-right text-sm font-bold uppercase tracking-wider text-foreground">SST (8%)</th>
                <th className="p-4 text-right text-sm font-bold uppercase tracking-wider text-foreground">Sub-Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* MBI Runner Fee - Only for public area */}
              {isPublicArea && (
                <tr className="bg-accent/5 transition-colors hover:bg-accent/10">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/30">
                        <FileText className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground">MBI Runner Fee</span>
                        <p className="mt-1 text-xs text-muted-foreground">Mandatory for public area</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-medium text-foreground">1</span>
                  </td>
                  <td className="p-4 text-right font-medium text-foreground">RM 100</td>
                  <td className="p-4 text-right text-xs text-muted-foreground">
                    No SST
                  </td>
                  <td className="p-4 text-right text-lg font-bold text-foreground">
                    RM {pricing.runnerFee.total.toFixed(2)}
                  </td>
                </tr>
              )}

              {/* MBI Permit - Only for public area */}
              {isPublicArea && (
                <tr className="bg-accent/5 transition-colors hover:bg-accent/10">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/30">
                        <FileText className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground">MBI Permit Fee</span>
                        <p className="mt-1 text-xs text-muted-foreground">RM20/day x {duration} day(s)</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-medium text-foreground">{duration}</span>
                  </td>
                  <td className="p-4 text-right font-medium text-foreground">RM 20/day</td>
                  <td className="p-4 text-right text-xs text-muted-foreground">
                    No SST
                  </td>
                  <td className="p-4 text-right text-lg font-bold text-foreground">
                    RM {pricing.mbiPermit.total.toFixed(2)}
                  </td>
                </tr>
              )}

              {/* MBI Parking - Only for public area */}
              {isPublicArea && (
                <tr className="bg-accent/5 transition-colors hover:bg-accent/10">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/30">
                        <Car className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground">MBI Parking Lots</span>
                        <p className="mt-1 text-xs text-muted-foreground">RM10 per lot</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <Input
                      type="number"
                      min="0"
                      value={pricingData.parkingLots || ""}
                      onChange={(e) =>
                        setPricingData((prev) => ({
                          ...prev,
                          parkingLots: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="mx-auto w-20 border-border text-center font-medium"
                    />
                  </td>
                  <td className="p-4 text-right font-medium text-foreground">RM 10</td>
                  <td className="p-4 text-right text-xs text-muted-foreground">
                    No SST
                  </td>
                  <td className="p-4 text-right text-lg font-bold text-foreground">
                    RM {pricing.mbiParking.total.toFixed(2)}
                  </td>
                </tr>
              )}

              {/* Sunday OT Fee */}
              {sundayOTFee > 0 && (
                <tr className="bg-red-50 transition-colors hover:bg-red-100">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-200">
                        <Clock className="h-6 w-6 text-red-700" />
                      </div>
                      <div>
                        <span className="font-bold text-red-700">Sunday OT Fee</span>
                        <p className="mt-1 text-xs text-red-600">
                          {isSunday(setupDate) && isSunday(dismantleDate)
                            ? "Setup + Dismantle on Sunday"
                            : isSunday(setupDate)
                              ? "Setup on Sunday"
                              : "Dismantle on Sunday"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-medium text-red-700">
                      {(isSunday(setupDate) ? 1 : 0) + (isSunday(dismantleDate) ? 1 : 0)}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium text-red-700">RM 300/day</td>
                  <td className="p-4 text-right text-xs text-red-500">
                    No SST
                  </td>
                  <td className="p-4 text-right text-lg font-bold text-red-700">
                    RM {sundayOTFee.toFixed(2)}
                  </td>
                </tr>
              )}

              {/* Duration Extension Fee */}
              {durationExtensionFee > 0 && (
                <tr className="bg-orange-50 transition-colors hover:bg-orange-100">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-200">
                        <Clock className="h-6 w-6 text-orange-700" />
                      </div>
                      <div>
                        <span className="font-bold text-orange-700">Duration Extension Fee</span>
                        <p className="mt-1 text-xs text-orange-600">
                          {duration - 3} extra day(s) beyond 3 days
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-medium text-orange-700">{duration - 3}</span>
                  </td>
                  <td className="p-4 text-right font-medium text-orange-700">RM 300/day</td>
                  <td className="p-4 text-right text-xs text-orange-500">
                    No SST
                  </td>
                  <td className="p-4 text-right text-lg font-bold text-orange-700">
                    RM {durationExtensionFee.toFixed(2)}
                  </td>
                </tr>
              )}

              {/* No additional charges message */}
              {!isPublicArea && sundayOTFee === 0 && durationExtensionFee === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">
                    No additional charges apply for your current selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
