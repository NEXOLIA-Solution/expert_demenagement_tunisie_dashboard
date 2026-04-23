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
import type { Appointment } from "@/lib/types"

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment?: Appointment
  onSave: (appointment: Appointment) => void
}

export function AppointmentDialog({ open, onOpenChange, appointment, onSave }: AppointmentDialogProps) {
  const [formData, setFormData] = useState<Partial<Appointment>>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    date: "",
    time: "",
    addressFrom: "",
    addressTo: "",
    status: "pending",
    notes: "",
  })

  useEffect(() => {
    if (appointment) {
      setFormData(appointment)
    } else {
      setFormData({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        date: "",
        time: "",
        addressFrom: "",
        addressTo: "",
        status: "pending",
        notes: "",
      })
    }
  }, [appointment, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Appointment)
  }

  const handleChange = (field: keyof Appointment, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{appointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}</DialogTitle>
          <DialogDescription>
            {appointment ? "Modifiez les informations du rendez-vous" : "Créez un nouveau rendez-vous de déménagement"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nom du client</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleChange("clientName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleChange("clientEmail", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Téléphone</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => handleChange("clientPhone", e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="time">Heure</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressFrom">Adresse de départ</Label>
            <Input
              id="addressFrom"
              value={formData.addressFrom}
              onChange={(e) => handleChange("addressFrom", e.target.value)}
              placeholder="Adresse complète de départ"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressTo">Adresse d'arrivée</Label>
            <Input
              id="addressTo"
              value={formData.addressTo}
              onChange={(e) => handleChange("addressTo", e.target.value)}
              placeholder="Adresse complète d'arrivée"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Informations complémentaires..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">{appointment ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
