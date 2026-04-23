"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import type { StockItem } from "@/lib/types"

interface StockAlertsProps {
  items: StockItem[]
}

export function StockAlerts({ items }: StockAlertsProps) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Stock faible détecté</AlertTitle>
      <AlertDescription>
        <p className="mb-2">Les articles suivants sont en dessous du seuil minimum:</p>
        <ul className="list-disc list-inside space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <span className="font-medium">{item.name}</span> - Stock actuel: {item.quantity} {item.unit} (Min:{" "}
              {item.minQuantity})
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
