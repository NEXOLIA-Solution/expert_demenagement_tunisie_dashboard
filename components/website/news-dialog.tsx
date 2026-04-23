"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { NewsItem } from "@/lib/types"

interface NewsDialogProps {
  item: NewsItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: NewsItem) => void
}

export function NewsDialog({ item, open, onOpenChange, onSave }: NewsDialogProps) {
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: "",
    content: "",
    type: "news",
    publishDate: new Date().toISOString().split("T")[0],
    isActive: true,
  })

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({
        title: "",
        content: "",
        type: "news",
        publishDate: new Date().toISOString().split("T")[0],
        isActive: true,
      })
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as NewsItem)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? "Modifier l'actualité" : "Ajouter une actualité"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="news">Actualité</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishDate">Date de publication *</Label>
              <Input
                id="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                required
              />
            </div>
          </div>

          {formData.type === "promotion" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Réduction</Label>
                <Input
                  id="discount"
                  value={formData.discount || ""}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="Ex: 20%"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Valide jusqu'au</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil || ""}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
