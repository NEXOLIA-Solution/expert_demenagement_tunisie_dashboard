"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import type { Transaction } from "@/lib/types"

interface FinancialSummaryProps {
  transactions: Transaction[]
}

export function FinancialSummary({ transactions }: FinancialSummaryProps) {
  const totalRevenue = transactions.filter((t) => t.type === "revenue").reduce((sum, t) => sum + t.amount, 0)

  const totalCharges = transactions.filter((t) => t.type === "charge").reduce((sum, t) => sum + t.amount, 0)

  const netProfit = totalRevenue - totalCharges

  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0"

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Revenus totaux</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString("fr-FR")} €</div>
          <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Charges totales</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{totalCharges.toLocaleString("fr-FR")} €</div>
          <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Bénéfice net</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            {netProfit.toLocaleString("fr-FR")} €
          </div>
          <p className="text-xs text-muted-foreground mt-1">Revenus - Charges</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Marge bénéficiaire</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profitMargin}%</div>
          <p className="text-xs text-muted-foreground mt-1">Rentabilité</p>
        </CardContent>
      </Card>
    </div>
  )
}
