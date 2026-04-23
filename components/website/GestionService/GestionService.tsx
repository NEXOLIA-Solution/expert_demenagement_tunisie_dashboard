"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Plus, 
  X,
  Image as ImageIcon,
  Tag,
  Sparkles,
  ChevronRight,
  Maximize2,
  CheckCircle,
  Clock,
  Settings,
  Grid3x3,
  List,
  Search,
  Filter,
  Package,
  Wrench,
  Truck,
  Home,
  Briefcase,
  Star
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import service from "../../../public/sectionImage/service.png";

type Service = {
  _id: string;
  title: string;
  description: string;
  images: string[];
  keywords: string[];
  createdAt?: string;
  updatedAt?: string;
};

type ServiceFormData = {
  title: string;
  description: string;
  images: { value: string }[];
  keywords: { value: string }[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// Icônes par catégorie de service (basé sur les mots-clés)
const getServiceIcon = (title: string) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("déménagement")) return <Truck className="h-4 w-4" />;
  if (titleLower.includes("emballage")) return <Package className="h-4 w-4" />;
  if (titleLower.includes("montage") || titleLower.includes("démontage")) return <Wrench className="h-4 w-4" />;
  if (titleLower.includes("garde") || titleLower.includes("stockage")) return <Home className="h-4 w-4" />;
  if (titleLower.includes("entreprise") || titleLower.includes("industriel")) return <Briefcase className="h-4 w-4" />;
  return <Settings className="h-4 w-4" />;
};

