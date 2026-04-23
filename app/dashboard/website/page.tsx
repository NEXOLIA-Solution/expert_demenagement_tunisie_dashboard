"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { NewsManagerComplete } from "@/components/website/NewsManagerComplete"
import { ReviewsManager } from "@/components/website/reviews-manager"
import { CompanySettings } from "@/components/website/CompanySettings"
import { ServicesSection } from "@/components/website/ServicesSection"
import { HomeSection } from "@/components/website/HomeSection"

import GestionVideos from "@/components/website/GestionVideos/GestionVideos"
import AdminGallery from "@/components/website/AdminGallery/AdminGallery"
import EmailListManager from "@/components/website/EmailListManager/EmailListManager"
import GestionPartners from "@/components/website/GestionPatners/GestionPartners"

import {
  ImageIcon,
  MessageSquare,
  Newspaper,
  Building2,
  HelpCircle,
  Wrench,
  Mail,
  Handshake
} from "lucide-react"

export default function WebsitePage() {





   const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("user_id")
    const userName = localStorage.getItem("user_name")

    if (!token || !userId || !userName) {
      router.push("/login")
    }
  }, [])
  
  const [isLoading] = useState(false)

  const tabsConfig = [
    { value: "gallery", label: "Galerie", icon: ImageIcon },
    { value: "reviews", label: "Avis", icon: MessageSquare },
    { value: "news", label: "News", icon: Newspaper },
    { value: "company", label: "Entreprise", icon: Building2 },
    { value: "home", label: "FAQ", icon: HelpCircle },
    { value: "services", label: "Services", icon: Wrench },
    { value: "emailClientNotification", label: "Clients", icon: Mail },
    { value: "partner", label: "Partenaires", icon: Handshake },
  ]

  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion du Site Web
          </h1>
          <p className="text-muted-foreground">
            Gérez le contenu et les informations de votre site web
          </p>
        </div>

        <Tabs defaultValue="gallery" className="space-y-6">

          {/* NAVBAR PRO ULTRA LISIBLE */}
          <TabsList
            className="
              grid grid-cols-2 sm:grid-cols-4 
              gap-3 
              w-full 
              p-3 
              bg-muted/50 
              rounded-xl
              h-auto
            "
          >
            {tabsConfig.map((tab) => {
              const Icon = tab.icon

              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="
                    flex items-center justify-center
                    gap-3

                    px-4 py-3
                    rounded-xl

                    text-xs sm:text-sm
                    font-medium

                    bg-background/40
                    hover:bg-muted

                    transition-all

                    data-[state=active]:bg-primary 
                    data-[state=active]:text-white
                    data-[state=active]:shadow-md
                  "
                >
                  {/* ICONE AVEC ESPACE PRO */}
                  <div className="p-2 rounded-lg bg-background/60 flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="whitespace-nowrap">
                    {tab.label}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* CONTENT */}

          <TabsContent value="gallery" className="space-y-4">
            <GestionVideos />
            <AdminGallery />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <ReviewsManager />
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            <NewsManagerComplete />
          </TabsContent>

          <TabsContent value="company" className="space-y-4">
            <CompanySettings />
          </TabsContent>

          <TabsContent value="home" className="space-y-4">
            <HomeSection />
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <ServicesSection />
          </TabsContent>

          <TabsContent value="emailClientNotification" className="space-y-4">
            <EmailListManager />
          </TabsContent>

          <TabsContent value="partner" className="space-y-4">
            <GestionPartners />
          </TabsContent>

        </Tabs>
      </div>
    </DashboardShell>
  )
}