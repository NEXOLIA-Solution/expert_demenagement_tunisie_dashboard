"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, MessageSquare, Newspaper, Building2, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react"
import VisitorDashboardWithCharts from "@/components/Visitors/VisitorDashboardWithCharts"

const monthlyData = [
  { month: "Jan", revenue: 18500, charges: 12000, projects: 18 },
  { month: "Fév", revenue: 22000, charges: 13500, projects: 22 },
  { month: "Mar", revenue: 25500, charges: 14200, projects: 25 },
  { month: "Avr", revenue: 28000, charges: 15000, projects: 28 },
  { month: "Mai", revenue: 31000, charges: 16500, projects: 26 },
  { month: "Jun", revenue: 34500, charges: 17800, projects: 23 },
]

const projectsByStatus = [
  { month: "Jan", completed: 18, cancelled: 2, inProgress: 5 },
  { month: "Fév", completed: 22, cancelled: 1, inProgress: 4 },
  { month: "Mar", completed: 25, cancelled: 3, inProgress: 6 },
  { month: "Avr", completed: 28, cancelled: 1, inProgress: 5 },
  { month: "Mai", completed: 26, cancelled: 2, inProgress: 7 },
  { month: "Jun", completed: 23, cancelled: 1, inProgress: 8 },
]

const categoryRevenue = [
  { name: "Résidentiel", value: 85000, percentage: 52 },
  { name: "Entreprise", value: 58000, percentage: 35 },
  { name: "International", value: 21000, percentage: 13 },
]

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

export default function AnalyticsPage() {
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0)
  const totalCharges = monthlyData.reduce((sum, item) => sum + item.charges, 0)
  const netProfit = totalRevenue - totalCharges
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1)

  const totalCompleted = projectsByStatus.reduce((sum, item) => sum + item.completed, 0)
  const totalCancelled = projectsByStatus.reduce((sum, item) => sum + item.cancelled, 0)
  const cancelRate = ((totalCancelled / (totalCompleted + totalCancelled)) * 100).toFixed(1)

  return (
    <DashboardShell>
      {/* <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytiques</h1>
          <p className="text-muted-foreground">Analyse détaillée de votre activité</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenus semestriels</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString("fr-FR")} €</div>
              <p className="text-xs text-muted-foreground mt-1">6 derniers mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bénéfice net</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{netProfit.toLocaleString("fr-FR")} €</div>
              <p className="text-xs text-muted-foreground mt-1">Marge: {profitMargin}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projets achevés</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompleted}</div>
              <p className="text-xs text-muted-foreground mt-1">6 derniers mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taux d'annulation</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cancelRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">{totalCancelled} projets annulés</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des revenus et charges</CardTitle>
              <CardDescription>Comparaison mensuelle sur 6 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCharges" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Revenus</span>
                                <span className="font-bold text-green-600">{payload[0].value}€</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Charges</span>
                                <span className="font-bold text-red-600">{payload[1].value}€</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="charges"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorCharges)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition des revenus par catégorie</CardTitle>
              <CardDescription>Distribution sur 6 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryRevenue}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">{payload[0].name}</span>
                              <span className="font-bold">{payload[0].value?.toLocaleString("fr-FR")} €</span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Statuts des projets par mois</CardTitle>
              <CardDescription>Achevés, en cours et annulés</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid gap-2">
                              {payload.map((entry, index) => (
                                <div key={`item-${index}`} className="flex items-center justify-between gap-8">
                                  <span className="text-[0.70rem] text-muted-foreground">{entry.name}</span>
                                  <span className="font-bold" style={{ color: entry.color }}>
                                    {entry.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Bar dataKey="completed" name="Achevés" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="inProgress" name="En cours" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cancelled" name="Annulés" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variation des charges</CardTitle>
              <CardDescription>Évolution mensuelle des dépenses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const currentCharges = payload[0].value as number
                        const prevIndex = monthlyData.findIndex((d) => d.month === payload[0].payload.month) - 1
                        const prevCharges = prevIndex >= 0 ? monthlyData[prevIndex].charges : currentCharges
                        const variation = ((currentCharges - prevCharges) / prevCharges) * 100

                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="flex flex-col gap-1">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Charges</span>
                              <span className="font-bold">{currentCharges}€</span>
                              {prevIndex >= 0 && (
                                <span className={`text-xs ${variation >= 0 ? "text-red-600" : "text-green-600"}`}>
                                  {variation >= 0 ? "+" : ""}
                                  {variation.toFixed(1)}% vs mois précédent
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line type="monotone" dataKey="charges" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div> */}




      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytiques</h1>
        <p className="text-muted-foreground">Analyse détaillée de votre activité</p>
      </div>


      <Tabs defaultValue="gallery" className="space-y-6 mt-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="gallery" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Visiteur</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Avis Clients</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="gap-2">
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">News & Offres</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Entreprise</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          {/* <GalleryManager /> */}
          <VisitorDashboardWithCharts />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {/* <ReviewsManager /> */}
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          {/* <NewsManager /> */}
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          {/* <CompanyInfoManager /> */}
        </TabsContent>
      </Tabs>



    </DashboardShell>
  )
}
