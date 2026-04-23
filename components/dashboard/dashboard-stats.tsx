"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Calendar, DollarSign, FileText, XCircle } from "lucide-react"

const stats = [
  {
    title: "Projets achevés",
    value: "142",
    change: "+12%",
    trend: "up",
    icon: Calendar,
  },
  {
    title: "Revenus totaux",
    value: "248 500€",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Projets en cours",
    value: "23",
    change: "-5%",
    trend: "down",
    icon: FileText,
  },
  {
    title: "Projets annulés",
    value: "8",
    change: "+2%",
    trend: "down",
    icon: XCircle,
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
              <span className="text-muted-foreground">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
