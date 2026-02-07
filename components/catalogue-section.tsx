"use client"

import { Book, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Catalogue items with estimated prices
const catalogueItems = [
  {
    id: 1,
    name: "Stage",
    price: "RM450",
    description: "Professional event stages in various sizes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
        <rect x="2" y="14" width="20" height="4" rx="1" />
        <rect x="4" y="10" width="16" height="4" rx="1" />
        <line x1="6" y1="18" x2="6" y2="22" />
        <line x1="18" y1="18" x2="18" y2="22" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Carpet",
    price: "RM300",
    description: "Red carpet and premium floor coverings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
        <path d="M2 6h20v12H2z" />
        <path d="M4 6v12M20 6v12" />
        <path d="M2 10h20M2 14h20" />
        <path d="M4 18l-2 4M20 18l2 4M4 6l-2-4M20 6l2-4" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Chandelier",
    price: "RM250",
    description: "Elegant chandeliers for stunning ambiance",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="9" />
        <path d="M12 15l-4 6M12 15l4 6M12 15l0 6" />
        <path d="M6 9l6 3M18 9l-6 3" />
        <circle cx="6" cy="9" r="1.5" />
        <circle cx="18" cy="9" r="1.5" />
      </svg>
    ),
  },
  {
    id: 4,
    name: "Banquet Chair with Ribbon",
    price: "RM15",
    description: "Decorated banquet chairs for special occasions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
        <path d="M7 4c0-1 1-2 2-2h6c1 0 2 1 2 2v6H7V4z" />
        <rect x="6" y="10" width="12" height="3" rx="0.5" />
        <line x1="7" y1="13" x2="6" y2="22" />
        <line x1="17" y1="13" x2="18" y2="22" />
        <path d="M10 6c2 2 4 2 4 0" strokeWidth="1" />
        <path d="M8 16c1.5 1.5 6.5 1.5 8 0" />
      </svg>
    ),
  },
]

export function CatalogueSection() {
  const handleSiteVisitRequest = () => {
    const message = encodeURIComponent(
      `Hello Venus Excellent Sdn Bhd,

I would like to request a site visit to view your catalogue items and discuss my event requirements.

Please contact me to arrange a suitable time.

Thank you!`
    )
    window.open(`https://wa.me/60123456789?text=${message}`, "_blank")
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
      <div className="border-b border-accent bg-accent px-6 py-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-accent-foreground">
          <Book className="h-5 w-5" />
          View Our Catalogue
        </h2>
      </div>

      <div className="p-6">
        <p className="mb-6 text-center text-muted-foreground">
          Explore our premium event equipment and decorations
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {catalogueItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="group relative aspect-square overflow-hidden rounded-xl border-2 border-border bg-secondary/30 transition-all hover:border-accent hover:shadow-lg"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-foreground transition-transform group-hover:scale-110">
                      {item.icon}
                    </div>
                    <h3 className="text-center text-sm font-bold text-foreground italic">{item.name}</h3>
                    <p className="mt-1 text-center text-sm font-bold text-accent italic">{item.price}</p>
                  </div>
                  <div className="absolute inset-0 bg-accent/0 transition-colors group-hover:bg-accent/10" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-foreground italic">
                    <Book className="h-5 w-5 text-accent" />
                    {item.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-secondary">
                  <div className="flex h-full flex-col items-center justify-center p-6">
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-accent/20 text-foreground">
                      {item.icon}
                    </div>
                    <p className="text-lg font-bold text-foreground italic">{item.name}</p>
                    <p className="mt-1 text-xl font-bold text-accent italic">{item.price}</p>
                    <p className="mt-2 text-center text-sm text-muted-foreground italic">{item.description}</p>
                    <p className="mt-6 rounded-lg bg-accent/10 px-4 py-2 text-center text-xs text-foreground">
                      Request a site visit to view our actual products
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-lg bg-secondary/50 p-4 text-center">
          <p className="text-sm text-muted-foreground italic">
            These are estimated prices only.
          </p>
          <p className="mt-1 text-sm text-muted-foreground italic">
            These are all customisable to suit your needs.
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            For exact price, please contact us.
          </p>
        </div>

        {/* Request Site Visit Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSiteVisitRequest}
            className="group relative overflow-hidden border-2 border-foreground bg-foreground px-8 py-6 text-lg font-bold text-background transition-all hover:bg-foreground/90"
          >
            <MapPin className="mr-2 h-5 w-5" />
            Request Site Visit
          </Button>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Visit our showroom to see our full catalogue of event equipment
        </p>
      </div>
    </div>
  )
}
