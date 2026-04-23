"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { checkAuth } from "@/lib/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { ProjectsChart } from "@/components/dashboard/projects-chart"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
 const token = localStorage.getItem("token")
console.log("Token stored:", token)
if (!token) {
  router.push("/login")
} else {
  setIsLoading(false)
}
}, [router])


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Aperçu de votre activité de déménagement</p>
        </div>

        {/* <DashboardStats /> */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* <RevenueChart /> */}
          {/* <ProjectsChart /> */}
        </div>
      </div>
    </DashboardShell>
  )
}
