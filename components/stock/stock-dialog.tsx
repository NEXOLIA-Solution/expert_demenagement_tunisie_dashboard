"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StockItem } from "@/lib/types"

interface StockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: StockItem
  onSave: (item: StockItem) => void
}

const categories = ["Emballage", "Protection", "Sécurité", "Équipement", "Accessoires", "Autre"]

const units = ["pièces", "rouleaux", "mètres", "kilogrammes", "litres"]

export function StockDialog({ open, onOpenChange, item, onSave }: StockDialogProps) {
  const [formData, setFormData] = useState<Partial<StockItem>>({
    name: "",
    category: "Emballage",
    quantity: 0,
    minQuantity: 0,
    unit: "pièces",
    location: "",
  })

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({
        name: "",
        category: "Emballage",
        quantity: 0,
        minQuantity: 0,
        unit: "pièces",
        location: "",
      })
    }
  }, [item, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as StockItem)
  }

  const handleChange = (field: keyof StockItem, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
          <DialogDescription>
            {item ? "Modifiez les informations de l'article" : "Ajoutez un nouvel article au stock"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'article</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ex: Cartons standard"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unité</Label>
              <Select value={formData.unit} onValueChange={(value) => handleChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité actuelle</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", Number.parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Quantité minimum</Label>
              <Input
                id="minQuantity"
                type="number"
                min="0"
                value={formData.minQuantity}
                onChange={(e) => handleChange("minQuantity", Number.parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Emplacement</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Ex: Entrepôt A - Zone 1"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">{item ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
