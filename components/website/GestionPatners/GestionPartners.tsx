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
    Building2,
    Calendar,
    Quote,
    Image as ImageIcon,
    Sparkles,
    ChevronRight,
    Maximize2,
    CheckCircle,
    Clock,
    Users,
    Briefcase,
    Star,
    MapPin,
    Link as LinkIcon,
    Globe,
    Award,
    TrendingUp
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
import partner from "../../../public/sectionImage/partner.png";

// Type Partenaire
type Partner = {
    _id: string;
    name: string;
    sector: string;
    description: string;
    logo: string;
    year: string;
    testimonial: string;
    bgGradient: string;
    createdAt?: string;
    updatedAt?: string;
};

// URL de base de l'API
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// Liste des secteurs d'activité prédéfinis
const sectors = [
    "Transport",
    "Logistique",
    "Déménagement",
    "Immobilier",
    "Banque/Assurance",
    "Construction",
    "Industrie",
    "Commerce",
    "Services",
    "Technologie",
    "Autre"
];

// Gradients prédéfinis
const gradients = [
    "from-blue-500/10 to-indigo-500/10",
    "from-green-500/10 to-emerald-500/10",
    "from-purple-500/10 to-pink-500/10",
    "from-red-500/10 to-orange-500/10",
    "from-yellow-500/10 to-amber-500/10",
    "from-teal-500/10 to-cyan-500/10",
    "from-gray-500/10 to-slate-500/10",
];

