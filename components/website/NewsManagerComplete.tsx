"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Trash2,
  Edit,
  Calendar,
  Tag,
  Star,
  StarOff,
  Search,
  AlertCircle,
  Loader2,
  Newspaper,
  ImageIcon,
  Upload,
  X,
  ChevronRight,
  Sparkles,
  Maximize2,
  Clock,
  CheckCircle,
  Filter,
  Grid3x3,
  List,
  Eye,
  TrendingUp,
  Award,
  Download,
  FileImage,
  RefreshCw
} from "lucide-react"
// NE PAS importer Image de next/image ici pour éviter les conflits
// import Image from "next/image" - Commenté car nous utilisons l'API native
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import newsImage from "../../public/sectionImage/news.png"

// Interfaces
interface NewsItem {
  _id?: string
  id?: string
  title: string
  category: "Offre" | "Actualité" | "Conseils"
  date: string
  endDateOfOffre?: string | null
  excerpt: string
  content?: string
  image: string // Stocké en Base64 data URL
  isFeatured: boolean
  createdAt?: string
  updatedAt?: string
  imageFormat?: string // Pour stocker le format de l'image (webp, jpeg, png)
  imageSize?: number // Taille de l'image en bytes
}

type NewsCategory = "Offre" | "Actualité" | "Conseils"

