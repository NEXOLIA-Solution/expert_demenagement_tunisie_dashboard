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
    Plus,
    Video,
    Youtube,
    Calendar,
    Clock,
    CheckCircle,
    Image as ImageIcon,
    Maximize2,
    Sparkles,
    ChevronRight,
    PlayCircle,
    ExternalLink,
    Film,
    ThumbsUp,
    Eye as ViewIcon
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import videoGal from "../../../public/sectionImage/videoGal.png";

type Video = {
    _id: string;
    title: string;
    description: string;
    youtubeLink: string;
    createdAt?: string;
    views?: number;
    likes?: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

// Fonction pour extraire l'ID YouTube d'un lien
const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Fonction pour obtenir la miniature YouTube
const getYoutubeThumbnail = (url: string) => {
    const videoId = getYoutubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
};

export default function GestionVideos() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
    const [isImageExpanded, setIsImageExpanded] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<Video>();

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_BASE}/video/api/all`);
            setVideos(data);
        } catch (error) {
            toast.error("Erreur lors du chargement des vidéos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const openCreateDialog = () => {
        setDialogMode("create");
        setSelectedVideo(null);
        reset({ title: "", description: "", youtubeLink: "" });
        setIsDialogOpen(true);
    };

    const openEditDialog = (video: Video) => {
        setDialogMode("edit");
        setSelectedVideo(video);
        reset(video);
        setIsDialogOpen(true);
    };

    const openViewDialog = (video: Video) => {
        setDialogMode("view");
        setSelectedVideo(video);
        reset(video);
        setIsDialogOpen(true);
    };

    const onSubmit = async (data: Video) => {
        try {
            if (dialogMode === "create") {
                await axios.post(`${API_BASE}/video/api/register`, data);
                toast.success("Vidéo créée avec succès");
            } else if (dialogMode === "edit" && selectedVideo) {
                const cleanData = {
                    title: data.title,
                    description: data.description,
                    youtubeLink: data.youtubeLink,
                };

                await axios.put(`${API_BASE}/video/api/${selectedVideo._id}`, cleanData);
                toast.success("Vidéo mise à jour");
            }
            setIsDialogOpen(false);
            fetchVideos();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Une erreur est survenue");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${API_BASE}/video/api/${id}`);
            toast.success("Vidéo supprimée");
            fetchVideos();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Date inconnue";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Statistiques
    const totalVideos = videos.length;
    const averageViews = videos.length > 0 
        ? Math.round(videos.reduce((acc, v) => acc + (v.views || 0), 0) / videos.length)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
            {/* Image Expansion Dialog */}
            <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
                <DialogContent className="max-w-5xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Aperçu de la section Galerie Vidéo
                        </DialogTitle>
                    </DialogHeader>
                    <div className="relative h-[70vh] w-full rounded-lg overflow-hidden border-2 border-slate-200">
                        <Image
                            src={videoGal}
                            alt="Section Galerie Vidéo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Bandeau décoratif */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"></div>

            <div className="container mx-auto px-4 py-8">
                {/* Fil d'Ariane */}
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <span>Dashboard</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-red-600 font-medium">Gestion des vidéos</span>
                </div>

                {/* En-tête */}
                <div className="flex justify-center items-center flex-wrap gap-3 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl shadow-lg">
                            <Video className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                                    Gestion des vidéos
                                </h1>
                                <Badge variant="secondary" className="bg-red-100 text-red-700">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Section active
                                </Badge>
                            </div>
                            <p className="text-slate-600">
                                Interface d'administration pour gérer la galerie vidéo YouTube
                            </p>
                        </div>
                    </div>
                    <Button 
                        onClick={openCreateDialog}
                        size="lg"
                        className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <Plus className="mr-2 h-5 w-5" /> Nouvelle vidéo
                    </Button>
                </div>

                {/* Section Image mise en valeur */}
                <Card className="mb-8 overflow-hidden border-2 border-red-100 hover:border-red-200 transition-all duration-300">
                    <CardContent className="p-0">
                        <div className="grid md:grid-cols-3 gap-0">
                            {/* Aperçu de l'image */}
                            <div className="md:col-span-2 relative h-[250px] md:h-[300px] group">
                                <Image
                                    src={videoGal}
                                    alt="Aperçu de la section Galerie Vidéo"
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
                            <div className="p-6 bg-gradient-to-br from-red-50 to-purple-50">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-red-500 rounded-lg">
                                        <Film className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Section Galerie Vidéo</h3>
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
                                        <Youtube className="h-5 w-5 text-red-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm">Plateforme</p>
                                            <p className="text-sm text-slate-600">YouTube intégré</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Video className="h-5 w-5 text-purple-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm">Total vidéos</p>
                                            <p className="text-2xl font-bold text-purple-600">{totalVideos}</p>
                                        </div>
                                    </div>

                                    {/* Badges des fonctionnalités */}
                                    <div className="pt-4 border-t border-red-200">
                                        <p className="text-xs text-slate-500 mb-2">Fonctionnalités</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="bg-white">Ajout</Badge>
                                            <Badge variant="outline" className="bg-white">Modification</Badge>
                                            <Badge variant="outline" className="bg-white">Suppression</Badge>
                                            <Badge variant="outline" className="bg-white">Lecture</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100 text-sm">Total vidéos</p>
                                    <p className="text-3xl font-bold mt-1">{totalVideos}</p>
                                </div>
                                <Video className="h-8 w-8 text-red-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Vues moyennes</p>
                                    <p className="text-3xl font-bold mt-1">{averageViews}</p>
                                </div>
                                <ViewIcon className="h-8 w-8 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Likes totaux</p>
                                    <p className="text-3xl font-bold mt-1">
                                        {videos.reduce((acc, v) => acc + (v.likes || 0), 0)}
                                    </p>
                                </div>
                                <ThumbsUp className="h-8 w-8 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Dernier ajout</p>
                                    <p className="text-lg font-bold mt-1">
                                        {videos.length > 0 ? formatDate(videos[0].createdAt) : "Aucun"}
                                    </p>
                                </div>
                                <Calendar className="h-8 w-8 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Grille des vidéos */}
                <Tabs defaultValue="grid" className="mb-6">
                    <TabsList>
                        <TabsTrigger value="grid">Vue en grille</TabsTrigger>
                        <TabsTrigger value="list">Vue liste</TabsTrigger>
                        <TabsTrigger value="stats">Statistiques</TabsTrigger>
                    </TabsList>

                    <TabsContent value="grid" className="mt-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                            </div>
                        ) : videos.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-16">
                                    <div className="p-4 bg-slate-100 rounded-full mb-4">
                                        <Video className="h-12 w-12 text-slate-400" />
                                    </div>
                                    <p className="text-slate-600 text-lg mb-2">Aucune vidéo trouvée</p>
                                    <p className="text-sm text-slate-500 mb-6">
                                        Commencez par ajouter votre première vidéo YouTube
                                    </p>
                                    <Button onClick={openCreateDialog} variant="outline">
                                        <Plus className="mr-2 h-4 w-4" /> Ajouter une vidéo
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.map((video, index) => {
                                    const thumbnail = getYoutubeThumbnail(video.youtubeLink);
                                    const videoId = getYoutubeVideoId(video.youtubeLink);
                                    
                                    return (
                                        <Card key={video._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200">
                                            <div className="relative h-48 bg-slate-100">
                                                {thumbnail ? (
                                                    <img 
                                                        src={thumbnail} 
                                                        alt={video.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-purple-100">
                                                        <Youtube className="h-12 w-12 text-red-400" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="text-white hover:text-red-500"
                                                        onClick={() => window.open(video.youtubeLink, '_blank')}
                                                    >
                                                        <PlayCircle className="h-12 w-12" />
                                                    </Button>
                                                </div>
                                                <Badge className="absolute top-2 right-2 bg-red-600">
                                                    #{index + 1}
                                                </Badge>
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{video.title}</h3>
                                                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{video.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Youtube className="h-4 w-4" />
                                                        <span>YouTube</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 hover:bg-blue-100 hover:text-blue-700"
                                                            onClick={() => openViewDialog(video)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 hover:bg-green-100 hover:text-green-700"
                                                            onClick={() => openEditDialog(video)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    className="h-8 w-8 hover:bg-red-100 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Êtes-vous sûr de vouloir supprimer "{video.title}" ? 
                                                                        Cette action est irréversible.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                    <AlertDialogAction 
                                                                        onClick={() => handleDelete(video._id)} 
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Supprimer
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="list" className="mt-6">
                        <Card className="border-slate-200 shadow-xl">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow>
                                                <TableHead className="w-16">#</TableHead>
                                                <TableHead>Miniature</TableHead>
                                                <TableHead>Titre</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Lien YouTube</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-16">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                                            <p className="text-slate-600">Chargement des vidéos...</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : videos.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-16">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="p-4 bg-slate-100 rounded-full">
                                                                <Video className="h-12 w-12 text-slate-400" />
                                                            </div>
                                                            <p className="text-slate-600 text-lg">Aucune vidéo trouvée</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                videos.map((video, index) => {
                                                    const thumbnail = getYoutubeThumbnail(video.youtubeLink);
                                                    
                                                    return (
                                                        <TableRow 
                                                            key={video._id}
                                                            className="hover:bg-slate-50 transition-colors duration-150 group"
                                                        >
                                                            <TableCell>
                                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-md">
                                                                    {index + 1}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="w-20 h-12 bg-slate-100 rounded overflow-hidden">
                                                                    {thumbnail ? (
                                                                        <img 
                                                                            src={thumbnail} 
                                                                            alt="" 
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center bg-red-100">
                                                                            <Youtube className="h-6 w-6 text-red-400" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="font-medium max-w-xs">
                                                                <div className="line-clamp-2">{video.title}</div>
                                                            </TableCell>
                                                            <TableCell className="max-w-sm">
                                                                <div className="line-clamp-2 text-slate-600">{video.description}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <a 
                                                                    href={video.youtubeLink} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="flex items-center gap-1 text-red-600 hover:underline"
                                                                >
                                                                    <Youtube className="h-4 w-4" />
                                                                    <span className="text-sm">Voir</span>
                                                                    <ExternalLink className="h-3 w-3" />
                                                                </a>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        onClick={() => openViewDialog(video)} 
                                                                        title="Voir"
                                                                        className="hover:bg-blue-100 hover:text-blue-700"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        onClick={() => openEditDialog(video)} 
                                                                        title="Modifier"
                                                                        className="hover:bg-green-100 hover:text-green-700"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
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
                                                                                    Êtes-vous sûr de vouloir supprimer "{video.title}" ? 
                                                                                    Cette action est irréversible.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                                <AlertDialogAction 
                                                                                    onClick={() => handleDelete(video._id)} 
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
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="stats" className="mt-6">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Statistiques de la galerie vidéo</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">Taux de remplissage</span>
                                            <span className="text-sm text-slate-600">{Math.min(100, (totalVideos / 10) * 100)}%</span>
                                        </div>
                                        <Progress value={Math.min(100, (totalVideos / 10) * 100)} className="h-2" />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-red-50 rounded-lg">
                                            <p className="text-sm text-red-600 mb-1">Vidéos avec miniatures</p>
                                            <p className="text-2xl font-bold text-red-700">
                                                {videos.filter(v => getYoutubeThumbnail(v.youtubeLink)).length}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <p className="text-sm text-purple-600 mb-1">Vidéos sans miniature</p>
                                            <p className="text-2xl font-bold text-purple-700">
                                                {videos.filter(v => !getYoutubeThumbnail(v.youtubeLink)).length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Dialogue de création/modification/visualisation */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            {dialogMode === "create" && (
                                <>
                                    <Plus className="h-6 w-6 text-red-500" />
                                    <span>Ajouter une nouvelle vidéo</span>
                                </>
                            )}
                            {dialogMode === "edit" && (
                                <>
                                    <Pencil className="h-6 w-6 text-green-500" />
                                    <span>Modifier la vidéo</span>
                                </>
                            )}
                            {dialogMode === "view" && (
                                <>
                                    <Eye className="h-6 w-6 text-blue-500" />
                                    <span>Détails de la vidéo</span>
                                </>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    {dialogMode === "view" && selectedVideo ? (
                        <div className="space-y-6">
                            {/* Miniature YouTube */}
                            {getYoutubeThumbnail(selectedVideo.youtubeLink) && (
                                <div className="relative h-48 rounded-lg overflow-hidden border border-slate-200">
                                    <img 
                                        src={getYoutubeThumbnail(selectedVideo.youtubeLink)!} 
                                        alt={selectedVideo.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:text-red-500"
                                            onClick={() => window.open(selectedVideo.youtubeLink, '_blank')}
                                        >
                                            <PlayCircle className="h-12 w-12" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="bg-gradient-to-r from-slate-50 to-red-50 p-4 rounded-lg border border-red-100">
                                <Label className="text-xs text-slate-500">Titre</Label>
                                <p className="text-lg font-medium mt-1">{selectedVideo.title}</p>
                            </div>

                            <div className="bg-gradient-to-r from-slate-50 to-purple-50 p-4 rounded-lg border border-purple-100">
                                <Label className="text-xs text-slate-500">Description</Label>
                                <p className="text-base mt-1 whitespace-pre-wrap">{selectedVideo.description}</p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                                <Label className="text-xs text-slate-500">Lien YouTube</Label>
                                <div className="flex items-center gap-2 mt-2">
                                    <Youtube className="h-5 w-5 text-red-600 flex-shrink-0" />
                                    <a 
                                        href={selectedVideo.youtubeLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline break-all flex-1"
                                    >
                                        {selectedVideo.youtubeLink}
                                    </a>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => window.open(selectedVideo.youtubeLink, '_blank')}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Fermer
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="title" className="text-sm font-medium">
                                    Titre <span className="text-red-500">*</span>
                                </Label>
                                <Input 
                                    id="title" 
                                    {...register("title", { required: "Le titre est requis" })} 
                                    className="mt-1 border-slate-200 focus:border-red-300 focus:ring-red-200"
                                    placeholder="Ex: Visite guidée du musée"
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Description <span className="text-red-500">*</span>
                                </Label>
                                <Textarea 
                                    id="description" 
                                    rows={4}
                                    {...register("description", { required: true })} 
                                    className="mt-1 border-slate-200 focus:border-red-300 focus:ring-red-200"
                                    placeholder="Décrivez le contenu de la vidéo..."
                                />
                            </div>

                            <div>
                                <Label htmlFor="youtubeLink" className="text-sm font-medium">
                                    Lien YouTube <span className="text-red-500">*</span>
                                </Label>
                                <Input 
                                    id="youtubeLink" 
                                    type="url" 
                                    {...register("youtubeLink", { 
                                        required: true, 
                                        pattern: { 
                                            value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/, 
                                            message: "Veuillez entrer un lien YouTube valide" 
                                        } 
                                    })} 
                                    className="mt-1 border-slate-200 focus:border-red-300 focus:ring-red-200"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                                {errors.youtubeLink && (
                                    <p className="text-sm text-red-600 mt-1">{errors.youtubeLink.message}</p>
                                )}
                                <p className="text-xs text-slate-500 mt-1">
                                    Ex: https://www.youtube.com/watch?v=123456 ou https://youtu.be/123456
                                </p>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Annuler
                                </Button>
                                <Button 
                                    type="submit"
                                    className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white"
                                >
                                    {dialogMode === "create" ? "Créer la vidéo" : "Mettre à jour"}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}