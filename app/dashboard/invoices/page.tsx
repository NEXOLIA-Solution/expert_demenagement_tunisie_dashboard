"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"

import QuoteDashboard from "@/components/website/QuoteDashboard/QuoteDashboard"

export default function InvoicesPage() {
 


  return (
    <DashboardShell>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Devis</h1>
            <p className="text-muted-foreground">Gérez vos devis</p>
          </div>
        </div>






        <QuoteDashboard />

      </div>
    </DashboardShell>
  )
}
