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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import type { Invoice, InvoiceItem } from "@/lib/types"

interface InvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: Invoice
  onSave: (invoice: Invoice) => void
}

export function InvoiceDialog({ open, onOpenChange, invoice, onSave }: InvoiceDialogProps) {
  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoiceNumber: "",
    clientName: "",
    clientEmail: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "draft",
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: "",
  })

  useEffect(() => {
    if (invoice) {
      setFormData(invoice)
    } else {
      setFormData({
        invoiceNumber: "",
        clientName: "",
        clientEmail: "",
        date: new Date().toISOString().split("T")[0],
        dueDate: "",
        status: "draft",
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        notes: "",
      })
    }
  }, [invoice, open])

  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.2 // TVA 20%
    const total = subtotal + tax
    return { subtotal, tax, total }
  }

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    const newItems = [...(formData.items || []), newItem]
    const totals = calculateTotals(newItems)
    setFormData((prev) => ({ ...prev, items: newItems, ...totals }))
  }

  const handleRemoveItem = (id: string) => {
    const newItems = (formData.items || []).filter((item) => item.id !== id)
    const totals = calculateTotals(newItems)
    setFormData((prev) => ({ ...prev, items: newItems, ...totals }))
  }

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const newItems = (formData.items || []).map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        updated.total = updated.quantity * updated.unitPrice
        return updated
      }
      return item
    })
    const totals = calculateTotals(newItems)
    setFormData((prev) => ({ ...prev, items: newItems, ...totals }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Invoice)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{invoice ? "Modifier la facture" : "Nouvelle facture"}</DialogTitle>
          <DialogDescription>
            {invoice ? "Modifiez les informations de la facture" : "Créez une nouvelle facture"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nom du client</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email du client</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, clientEmail: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date de facture</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as Invoice["status"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="sent">Envoyé</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Articles / Services</Label>
              <Button type="button" onClick={handleAddItem} size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un article
              </Button>
            </div>

            {(formData.items || []).length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead className="w-[15%]">Quantité</TableHead>
                      <TableHead className="w-[20%]">Prix unitaire</TableHead>
                      <TableHead className="w-[20%]">Total</TableHead>
                      <TableHead className="w-[5%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(formData.items || []).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                            placeholder="Description"
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, "quantity", Number.parseInt(e.target.value))}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(item.id, "unitPrice", Number.parseFloat(e.target.value))}
                            required
                          />
                        </TableCell>
                        <TableCell className="font-semibold">{item.total.toLocaleString("fr-FR")} €</TableCell>
                        <TableCell>
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total HT:</span>
                <span className="font-medium">{formData.subtotal?.toLocaleString("fr-FR")} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVA (20%):</span>
                <span className="font-medium">{formData.tax?.toLocaleString("fr-FR")} €</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total TTC:</span>
                <span>{formData.total?.toLocaleString("fr-FR")} €</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Conditions de paiement, notes spéciales..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">{invoice ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
