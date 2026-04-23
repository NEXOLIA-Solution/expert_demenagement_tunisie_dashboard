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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction } from "@/lib/types"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction
  onSave: (transaction: Transaction) => void
}

const revenueCategories = [
  "Déménagement résidentiel",
  "Déménagement entreprise",
  "Déménagement international",
  "Stockage",
  "Services additionnels",
]

const chargeCategories = ["Salaires", "Carburant", "Maintenance", "Assurance", "Location", "Marketing", "Autre"]

export function TransactionDialog({ open, onOpenChange, transaction, onSave }: TransactionDialogProps) {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    date: "",
    type: "revenue",
    category: "",
    amount: 0,
    description: "",
    project: "",
  })

  useEffect(() => {
    if (transaction) {
      setFormData(transaction)
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        type: "revenue",
        category: "",
        amount: 0,
        description: "",
        project: "",
      })
    }
  }, [transaction, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Transaction)
  }

  const handleChange = (field: keyof Transaction, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const categories = formData.type === "revenue" ? revenueCategories : chargeCategories

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {transaction?.id
              ? "Modifier la transaction"
              : `Ajouter un${formData.type === "revenue" ? " revenu" : "e charge"}`}
          </DialogTitle>
          <DialogDescription>
            {transaction?.id
              ? "Modifiez les informations de la transaction"
              : `Enregistrez un nouveau ${formData.type === "revenue" ? "revenu" : "une nouvelle charge"}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenu</SelectItem>
                  <SelectItem value="charge">Charge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
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
            <Label htmlFor="amount">Montant (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleChange("amount", Number.parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Détails de la transaction..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Référence projet (optionnel)</Label>
            <Input
              id="project"
              value={formData.project}
              onChange={(e) => handleChange("project", e.target.value)}
              placeholder="PRJ-001"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">{transaction?.id ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
