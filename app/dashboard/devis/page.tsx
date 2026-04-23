"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import QuoteDashboard from "@/components/website/QuoteDashboard/QuoteDashboard"
import CompletedQuotes from "@/components/website/fetchQuotes/fetchQuotes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuoteForm } from "@/components/QuoteForm/QuoteForm" // adaptez le chemin selon votre structure
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function Devis() {


  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("user_id")
    const userName = localStorage.getItem("user_name")

    if (!token || !userId || !userName) {
      router.push("/login")
    }
  }, [])



  const [activeTab, setActiveTab] = useState("all")
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false)







  // Fonction optionnelle pour fermer la popup après succès
  const handleQuoteSuccess = () => {
    setIsQuoteDialogOpen(false)
    // Vous pouvez aussi rafraîchir la liste des devis si nécessaire
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header avec gradient et animation */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Gestion des Devis</h1>
                <p className="mt-2 text-blue-100">Gérez et suivez tous vos devis de déménagement</p>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsQuoteDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau devis
              </Button>
            </div>
          </div>
          {/* Éléments décoratifs */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"></div>
        </div>

        {/* Tabs modernes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b border-gray-200">
            <TabsList className="bg-transparent h-auto p-0 space-x-6">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-3 text-base font-medium transition-all duration-200"
              >
                Tous les devis
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-3 text-base font-medium transition-all duration-200"
              >
                Devis finalisés
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <QuoteDashboard />
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <CompletedQuotes />
          </TabsContent>
        </Tabs>
      </div>

      {/* Popup de création de devis avec le formulaire QuoteForm */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau devis</DialogTitle>
          </DialogHeader>
          <QuoteForm 
            onSuccess={handleQuoteSuccess}
            onError={(error) => console.error("Erreur devis:", error)}
            className="mt-2"
          />
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}