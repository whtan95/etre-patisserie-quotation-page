export type EventLocation = "etre-cafe-kl" | "etre-cafe-ipoh" | "others" | ""
export type VenueType = "indoor" | "outdoor" | ""

export type BrandingRequirementType = "none" | "brand-logo" | "brand-colour"

export type DessertCategory = "savoury" | "viennoiserie" | "tart" | "gateaux"
export type DessertSize = "normal" | "mini" | ""

export type DrinksOption = "coffee" | "tea" | "fizzy" | "others"

export type PackagingOption = "customer-own" | "etre-existing" | "premium" | ""

export type CustomisationLevel = "current" | "partial" | "full" | ""

export interface EventData {
  eventName: string
  eventDate: string
  eventType: string
  estimatedGuests: number

  takeOutSetupDate: string
  takeOutDismantleDate: string

  budgetPerPersonFromRm: string
  budgetPerPersonToRm: string

  eventLocation: EventLocation
  otherAreaName: string
  otherVenueType: VenueType
}

export interface BrandingData {
  requirement: BrandingRequirementType

  // For "brand-logo"
  logoOnDessert: boolean
  logoOnPackaging: boolean
  logoOnOthers: boolean
  logoOnOthersText: string

  // For "brand-colour"
  colourOnDessert: boolean
  colourOnPackaging: boolean
  colourOnOthers: boolean
  colourOnOthersText: string
}

export interface MenuSelectionData {
  customisationLevel: CustomisationLevel
  customisationNotes: string
  referenceImageName: string
  referenceImageDataUrl: string

  categories: DessertCategory[]
  itemQuantities: Record<string, number>
  dessertSize: DessertSize

  drinks: DrinksOption[]
  drinksOtherText: string

  packaging: PackagingOption
}

export interface CustomerData {
  companyName: string
  name: string
  phone: string
  email: string
  address: string
  notes: string
}

export interface QuoteRequestData {
  event: EventData
  branding: BrandingData
  menu: MenuSelectionData
  customer: CustomerData
}
