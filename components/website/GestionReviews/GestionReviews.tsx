"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
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
  CheckCircle, 
  XCircle,
  Star,
  MapPin,
  Mail,
  User,
  Calendar,
  MessageSquare,
  Filter,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
  Maximize2,
  Clock,
  TrendingUp,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import avies from "../../../public/sectionImage/avie.png";

type Review = {
  _id: string;
  userName: string;
  email: string;
  profileImage?: string;
  service: string;
  reviewText: string;
  rating: number;
  city: string;
  isValidated: boolean;
  createdAt: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function GestionReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "validated" | "pending">("all");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/review/api/all`);
      setReviews(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des avis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openViewDialog = (review: Review) => {
    setDialogMode("view");
    setSelectedReview(review);
    setIsDialogOpen(true);
  };

  const openEditDialog = (review: Review) => {
    setDialogMode("edit");
    setSelectedReview(review);
    setIsDialogOpen(true);
  };

  const handleValidateToggle = async (review: Review, newValue: boolean) => {
    try {
      await axios.put(`${API_BASE}/review/api/${review._id}`, { isValidated: newValue });
      toast.success(`Avis ${newValue ? "validé" : "invalidé"}`);
      fetchReviews();
    } catch (error) {
      toast.error("Erreur lors de la modification");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/review/api/${id}`);
      toast.success("Avis supprimé");
      fetchReviews();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Calcul des statistiques
  const validatedCount = reviews.filter(r => r.isValidated).length;
  const pendingCount = reviews.filter(r => !r.isValidated).length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const getFilteredReviews = () => {
    if (filterStatus === "validated") return reviews.filter(r => r.isValidated);
    if (filterStatus === "pending") return reviews.filter(r => !r.isValidated);
    return reviews;
  };

  const filteredReviews = getFilteredReviews();

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Image Expansion Dialog */}
      <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Aperçu de la section Avis Clients
            </DialogTitle>
          </DialogHeader>
          <div className="relative h-[70vh] w-full rounded-lg overflow-hidden border-2 border-slate-200">
            <Image
              src={avies}
              alt="Section Avis Clients"
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Bandeau décoratif */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-orange-600 font-medium">Gestion des avis</span>
        </div>

        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Gestion des avis clients
                </h1>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Section active
                </Badge>
              </div>
              <p className="text-slate-600">
                Interface d'administration pour gérer les avis et témoignages clients
              </p>
            </div>
          </div>
        </div>

        {/* Section Image mise en valeur */}
        <Card className="mb-8 overflow-hidden border-2 border-orange-100 hover:border-orange-200 transition-all duration-300">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-3 gap-0">
              {/* Aperçu de l'image */}
              <div className="md:col-span-2 relative h-[250px] md:h-[300px] group">
                <Image
                  src={avies}
                  alt="Aperçu de la section Avis Clients"
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
              <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Section Avis Clients</h3>
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
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Dernier avis</p>
                      <p className="text-sm text-slate-600">
                        {reviews.length > 0 ? formatDate(reviews[0].createdAt) : "Aucun avis"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Total avis</p>
                      <p className="text-2xl font-bold text-purple-600">{reviews.length}</p>
                    </div>
                  </div>

                  {/* Badges des fonctionnalités */}
                  <div className="pt-4 border-t border-orange-200">
                    <p className="text-xs text-slate-500 mb-2">Fonctionnalités</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-white">Validation</Badge>
                      <Badge variant="outline" className="bg-white">Modération</Badge>
                      <Badge variant="outline" className="bg-white">Suppression</Badge>
                      <Badge variant="outline" className="bg-white">Visualisation</Badge>
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
                  <p className="text-blue-100 text-sm">Total avis</p>
                  <p className="text-3xl font-bold mt-1">{reviews.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Avis validés</p>
                  <p className="text-3xl font-bold mt-1">{validatedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">En attente</p>
                  <p className="text-3xl font-bold mt-1">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Note moyenne</p>
                  <p className="text-3xl font-bold mt-1">{averageRating}/5</p>
                </div>
                <Award className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={filterStatus === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className={filterStatus === "all" ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              Tous
            </Button>
            <Button
              variant={filterStatus === "validated" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus("validated")}
              className={filterStatus === "validated" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              Validés
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
              className={filterStatus === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            >
              En attente
            </Button>
          </div>
          <Badge variant="outline" className="ml-auto">
            {filteredReviews.length} avis affichés
          </Badge>
        </div>

        {/* Tableau des avis */}
        <Card className="border-slate-200 shadow-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                          <p className="text-slate-600">Chargement des avis...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredReviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-slate-100 rounded-full">
                            <MessageSquare className="h-12 w-12 text-slate-400" />
                          </div>
                          <p className="text-slate-600 text-lg">Aucun avis trouvé</p>
                          <p className="text-sm text-slate-500">
                            {filterStatus !== "all" ? "Essayez de changer le filtre" : "Les avis apparaîtront ici"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReviews.map((review, index) => (
                      <TableRow 
                        key={review._id}
                        className="hover:bg-slate-50 transition-colors duration-150 group"
                      >
                        <TableCell>
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg text-sm font-medium shadow-md">
                            {index + 1}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {review.profileImage ? (
                              <img 
                                src={review.profileImage} 
                                alt="" 
                                className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center border-2 border-orange-200">
                                <span className="text-sm font-bold text-orange-700">
                                  {review.userName.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{review.userName}</p>
                              <p className="text-xs text-slate-500">{review.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {review.service}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className={`font-bold ${getRatingColor(review.rating)}`}>
                              {review.rating}
                            </span>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? "text-yellow-400 fill-yellow-400" 
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-slate-600">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{review.city}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">{formatDate(review.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={review.isValidated}
                              onCheckedChange={(checked) => handleValidateToggle(review, checked)}
                              className={review.isValidated ? "bg-green-500" : "bg-yellow-500"}
                            />
                            <Badge 
                              variant="outline"
                              className={
                                review.isValidated 
                                  ? "bg-green-50 text-green-700 border-green-200" 
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }
                            >
                              {review.isValidated ? "Validé" : "En attente"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openViewDialog(review)} 
                              title="Voir les détails"
                              className="hover:bg-blue-100 hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  title="Supprimer"
                                  className="hover:bg-red-100 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer l'avis de {review.userName} ? 
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(review._id)} 
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination simplifiée */}
        {filteredReviews.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
            <p>Affichage de 1 à {filteredReviews.length} sur {filteredReviews.length} avis</p>
          </div>
        )}
      </div>

      {/* Dialogue de visualisation/modification */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {dialogMode === "view" ? (
                <>
                  <Eye className="h-6 w-6 text-blue-500" />
                  <span>Détails de l'avis</span>
                </>
              ) : (
                <>
                  <Pencil className="h-6 w-6 text-green-500" />
                  <span>Modifier l'avis</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              {dialogMode === "view" ? (
                // Mode visualisation amélioré
                <div className="space-y-6">
                  {/* En-tête avec avatar */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-orange-50 rounded-lg border border-orange-100">
                    {selectedReview.profileImage ? (
                      <img 
                        src={selectedReview.profileImage} 
                        alt="" 
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                        {selectedReview.userName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-semibold">{selectedReview.userName}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{selectedReview.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{formatDate(selectedReview.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grille d'informations */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <Label className="text-xs text-slate-500">Service</Label>
                      <p className="font-medium flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-blue-50">
                          {selectedReview.service}
                        </Badge>
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <Label className="text-xs text-slate-500">Ville</Label>
                      <p className="font-medium flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {selectedReview.city}
                      </p>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <Label className="text-xs text-slate-500 mb-2 block">Note</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${
                              i < selectedReview.rating 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`font-bold text-lg ${getRatingColor(selectedReview.rating)}`}>
                        {selectedReview.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Avis */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <Label className="text-xs text-slate-500 mb-2 block">Avis</Label>
                    <p className="whitespace-pre-wrap bg-white p-4 rounded border border-slate-200">
                      {selectedReview.reviewText}
                    </p>
                  </div>

                  {/* Statut avec switch */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <Label className="text-xs text-slate-500 mb-2 block">Statut de validation</Label>
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={selectedReview.isValidated}
                        onCheckedChange={(checked) => {
                          handleValidateToggle(selectedReview, checked);
                          setIsDialogOpen(false);
                        }}
                        className={selectedReview.isValidated ? "bg-green-500" : "bg-yellow-500"}
                      />
                      <div className="flex items-center gap-2">
                        {selectedReview.isValidated ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-medium text-green-700">Avis validé</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-5 w-5 text-yellow-500" />
                            <span className="font-medium text-yellow-700">En attente de validation</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Fermer
                    </Button>
                  </div>
                </div>
              ) : (
                // Mode édition
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div className="bg-gradient-to-r from-slate-50 to-orange-50 p-4 rounded-lg">
                    <Label className="text-sm font-medium mb-2 block">Statut de validation</Label>
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={selectedReview.isValidated}
                        onCheckedChange={async (checked) => {
                          await handleValidateToggle(selectedReview, checked);
                          setIsDialogOpen(false);
                        }}
                        className={selectedReview.isValidated ? "bg-green-500" : "bg-yellow-500"}
                      />
                      <span className={selectedReview.isValidated ? "text-green-600" : "text-yellow-600"}>
                        {selectedReview.isValidated ? "Validé" : "En attente"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}