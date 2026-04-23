"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Calendar, Clock, MapPin } from "lucide-react"
import type { Appointment } from "@/lib/types"

interface AppointmentsTableProps {
  appointments: Appointment[]
  onEdit: (appointment: Appointment) => void
  onDelete: (id: string) => void
}

const statusConfig = {
  pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  confirmed: { label: "Confirmé", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  completed: { label: "Terminé", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  cancelled: { label: "Annulé", className: "bg-red-100 text-red-800 hover:bg-red-100" },
}

export function AppointmentsTable({ appointments, onEdit, onDelete }: AppointmentsTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date & Heure</TableHead>
              <TableHead>Adresses</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun rendez-vous pour le moment
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="font-medium">{appointment.clientName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div>{appointment.clientEmail}</div>
                      <div className="text-muted-foreground">{appointment.clientPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(appointment.date).toLocaleDateString("fr-FR")}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {appointment.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 text-sm max-w-xs">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-green-700">{appointment.addressFrom}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-700">{appointment.addressTo}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[appointment.status].className}>
                      {statusConfig[appointment.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(appointment)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(appointment.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
