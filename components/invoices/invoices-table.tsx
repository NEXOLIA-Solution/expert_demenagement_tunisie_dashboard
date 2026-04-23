"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Download } from "lucide-react"
import type { Invoice } from "@/lib/types"
import { generateInvoicePDF } from "@/lib/pdf-generator"

interface InvoicesTableProps {
  invoices: Invoice[]
  onEdit: (invoice: Invoice) => void
  onDelete: (id: string) => void
}

const statusConfig = {
  draft: { label: "Brouillon", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
  sent: { label: "Envoyé", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  paid: { label: "Payé", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  overdue: { label: "En retard", className: "bg-red-100 text-red-800 hover:bg-red-100" },
}

export function InvoicesTable({ invoices, onEdit, onDelete }: InvoicesTableProps) {
  const handleDownloadPDF = (invoice: Invoice) => {
    generateInvoicePDF(invoice)
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Date d'échéance</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Montant TTC</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Aucune facture pour le moment
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.clientName}</div>
                      <div className="text-sm text-muted-foreground">{invoice.clientEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <Badge className={statusConfig[invoice.status].className}>
                      {statusConfig[invoice.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{invoice.total.toLocaleString("fr-FR")} €</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownloadPDF(invoice)}>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(invoice)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(invoice.id)} className="text-destructive">
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
