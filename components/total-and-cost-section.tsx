import { Calculator, Users, TrendingUp } from "lucide-react"

interface TotalAndCostSectionProps {
  total: number
  costPerGuest: number
  guests: number
}

export function TotalAndCostSection({ total, costPerGuest, guests }: TotalAndCostSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Total Estimated Price */}
      <div className="overflow-hidden rounded-2xl border-2 border-accent bg-card shadow-xl">
        <div className="flex h-full flex-col items-center justify-center p-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <Calculator className="h-7 w-7 text-accent-foreground" />
          </div>
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Total Estimated Price
          </p>
          <p className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            RM {total.toFixed(2)}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            * Inclusive of applicable SST (8%)
          </p>
        </div>
      </div>

      {/* Cost Per Guest */}
      <div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-xl">
        <div className="flex h-full flex-col items-center justify-center p-8">
          <div className="mb-4 flex items-center gap-6">
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Users className="h-6 w-6 text-foreground" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Guests</p>
              <p className="text-2xl font-bold text-foreground">{guests || 0}</p>
            </div>
            
            <div className="h-16 w-px bg-border" />

            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                <TrendingUp className="h-6 w-6 text-foreground" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cost Per Guest</p>
              <p className="text-2xl font-bold text-foreground">
                RM {guests > 0 ? costPerGuest.toFixed(2) : "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
