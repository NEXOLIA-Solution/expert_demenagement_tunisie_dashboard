"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus, FileText, List } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast" // adaptez selon votre projet
import ValidatedQuotesList from "@/components/ValidatedQuotesList/ValidatedQuotesList"
import InvoicesList from "@/components/InvoicesList/InvoicesList"
import { useRouter } from "next/navigation"


export default function Facture() {

  const router = useRouter()






  const [activeTab, setActiveTab] = useState("init")
  const [isInitDialogOpen, setIsInitDialogOpen] = useState(false)
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null)
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false)
  const { toast } = useToast()
  




    useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("user_id")
    const userName = localStorage.getItem("user_name")

    if (!token || !userId || !userName) {
      router.push("/login")
    }
  }, [])





  // Pour l'initialisation depuis un devis
  const handleInitFacture = (quoteId: string) => {
    setSelectedQuoteId(quoteId)
    setIsInitDialogOpen(true)
  }

  const confirmInitFacture = async () => {
    if (!selectedQuoteId) return
    try {
      const res = await fetch(`/api/facture/${selectedQuoteId}`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Erreur lors de la création")
      const data = await res.json()
      toast({
        title: "Facture créée",
        description: `Facture ${data.facture._id} générée avec succès`,
      })
      setIsInitDialogOpen(false)
      setSelectedQuoteId(null)
      // Option : rafraîchir la liste des factures si vous avez un onglet liste
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture",
        variant: "destructive",
      })
    }
  }

  // Pour la création manuelle
  const handleManualSuccess = () => {
    setIsManualDialogOpen(false)
    toast({
      title: "Facture créée",
      description: "La facture manuelle a été ajoutée",
    })
    // Rafraîchir la liste si nécessaire
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-700 to-teal-800 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Gestion des Factures</h1>
                <p className="mt-2 text-green-100">Créez et gérez vos factures de déménagement</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-teal-500/20 blur-3xl"></div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b border-gray-200">
            <TabsList className="bg-transparent h-auto p-0 space-x-6">
              <TabsTrigger
                value="init"
                className="data-[state=active]:border-green-600 data-[state=active]:text-green-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-3 text-base font-medium transition-all duration-200"
              >
                Initialiser depuis un devis
              </TabsTrigger>


              
              {/* <TabsTrigger
                value="manual"
                className="data-[state=active]:border-green-600 data-[state=active]:text-green-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-3 text-base font-medium transition-all duration-200"
              >
                Créer une facture manuelle
              </TabsTrigger> */}



              <TabsTrigger
                value="list"
                className="data-[state=active]:border-green-600 data-[state=active]:text-green-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-3 text-base font-medium transition-all duration-200"
              >
                Toutes les factures
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Onglet 1 : Initialisation à partir d'un devis validé */}
          <TabsContent value="init" className="mt-0">
            <div>
              <ValidatedQuotesList/>
            </div>
          </TabsContent>

          {/* Onglet 2 : Création manuelle */}
          <TabsContent value="manual" className="mt-0">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Nouvelle facture manuelle</h2>
                  <p className="text-sm text-gray-500">
                    Remplissez tous les champs pour créer une facture sans devis préalable
                  </p>
                </div>
                <Button onClick={() => setIsManualDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une facture
                </Button>
              </div>
              {/* Option : afficher un aperçu ou une liste des dernières factures manuelles */}
              <div className="text-center text-gray-400 py-12">
                <FileText className="mx-auto h-12 w-12 mb-3" />
                <p>Cliquez sur "Créer une facture" pour ouvrir le formulaire</p>
              </div>
            </div>
          </TabsContent>

          {/* Onglet 3 : Liste de toutes les factures (optionnel mais utile) */}
          <TabsContent value="list" className="mt-0">
            <InvoicesList/>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogue de confirmation d'initialisation */}
      <Dialog open={isInitDialogOpen} onOpenChange={setIsInitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initialiser une facture</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Voulez-vous créer une facture à partir de ce devis validé ?</p>
            <p className="text-sm text-gray-500 mt-2">
              Toutes les informations du devis seront reprises dans la facture.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsInitDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={confirmInitFacture}>Confirmer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue pour la création manuelle */}
      <Dialog open={isManualDialogOpen} onOpenChange={setIsManualDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une facture manuelle</DialogTitle>
          </DialogHeader>
          <div>wahbi</div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}