const API_URL = process.env.NEXT_PUBLIC_API_BASE
const categories: NewsCategory[] = ["Offre", "Actualité", "Conseils"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 Mo
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export function NewsManagerComplete() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [featuredFilter, setFeaturedFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isImageExpanded, setIsImageExpanded] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState<NewsItem>({
    title: "",
    category: "Actualité",
    date: new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }),
    endDateOfOffre: "",
    excerpt: "",
    content: "",
    image: "",
    isFeatured: false,
    imageFormat: "",
    imageSize: 0
  })
  const { toast } = useToast()

  // Charger les actualités
  useEffect(() => {
    fetchNews()
  }, [])

  // Mettre à jour formData quand selectedItem change
  useEffect(() => {
    if (selectedItem) {
      setFormData(selectedItem)
    } else {
      setFormData({
        title: "",
        category: "Actualité",
        date: new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }),
        endDateOfOffre: "",
        excerpt: "",
        content: "",
        image: "",
        isFeatured: false,
        imageFormat: "",
        imageSize: 0
      })
    }
  }, [selectedItem])

  // Filtrer les actualités
  useEffect(() => {
    let filtered = [...news]

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    if (featuredFilter === "featured") {
      filtered = filtered.filter((item) => item.isFeatured)
    } else if (featuredFilter === "not-featured") {
      filtered = filtered.filter((item) => !item.isFeatured)
    }

    setFilteredNews(filtered)
  }, [news, searchTerm, categoryFilter, featuredFilter])

  const fetchNews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/news/api`)
      if (!response.ok) throw new Error("Erreur lors du chargement")
      const data = await response.json()
      setNews(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les actualités",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedItem(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: NewsItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setItemToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      const response = await fetch(`${API_URL}/news/api/${itemToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erreur lors de la suppression")

      setNews(news.filter((item) => item._id !== itemToDelete && item.id !== itemToDelete))
      toast({
        title: "Succès",
        description: "Actualité supprimée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'actualité",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  // Fonction pour convertir une image en Base64 avec compression optionnelle
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Fonction pour optimiser et compresser l'image avant conversion
  const optimizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        // Utiliser l'API native du navigateur pour créer un objet Image
        const img = new window.Image() // Correction : utiliser window.Image au lieu de new Image()
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          // Redimensionner si l'image est trop grande (max 1200px)
          const maxWidth = 1200
          const maxHeight = 1200
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
          
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          
          // Convertir en WebP pour une meilleure compression
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                  type: 'image/webp',
                  lastModified: Date.now()
                })
                resolve(optimizedFile)
              } else {
                reject(new Error('Erreur lors de la conversion'))
              }
            },
            'image/webp',
            0.85 // Qualité 85% pour un bon équilibre taille/qualité
          )
        }
        
        img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'))
        img.src = event.target?.result as string
      }
      reader.onerror = reject
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Erreur",
        description: `Format non supporté. Utilisez: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
        variant: "destructive",
      })
      return
    }

    // Vérifier la taille du fichier
    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: "Erreur",
        description: `L'image ne doit pas dépasser ${MAX_IMAGE_SIZE / 1024 / 1024} Mo`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simuler la progression
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      // Optimiser et compresser l'image
      const optimizedFile = await optimizeImage(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Convertir en Base64
      const base64String = await convertToBase64(optimizedFile)
      
      // Extraire le format de l'image
      const imageFormat = base64String.split(';')[0].split('/')[1] || 'webp'
      
      setFormData({ 
        ...formData, 
        image: base64String,
        imageFormat: imageFormat,
        imageSize: optimizedFile.size
      })
      
      toast({
        title: "Succès",
        description: `Image chargée avec succès (${(optimizedFile.size / 1024).toFixed(1)} KB)`,
      })
    } catch (error) {
      console.error('Erreur lors du traitement de l\'image:', error)
      toast({
        title: "Erreur",
        description: "Impossible de traiter l'image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const removeImage = () => {
    setFormData({ 
      ...formData, 
      image: "", 
      imageFormat: "", 
      imageSize: 0 
    })
  }
const handleSave = async () => {
  try {
    // Valider les champs requis
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est requis",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.excerpt.trim()) {
      toast({
        title: "Erreur",
        description: "L'extrait est requis",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.image) {
      toast({
        title: "Erreur",
        description: "Une image est requise",
        variant: "destructive",
      })
      return
    }

    // Préparer les données pour l'API - UNIQUEMENT les champs attendus par le backend
    const apiData: any = {
      title: formData.title.trim(),
      category: formData.category,
      date: formData.date,
      excerpt: formData.excerpt.trim(),
      image: formData.image, // Base64 data URL
      isFeatured: formData.isFeatured,
    }
    
    // Ajouter les champs optionnels seulement s'ils existent
    if (formData.endDateOfOffre) {
      apiData.endDateOfOffre = formData.endDateOfOffre
    }
    
    if (formData.content && formData.content.trim()) {
      apiData.content = formData.content.trim()
    }
    
    // NE PAS inclure imageFormat et imageSize car votre API ne les accepte pas

    // Pour la modification
    if (selectedItem?._id) {
      const response = await fetch(`${API_URL}/news/api/${selectedItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la mise à jour")
      }

      const data = await response.json()
      const savedItem = data.news || data

      setNews(news.map((n) => (n._id === savedItem._id ? savedItem : n)))
      toast({
        title: "Succès",
        description: "Actualité mise à jour avec succès",
      })
    } 
    // Pour la création
    else {
      const response = await fetch(`${API_URL}/news/api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la création")
      }

      const data = await response.json()
      const savedItem = data.news || data

      setNews([savedItem, ...news])
      toast({
        title: "Succès",
        description: "Actualité créée avec succès",
      })
    }

    setIsDialogOpen(false)
  } catch (error) {
    console.error("Erreur complète:", error)
    toast({
      title: "Erreur",
      description: error instanceof Error ? error.message : "Impossible d'enregistrer l'actualité",
      variant: "destructive",
    })
  }
}

  const handleToggleFeatured = async (item: NewsItem) => {
    try {
      const updatedItem = { ...item, isFeatured: !item.isFeatured }
      
      const response = await fetch(`${API_URL}/news/api/${item._id || item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      })

      if (!response.ok) throw new Error("Erreur lors de la mise à jour")

      const data = await response.json()
      const savedItem = data.news || data

      setNews(news.map((n) => (n._id === savedItem._id ? savedItem : n)))
      
      toast({
        title: "Succès",
        description: updatedItem.isFeatured 
          ? "Article mis à la une" 
          : "Article retiré de la une",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive",
      })
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Offre":
        return "bg-green-500 text-white"
      case "Actualité":
        return "bg-blue-500 text-white"
      case "Conseils":
        return "bg-purple-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Offre":
        return <Tag className="h-3 w-3 mr-1" />
      case "Actualité":
        return <Newspaper className="h-3 w-3 mr-1" />
      case "Conseils":
        return <Award className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return dateString
  }

  // Formater la taille de l'image
  const formatImageSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Statistiques
  const totalNews = news.length
  const featuredCount = news.filter(item => item.isFeatured).length
  const offersCount = news.filter(item => item.category === "Offre").length
  const lastUpdated = news.length > 0 
    ? formatDate(news[0].date)
    : "Aucune"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-slate-600">Chargement des actualités...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Image Expansion Dialog */}
      <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Aperçu de la section Actualités
            </DialogTitle>
          </DialogHeader>
          <div className="relative h-[70vh] w-full rounded-lg overflow-hidden border-2 border-slate-200">
            {/* Utiliser img au lieu de Image pour l'aperçu */}
            <img
              src={newsImage.src}
              alt="Section Actualités"
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Bandeau décoratif */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-blue-600 font-medium">Gestion des actualités</span>
        </div>

        {/* En-tête */}
<div className="flex flex-wrap items-center justify-center md:justify-between gap-3 mb-8">          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Newspaper className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Gestion des actualités
                </h1>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Section active
                </Badge>
              </div>
              <p className="text-slate-600">
                Interface d'administration pour gérer les actualités, offres et conseils
              </p>
            </div>
          </div>
          <Button 
            onClick={handleCreate}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-5 w-5" /> Nouvelle actualité
          </Button>
        </div>

        {/* Section Image mise en valeur */}
        <Card className="mb-8 overflow-hidden border-2 border-blue-100 hover:border-blue-200 transition-all duration-300">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-3 gap-0">
              {/* Aperçu de l'image */}
              <div className="md:col-span-2 relative h-[250px] md:h-[300px] group">
                <img
                  src={newsImage.src}
                  alt="Aperçu de la section Actualités"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white"
                  onClick={() => setIsImageExpanded(true)}
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Agrandir
                </Button>
              </div>

              {/* Informations sur la section */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Newspaper className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Section Actualités</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Statut</p>
                      <p className="text-sm text-green-600">Active et visible</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Catégories</p>
                      <p className="text-sm text-slate-600">3 catégories disponibles</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">À la une</p>
                      <p className="text-sm text-slate-600">{featuredCount} articles en vedette</p>
                    </div>
                  </div>

                  {/* Badges des fonctionnalités */}
                  <div className="pt-4 border-t border-blue-200">
                    <p className="text-xs text-slate-500 mb-2">Fonctionnalités</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-white">CRUD complet</Badge>
                      <Badge variant="outline" className="bg-white">Catégorisation</Badge>
                      <Badge variant="outline" className="bg-white">Mise en avant</Badge>
                      <Badge variant="outline" className="bg-white">Recherche</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total articles</p>
                  <p className="text-3xl font-bold mt-1">{totalNews}</p>
                </div>
                <Newspaper className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Offres</p>
                  <p className="text-3xl font-bold mt-1">{offersCount}</p>
                </div>
                <Tag className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">À la une</p>
                  <p className="text-3xl font-bold mt-1">{featuredCount}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Dernière mise à jour</p>
                  <p className="text-lg font-bold mt-1">{lastUpdated}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Barre de recherche */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filtre par catégorie */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtre par statut "à la une" */}
            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tous les articles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les articles</SelectItem>
                <SelectItem value="featured">À la une</SelectItem>
                <SelectItem value="not-featured">Non à la une</SelectItem>
              </SelectContent>
            </Select>

            {/* Sélecteur de vue */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                <Grid3x3 className="h-4 w-4 mr-2" />
                Grille
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                <List className="h-4 w-4 mr-2" />
                Liste
              </Button>
            </div>
          </div>

          <Badge variant="outline" className="px-3 py-1">
            {filteredNews.length} article(s) trouvé(s)
          </Badge>
        </div>

        {/* Contenu principal */}
        {filteredNews.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-slate-100 rounded-full mb-4">
                <Newspaper className="h-12 w-12 text-slate-400" />
              </div>
              <p className="text-slate-600 text-lg mb-2">Aucune actualité trouvée</p>
              <p className="text-sm text-slate-500 mb-6">
                {news.length === 0 
                  ? "Commencez par créer votre première actualité"
                  : "Essayez de modifier vos filtres de recherche"}
              </p>
              {news.length === 0 && (
                <Button onClick={handleCreate} variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Créer une actualité
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          /* Vue en grille */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <Card
                key={item._id || item.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200"
              >
                <div className="relative h-48 bg-slate-100">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-blue-400"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-yellow-400"
                      onClick={() => handleToggleFeatured(item)}
                    >
                      {item.isFeatured ? <StarOff className="h-5 w-5" /> : <Star className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-red-400"
                      onClick={() => handleDelete(item._id || item.id || "")}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge className={getCategoryColor(item.category)}>
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </Badge>
                    {item.isFeatured && (
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Une
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {item.date}
                    </div>
                    {item.category === "Offre" && item.endDateOfOffre && (
                      <div className="flex items-center gap-1 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        Fin: {item.endDateOfOffre}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Vue en liste */
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Titre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Catégorie</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredNews.map((item) => (
                      <tr key={item._id || item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-16 h-12 rounded overflow-hidden bg-slate-100">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-900 line-clamp-2">
                            {item.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getCategoryColor(item.category)}>
                            {getCategoryIcon(item.category)}
                            {item.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar className="h-4 w-4" />
                            {item.date}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {item.isFeatured ? (
                            <Badge className="bg-yellow-500 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              À la une
                            </Badge>
                          ) : (
                            <Badge variant="outline">Standard</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-blue-100 hover:text-blue-700"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-yellow-100 hover:text-yellow-700"
                              onClick={() => handleToggleFeatured(item)}
                            >
                              {item.isFeatured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-red-100 hover:text-red-700"
                              onClick={() => handleDelete(item._id || item.id || "")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog pour créer/modifier */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {selectedItem ? (
                <>
                  <Edit className="h-6 w-6 text-blue-500" />
                  <span>Modifier l'actualité</span>
                </>
              ) : (
                <>
                  <Plus className="h-6 w-6 text-green-500" />
                  <span>Créer une nouvelle actualité</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image avec upload amélioré */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Image à la une <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-start gap-4">
                <div className="relative w-32 h-32 bg-muted rounded-lg overflow-hidden border-2 border-dashed">
                  {formData.image ? (
                    <>
                      <img 
                        src={formData.image || "/placeholder.svg"} 
                        alt="Aperçu" 
                        className="w-full h-full object-cover" 
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <FileImage className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById("image-upload")?.click()}
                    disabled={isUploading}
                    className="w-full"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choisir une image
                      </>
                    )}
                  </Button>
                  
                  {isUploading && uploadProgress > 0 && (
                    <div className="space-y-1">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-center">
                        {uploadProgress < 100 ? 'Compression et conversion...' : 'Terminé !'}
                      </p>
                    </div>
                  )}
                  
                  {formData.imageSize && formData.imageSize > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Format: {formData.imageFormat?.toUpperCase() || 'WebP'}</span>
                      <span>•</span>
                      <span>Taille: {formatImageSize(formData.imageSize)}</span>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Formats acceptés: JPG, PNG, WebP, GIF. Max 5 Mo.<br />
                    Les images sont automatiquement optimisées et converties en WebP.
                  </p>
                </div>
              </div>
            </div>

            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Titre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Offre spéciale printemps 2024"
                className="mt-1"
                required
              />
            </div>

            {/* Catégorie et Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Catégorie <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: NewsCategory) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(cat)}
                          {cat}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Date de publication <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="Ex: 15 Mars 2024"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {/* Date de fin d'offre (conditionnel) */}
            {formData.category === "Offre" && (
              <div className="space-y-2">
                <Label htmlFor="endDateOfOffre" className="text-sm font-medium">
                  Date de fin de l'offre
                </Label>
                <Input
                  id="endDateOfOffre"
                  value={formData.endDateOfOffre || ""}
                  onChange={(e) => setFormData({ ...formData, endDateOfOffre: e.target.value })}
                  placeholder="Ex: 30 Avril 2024"
                  className="mt-1"
                />
              </div>
            )}

            {/* Extrait */}
            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-sm font-medium">
                Extrait <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brève description qui apparaîtra dans la carte d'aperçu..."
                rows={3}
                className="mt-1"
                required
              />
            </div>

            {/* Contenu complet */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">
                Contenu complet (optionnel)
              </Label>
              <Textarea
                id="content"
                value={formData.content || ""}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Contenu détaillé de l'article..."
                rows={6}
                className="mt-1"
              />
            </div>

            {/* Article à la une */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
              <div className="space-y-0.5">
                <Label htmlFor="featured" className="text-base font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Mettre à la une
                </Label>
                <p className="text-sm text-muted-foreground">
                  Cet article apparaîtra en évidence sur la page d'accueil des actualités
                </p>
              </div>
              <Switch
                id="featured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              type="button" 
              onClick={handleSave} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              disabled={!formData.title.trim() || !formData.excerpt.trim() || !formData.image}
            >
              {selectedItem ? "Mettre à jour" : "Créer l'actualité"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'actualité sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}