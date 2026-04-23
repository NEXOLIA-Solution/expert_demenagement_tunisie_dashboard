"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionsTable } from "@/components/finances/transactions-table"
import { TransactionDialog } from "@/components/finances/transaction-dialog"
import { FinancialSummary } from "@/components/finances/financial-summary"
import type { Transaction } from "@/lib/types"

export default function FinancesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2024-02-15",
      type: "revenue",
      category: "Déménagement résidentiel",
      amount: 2500,
      description: "Déménagement appartement 3 pièces - Jean Dupont",
      project: "PRJ-001",
    },
    {
      id: "2",
      date: "2024-02-14",
      type: "charge",
      category: "Carburant",
      amount: 150,
      description: "Plein camion - Station Total",
    },
    {
      id: "3",
      date: "2024-02-13",
      type: "revenue",
      category: "Déménagement entreprise",
      amount: 4800,
      description: "Déménagement bureaux - Société ABC",
      project: "PRJ-002",
    },
    {
      id: "4",
      date: "2024-02-12",
      type: "charge",
      category: "Maintenance",
      amount: 380,
      description: "Réparation camion - Garage Martin",
    },
    {
      id: "5",
      date: "2024-02-10",
      type: "charge",
      category: "Salaires",
      amount: 3200,
      description: "Salaires équipe - Février",
    },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()

  const handleCreate = (type: "revenue" | "charge") => {
    setEditingTransaction({ type } as Transaction)
    setDialogOpen(true)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const handleSave = (transaction: Transaction) => {
    if (editingTransaction?.id) {
      setTransactions((prev) => prev.map((t) => (t.id === transaction.id ? transaction : t)))
    } else {
      setTransactions((prev) => [...prev, { ...transaction, id: Date.now().toString() }])
    }
    setDialogOpen(false)
    setEditingTransaction(undefined)
  }

  const revenues = transactions.filter((t) => t.type === "revenue")
  const charges = transactions.filter((t) => t.type === "charge")

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Finances</h1>
            <p className="text-muted-foreground">Gérez vos revenus et charges</p>
          </div>
        </div>

        <FinancialSummary transactions={transactions} />

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">Toutes les transactions</TabsTrigger>
              <TabsTrigger value="revenue">Revenus</TabsTrigger>
              <TabsTrigger value="charges">Charges</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button onClick={() => handleCreate("revenue")} variant="default">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un revenu
              </Button>
              <Button onClick={() => handleCreate("charge")} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une charge
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <TransactionsTable transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <TransactionsTable transactions={revenues} onEdit={handleEdit} onDelete={handleDelete} />
          </TabsContent>

          <TabsContent value="charges" className="space-y-4">
            <TransactionsTable transactions={charges} onEdit={handleEdit} onDelete={handleDelete} />
          </TabsContent>
        </Tabs>

        <TransactionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          transaction={editingTransaction}
          onSave={handleSave}
        />
      </div>
    </DashboardShell>
  )
}
