"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import logoAla from "../../public/logo/logo1-removebg-preview.png"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Calendar, Euro, FileText, Package, BarChart3, Menu, X, LogOut, User, Truck, Globe } from "lucide-react"
import { logout, getAdminEmail } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: React.ReactNode
}

const navigation = [
  // { name: "Tableau de bord", href: "/dashboard", icon: Home },
  { name: "Site Web", href: "/dashboard/website", icon: Globe },

  { name: "Devis", href: "/dashboard/devis", icon: FileText },
  { name: "Facture", href: "/dashboard/facture", icon: Calendar },
  // { name: "Finances", href: "/dashboard/finances", icon: Euro },
  // { name: "Stock", href: "/dashboard/stock", icon: Package },
  // { name: "Analytiques", href: "/dashboard/analytics", icon: BarChart3 },
]

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const adminEmail = getAdminEmail() || "Admin"

const handleLogout = () => {
  localStorage.clear() // supprime tout
  router.push("/login")
}

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-card border-r shadow-xl">
            <div className="flex h-16 items-center justify-between px-6 border-b">
              <div className="flex items-center gap-2">
                <div className="w-16 h-8 rounded-lg flex items-center justify-center">
                  <Image
                    src={logoAla}
                    alt="Logo"
                    width={200}
                    height={100}
                  />                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
















      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow border-r bg-card">
          <div className="flex h-16 items-center gap-2 px-6 border-b">
            <div className="w-24 h-16 rounded-lg flex items-center justify-center">
              <Image
                src={logoAla}
                alt="Logo"
                width={200}
                height={100}
              />             </div>
            {/* <span className="font-bold text-lg">DéménaPro</span> */}
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {adminEmail.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block text-sm">{adminEmail}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
