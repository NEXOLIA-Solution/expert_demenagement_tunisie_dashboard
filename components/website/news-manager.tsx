"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Tag } from "lucide-react"
import { NewsDialog } from "./news-dialog"
import type { NewsItem } from "@/lib/types"

const initialNews: NewsItem[] = [
  {
    id: "1",
    title: "Offre Spéciale Janvier 2025",
    content: "Profitez de -20% sur tous nos déménagements résidentiels jusqu'au 31 janvier !",
    type: "promotion",
    discount: "20%",
    validUntil: "2025-01-31",
    publishDate: "2024-12-01",
    isActive: true,
  },
  {
    id: "2",
    title: "Nouveau service d'emballage premium",
    content: "Découvrez notre nouveau service d'emballage avec matériaux écologiques.",
    type: "news",
    publishDate: "2024-11-15",
    isActive: true,
  },
]

export function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>(initialNews)
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreate = () => {
    setSelectedItem(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: NewsItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setNews(news.filter((item) => item.id !== id))
  }

  const handleSave = (item: NewsItem) => {
    if (selectedItem) {
      setNews(news.map((n) => (n.id === item.id ? item : n)))
    } else {
      setNews([...news, { ...item, id: Date.now().toString() }])
    }
  }

  const toggleActive = (id: string) => {
    setNews(news.map((n) => (n.id === id ? { ...n, isActive: !n.isActive } : n)))
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>News & Offres de Réduction</CardTitle>
              <CardDescription>Gérez les actualités et promotions affichées sur votre site</CardDescription>
            </div>
            <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.map((item) => (
              <Card key={item.id} className={`border-2 ${item.isActive ? "border-primary" : "border-muted"}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        {item.type === "promotion" ? (
                          <Badge className="bg-[oklch(0.75_0.15_60)] text-[oklch(0.145_0_0)]">
                            <Tag className="h-3 w-3 mr-1" />
                            Promotion {item.discount}
                          </Badge>
                        ) : (
                          <Badge className="bg-[oklch(0.60_0.18_230)] text-white">Actualité</Badge>
                        )}
                        {item.isActive ? (
                          <Badge className="bg-[oklch(0.65_0.20_150)] text-white">Actif</Badge>
                        ) : (
                          <Badge variant="outline">Inactif</Badge>
                        )}
                      </div>
                      <p className="text-foreground">{item.content}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Publié le {new Date(item.publishDate).toLocaleDateString("fr-FR")}</span>
                        {item.validUntil && (
                          <span className="text-[oklch(0.75_0.15_60)]">
                            Valide jusqu'au {new Date(item.validUntil).toLocaleDateString("fr-FR")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(item.id)}
                      className={item.isActive ? "border-muted" : "border-primary"}
                    >
                      {item.isActive ? "Désactiver" : "Activer"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <NewsDialog item={selectedItem} open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleSave} />
    </>
  )
}
