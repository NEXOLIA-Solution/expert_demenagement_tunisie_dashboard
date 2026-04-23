"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StockTable } from "@/components/stock/stock-table"
import { StockDialog } from "@/components/stock/stock-dialog"
import { StockAlerts } from "@/components/stock/stock-alerts"
import type { StockItem } from "@/lib/types"

export default function StockPage() {
  const [stock, setStock] = useState<StockItem[]>([
    {
      id: "1",
      name: "Cartons standard",
      category: "Emballage",
      quantity: 250,
      minQuantity: 100,
      unit: "pièces",
      location: "Entrepôt A - Zone 1",
      lastUpdated: "2024-02-15",
    },
    {
      id: "2",
      name: "Couvertures de protection",
      category: "Protection",
      quantity: 45,
      minQuantity: 50,
      unit: "pièces",
      location: "Entrepôt A - Zone 2",
      lastUpdated: "2024-02-14",
    },
    {
      id: "3",
      name: "Sangles d'arrimage",
      category: "Sécurité",
      quantity: 80,
      minQuantity: 30,
      unit: "pièces",
      location: "Entrepôt B",
      lastUpdated: "2024-02-13",
    },
    {
      id: "4",
      name: "Diables",
      category: "Équipement",
      quantity: 12,
      minQuantity: 10,
      unit: "pièces",
      location: "Garage",
      lastUpdated: "2024-02-10",
    },
    {
      id: "5",
      name: "Papier bulle (rouleaux)",
      category: "Emballage",
      quantity: 15,
      minQuantity: 25,
      unit: "rouleaux",
      location: "Entrepôt A - Zone 1",
      lastUpdated: "2024-02-12",
    },
    {
      id: "6",
      name: "Adhésif d'emballage",
      category: "Emballage",
      quantity: 120,
      minQuantity: 50,
      unit: "rouleaux",
      location: "Entrepôt A - Zone 1",
      lastUpdated: "2024-02-15",
    },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<StockItem | undefined>()

  const handleCreate = () => {
    setEditingItem(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (item: StockItem) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setStock((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSave = (item: StockItem) => {
    const updatedItem = { ...item, lastUpdated: new Date().toISOString().split("T")[0] }

    if (editingItem) {
      setStock((prev) => prev.map((i) => (i.id === item.id ? updatedItem : i)))
    } else {
      setStock((prev) => [...prev, { ...updatedItem, id: Date.now().toString() }])
    }
    setDialogOpen(false)
    setEditingItem(undefined)
  }

  const lowStockItems = stock.filter((item) => item.quantity < item.minQuantity)

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stock</h1>
            <p className="text-muted-foreground">Gérez votre matériel de déménagement</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un article
          </Button>
        </div>

        {lowStockItems.length > 0 && <StockAlerts items={lowStockItems} />}

        <StockTable stock={stock} onEdit={handleEdit} onDelete={handleDelete} />

        <StockDialog open={dialogOpen} onOpenChange={setDialogOpen} item={editingItem} onSave={handleSave} />
      </div>
    </DashboardShell>
  )
}
