"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Filter,
  RefreshCw,
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
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Types
interface Quote {
  _id: string;
  firstName: string;
  lastName: string;
  addressClient: string;
  matriculeFiscaleClient: string;
  email: string;
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
  priceTTC?: number;
  moveStartDate?: string;
  additionalInfo?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled' | 'validated';
  createdAt: string;
  updatedAt: string;
}

interface QuotesResponse {
  quotes: Quote[];
  totalPages: number;
  currentPage: number;
  total: number;
}

interface Stats {
  total: number;
  pending: number;
  contacted: number;
  completed: number;
  cancelled: number;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}/quote/api`;
const ALLOWED_UPDATE_FIELDS = [
  'firstName', 'lastName', 'email', 'phone', 'moveType',
  'pickupAddress', 'pickupFloors', 'pickupElevator',
  'deliveryAddress', 'deliveryFloors', 'deliveryElevator',
  'cleaningAddress', 'cleaningType', 'cleaningFloors', 'cleaningInclusions',
  'storageItemType', 'storageStartDate', 'storageEndDate',
  'quoteDate', 'moveStartDate', 'additionalInfo', 'addressClient', 'matriculeFiscaleClient'
];

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  contacted: { label: 'Contacté', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Phone },
  completed: { label: 'Terminé', color: 'bg-green-100 text-green-800 border-green-200', icon: Check },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800 border-red-200', icon: X },
  validated: { label: 'Validé', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: X }
};

const moveTypeConfig = {
  residential: { label: 'Résidentiel', icon: Home, color: 'bg-purple-100 text-purple-800' },
  commercial: { label: 'Commercial', icon: Building, color: 'bg-indigo-100 text-indigo-800' },
  storage: { label: 'Entreposage', icon: Package, color: 'bg-orange-100 text-orange-800' },
  cleaning: { label: 'Nettoyage', icon: Sparkles, color: 'bg-teal-100 text-teal-800' }
};

const QuoteDashboard: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, contacted: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Quote>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMoveType, setFilterMoveType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await axios.get<Stats>(`${API_BASE_URL}/stats`);
      setStats(response.data);
    } catch (err) {
      console.error('Erreur stats', err);
    }
  };

  const fetchQuotes = async (pageNum = page, status = filterStatus, moveType = filterMoveType, search = searchTerm) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      params.append('limit', '10');
      if (status && status !== 'all') params.append('status', status);
      if (moveType && moveType !== 'all') params.append('moveType', moveType);
      if (search) params.append('search', search);

      const response = await axios.get<QuotesResponse>(`${API_BASE_URL}?${params.toString()}`);
      setQuotes(response.data.quotes);
      setTotalPages(response.data.totalPages);
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
    fetchStats();
    fetchQuotes(1, filterStatus, filterMoveType, searchTerm);
  }, []);

  useEffect(() => {
    fetchQuotes(1, filterStatus, filterMoveType, searchTerm);
  }, [filterStatus, filterMoveType, searchTerm]);

  const goToPage = (newPage: number) => {
    setPage(newPage);
    fetchQuotes(newPage, filterStatus, filterMoveType, searchTerm);
  };

  const handleDeleteClick = (id: string) => {
    setQuoteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!quoteToDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/${quoteToDelete}`);
      fetchQuotes(page, filterStatus, filterMoveType, searchTerm);
      fetchStats();
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

  const handleStatusChange = async (id: string, newStatus: Quote['status']) => {
    try {
      await axios.patch(`${API_BASE_URL}/${id}/status`, { status: newStatus });
      setQuotes(prev => prev.map(q => q._id === id ? { ...q, status: newStatus } : q));
      fetchStats();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || err.message);
      } else {
        alert('Erreur lors du changement de statut');
      }
    }
  };

  const openDetailModal = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDetailModalOpen(true);
  };

  const openEditModal = (quote: Quote) => {
    setSelectedQuote(quote);
    setEditFormData(quote);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('cleaningInclusions.')) {
        const field = name.split('.')[1];
        setEditFormData(prev => ({
          ...prev,
          cleaningInclusions: {
            ...prev.cleaningInclusions,
            [field]: checked,
          },
        }));
      } else {
        setEditFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    const dataToSend = Object.fromEntries(
      Object.entries(editFormData).filter(([key]) => ALLOWED_UPDATE_FIELDS.includes(key))
    );

    try {
      await axios.put(`${API_BASE_URL}/${selectedQuote._id}`, dataToSend);
      fetchQuotes(page, filterStatus, filterMoveType, searchTerm);
      fetchStats();
      setIsEditModalOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || err.message);
      } else {
        alert('Erreur lors de la modification');
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const StatusBadge = ({ status }: { status: Quote['status'] }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} border font-medium px-3 py-1 rounded-full flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const MoveTypeBadge = ({ type }: { type: Quote['moveType'] }) => {
    const config = moveTypeConfig[type];
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.color} border-0 font-medium px-2 py-1 rounded-md flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const StatCard = ({ title, value, color, icon: Icon, trend }: { title: string; value: number; color: string; icon: any; trend?: string }) => (
    <Card className={`border-l-4 ${color} shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('border-l-', 'bg-')}`}>
            <Icon className={`h-6 w-6 ${color.replace('border-l-', 'text-')}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading && quotes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cartes KPI modernes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total devis" value={stats.total} color="border-l-gray-500" icon={TrendingUp} />
        <StatCard title="En attente" value={stats.pending} color="border-l-yellow-500" icon={Clock} />
        <StatCard title="Contactés" value={stats.contacted} color="border-l-blue-500" icon={Phone} />
        <StatCard title="Terminés" value={stats.completed} color="border-l-green-500" icon={Check} />
        <StatCard title="Annulés" value={stats.cancelled} color="border-l-red-500" icon={X} />
      </div>

      {/* Barre de filtres améliorée */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex justify-center items-center flex-wrap gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tous statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="contacted">Contacté</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterMoveType} onValueChange={setFilterMoveType}>
                <SelectTrigger className="w-[160px]">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tous types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="residential">Résidentiel</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="storage">Entreposage</SelectItem>
                  <SelectItem value="cleaning">Nettoyage</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                setFilterStatus('all');
                setFilterMoveType('all');
                setSearchTerm('');
              }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des devis moderne */}
      <Card className="shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix TTC</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotes.map((quote) => (
                <tr key={quote._id} className="hover:bg-gray-50 transition-colors duration-150 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                        {quote.firstName.charAt(0)}{quote.lastName.charAt(0)}
                      </div>
                      <div className="ml-3">
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
                  <td className="px-6 py-4">
                    <select
                      value={quote.status}
                      onChange={(e) => handleStatusChange(quote._id, e.target.value as Quote['status'])}
                      className={`text-sm rounded-full px-3 py-1 font-medium border-0 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${statusConfig[quote.status].color
                        }`}
                    >
                      <option value="pending">En attente</option>
                      <option value="contacted">Contacté</option>
                      <option value="completed">Terminé</option>
                      {quote.priceTTC === 0 ? null : <option value="validated">Validated</option>}

                      <option value="cancelled">Annulé</option>
                    </select>
                  </td>





                  <td className="px-6 py-4">
                    <div className="flex items-center">

                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{quote.priceTTC} TND</p>
                      </div>
                    </div>
                  </td>



                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(quote.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetailModal(quote)}
                        className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(quote)}
                        className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(quote._id)}
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-12 w-12 text-gray-300" />
                      <p className="text-lg font-medium">Aucun devis trouvé</p>
                      <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Page {page} sur {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="gap-1"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modal Détails - Version améliorée */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
  <DialogContent className="w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh] overflow-auto">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Détails du devis</DialogTitle>
                <DialogDescription>
                  Informations complètes concernant la demande de devis
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* En-tête client */}
                <div className="flex items-start justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                      {selectedQuote.firstName.charAt(0)}{selectedQuote.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedQuote.firstName} {selectedQuote.lastName}</h3>
                      <div className="flex gap-3 mt-1">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {selectedQuote.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {selectedQuote.phone}
                        </p>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedQuote.addressClient}</h3>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedQuote.matriculeFiscaleClient}</h3>

                    </div>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={selectedQuote.status} />
                    <MoveTypeBadge type={selectedQuote.moveType} />
                  </div>
                </div>

                {/* Grille d'informations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations déménagement */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Informations déménagement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Date souhaitée :</span> {formatDate(selectedQuote.moveStartDate)}</p>
                      <p className="text-sm"><span className="font-medium">Date création :</span> {formatDateTime(selectedQuote.createdAt)}</p>
                      <p className="text-sm"><span className="font-medium">Dernière modif :</span> {formatDateTime(selectedQuote.updatedAt)}</p>
                    </CardContent>
                  </Card>

                  {/* Adresses */}
                  {selectedQuote.moveType !== 'cleaning' && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          Adresses
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Départ</p>
                          <p className="text-sm text-gray-600">{selectedQuote.pickupAddress || '-'}</p>
                          {(selectedQuote.pickupFloors || selectedQuote.pickupElevator) && (
                            <p className="text-xs text-gray-500 mt-1">
                              {selectedQuote.pickupFloors && `Étage ${selectedQuote.pickupFloors}`}
                              {selectedQuote.pickupElevator && ` · Ascenseur: ${selectedQuote.pickupElevator}`}
                            </p>
                          )}
                        </div>
                        {selectedQuote.moveType !== 'storage' && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Arrivée</p>
                            <p className="text-sm text-gray-600">{selectedQuote.deliveryAddress || '-'}</p>
                            {(selectedQuote.deliveryFloors || selectedQuote.deliveryElevator) && (
                              <p className="text-xs text-gray-500 mt-1">
                                {selectedQuote.deliveryFloors && `Étage ${selectedQuote.deliveryFloors}`}
                                {selectedQuote.deliveryElevator && ` · Ascenseur: ${selectedQuote.deliveryElevator}`}
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Type spécifique */}
                  {selectedQuote.moveType === 'storage' && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="h-5 w-5 text-blue-600" />
                          Détails entreposage
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm"><span className="font-medium">Type articles :</span> {selectedQuote.storageItemType}</p>
                        <p className="text-sm"><span className="font-medium">Période :</span> du {formatDate(selectedQuote.storageStartDate)} au {formatDate(selectedQuote.storageEndDate)}</p>
                      </CardContent>
                    </Card>
                  )}

                  {selectedQuote.moveType === 'cleaning' && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-blue-600" />
                          Détails nettoyage
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm"><span className="font-medium">Adresse :</span> {selectedQuote.cleaningAddress}</p>
                        <p className="text-sm"><span className="font-medium">Type :</span> {selectedQuote.cleaningType === 'entreprise' ? 'Entreprise' : 'Appartement'}</p>
                        {selectedQuote.cleaningFloors && <p className="text-sm"><span className="font-medium">Étage :</span> {selectedQuote.cleaningFloors}</p>}
                        <p className="text-sm"><span className="font-medium">Inclusions :</span> {
                          selectedQuote.cleaningInclusions ?
                            Object.entries(selectedQuote.cleaningInclusions)
                              .filter(([_, v]) => v)
                              .map(([k]) => k === 'jardin' ? 'Jardin' : k === 'meuble' ? 'Meuble' : 'Mur')
                              .join(', ') : '-'
                        }</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Informations complémentaires */}
                {selectedQuote.additionalInfo && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Informations complémentaires</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                        {selectedQuote.additionalInfo}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Édition */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle>Modifier le devis</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du devis de {selectedQuote.firstName} {selectedQuote.lastName}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEditSubmit}>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" name="firstName" value={editFormData.firstName || ''} onChange={handleEditChange} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" name="lastName" value={editFormData.lastName || ''} onChange={handleEditChange} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={editFormData.email || ''} onChange={handleEditChange} />
                    </div>



                    <div>
                      <Label htmlFor="addressClient">Address Client</Label>
                      <Input id="addressClient" name="addressClient" type="text" value={editFormData.addressClient || ''} onChange={handleEditChange} />
                    </div>


                    <div>
                      <Label htmlFor="matriculeFiscaleClient">MF Client</Label>
                      <Input
                        id="matriculeFiscaleClient"
                        name="matriculeFiscaleClient"                // ✅ corrigé
                        type="text"
                        value={editFormData.matriculeFiscaleClient || ''}
                        onChange={handleEditChange}
                      />                    </div>


                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" name="phone" value={editFormData.phone || ''} onChange={handleEditChange} />
                    </div>
                    <div>
                      <Label htmlFor="moveType">Type de service</Label>
                      <Select
                        name="moveType"
                        value={editFormData.moveType || 'residential'}
                        onValueChange={(value) => setEditFormData(prev => ({ ...prev, moveType: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Résidentiel</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          {/* <SelectItem value="storage">Entreposage</SelectItem>
                          <SelectItem value="cleaning">Nettoyage</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="moveStartDate">Date souhaitée</Label>
                      <Input id="moveStartDate" name="moveStartDate" type="date" value={editFormData.moveStartDate ? editFormData.moveStartDate.substring(0, 10) : ''} onChange={handleEditChange} />
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-3">Informations supplémentaires</p>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="additionalInfo">Informations complémentaires</Label>
                        <textarea
                          id="additionalInfo"
                          name="additionalInfo"
                          rows={3}
                          value={editFormData.additionalInfo || ''}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Enregistrer les modifications
                  </Button>
                </DialogFooter>
              </form>
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
              Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.
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

export default QuoteDashboard;