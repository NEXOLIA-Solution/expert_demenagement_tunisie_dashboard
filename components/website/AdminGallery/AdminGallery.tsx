"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Eye,
  Loader2,
  Image as ImageIcon,
  MapPin,
  Calendar,
  FolderOpen,
  ChevronRight,
  Sparkles,
  Maximize2,
  Download,
  Copy,
  CheckCircle,
  Clock,
  Filter,
  Grid3x3,
  List,
  Camera,
  Upload
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import imageGal from "../../../public/sectionImage/imageGal.png";

// Type pour une image de la galerie
interface GalleryImage {
  _id: string;
  src: string;
  alt: string;
  category: string;
  location: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

// Catégories
const categories = [
  "transport",
  "emballage",
  "stockage",
  "Service d’emballage",
  "Montage/Démontage",
  "Transport des meubles",
  "Transport des électroménagers",
  "Transport du climatiseur",
  "Garde meubles",
  "Déménagement d’appartement",
  "Déménagement industriel",
  "Déménagement Villa",
  "Déménagement Entreprise",
  "Déménagement Ministère"
];

// État du formulaire (création / édition)
interface FormData {
  _id?: string;
  src: string;
  alt: string;
  category: string;
  location: string;
  date: string;
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [formData, setFormData] = useState<FormData>({
    src: "",
    alt: "",
    category: "",
    location: "",
    date: "",
  });
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Récupérer toutes les images au chargement
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/gallery/api`);
      setImages(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des images");
      toast.error("Erreur lors du chargement des images");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gestion de l'upload d'image (conversion en base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille du fichier (max 5 Mo)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, src: reader.result as string }));
      setUploading(false);
      toast.success("Image chargée avec succès");
    };
    reader.onerror = () => {
      toast.error("Erreur lors de la lecture du fichier");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Soumission du formulaire (création ou modification)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.src || !formData.alt || !formData.category || !formData.location || !formData.date) {
      toast.error("Tous les champs sont requis");
      return;
    }

    setLoading(true);
    try {
      if (modalMode === "create") {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/gallery/api`, formData);
        toast.success("Image ajoutée avec succès");
      } else if (modalMode === "edit" && formData._id) {
        const { _id, ...dataWithoutId } = formData;
        await axios.put(`${process.env.NEXT_PUBLIC_API_BASE}/gallery/api/${formData._id}`, dataWithoutId);
        toast.success("Image mise à jour avec succès");
      }

      fetchImages();
      closeModal();
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Suppression
  const handleDelete = async (id: string) => {
    setDeleteId(id);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE}/gallery/api/${id}`);
      toast.success("Image supprimée avec succès");
      fetchImages();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  // Ouvrir le modal en mode création
  const openCreateModal = () => {
    setFormData({ src: "", alt: "", category: "", location: "", date: "" });
    setModalMode("create");
    setShowModal(true);
  };

  // Ouvrir le modal en mode édition
  const openEditModal = (image: GalleryImage) => {
    setFormData({
      _id: image._id,
      src: image.src,
      alt: image.alt,
      category: image.category,
      location: image.location,
      date: image.date,
    });
    setModalMode("edit");
    setShowModal(true);
  };

  // Ouvrir le modal en mode visualisation
  const openViewModal = (image: GalleryImage) => {
    setFormData({
      _id: image._id,
      src: image.src,
      alt: image.alt,
      category: image.category,
      location: image.location,
      date: image.date,
    });
    setModalMode("view");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ src: "", alt: "", category: "", location: "", date: "" });
    setError("");
  };

  // Filtrer les images par catégorie
  const filteredImages = selectedCategory === "all"
    ? images
    : images.filter(img => img.category === selectedCategory);

  // Statistiques
  const totalImages = images.length;
  const uniqueCategories = new Set(images.map(img => img.category)).size;
  const lastAdded = images.length > 0
    ? new Date(images[0].createdAt || "").toLocaleDateString('fr-FR')
    : "Aucune";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date inconnue";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      {/* Image Expansion Dialog */}
      <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
        <DialogContent className="max-w-5xl w-[95%] mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Aperçu de la section Galerie d'images
            </DialogTitle>
          </DialogHeader>
          <div className="relative h-[70vh] w-full rounded-lg overflow-hidden border-2 border-slate-200">
            <Image
              src={imageGal}
              alt="Section Galerie d'images"
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Bandeau décoratif */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-green-600 font-medium">Gestion de la galerie</span>
        </div>

        {/* En-tête */}
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-3 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-lg">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Gestion de la galerie
                </h1>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Section active
                </Badge>
              </div>
              <p className="text-slate-600">
                Interface d'administration pour gérer les images de la galerie
              </p>
            </div>
          </div>
          <Button 
            onClick={openCreateModal}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-5 w-5" /> Ajouter une image
          </Button>
        </div>

        {/* Section Image mise en valeur */}
        <Card className="mb-8 overflow-hidden border-2 border-green-100 hover:border-green-200 transition-all duration-300">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-3 gap-0">
              {/* Aperçu de l'image */}
              <div className="md:col-span-2 relative h-[250px] md:h-[300px] group">
                <Image
                  src={imageGal}
                  alt="Aperçu de la section Galerie"
                  fill
                  className="object-cover"
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
              <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <ImageIcon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Section Galerie</h3>
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
                    <FolderOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Catégories</p>
                      <p className="text-sm text-slate-600">{uniqueCategories} catégories</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ImageIcon className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Total images</p>
                      <p className="text-2xl font-bold text-purple-600">{totalImages}</p>
                    </div>
                  </div>

                  {/* Badges des fonctionnalités */}
                  <div className="pt-4 border-t border-green-200">
                    <p className="text-xs text-slate-500 mb-2">Fonctionnalités</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-white">Upload</Badge>
                      <Badge variant="outline" className="bg-white">Catégorisation</Badge>
                      <Badge variant="outline" className="bg-white">Filtrage</Badge>
                      <Badge variant="outline" className="bg-white">Prévisualisation</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total images</p>
                  <p className="text-3xl font-bold mt-1">{totalImages}</p>
                </div>
                <ImageIcon className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Catégories</p>
                  <p className="text-3xl font-bold mt-1">{uniqueCategories}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Dernier ajout</p>
                  <p className="text-lg font-bold mt-1">{lastAdded}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Espace utilisé</p>
                  <p className="text-3xl font-bold mt-1">
                    {Math.round(totalImages * 0.5)} Mo
                  </p>
                </div>
                <Upload className="h-8 w-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et contrôles */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4" style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                <Grid3x3 className="h-4 w-4 mr-2" />
                Grille
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                <List className="h-4 w-4 mr-2" />
                Liste
              </Button>
            </div>
          </div>

          <Badge variant="outline" className="px-3 py-1">
            {filteredImages.length} image(s) affichée(s)
          </Badge>
        </div>

        {/* Contenu principal */}
        {loading && !images.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              <p className="text-slate-600">Chargement des images...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        ) : filteredImages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-slate-100 rounded-full mb-4">
                <ImageIcon className="h-12 w-12 text-slate-400" />
              </div>
              <p className="text-slate-600 text-lg mb-2">Aucune image trouvée</p>
              <p className="text-sm text-slate-500 mb-6">
                {selectedCategory !== "all" 
                  ? "Aucune image dans cette catégorie" 
                  : "Commencez par ajouter votre première image"}
              </p>
              <Button onClick={openCreateModal} variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Ajouter une image
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          // Vue en grille avec icônes TOUJOURS VISIBLES
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <Card
                key={image._id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200"
              >
                <div className="relative h-48 bg-slate-100">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Badge catégorie en haut à gauche */}
                  <Badge className="absolute top-2 left-2 bg-green-600 z-10">
                    {image.category}
                  </Badge>
                  {/* Boutons d'action TOUJOURS VISIBLES (plus de hover) */}
                  <div className="absolute bottom-2 right-2 flex gap-1 bg-black/60 rounded-lg p-1 backdrop-blur-sm z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white hover:text-green-400"
                      onClick={() => openViewModal(image)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white hover:text-blue-400"
                      onClick={() => openEditModal(image)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/20 hover:bg-white/40 text-white hover:text-red-400"
                      onClick={() => {
                        if (window.confirm("Voulez-vous vraiment supprimer cette image ?")) {
                          handleDelete(image._id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{image.alt}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{image.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>{image.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Vue en liste
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Titre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Catégorie</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Lieu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredImages.map((image) => (
                      <tr key={image._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-16 h-12 rounded overflow-hidden bg-slate-100">
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-900 line-clamp-2">
                            {image.alt}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {image.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <MapPin className="h-4 w-4" />
                            {image.location}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar className="h-4 w-4" />
                            {image.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-blue-100 hover:text-blue-700"
                              onClick={() => openViewModal(image)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-green-100 hover:text-green-700"
                              onClick={() => openEditModal(image)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-red-100 hover:text-red-700"
                              onClick={() => {
                                if (window.confirm("Voulez-vous vraiment supprimer cette image ?")) {
                                  handleDelete(image._id);
                                }
                              }}
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

      {/* Modal (création, édition, vue) - CENTRÉ AVEC SCROLL VERTICAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-2xl w-[95%] mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {modalMode === "create" && (
                <>
                  <Plus className="h-6 w-6 text-green-500" />
                  <span>Ajouter une nouvelle image</span>
                </>
              )}
              {modalMode === "edit" && (
                <>
                  <Pencil className="h-6 w-6 text-blue-500" />
                  <span>Modifier l'image</span>
                </>
              )}
              {modalMode === "view" && (
                <>
                  <Eye className="h-6 w-6 text-purple-500" />
                  <span>Détails de l'image</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {modalMode === "view" ? (
            <div className="space-y-6 overflow-x-auto">
              <div className="relative h-80 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={formData.src}
                  alt={formData.alt}
                  className="w-full h-full object-contain bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <Label className="text-xs text-slate-500">Titre</Label>
                  <p className="text-lg font-medium mt-1">{formData.alt}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <Label className="text-xs text-slate-500">Catégorie</Label>
                  <p className="text-lg font-medium mt-1">
                    <Badge variant="outline" className="bg-green-50">
                      {formData.category}
                    </Badge>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <Label className="text-xs text-slate-500">Lieu</Label>
                  <p className="text-lg font-medium mt-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {formData.location}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <Label className="text-xs text-slate-500">Date</Label>
                  <p className="text-lg font-medium mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {formData.date}
                  </p>
                </div>
              </div>

              
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 overflow-x-auto">
              {/* Upload d'image */}
              <div>
                <Label htmlFor="image" className="text-sm font-medium mb-2 block">
                  Image <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-4">
                  {formData.src && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                      <img
                        src={formData.src}
                        alt="Prévisualisation"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                    {uploading && (
                      <div className="flex items-center mt-2 text-green-600">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Conversion en cours...
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Formats acceptés : jpg, jpeg, png, gif, webp (max 5 Mo)
                </p>
              </div>

              {/* Texte alternatif */}
              <div>
                <Label htmlFor="alt" className="text-sm font-medium">
                  Texte alternatif (alt) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="alt"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  placeholder="Description de l'image"
                  className="mt-1"
                  required
                />
              </div>

              {/* Catégorie */}
              <div>
                <Label htmlFor="category" className="text-sm font-medium">
                  Catégorie <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lieu */}
              <div>
                <Label htmlFor="location" className="text-sm font-medium">
                  Lieu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Paris, France"
                  className="mt-1"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date" className="text-sm font-medium">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="Ex: Mars 2024"
                  className="mt-1"
                  required
                />
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {modalMode === "create" ? "Ajouter" : "Mettre à jour"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}