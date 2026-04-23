// VisitorDashboardWithCharts.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  Legend, ResponsiveContainer
} from "recharts"

/* ================= TYPES ================= */

interface PageView {
  page: string
  enteredAt: string
  duration: number
}

interface Session {
  session_id: string
  session_start: string
  page_views: PageView[]
}

interface Visitor {
  _id: string
  visitor_id: string
  sessions: Session[]
  createdAt: string
  updatedAt: string
}

/* ================= CONSTANTS ================= */

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF"]

/* ================= UI COMPONENTS ================= */

function KPI({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="font-semibold mb-4">{title}</h2>
      {children}
    </div>
  )
}

/* ================= MAIN COMPONENT ================= */

export default function VisitorDashboardWithCharts() {
  const [data, setData] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get("http://localhost:2000/visitorAnalytics/api/visitors")
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  /* ================= DATA FLATTEN ================= */

  const sessions = useMemo(
    () => data.flatMap(v => v.sessions),
    [data]
  )

  const pageViews = useMemo(
    () => sessions.flatMap(s => s.page_views),
    [sessions]
  )

  /* ================= KPIs ================= */

  const kpis = useMemo(() => {
    const totalSessions = sessions.length
    const totalPages = pageViews.length
    const uniquePages = new Set(pageViews.map(p => p.page)).size
    const totalDuration = pageViews.reduce((a, p) => a + p.duration, 0)
    const bounceSessions = sessions.filter(s => s.page_views.length === 1).length
    const longestSession = Math.max(...sessions.map(s =>
      s.page_views.reduce((a, p) => a + p.duration, 0)
    )) / 1000

    // KPIs additionnels de la première version
    const totalVisitors = data.length
    const totalPageViews = pageViews.length
    const avgPagesPerSession = totalSessions ? (totalPageViews / totalSessions).toFixed(2) : "0"
    const avgSessionDuration = totalSessions ? (
      data.reduce((acc, v) =>
        acc + v.sessions.reduce((sAcc, s) =>
          sAcc + s.page_views.reduce((pAcc, p) => pAcc + p.duration, 0), 0),
      0) / totalSessions / 1000
    ).toFixed(2) : "0"

    return {
      totalVisitors,
      totalSessions,
      totalPageViews,
      avgPagesPerSession,
      avgSessionDuration,
      uniquePages,
      avgPageDuration: totalPages ? (totalDuration / totalPages / 1000).toFixed(1) : "0",
      bounceRate: totalSessions ? ((bounceSessions / totalSessions) * 100).toFixed(1) : "0",
      longestSession: longestSession.toFixed(1)
    }
  }, [data, sessions, pageViews])

  /* ================= CHART DATA ================= */

  // Pages les plus visitées (version 1)
  const pageCounts = useMemo(() => {
    const counts: { [key: string]: number } = {}
    data.forEach(visitor => {
      visitor.sessions.forEach(session => {
        session.page_views.forEach(pv => {
          counts[pv.page] = (counts[pv.page] || 0) + 1
        })
      })
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([page, count]) => ({ page, count }))
  }, [data])

  // Sessions par visiteur
  const sessionsPerVisitor = useMemo(() =>
    data.map(v => ({
      visitor: v.visitor_id.slice(0, 8),
      sessions: v.sessions.length
    })),
    [data]
  )

  // Timeline pour sessions
  const timeline = useMemo(() =>
    sessions.map(s => ({
      time: new Date(s.session_start).toLocaleTimeString(),
      sessions: 1,
      pages: s.page_views.length
    })),
    [sessions]
  )

  // Qualité des sessions
  const sessionQuality = useMemo(() => ([
    {
      name: "Courtes (<15s)",
      value: sessions.filter(s =>
        s.page_views.reduce((a, p) => a + p.duration, 0) < 15000
      ).length
    },
    {
      name: "Longues (≥15s)",
      value: sessions.filter(s =>
        s.page_views.reduce((a, p) => a + p.duration, 0) >= 15000
      ).length
    }
  ]), [sessions])

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Chargement des données...</div>
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold">📊 Dashboard des visiteurs</h1>

      {/* KPIs Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Total Visiteurs" value={kpis.totalVisitors} />
        <KPI label="Total Sessions" value={kpis.totalSessions} />
        <KPI label="Pages / Session" value={kpis.avgPagesPerSession} />
        <KPI label="Durée Moy. Session (s)" value={kpis.avgSessionDuration} />
        <KPI label="Pages vues totales" value={kpis.totalPageViews} />
        <KPI label="Pages uniques" value={kpis.uniquePages} />
        <KPI label="Taux de rebond (%)" value={kpis.bounceRate} />
        <KPI label="Session max (s)" value={kpis.longestSession} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sessions par visiteur */}
        <Card title="Sessions par visiteur">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessionsPerVisitor}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="visitor" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pages les plus visitées */}
        <Card title="Pages les plus visitées">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pageCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Sessions dans le temps */}
        <Card title="Sessions dans le temps">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" stroke="#0088FE" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pages vues par session */}
        <Card title="Pages vues par session">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="pages" stroke="#00C49F" fill="#bbf7d0" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Répartition des visites par page */}
        <Card title="Répartition des visites par page">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pageCounts}
                dataKey="count"
                nameKey="page"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pageCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Qualité des sessions */}
        <Card title="Qualité des sessions">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sessionQuality}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {sessionQuality.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}