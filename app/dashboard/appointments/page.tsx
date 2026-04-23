"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AppointmentsTable } from "@/components/appointments/appointments-table"
import { AppointmentDialog } from "@/components/appointments/appointment-dialog"
import type { Appointment } from "@/lib/types"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      clientName: "Jean Dupont",
      clientEmail: "jean.dupont@email.com",
      clientPhone: "06 12 34 56 78",
      date: "2024-02-15",
      time: "09:00",
      addressFrom: "15 Rue de Paris, 75001 Paris",
      addressTo: "32 Avenue des Champs, 75008 Paris",
      status: "confirmed",
      notes: "Appartement 3 pièces au 4ème étage sans ascenseur",
    },
    {
      id: "2",
      clientName: "Marie Martin",
      clientEmail: "marie.martin@email.com",
      clientPhone: "06 98 76 54 32",
      date: "2024-02-16",
      time: "14:00",
      addressFrom: "8 Rue Victor Hugo, 69001 Lyon",
      addressTo: "45 Boulevard de la République, 69003 Lyon",
      status: "pending",
      notes: "Maison avec garage",
    },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>()

  const handleCreate = () => {
    setEditingAppointment(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id))
  }

  const handleSave = (appointment: Appointment) => {
    if (editingAppointment) {
      setAppointments((prev) => prev.map((apt) => (apt.id === appointment.id ? appointment : apt)))
    } else {
      setAppointments((prev) => [...prev, { ...appointment, id: Date.now().toString() }])
    }
    setDialogOpen(false)
    setEditingAppointment(undefined)
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
            <p className="text-muted-foreground">Gérez vos rendez-vous de déménagement</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau rendez-vous
          </Button>
        </div>

        <AppointmentsTable appointments={appointments} onEdit={handleEdit} onDelete={handleDelete} />

        <AppointmentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          appointment={editingAppointment}
          onSave={handleSave}
        />
      </div>
    </DashboardShell>
  )
}
