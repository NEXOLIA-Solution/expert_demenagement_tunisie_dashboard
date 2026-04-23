"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, AlertTriangle, CheckCircle } from "lucide-react"
import type { StockItem } from "@/lib/types"

interface StockTableProps {
  stock: StockItem[]
  onEdit: (item: StockItem) => void
  onDelete: (id: string) => void
}

export function StockTable({ stock, onEdit, onDelete }: StockTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Article</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Minimum</TableHead>
              <TableHead>Emplacement</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière mise à jour</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stock.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Aucun article en stock
                </TableCell>
              </TableRow>
            ) : (
              stock.map((item) => {
                const isLowStock = item.quantity < item.minQuantity
                const stockPercentage = (item.quantity / item.minQuantity) * 100

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={isLowStock ? "text-red-600 font-semibold" : "font-medium"}>
                        {item.quantity} {item.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.minQuantity} {item.unit}
                    </TableCell>
                    <TableCell className="text-sm">{item.location}</TableCell>
                    <TableCell>
                      {isLowStock ? (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Stock faible
                        </Badge>
                      ) : stockPercentage < 150 ? (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Normal</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Stock bon
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(item.lastUpdated).toLocaleDateString("fr-FR")}
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
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
