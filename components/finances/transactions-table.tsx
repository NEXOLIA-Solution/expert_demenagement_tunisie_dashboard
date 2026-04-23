"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import type { Transaction } from "@/lib/types"

interface TransactionsTableProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Aucune transaction pour le moment
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    {transaction.type === "revenue" ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Revenu
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <TrendingDown className="mr-1 h-3 w-3" />
                        Charge
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                  <TableCell>
                    {transaction.project ? (
                      <Badge variant="outline">{transaction.project}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      transaction.type === "revenue" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "revenue" ? "+" : "-"}
                    {transaction.amount.toLocaleString("fr-FR")} €
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
                        <DropdownMenuItem onClick={() => onEdit(transaction)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(transaction.id)} className="text-destructive">
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