export default function GestionServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormData>({
    defaultValues: {
      title: "",
      description: "",
      images: [{ value: "" }],
      keywords: [{ value: "" }],
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  const { fields: keywordFields, append: appendKeyword, remove: removeKeyword } = useFieldArray({
    control,
    name: "keywords",
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/service/api/all`);
      setServices(data);
      setFilteredServices(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filtrage des services
  useEffect(() => {
    let filtered = [...services];
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.keywords.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const openCreateDialog = () => {
    setDialogMode("create");
    setSelectedService(null);
    reset({
      title: "",
      description: "",
      images: [{ value: "" }],
      keywords: [{ value: "" }],
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setDialogMode("edit");
    setSelectedService(service);
    reset({
      title: service.title,
      description: service.description,
      images: service.images.map((url) => ({ value: url })),
      keywords: service.keywords.map((kw) => ({ value: kw })),
    });
    setIsDialogOpen(true);
  };

  const openViewDialog = (service: Service) => {
    setDialogMode("view");
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ServiceFormData) => {
    // Transformer les tableaux d'objets en tableaux de chaînes
    const payload = {
      title: data.title,
      description: data.description,
      images: data.images.map((img) => img.value).filter((url) => url.trim() !== ""),
      keywords: data.keywords.map((kw) => kw.value).filter((kw) => kw.trim() !== ""),
    };

    // Validation : au moins une image
    if (payload.images.length === 0) {
      toast.error("Ajoutez au moins une image");
      return;
    }

    try {
      if (dialogMode === "create") {
        await axios.post(`${API_BASE}/service/api/register`, payload);
        toast.success("Service créé avec succès");
      } else if (dialogMode === "edit" && selectedService) {
        await axios.put(`${API_BASE}/service/api/${selectedService._id}`, payload);
        toast.success("Service mis à jour");
      }
      setIsDialogOpen(false);
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/service/api/${id}`);
      toast.success("Service supprimé");
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  // Statistiques
  const totalServices = services.length;
  const totalKeywords = services.reduce((acc, s) => acc + s.keywords.length, 0);
  const totalImages = services.reduce((acc, s) => acc + s.images.length, 0);
  const lastUpdated = services.length > 0 
    ? new Date(services[0].createdAt || "").toLocaleDateString('fr-FR')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Image Expansion Dialog */}
      <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Aperçu de la section Services
            </DialogTitle>
          </DialogHeader>
          <div className="relative h-[70vh] w-full rounded-lg overflow-hidden border-2 border-slate-200">
            <Image
              src={service}
              alt="Section Services"
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Bandeau décoratif */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-purple-600 font-medium">Gestion des services</span>
        </div>

        {/* En-tête */}
<div className="flex flex-wrap items-center justify-center md:justify-between gap-3 mb-8">          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Gestion des services
                </h1>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Section active
                </Badge>
              </div>
              <p className="text-slate-600">
                Interface d'administration pour gérer les services proposés
              </p>
            </div>
          </div>
          <Button 
            onClick={openCreateDialog}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-5 w-5" /> Nouveau service
          </Button>
        </div>

        {/* Section Image mise en valeur */}
        <Card className="mb-8 overflow-hidden border-2 border-purple-100 hover:border-purple-200 transition-all duration-300">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-3 gap-0">
              {/* Aperçu de l'image */}
              <div className="md:col-span-2 relative h-[250px] md:h-[300px] group">
                <Image
                  src={service}
                  alt="Aperçu de la section Services"
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
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Section Services</h3>
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
                    <Tag className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Mots-clés</p>
                      <p className="text-sm text-slate-600">{totalKeywords} au total</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ImageIcon className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Images</p>
                      <p className="text-sm text-slate-600">{totalImages} images</p>
                    </div>
                  </div>

                  {/* Badges des fonctionnalités */}
                  <div className="pt-4 border-t border-purple-200">
                    <p className="text-xs text-slate-500 mb-2">Fonctionnalités</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-white">CRUD complet</Badge>
                      <Badge variant="outline" className="bg-white">Images multiples</Badge>
                      <Badge variant="outline" className="bg-white">Mots-clés</Badge>
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
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total services</p>
                  <p className="text-3xl font-bold mt-1">{totalServices}</p>
                </div>
                <Package className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Mots-clés</p>
                  <p className="text-3xl font-bold mt-1">{totalKeywords}</p>
                </div>
                <Tag className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Images</p>
                  <p className="text-3xl font-bold mt-1">{totalImages}</p>
                </div>
                <ImageIcon className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Dernière mise à jour</p>
                  <p className="text-lg font-bold mt-1">{lastUpdated}</p>
                </div>
                <Clock className="h-8 w-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et contrôles */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Barre de recherche */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Sélecteur de vue */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-purple-500 hover:bg-purple-600" : ""}
              >
                <Grid3x3 className="h-4 w-4 mr-2" />
                Grille
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-purple-500 hover:bg-purple-600" : ""}
              >
                <List className="h-4 w-4 mr-2" />
                Liste
              </Button>
            </div>
          </div>

          <Badge variant="outline" className="px-3 py-1">
            {filteredServices.length} service(s) trouvé(s)
          </Badge>
        </div>

        {/* Contenu principal */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-slate-600">Chargement des services...</p>
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-slate-100 rounded-full mb-4">
                <Package className="h-12 w-12 text-slate-400" />
              </div>
              <p className="text-slate-600 text-lg mb-2">Aucun service trouvé</p>
              <p className="text-sm text-slate-500 mb-6">
                {services.length === 0 
                  ? "Commencez par créer votre premier service"
                  : "Aucun service ne correspond à votre recherche"}
              </p>
              {services.length === 0 && (
                <Button onClick={openCreateDialog} variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Créer un service
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          /* Vue en grille */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card
                key={service._id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200"
              >
                <div className="relative h-48 bg-slate-100">
                  {service.images && service.images.length > 0 ? (
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                      <ImageIcon className="h-12 w-12 text-purple-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-purple-400"
                      onClick={() => openViewDialog(service)}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-blue-400"
                      onClick={() => openEditDialog(service)}
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-red-400"
                      onClick={() => {
                        if (window.confirm("Voulez-vous vraiment supprimer ce service ?")) {
                          handleDelete(service._id);
                        }
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <Badge className="absolute top-2 left-2 bg-purple-600">
                    {service.images.length} image(s)
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{service.title}</h3>
                    <div className="p-1 bg-purple-100 rounded-full">
                      {getServiceIcon(service.title)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{service.description}</p>
                  {service.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {service.keywords.slice(0, 3).map((kw, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                      {service.keywords.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{service.keywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="text-xs text-slate-500 mt-2">
                    {formatDate(service.createdAt)}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Images</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mots-clés</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredServices.map((service, index) => (
                      <tr key={service._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-16 h-12 rounded overflow-hidden bg-slate-100">
                            {service.images && service.images.length > 0 ? (
                              <img
                                src={service.images[0]}
                                alt={service.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-purple-100">
                                <ImageIcon className="h-6 w-6 text-purple-400" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-purple-100 rounded-full">
                              {getServiceIcon(service.title)}
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {service.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600 line-clamp-2 max-w-xs">
                            {service.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-purple-50">
                            {service.images.length} image(s)
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {service.keywords.slice(0, 2).map((kw, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {kw}
                              </Badge>
                            ))}
                            {service.keywords.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{service.keywords.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">
                            {formatDate(service.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-purple-100 hover:text-purple-700"
                              onClick={() => openViewDialog(service)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-blue-100 hover:text-blue-700"
                              onClick={() => openEditDialog(service)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-red-100 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer le service "{service.title}" ? 
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(service._id)} 
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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

      {/* Dialogue */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {dialogMode === "create" && (
                <>
                  <Plus className="h-6 w-6 text-green-500" />
                  <span>Créer un nouveau service</span>
                </>
              )}
              {dialogMode === "edit" && (
                <>
                  <Pencil className="h-6 w-6 text-blue-500" />
                  <span>Modifier le service</span>
                </>
              )}
              {dialogMode === "view" && (
                <>
                  <Eye className="h-6 w-6 text-purple-500" />
                  <span>Détails du service</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {dialogMode === "view" && selectedService ? (
            <div className="space-y-6">
              {/* Images */}
              <div>
                <Label className="text-sm text-slate-500 mb-2 block">Images</Label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedService.images.map((url, idx) => (
                    <div key={idx} className="relative h-32 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={url}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Titre */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                <Label className="text-xs text-slate-500">Titre</Label>
                <p className="text-lg font-medium mt-1">{selectedService.title}</p>
              </div>

              {/* Description */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <Label className="text-xs text-slate-500">Description</Label>
                <p className="text-base mt-1 whitespace-pre-wrap">{selectedService.description}</p>
              </div>

              {/* Mots-clés */}
              {selectedService.keywords.length > 0 && (
                <div>
                  <Label className="text-xs text-slate-500 mb-2 block">Mots-clés</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.keywords.map((kw, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        <Tag className="h-3 w-3 mr-1" />
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Titre */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  Titre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  {...register("title", { required: "Le titre est requis" })}
                  className="mt-1"
                  placeholder="Ex: Service de déménagement professionnel"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  {...register("description", { required: true })}
                  className="mt-1"
                  placeholder="Description détaillée du service..."
                />
              </div>

              {/* Images (tableau dynamique) */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Images (URLs) <span className="text-red-500">*</span>
                </Label>
                {imageFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="https://exemple.com/image.jpg"
                      {...register(`images.${index}.value`, { 
                        required: index === 0 ? "Au moins une image est requise" : false 
                      })}
                      className="flex-1"
                    />
                    {imageFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImage(index)}
                        className="hover:bg-red-100 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => appendImage({ value: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Ajouter une image
                </Button>
              </div>

              {/* Mots-clés (tableau dynamique) */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Mots-clés
                </Label>
                {keywordFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="ex: déménagement, meubles, ..."
                      {...register(`keywords.${index}.value`)}
                      className="flex-1"
                    />
                    {keywordFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeKeyword(index)}
                        className="hover:bg-red-100 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => appendKeyword({ value: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Ajouter un mot-clé
                </Button>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {dialogMode === "create" ? "Créer le service" : "Mettre à jour"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}