export default function GestionPartners() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sectorFilter, setSectorFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Partner>();

    // Charger la liste des partenaires
    const fetchPartners = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_BASE}/partner/api/all`);
            setPartners(data);
            setFilteredPartners(data);
        } catch (error) {
            toast.error("Erreur lors du chargement des partenaires");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    // Filtrage des partenaires
    useEffect(() => {
        let filtered = [...partners];

        if (searchTerm) {
            filtered = filtered.filter(
                (partner) =>
                    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    partner.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    partner.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sectorFilter !== "all") {
            filtered = filtered.filter((partner) => partner.sector === sectorFilter);
        }

        setFilteredPartners(filtered);
    }, [searchTerm, sectorFilter, partners]);

    // Ouvrir le dialogue en mode création
    const openCreateDialog = () => {
        setDialogMode("create");
        setSelectedPartner(null);
        reset({
            name: "",
            sector: "",
            description: "",
            logo: "",
            year: new Date().getFullYear().toString(),
            testimonial: "",
            bgGradient: "from-blue-500/10 to-indigo-500/10",
        });
        setIsDialogOpen(true);
    };

    // Ouvrir le dialogue en mode édition
    const openEditDialog = (partner: Partner) => {
        setDialogMode("edit");
        setSelectedPartner(partner);
        reset(partner);
        setIsDialogOpen(true);
    };

    // Ouvrir le dialogue en mode visualisation
    const openViewDialog = (partner: Partner) => {
        setDialogMode("view");
        setSelectedPartner(partner);
        reset(partner);
        setIsDialogOpen(true);
    };

    // Soumission du formulaire
    const onSubmit = async (data: Partner) => {
        try {
            if (dialogMode === "create") {
                await axios.post(`${API_BASE}/partner/api/register`, data);
                toast.success("Partenaire créé avec succès");
            }
            else if (dialogMode === "edit" && selectedPartner) {
                const cleanData = {
                    name: data.name,
                    sector: data.sector,
                    description: data.description,
                    logo: data.logo,
                    year: data.year,
                    testimonial: data.testimonial,
                    bgGradient: data.bgGradient,
                };

                await axios.put(
                    `${API_BASE}/partner/api/${selectedPartner._id}`,
                    cleanData
                );

                toast.success("Partenaire mis à jour");
            }

            setIsDialogOpen(false);
            fetchPartners();
        } catch (error: any) {
            console.log("Erreur complète :", error.response?.data);
            toast.error(error.response?.data?.message || "Une erreur est survenue");
        }
    };

    // Supprimer un partenaire
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${API_BASE}/partner/api/${id}`);
            toast.success("Partenaire supprimé");
            fetchPartners();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    // Statistiques
    const totalPartners = partners.length;
    const uniqueSectors = new Set(partners.map(p => p.sector)).size;
    const oldestYear = partners.length > 0
        ? Math.min(...partners.map(p => parseInt(p.year)))
        : new Date().getFullYear();
    const newestYear = partners.length > 0
        ? Math.max(...partners.map(p => parseInt(p.year)))
        : new Date().getFullYear();

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Date inconnue";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
            {/* Image Expansion Dialog */}
            <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
                <DialogContent className="max-w-5xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Aperçu de la section Partenaires
                        </DialogTitle>
                    </DialogHeader>
                    <div className="relative h-[70vh] w-full rounded-lg overflow-hidden border-2 border-slate-200">
                        <Image
                            src={partner}
                            alt="Section Partenaires"
                            fill
                            className="object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Bandeau décoratif */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500"></div>

            <div className="container mx-auto px-4 py-8">
                {/* Fil d'Ariane */}
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <span>Dashboard</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-amber-600 font-medium">Gestion des partenaires</span>
                </div>

                {/* En-tête */}
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-3 mb-8">                    <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                        <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                                Gestion des partenaires
                            </h1>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Section active
                            </Badge>
                        </div>
                        <p className="text-slate-600">
                            Interface d'administration pour gérer les partenaires et témoignages
                        </p>
                    </div>
                </div>
                    <Button
                        onClick={openCreateDialog}
                        size="lg"
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <Plus className="mr-2 h-5 w-5" /> Nouveau partenaire
                    </Button>
                </div>

                {/* Section Image mise en valeur */}
                <Card className="mb-8 overflow-hidden border-2 border-amber-100 hover:border-amber-200 transition-all duration-300">
                    <CardContent className="p-0">
                        <div className="grid md:grid-cols-3 gap-0">
                            {/* Aperçu de l'image */}
                            <div className="md:col-span-2 relative h-[250px] md:h-[300px] group">
                                <Image
                                    src={partner}
                                    alt="Aperçu de la section Partenaires"
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
                            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-amber-500 rounded-lg">
                                        <Building2 className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Section Partenaires</h3>
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
                                        <Briefcase className="h-5 w-5 text-blue-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm">Secteurs</p>
                                            <p className="text-sm text-slate-600">{uniqueSectors} secteurs</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Award className="h-5 w-5 text-purple-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm">Partenaires</p>
                                            <p className="text-2xl font-bold text-purple-600">{totalPartners}</p>
                                        </div>
                                    </div>

                                    {/* Badges des fonctionnalités */}
                                    <div className="pt-4 border-t border-amber-200">
                                        <p className="text-xs text-slate-500 mb-2">Fonctionnalités</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="bg-white">CRUD complet</Badge>
                                            <Badge variant="outline" className="bg-white">Témoignages</Badge>
                                            <Badge variant="outline" className="bg-white">Logos</Badge>
                                            <Badge variant="outline" className="bg-white">Gradients</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-amber-100 text-sm">Total partenaires</p>
                                    <p className="text-3xl font-bold mt-1">{totalPartners}</p>
                                </div>
                                <Building2 className="h-8 w-8 text-amber-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Secteurs</p>
                                    <p className="text-3xl font-bold mt-1">{uniqueSectors}</p>
                                </div>
                                <Briefcase className="h-8 w-8 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Partenariat depuis</p>
                                    <p className="text-lg font-bold mt-1">{oldestYear} - {newestYear}</p>
                                </div>
                                <Calendar className="h-8 w-8 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Dernier ajout</p>
                                    <p className="text-lg font-bold mt-1">
                                        {partners.length > 0 ? formatDate(partners[0].createdAt) : "Aucun"}
                                    </p>
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
                            <input
                                type="text"
                                placeholder="Rechercher un partenaire..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>

                        {/* Filtre par secteur */}
                        <Select value={sectorFilter} onValueChange={setSectorFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Tous secteurs" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous secteurs</SelectItem>
                                {sectors.map((sector) => (
                                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sélecteur de vue */}
                        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className={viewMode === "grid" ? "bg-amber-500 hover:bg-amber-600" : ""}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                                        <div className="bg-current rounded-sm"></div>
                                        <div className="bg-current rounded-sm"></div>
                                        <div className="bg-current rounded-sm"></div>
                                        <div className="bg-current rounded-sm"></div>
                                    </div>
                                    Grille
                                </div>
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className={viewMode === "list" ? "bg-amber-500 hover:bg-amber-600" : ""}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 flex flex-col gap-0.5">
                                        <div className="h-1 bg-current rounded-sm"></div>
                                        <div className="h-1 bg-current rounded-sm"></div>
                                        <div className="h-1 bg-current rounded-sm"></div>
                                    </div>
                                    Liste
                                </div>
                            </Button>
                        </div>
                    </div>

                    <Badge variant="outline" className="px-3 py-1">
                        {filteredPartners.length} partenaire(s) trouvé(s)
                    </Badge>
                </div>

                {/* Contenu principal */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                            <p className="text-slate-600">Chargement des partenaires...</p>
                        </div>
                    </div>
                ) : filteredPartners.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="p-4 bg-slate-100 rounded-full mb-4">
                                <Users className="h-12 w-12 text-slate-400" />
                            </div>
                            <p className="text-slate-600 text-lg mb-2">Aucun partenaire trouvé</p>
                            <p className="text-sm text-slate-500 mb-6">
                                {partners.length === 0
                                    ? "Commencez par ajouter votre premier partenaire"
                                    : "Aucun partenaire ne correspond à votre recherche"}
                            </p>
                            {partners.length === 0 && (
                                <Button onClick={openCreateDialog} variant="outline">
                                    <Plus className="mr-2 h-4 w-4" /> Ajouter un partenaire
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : viewMode === "grid" ? (
                    /* Vue en grille */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPartners.map((partner) => (
                            <Card
                                key={partner._id}
                                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-amber-200"
                            >
                                <div className={`relative h-32 bg-gradient-to-r ${partner.bgGradient} p-6 flex items-center justify-center`}>
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="h-16 w-auto object-contain max-w-full"
                                    />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:text-amber-400"
                                            onClick={() => openViewDialog(partner)}
                                        >
                                            <Eye className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:text-blue-400"
                                            onClick={() => openEditDialog(partner)}
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:text-red-400"
                                            onClick={() => {
                                                if (window.confirm("Voulez-vous vraiment supprimer ce partenaire ?")) {
                                                    handleDelete(partner._id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-lg">{partner.name}</h3>
                                            <Badge variant="secondary" className="mt-1">
                                                {partner.sector}
                                            </Badge>
                                        </div>
                                        <Badge variant="outline" className="bg-amber-50">
                                            {partner.year}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                        {partner.description}
                                    </p>

                                    {partner.testimonial && (
                                        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                            <Quote className="h-4 w-4 text-amber-500 mb-1" />
                                            <p className="text-xs italic text-slate-600 line-clamp-2">
                                                "{partner.testimonial}"
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-3 text-xs text-slate-500">
                                        {formatDate(partner.createdAt)}
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Logo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Secteur</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Année</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Témoignage</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredPartners.map((partner) => (
                                            <tr key={partner._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${partner.bgGradient} p-3 flex items-center justify-center`}>
                                                        <img
                                                            src={partner.logo}
                                                            alt={partner.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-slate-900">
                                                        {partner.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="secondary">
                                                        {partner.sector}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                                        <Calendar className="h-4 w-4" />
                                                        {partner.year}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-slate-600 line-clamp-2 max-w-xs">
                                                        {partner.testimonial}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-amber-100 hover:text-amber-700"
                                                            onClick={() => openViewDialog(partner)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-blue-100 hover:text-blue-700"
                                                            onClick={() => openEditDialog(partner)}
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
                                                                        Êtes-vous sûr de vouloir supprimer le partenaire "{partner.name}" ?
                                                                        Cette action est irréversible.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(partner._id)}
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

            {/* Dialogue de création / édition / visualisation */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            {dialogMode === "create" && (
                                <>
                                    <Plus className="h-6 w-6 text-green-500" />
                                    <span>Ajouter un nouveau partenaire</span>
                                </>
                            )}
                            {dialogMode === "edit" && (
                                <>
                                    <Pencil className="h-6 w-6 text-blue-500" />
                                    <span>Modifier le partenaire</span>
                                </>
                            )}
                            {dialogMode === "view" && (
                                <>
                                    <Eye className="h-6 w-6 text-purple-500" />
                                    <span>Détails du partenaire</span>
                                </>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    {dialogMode === "view" && selectedPartner ? (
                        // Mode visualisation
                        <div className="space-y-6">
                            {/* Logo avec gradient */}
                            <div className={`p-8 rounded-lg bg-gradient-to-r ${selectedPartner.bgGradient} flex items-center justify-center`}>
                                <img
                                    src={selectedPartner.logo}
                                    alt={selectedPartner.name}
                                    className="h-24 w-auto object-contain max-w-full"
                                />
                            </div>

                            {/* Informations */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <Label className="text-xs text-amber-600">Nom</Label>
                                    <p className="text-lg font-medium mt-1">{selectedPartner.name}</p>
                                </div>
                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <Label className="text-xs text-amber-600">Secteur</Label>
                                    <p className="text-lg font-medium mt-1">
                                        <Badge variant="secondary">{selectedPartner.sector}</Badge>
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <Label className="text-xs text-slate-500">Année de partenariat</Label>
                                    <p className="text-lg font-medium mt-1 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        {selectedPartner.year}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <Label className="text-xs text-slate-500">Gradient</Label>
                                    <p className="text-sm font-mono mt-1">{selectedPartner.bgGradient}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                                <Label className="text-xs text-slate-500">Description</Label>
                                <p className="text-base mt-1">{selectedPartner.description}</p>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                                <Label className="text-xs text-amber-600 flex items-center gap-2">
                                    <Quote className="h-4 w-4" />
                                    Témoignage
                                </Label>
                                <p className="text-base italic mt-1">"{selectedPartner.testimonial}"</p>
                            </div>

                            <div className="flex justify-end">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Fermer
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Formulaire
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Nom <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    {...register("name", { required: "Le nom est requis" })}
                                    className="mt-1"
                                    placeholder="Ex: Entreprise ABC"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="sector" className="text-sm font-medium">
                                    Secteur <span className="text-red-500">*</span>
                                </Label>
                                <select
                                    id="sector"
                                    {...register("sector", { required: true })}
                                    className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="">Sélectionner un secteur</option>
                                    {sectors.map((sector) => (
                                        <option key={sector} value={sector}>{sector}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Description <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    {...register("description", { required: true })}
                                    className="mt-1"
                                    rows={3}
                                    placeholder="Description du partenaire et de ses activités..."
                                />
                            </div>

                            <div>
                                <Label htmlFor="logo" className="text-sm font-medium">
                                    Logo (URL) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="logo"
                                    type="url"
                                    {...register("logo", {
                                        required: true,
                                        pattern: {
                                            value: /^https?:\/\//,
                                            message: "URL invalide"
                                        }
                                    })}
                                    className="mt-1"
                                    placeholder="https://exemple.com/logo.png"
                                />
                                {errors.logo && (
                                    <p className="text-sm text-red-600 mt-1">{errors.logo.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="year" className="text-sm font-medium">
                                        Année <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="year"
                                        {...register("year", { required: true })}
                                        className="mt-1"
                                        placeholder="2024"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="bgGradient" className="text-sm font-medium">
                                        Gradient <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="bgGradient"
                                        {...register("bgGradient", { required: true })}
                                        className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        {gradients.map((gradient) => (
                                            <option key={gradient} value={gradient}>
                                                {gradient}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="testimonial" className="text-sm font-medium">
                                    Témoignage <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="testimonial"
                                    {...register("testimonial", { required: true })}
                                    className="mt-1"
                                    rows={2}
                                    placeholder="Témoignage du partenaire..."
                                />
                            </div>

                            <div className="flex justify-end space-x-2 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                                >
                                    {dialogMode === "create" ? "Créer le partenaire" : "Mettre à jour"}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}