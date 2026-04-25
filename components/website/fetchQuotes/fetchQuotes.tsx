"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toPng } from "html-to-image";
import {
    Eye,
    Edit,
    Trash2,
    Download,
    X,
    Check,
    Clock,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Briefcase,
    Home,
    Building,
    Package,
    Sparkles,
    TrendingUp,
    AlertCircle,
    FileText,
    Euro,
    Percent,
    CalendarDays,
    MessageSquare,
    Building2,
    User
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from '@radix-ui/react-checkbox';

// Interface Quote
interface Quote {
    _id: string;
    firstName: string;
    lastName: string;
    matriculeFiscaleClient: string;
    addressClient: string;
    email: string;
    goToFacturation: boolean;
    phone: string;
    moveType: 'residential' | 'commercial' | 'storage' | 'cleaning';
    pickupAddress?: string;
    pickupFloors?: number;
    pickupElevator?: 'oui' | 'non';
    deliveryAddress?: string;
    deliveryFloors?: number;
    deliveryElevator?: 'oui' | 'non';
    cleaningAddress?: string;
    cleaningType?: 'entreprise' | 'appartement';
    cleaningFloors?: number;
    cleaningInclusions?: {
        jardin?: boolean;
        meuble?: boolean;
        mur?: boolean;
    };
    storageItemType?: string;
    storageStartDate?: string;
    storageEndDate?: string;
    quoteDate?: string;
    moveStartDate?: string;
    additionalInfo?: string;
    status: 'pending' | 'contacted' | 'completed' | 'cancelled' | 'validated';
    createdAt: string;
    updatedAt: string;
    priceHT?: number;
    tvaRate?: number;
    priceTTC?: number;
    estimatedDays?: number;
    adminComment?: string;
}

interface CompanyData {
    name: string;
    email: string;
    phone: string;
    address: string;
    matriculeFiscal: string;
    logo?: string;
    website?: string;
    description?: string;
    city?: string;
    postalCode?: string;
    cachet?: string;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}/quote/api`;

const COMPANY_API_URL = `${process.env.NEXT_PUBLIC_API_BASE}/company/api/69b47b44ec716a1109444053`;

// Configuration des types de déménagement
const moveTypeConfig = {
    residential: { label: 'Résidentiel', icon: Home, color: 'bg-purple-100 text-purple-800 border-purple-200' },
    commercial: { label: 'Commercial', icon: Building, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    storage: { label: 'Entreposage', icon: Package, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    cleaning: { label: 'Nettoyage', icon: Sparkles, color: 'bg-teal-100 text-teal-800 border-teal-200' }
};

// Configuration des statuts
const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    contacted: { label: 'Contacté', color: 'bg-blue-100 text-blue-800', icon: Phone },
    completed: { label: 'Terminé', color: 'bg-green-100 text-green-800', icon: Check },
    cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800', icon: X },
    validated: { label: 'Validé', color: 'bg-emerald-100 text-emerald-800', icon: Check }
};

const CompletedQuotes: React.FC = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<Quote>>({});
    const [company, setCompany] = useState<CompanyData>({
        name: "",
        email: "",
        phone: "",
        address: "",
        matriculeFiscal: "",
        cachet: ""
    });

    const fetchCompanyData = async () => {
        try {
            const response = await axios.get(COMPANY_API_URL);
            setCompany({
                name: response.data.name,
                email: response.data.email,
                phone: response.data.phone,
                address: response.data.address,
                matriculeFiscal: response.data.matriculeFiscal,
                logo: response.data.logo || "/logoAla.png",
                website: response.data.website,
                description: response.data.description,
                city: response.data.city,
                postalCode: response.data.postalCode,
                cachet: response.data.cachet || ""
            });
        } catch (err) {
            console.error("Erreur lors de la récupération des données de l'entreprise:", err);
        }
    };

    const fetchCompletedAndValidatedQuotes = async () => {
        setLoading(true);
        try {
            // Récupérer les devis avec status 'completed' ET 'validated'
            const params = new URLSearchParams();
            params.append('limit', '100');
            const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);

            // Filtrer les devis avec status completed ou validated
            const filteredQuotes = response.data.quotes.filter(
                (quote: Quote) => quote.status === 'completed' || quote.status === 'validated'
            );

            setQuotes(filteredQuotes);
            setError(null);

        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message);
            } else {
                setError('Erreur inconnue');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedAndValidatedQuotes();
        fetchCompanyData();
    }, []);

    const handleDeleteClick = (id: string) => {
        setQuoteToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!quoteToDelete) return;
        try {
            await axios.delete(`${API_BASE_URL}/${quoteToDelete}`);
            fetchCompletedAndValidatedQuotes();
            setDeleteDialogOpen(false);
            setQuoteToDelete(null);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                alert(err.response?.data?.message || err.message);
            } else {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const openEditModal = (quote: Quote) => {
        // Vérifier si le devis est validé - si oui, ne pas ouvrir le modal
        if (quote.status === 'validated') {
            return;
        }
        setSelectedQuote(quote);
        setEditFormData({
            priceHT: quote.priceHT,
            tvaRate: quote.tvaRate ?? 20,
            priceTTC: quote.priceTTC,
            estimatedDays: quote.estimatedDays,
            adminComment: quote.adminComment,
        });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const ht = editFormData.priceHT ? Number(editFormData.priceHT) : undefined;
        const tva = editFormData.tvaRate ? Number(editFormData.tvaRate) : undefined;
        if (ht !== undefined && tva !== undefined) {
            const ttc = ht * (1 + tva / 100);
            setEditFormData(prev => ({ ...prev, priceTTC: Math.round(ttc * 100) / 100 }));
        } else {
            setEditFormData(prev => ({ ...prev, priceTTC: undefined }));
        }
    }, [editFormData.priceHT, editFormData.tvaRate]);

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedQuote) return;

        // Vérification supplémentaire avant soumission
        if (selectedQuote.status === 'validated') {
            alert('Ce devis est validé et ne peut pas être modifié');
            setIsEditModalOpen(false);
            return;
        }

        const dataToSend = {
            priceHT: editFormData.priceHT ? Number(editFormData.priceHT) : undefined,
            tvaRate: editFormData.tvaRate ? Number(editFormData.tvaRate) : undefined,
            // priceTTC: editFormData.priceTTC ? Number(editFormData.priceTTC) : undefined,
            estimatedDays: editFormData.estimatedDays ? Number(editFormData.estimatedDays) : undefined,
            adminComment: editFormData.adminComment,
        };
        try {
            await axios.put(`${API_BASE_URL}/${selectedQuote._id}`, dataToSend);
            fetchCompletedAndValidatedQuotes();
            setIsEditModalOpen(false);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                alert(err.response?.data?.message || err.message);
            } else {
                alert('Erreur lors de la modification');
            }
        }
    };

    const openViewModal = (quote: Quote) => {
        setSelectedQuote(quote);
        setIsViewModalOpen(true);
    };

    const downloadAsImage = async () => {
        const element = document.getElementById("quote-document-content");
        if (!element) {
            alert("Élément introuvable");
            return;
        }
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            const dataUrl = await toPng(element, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#ffffff",
            });
            const link = document.createElement("a");
            link.download = `devis-${selectedQuote?._id.slice(-6)}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error: any) {
            console.error("Erreur génération image :", error);
            alert(`Erreur lors de la génération de l'image : ${error?.message || "inconnue"}`);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatCurrency = (amount?: number) => {
        if (amount === undefined || amount === null) return '-';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND' }).format(amount);
    };

    const MoveTypeBadge = ({ type }: { type: Quote['moveType'] }) => {
        const config = moveTypeConfig[type];
        const Icon = config.icon;
        return (
            <Badge variant="outline" className={`${config.color} border font-medium px-2 py-1 rounded-md flex items-center gap-1 w-fit`}>
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };





    const StatusBadge = ({ status }: { status: Quote['status'] }) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        return (
            <Badge className={`${config.color} border-0 font-medium px-3 py-1 rounded-full flex items-center gap-1 w-fit`}>
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    // Statistiques
    const stats = {
        total: quotes.length,
        completed: quotes.filter(q => q.status === 'completed').length,
        validated: quotes.filter(q => q.status === 'validated').length,
        withPrice: quotes.filter(q => q.priceTTC).length,
        totalAmount: quotes.reduce((sum, q) => sum + (q.priceTTC || 0), 0),
        avgAmount: quotes.filter(q => q.priceTTC).length > 0
            ? quotes.reduce((sum, q) => sum + (q.priceTTC || 0), 0) / quotes.filter(q => q.priceTTC).length
            : 0
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-96 rounded-xl" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        <p>Erreur : {error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }




    const handleFacturationChange = async (id: string, checked: boolean) => {
        try {
            await axios.put(`${API_BASE_URL}/${id}/facturation`, {
                goToFacturation: checked
            });

            // 🔥 update local state (important)
            setQuotes(prev =>
                prev.map(q =>
                    q._id === id ? { ...q, goToFacturation: checked } : q
                )
            );

        } catch (error) {
            console.error("Erreur update facturation:", error);
        }
    };










    return (
        <div className="space-y-6">
            {/* Header avec gradient */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 p-8 text-white shadow-xl">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Devis finalisés & validés</h1>
                            <p className="mt-2 text-green-100">Consultez et gérez les devis terminés et validés</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-white/20 text-white border-0 px-3 py-1">
                                {stats.total} devis
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"></div>
            </div>

            {/* Cartes KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total devis</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-100">
                                <FileText className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Terminés</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-100">
                                <Check className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Validés</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.validated}</p>
                            </div>
                            <div className="p-3 rounded-full bg-emerald-100">
                                <Check className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Avec prix</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.withPrice}</p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100">
                                DT
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Montant total</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-100">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tableau des devis modernisé */}
            <Card className="shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total TTC</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>




                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {quotes.map((quote) => {
                                const isValidated = quote.status === 'validated';
                                return (
                                    <tr key={quote._id} className="hover:bg-gray-50 transition-colors duration-150 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${isValidated
                                                    ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                                                    : 'bg-gradient-to-r from-green-500 to-emerald-600'
                                                    }`}>
                                                    {quote.firstName.charAt(0)}{quote.lastName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{quote.firstName} {quote.lastName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {quote.email}
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {quote.phone}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <MoveTypeBadge type={quote.moveType} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(quote.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={quote.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            {quote.priceTTC ? (
                                                <span className={`font-semibold ${isValidated ? 'text-emerald-600' : 'text-green-600'}`}>
                                                    {formatCurrency(quote.priceTTC)}
                                                </span>
                                            ) : (
                                                <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">
                                                    En attente
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Bouton Voir - toujours actif */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openViewModal(quote)}
                                                    className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600"
                                                    title="Voir le document"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>

                                                {/* Bouton Modifier - désactivé pour les devis validés */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditModal(quote)}
                                                    className={`h-8 w-8 p-0 ${isValidated
                                                        ? 'text-gray-300 cursor-not-allowed opacity-50'
                                                        : 'text-gray-500 hover:text-blue-600'
                                                        }`}
                                                    disabled={isValidated}
                                                    title={isValidated ? "Ce devis est validé et ne peut pas être modifié" : "Modifier"}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>

                                                {/* Bouton Supprimer - désactivé pour les devis validés */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(quote._id)}
                                                    className={`h-8 w-8 p-0 ${isValidated
                                                        ? 'text-gray-300 cursor-not-allowed opacity-50'
                                                        : 'text-gray-500 hover:text-red-600'
                                                        }`}
                                                    disabled={isValidated}
                                                    title={isValidated ? "Ce devis est validé et ne peut pas être supprimé" : "Supprimer"}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>



                                    </tr>
                                );
                            })}
                            {quotes.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertCircle className="h-12 w-12 text-gray-300" />
                                            <p className="text-lg font-medium">Aucun devis finalisé ou validé</p>
                                            <p className="text-sm">Les devis avec statut "Terminé" ou "Validé" apparaîtront ici</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal d'édition admin - avec vérification supplémentaire */}
            <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                // Empêcher l'ouverture si le devis est validé
                if (selectedQuote?.status === 'validated' && open) {
                    return;
                }
                setIsEditModalOpen(open);
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Informations financières</DialogTitle>
                        <DialogDescription>
                            Ajoutez les détails financiers pour le devis de {selectedQuote?.firstName} {selectedQuote?.lastName}
                            {selectedQuote?.status === 'validated' && (
                                <span className="block text-amber-600 mt-1">⚠️ Ce devis est validé - les modifications sont bloquées</span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit}>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="priceHT" className="flex items-center gap-2">
                                    Montant HT (DT)
                                </Label>
                                <Input
                                    id="priceHT"
                                    name="priceHT"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={editFormData.priceHT ?? ''}
                                    onChange={handleEditChange}
                                    placeholder="0.00"
                                    className="mt-1"
                                    disabled={selectedQuote?.status === 'validated'}
                                />
                            </div>
                            <div>
                                <Label htmlFor="tvaRate" className="flex items-center gap-2">
                                    <Percent className="h-4 w-4" />
                                    TVA (%)
                                </Label>
                                <Input
                                    id="tvaRate"
                                    name="tvaRate"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={editFormData.tvaRate ?? ''}
                                    onChange={handleEditChange}
                                    placeholder="20"
                                    className="mt-1"
                                    disabled={selectedQuote?.status === 'validated'}
                                />
                            </div>
                            <div>
                                <Label htmlFor="priceTTC" className="flex items-center gap-2">
                                    Montant TTC (calculé)
                                </Label>
                                <Input
                                    id="priceTTC"
                                    name="priceTTC"
                                    type="number"
                                    value={editFormData.priceTTC ?? ''}
                                    disabled
                                    className="mt-1 bg-gray-100"
                                />
                            </div>
                            <div>
                                <Label htmlFor="estimatedDays" className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    Durée estimée (jours)
                                </Label>
                                <Input
                                    id="estimatedDays"
                                    name="estimatedDays"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={editFormData.estimatedDays ?? ''}
                                    onChange={handleEditChange}
                                    placeholder="1"
                                    className="mt-1"
                                    disabled={selectedQuote?.status === 'validated'}
                                />
                            </div>
                            <div>
                                <Label htmlFor="adminComment" className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Commentaire pour le client
                                </Label>
                                <textarea
                                    id="adminComment"
                                    name="adminComment"
                                    rows={3}
                                    value={editFormData.adminComment ?? ''}
                                    onChange={handleEditChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Optionnel : informations complémentaires..."
                                    disabled={selectedQuote?.status === 'validated'}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Annuler
                            </Button>
                            {selectedQuote?.status !== 'validated' && (
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Enregistrer
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal de visualisation du document - inchangée */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-auto">
                    {selectedQuote && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between">
                                    <DialogTitle className="text-xl font-bold">
                                        Devis pour {selectedQuote.firstName} {selectedQuote.lastName}
                                    </DialogTitle>
                                    <Button onClick={downloadAsImage} variant="outline" className="gap-2 mt-5">
                                        <Download className="h-4 w-4" />
                                        Télécharger en image
                                    </Button>
                                </div>
                            </DialogHeader>

                            {/* Document professionnel */}
                            <div className="flex justify-center">
                                <div
                                    id="quote-document-content"
                                    className="bg-white p-8 border border-gray-200 shadow-xl rounded-lg"
                                    style={{ width: '800px', fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif" }}
                                >
                                    {/* En-tête avec logo */}
                                    <div className="flex justify-between items-start pb-6 border-b-2 border-green-200">
                                        <div className="flex items-center gap-4">
                                            {company.logo && (
                                                <div className="p-2 bg-gray-50 rounded-lg">
                                                    <img src={company.logo} alt="Logo" className="h-16 w-auto object-contain" />
                                                </div>
                                            )}
                                            <div>
                                                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{company.name}</h1>
                                                <p className="text-sm text-gray-500 mt-1">{company.address}</p>
                                                <p className="text-sm text-gray-500">Tél : {company.phone} | Email : {company.email}</p>
                                                <p className="text-sm text-gray-500">Matricule fiscale : {company.matriculeFiscal}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`px-6 py-3 rounded-lg border ${selectedQuote.status === 'validated' ? 'bg-emerald-50 border-emerald-200' : 'bg-green-50 border-green-200'}`}>
                                                <h2 className={`text-3xl font-bold ${selectedQuote.status === 'validated' ? 'text-emerald-700' : 'text-green-700'}`}>
                                                    {selectedQuote.status === 'validated' ? 'DEVIS VALIDÉ' : 'DEVIS'}
                                                </h2>
                                                <p className="text-gray-600 text-sm mt-1">N° {selectedQuote._id.slice(-6).toUpperCase()}</p>
                                                <p className="text-gray-600 text-sm">Date : {new Date().toLocaleDateString('fr-FR')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Le reste du document reste identique */}
                                    {/* Coordonnées client */}
                                    <div className="mt-6 bg-gray-50 p-5 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Client</h3>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-800">{selectedQuote.firstName} {selectedQuote.lastName}</p>
                                        <div className="flex gap-3 mt-1">
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {selectedQuote.email}
                                            </p>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <Phone className="h-3 w-3" /> {selectedQuote.phone}
                                            </p>
                                        </div>
                                        <h6>{selectedQuote.addressClient}</h6>
                                        <h6>{selectedQuote.matriculeFiscaleClient}</h6>
                                    </div>

                                    {/* Détails de la prestation */}
                                    <div className="mt-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Briefcase className="h-4 w-4 text-gray-500" />
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Détails de la prestation</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="border rounded-lg p-4 bg-white">
                                                <span className="text-xs text-gray-500 uppercase">Type</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {(() => {
                                                        const config = moveTypeConfig[selectedQuote.moveType];
                                                        const Icon = config.icon;
                                                        return <Icon className="h-4 w-4 text-gray-600" />;
                                                    })()}
                                                    <p className="font-medium text-gray-800 capitalize">
                                                        {selectedQuote.moveType === 'residential' ? 'Déménagement résidentiel' :
                                                            selectedQuote.moveType === 'commercial' ? 'Déménagement commercial' :
                                                                selectedQuote.moveType === 'storage' ? 'Entreposage' : 'Nettoyage'}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedQuote.moveStartDate && (
                                                <div className="border rounded-lg p-4 bg-white">
                                                    <span className="text-xs text-gray-500 uppercase">Date souhaitée</span>
                                                    <p className="font-medium text-gray-800 mt-1 flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDate(selectedQuote.moveStartDate)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Adresses */}
                                        {selectedQuote.moveType !== 'cleaning' && (
                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <div className="border rounded-lg p-4 bg-white">
                                                    <span className="text-xs text-gray-500 uppercase flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> Départ
                                                    </span>
                                                    <p className="font-medium text-gray-800 mt-1">{selectedQuote.pickupAddress || '-'}</p>
                                                    {(selectedQuote.pickupFloors || selectedQuote.pickupElevator) && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {selectedQuote.pickupFloors && `Étage ${selectedQuote.pickupFloors}`}
                                                            {selectedQuote.pickupElevator && ` · Ascenseur : ${selectedQuote.pickupElevator}`}
                                                        </p>
                                                    )}
                                                </div>
                                                {selectedQuote.moveType !== 'storage' && (
                                                    <div className="border rounded-lg p-4 bg-white">
                                                        <span className="text-xs text-gray-500 uppercase flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" /> Arrivée
                                                        </span>
                                                        <p className="font-medium text-gray-800 mt-1">{selectedQuote.deliveryAddress || '-'}</p>
                                                        {(selectedQuote.deliveryFloors || selectedQuote.deliveryElevator) && (
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {selectedQuote.deliveryFloors && `Étage ${selectedQuote.deliveryFloors}`}
                                                                {selectedQuote.deliveryElevator && ` · Ascenseur : ${selectedQuote.deliveryElevator}`}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {selectedQuote.moveType === 'storage' && (
                                            <div className="mt-4 border rounded-lg p-4 bg-white">
                                                <span className="text-xs text-gray-500 uppercase flex items-center gap-1">
                                                    <Package className="h-3 w-3" /> Entreposage
                                                </span>
                                                <p className="font-medium text-gray-800 mt-1">Type : {selectedQuote.storageItemType}</p>
                                                <p className="text-sm text-gray-500">du {formatDate(selectedQuote.storageStartDate)} au {formatDate(selectedQuote.storageEndDate)}</p>
                                            </div>
                                        )}

                                        {selectedQuote.moveType === 'cleaning' && (
                                            <div className="mt-4 border rounded-lg p-4 bg-white">
                                                <span className="text-xs text-gray-500 uppercase flex items-center gap-1">
                                                    <Sparkles className="h-3 w-3" /> Nettoyage
                                                </span>
                                                <p className="font-medium text-gray-800 mt-1">Adresse : {selectedQuote.cleaningAddress}</p>
                                                <p className="text-sm text-gray-500">Type : {selectedQuote.cleaningType === 'entreprise' ? 'Entreprise' : 'Appartement'}</p>
                                                {selectedQuote.cleaningFloors && <p className="text-sm text-gray-500">Étage : {selectedQuote.cleaningFloors}</p>}
                                                <p className="text-sm text-gray-500">Inclusions : {
                                                    selectedQuote.cleaningInclusions ?
                                                        Object.entries(selectedQuote.cleaningInclusions)
                                                            .filter(([_, v]) => v)
                                                            .map(([k]) => k === 'jardin' ? 'Jardin' : k === 'meuble' ? 'Meuble' : 'Mur')
                                                            .join(', ') : '-'
                                                }</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tableau des montants */}
                                    <div className="mt-8">
                                        <div className="flex items-center gap-2 mb-3">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Montants</h3>
                                        </div>
                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="w-full">
                                                <tbody className="divide-y divide-gray-200">
                                                    <tr className="bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-700">Montant HT</td>
                                                        <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(selectedQuote.priceHT)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-3 text-gray-700">TVA ({selectedQuote.tvaRate ?? 20}%)</td>
                                                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                            {selectedQuote.priceHT && selectedQuote.tvaRate ? formatCurrency(selectedQuote.priceHT * (selectedQuote.tvaRate / 100)) : '-'}
                                                        </td>
                                                    </tr>
                                                    <tr className={`${selectedQuote.status === 'validated' ? 'bg-emerald-50' : 'bg-green-50'}`}>
                                                        <td className="px-4 py-3 font-semibold text-gray-800">Total TTC</td>
                                                        <td className={`px-4 py-3 text-right text-xl font-bold ${selectedQuote.status === 'validated' ? 'text-emerald-700' : 'text-green-700'}`}>
                                                            {formatCurrency(selectedQuote.priceTTC)}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Informations complémentaires */}
                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        {selectedQuote.estimatedDays && (
                                            <div className="border rounded-lg p-4 bg-white">
                                                <span className="text-xs text-gray-500 uppercase flex items-center gap-1">
                                                    <CalendarDays className="h-3 w-3" /> Durée estimée
                                                </span>
                                                <p className="text-lg font-semibold text-gray-800 mt-1">
                                                    {selectedQuote.estimatedDays} jour{selectedQuote.estimatedDays > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        )}
                                        {selectedQuote.adminComment && (
                                            <div className="border rounded-lg p-4 bg-white">
                                                <span className="text-xs text-gray-500 uppercase flex items-center gap-1">
                                                    <MessageSquare className="h-3 w-3" /> Commentaire
                                                </span>
                                                <p className="text-gray-700 mt-1 italic text-sm">{selectedQuote.adminComment}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Conditions et signature avec cachet */}
                                    <div className="mt-8 pt-6 border-t border-gray-300">
                                        <div className="flex justify-between items-end">
                                            <div className="text-xs text-gray-500 space-y-1 flex-1">
                                                <p>✓ Ce devis est valable 30 jours à compter de sa date d'émission.</p>
                                                <p>✓ Sous réserve d'acceptation par le client et de disponibilité.</p>
                                                <p>✓ Les prestations sont garanties selon nos conditions générales.</p>
                                                {selectedQuote.status === 'validated' && (
                                                    <p className="text-emerald-600 font-medium mt-2">✓ Devis validé par le client</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-700 font-medium mb-2">Cachet et signature</p>
                                                <div className="flex flex-col items-end gap-2">
                                                    {company.cachet ? (
                                                        <div className="mb-2">
                                                            <img
                                                                src={company.cachet}
                                                                alt="Cachet de l'entreprise"
                                                                className="h-20 w-auto object-contain opacity-80"
                                                                style={{ filter: 'grayscale(20%)' }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-32 h-12 border-b-2 border-gray-400 border-dashed"></div>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Fait à {company.city || '...'}, le {new Date().toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog de confirmation suppression */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible et supprimera définitivement toutes les données associées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default CompletedQuotes;