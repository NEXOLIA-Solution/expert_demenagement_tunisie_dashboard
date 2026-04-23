"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", completed: 18, cancelled: 2, inProgress: 5 },
  { month: "Fév", completed: 22, cancelled: 1, inProgress: 4 },
  { month: "Mar", completed: 25, cancelled: 3, inProgress: 6 },
  { month: "Avr", completed: 28, cancelled: 1, inProgress: 5 },
  { month: "Mai", completed: 26, cancelled: 2, inProgress: 7 },
  { month: "Jun", completed: 23, cancelled: 1, inProgress: 8 },
]

export function ProjectsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projets par mois</CardTitle>
        <CardDescription>Répartition des statuts de projets</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
  )
}
