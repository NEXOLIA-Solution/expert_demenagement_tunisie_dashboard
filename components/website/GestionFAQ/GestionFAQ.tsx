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
    HelpCircle,
    ChevronRight,
    Settings,
    Clock,
    CheckCircle2,
    XCircle,
    Sparkles,
    Image as ImageIcon,
    Maximize2
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import FAQ from "../../../public/sectionImage/FAQ.png";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FAQ = {
    _id: string;
    question: string;
    answer: string;
    order?: number;
    createdAt?: string;
    updatedAt?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function GestionFAQ() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
    const [isImageExpanded, setIsImageExpanded] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FAQ>();

    const fetchFAQs = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_BASE}/faq/api/all`);
            setFaqs(data);
        } catch (error) {
            toast.error("Erreur lors du chargement des FAQ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs();
    }, []);

    const openCreateDialog = () => {
        setDialogMode("create");
        setSelectedFAQ(null);
        reset({ question: "", answer: "", order: 0 });
        setIsDialogOpen(true);
    };

    const openEditDialog = (faq: FAQ) => {
        setDialogMode("edit");
        setSelectedFAQ(faq);
        reset(faq);
        setIsDialogOpen(true);
    };

    const openViewDialog = (faq: FAQ) => {
        setDialogMode("view");
        setSelectedFAQ(faq);
        reset(faq);
        setIsDialogOpen(true);
    };

    const onSubmit = async (data: FAQ) => {
        try {
            if (dialogMode === "create") {
                await axios.post(`${API_BASE}/faq/api/register`, data);
                toast.success("FAQ créée avec succès");
            } else if (dialogMode === "edit" && selectedFAQ) {
                const cleanData = {
                    question: data.question,
                    answer: data.answer
                };
                await axios.put(`${API_BASE}/faq/api/${selectedFAQ._id}`, cleanData);
                toast.success("FAQ mise à jour");
            }
            setIsDialogOpen(false);
            fetchFAQs();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Une erreur est survenue");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${API_BASE}/faq/api/${id}`);
            toast.success("FAQ supprimée");
            fetchFAQs();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Image Expansion Dialog */}
            <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
                <DialogContent className="max-w-5xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Aperçu de la section FAQ
                        </DialogTitle>
                    </DialogHeader>
                    <div className="relative h-[70vh] w-full rounded-lg overflow-hidden border-2 border-slate-200">
                        <Image
                            src={FAQ}
                            alt="Section FAQ"
                            fill
                            className="object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Hero Section améliorée avec mise en valeur de l'image */}
            <div className="relative">
                {/* Bandeau décoratif */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                <div className="container mx-auto px-4 py-8">
                    {/* Fil d'Ariane */}
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                        <span>Dashboard</span>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-blue-600 font-medium">Gestion FAQ</span>
                    </div>

                    {/* En-tête avec titre et badge */}
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-3 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                                <HelpCircle className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                                        Gestion des FAQ
                                    </h1>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Section active
                                    </Badge>
                                </div>
                                <p className="text-slate-600">
                                    Interface d'administration pour gérer les questions fréquemment posées
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={openCreateDialog}
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <Plus className="mr-2 h-5 w-5" /> Nouvelle FAQ
                        </Button>
                    </div>

                    {/* Section Image mise en valeur */}
                    <Card className="mb-8 overflow-hidden border-2 border-blue-100 hover:border-blue-200 transition-all duration-300">
                        <CardContent className="p-0">
                            <div className="grid md:grid-cols-3 gap-0">
                                {/* Aperçu de l'image */}
                                <div className="md:col-span-2 relative h-[250px] md:h-[300px] group">
                                    <Image
                                        src={FAQ}
                                        alt="Aperçu de la section FAQ"
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
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-blue-500 rounded-lg">
                                            <Settings className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Section FAQ</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-sm">Statut</p>
                                                <p className="text-sm text-green-600">Active et visible</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-sm">Dernière mise à jour</p>
                                                <p className="text-sm text-slate-600">{new Date().toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <HelpCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-sm">FAQ disponibles</p>
                                                <p className="text-2xl font-bold text-purple-600">{faqs.length}</p>
                                            </div>
                                        </div>

                                        {/* Badges des fonctionnalités */}
                                        <div className="pt-4 border-t border-blue-200">
                                            <p className="text-xs text-slate-500 mb-2">Fonctionnalités</p>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="outline" className="bg-white">Création</Badge>
                                                <Badge variant="outline" className="bg-white">Modification</Badge>
                                                <Badge variant="outline" className="bg-white">Suppression</Badge>
                                                <Badge variant="outline" className="bg-white">Visualisation</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Onglets pour différentes vues */}
                    <Tabs defaultValue="list" className="mb-6">
                        <TabsList>
                            <TabsTrigger value="list">Liste des FAQ</TabsTrigger>
                            <TabsTrigger value="stats">Statistiques</TabsTrigger>
                            <TabsTrigger value="preview">Aperçu section</TabsTrigger>
                        </TabsList>

                        <TabsContent value="list" className="mt-6">
                            {/* Tableau des FAQ */}
                            <Card className="border-slate-200 shadow-xl">
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                    <TableHead className="w-16">#</TableHead>
                                                    <TableHead>Question</TableHead>
                                                    <TableHead>Réponse</TableHead>
                                                    <TableHead className="w-24 text-center">Statut</TableHead>
                                                    <TableHead className="text-right w-32">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {loading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-16">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                                <p className="text-slate-600">Chargement des FAQ...</p>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : faqs.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-16">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <div className="p-4 bg-slate-100 rounded-full">
                                                                    <HelpCircle className="h-12 w-12 text-slate-400" />
                                                                </div>
                                                                <p className="text-slate-600 text-lg">Aucune FAQ trouvée</p>
                                                                <p className="text-sm text-slate-500 mb-4">
                                                                    Commencez par créer votre première FAQ
                                                                </p>
                                                                <Button
                                                                    onClick={openCreateDialog}
                                                                    variant="outline"
                                                                    className="border-blue-200 hover:border-blue-300"
                                                                >
                                                                    <Plus className="mr-2 h-4 w-4" /> Créer une FAQ
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    faqs.map((faq, index) => (
                                                        <TableRow
                                                            key={faq._id}
                                                            className="hover:bg-slate-50 transition-colors duration-150 group"
                                                        >
                                                            <TableCell>
                                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium shadow-md">
                                                                    {index + 1}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="font-medium max-w-md">
                                                                <div className="line-clamp-2">{faq.question}</div>
                                                            </TableCell>
                                                            <TableCell className="max-w-md">
                                                                <div className="line-clamp-2 text-slate-600">{faq.answer}</div>
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                    Active
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => openViewDialog(faq)}
                                                                        title="Voir"
                                                                        className="hover:bg-blue-100 hover:text-blue-700"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => openEditDialog(faq)}
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
                                                                                    Êtes-vous sûr de vouloir supprimer cette FAQ ? Cette action est irréversible.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() => handleDelete(faq._id)}
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
                        </TabsContent>

                        <TabsContent value="stats" className="mt-6">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Statistiques de la section FAQ</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-blue-600 mb-2">Total questions</p>
                                            <p className="text-3xl font-bold text-blue-700">{faqs.length}</p>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <p className="text-sm text-green-600 mb-2">Questions actives</p>
                                            <p className="text-3xl font-bold text-green-700">{faqs.length}</p>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <p className="text-sm text-purple-600 mb-2">Moyenne réponses</p>
                                            <p className="text-3xl font-bold text-purple-700">
                                                {faqs.length > 0 ? Math.round(faqs.reduce((acc, f) => acc + f.answer.length, 0) / faqs.length) : 0}
                                            </p>
                                            <p className="text-xs text-purple-500">caractères par réponse</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="preview" className="mt-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="relative h-[400px] rounded-lg overflow-hidden border-2 border-slate-200">
                                        <Image
                                            src={FAQ}
                                            alt="Aperçu de la section FAQ"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Dialogue */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            {dialogMode === "create" && (
                                <>
                                    <Sparkles className="h-6 w-6 text-blue-500" />
                                    <span>Créer une nouvelle FAQ</span>
                                </>
                            )}
                            {dialogMode === "edit" && (
                                <>
                                    <Pencil className="h-6 w-6 text-green-500" />
                                    <span>Modifier la FAQ</span>
                                </>
                            )}
                            {dialogMode === "view" && (
                                <>
                                    <Eye className="h-6 w-6 text-purple-500" />
                                    <span>Détails de la FAQ</span>
                                </>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    {dialogMode === "view" ? (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-lg border border-blue-100">
                                <Label className="text-sm text-slate-600">Question</Label>
                                <p className="text-lg font-medium mt-1 text-slate-800">{selectedFAQ?.question}</p>
                            </div>
                            <div className="bg-gradient-to-r from-slate-50 to-green-50 p-4 rounded-lg border border-green-100">
                                <Label className="text-sm text-slate-600">Réponse</Label>
                                <p className="text-base mt-1 whitespace-pre-wrap text-slate-700">{selectedFAQ?.answer}</p>
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
                                <Label htmlFor="question" className="text-sm font-medium">
                                    Question <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="question"
                                    {...register("question", { required: "La question est requise" })}
                                    className="mt-1 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                                    placeholder="Ex: Comment puis-je réserver une visite ?"
                                />
                                {errors.question && (
                                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                        <XCircle className="h-4 w-4" />
                                        {errors.question.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="answer" className="text-sm font-medium">
                                    Réponse <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="answer"
                                    rows={5}
                                    {...register("answer", { required: true })}
                                    className="mt-1 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                                    placeholder="Ex: Pour réserver une visite, vous pouvez..."
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                                >
                                    {dialogMode === "create" ? (
                                        <>Créer la FAQ</>
                                    ) : (
                                        <>Mettre à jour</>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}