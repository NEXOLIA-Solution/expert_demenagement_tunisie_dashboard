import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { toPng } from 'html-to-image';
import Image from 'next/image';
import logo from "../../public/logoAla.png"
// Types (identiques à avant)
interface Item {
  description: string;
  quantite: number;
  unite: string;
  prixHT: number;
  _id?: string;
}

interface Invoice {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressClient: string;
  matriculeFiscaleClient: string;
  moveType: string;
  pickupAddress: string;
  pickupFloors: number;
  pickupElevator: string;
  deliveryAddress: string;
  deliveryFloors: number;
  deliveryElevator: string;
  priceHT: number;
  tvaRate: number;
  priceTTC: number;
  timbre: number;
  dateFacture: string;
  NombreJourePayement: number;
  items: Item[];
  createdAt: string;
  updatedAt: string;
  dateEcheancie: string;
  Numerofacture: string;
}

interface FormDataState {
  NombreJourePayement: number | string;
  Numerofacture: string;
  timbre: number | string;
  items: Item[];
}

interface Notification {
  message: string;
  type: 'success' | 'error' | '';
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
  RIB?: string;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}/facture/api`;
const COMPANY_API_URL = `${process.env.NEXT_PUBLIC_API_BASE}/company/api/${process.env.NEXT_PUBLIC_COMPANY_ID}`;

const InvoicesList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    NombreJourePayement: '',
    Numerofacture: '',
    timbre: '',
    items: []
  });
  const [notification, setNotification] = useState<Notification>({ message: '', type: '' });
  const [company, setCompany] = useState<CompanyData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    matriculeFiscal: '',
    RIB:''
  });
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Chargement des données entreprise
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(COMPANY_API_URL);
        setCompany({
          name: response.data.name ,
          email: response.data.email,
          phone: response.data.phone ,
          address: response.data.address ,
          matriculeFiscal: response.data.matriculeFiscal ,
          logo: response.data.logo,
          cachet: response.data.cachet,
          city: response.data.city,
          RIB: response.data.RIB
        });
      } catch (err) {
        console.error("Erreur chargement entreprise:", err);
      }
    };
    fetchCompanyData();
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Invoice[] | { factures: Invoice[] }>(`${API_BASE_URL}/`);
      const data = response.data;
      const factures = Array.isArray(data) ? data : data.factures || [];
      setInvoices(factures);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Erreur lors du chargement des factures');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Supprimer définitivement cette facture ?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setNotification({ message: 'Facture supprimée avec succès', type: 'success' });
      setInvoices(invoices.filter(inv => inv._id !== id));
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    } catch (err) {
      const axiosError = err as AxiosError;
      setNotification({ message: `Erreur suppression: ${axiosError.message}`, type: 'error' });
    }
  };

  const openEditModal = (invoice: Invoice): void => {
    setEditingInvoice(invoice);
    setFormData({
      NombreJourePayement: invoice.NombreJourePayement || '',
      Numerofacture: invoice.Numerofacture || '',
      timbre: invoice.timbre || '',
      items: invoice.items ? [...invoice.items] : []
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: keyof Item, value: string | number): void => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = (): void => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantite: 1, unite: '', prixHT: 0 }]
    }));
  };

  const removeItem = (index: number): void => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleUpdate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!editingInvoice) return;
    try {
      const payload = {
        NombreJourePayement: Number(formData.NombreJourePayement),
        Numerofacture: formData.Numerofacture,
        timbre: Number(formData.timbre),
        items: formData.items.map(item => ({
          description: item.description,
          quantite: Number(item.quantite),
          unite: item.unite,
          prixHT: Number(item.prixHT)
        }))
      };
      const response = await axios.put<{ facture: Invoice }>(`${API_BASE_URL}/${editingInvoice._id}`, payload);
      setInvoices(invoices.map(inv => (inv._id === editingInvoice._id ? response.data.facture : inv)));
      setNotification({ message: 'Facture mise à jour', type: 'success' });
      setEditingInvoice(null);
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    } catch (err) {
      const axiosError = err as AxiosError;
      setNotification({ message: `Erreur mise à jour: ${axiosError.message}`, type: 'error' });
    }
  };

  // Ouvre le modal de visualisation
  const openViewModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  // Téléchargement de la facture en image PNG
  const downloadInvoiceAsImage = async () => {
    const element = document.getElementById('invoice-document-content');
    if (!element) {
      alert('Élément introuvable');
      return;
    }
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `facture-${selectedInvoice?.Numerofacture || selectedInvoice?._id.slice(-6)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error: any) {
      console.error('Erreur génération image:', error);
      alert(`Erreur lors de la génération de l'image : ${error?.message || 'inconnue'}`);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND' }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) return <div className="text-center py-10 text-blue-600 text-lg">📄 Chargement des factures...</div>;
  if (error) return <div className="text-center py-10 text-red-600 text-lg">⚠️ {error}</div>;
  if (invoices.length === 0) return <div className="text-center py-10 text-gray-500 text-lg">🧾 Aucune facture trouvée.</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      {/* En-tête avec notification */}
      <div className="flex justify-between items-center flex-wrap mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          🧾 Toutes les factures
          <span className="ml-2 bg-blue-500 text-white text-sm px-3 py-1 rounded-full">{invoices.length}</span>
        </h2>
        {notification.message && (
          <div className={`px-4 py-2 rounded-lg shadow-md ${notification.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'}`}>
            {notification.message}
          </div>
        )}
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">N° Facture</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Montant TTC</th>
              <th className="px-4 py-3 text-left">Timbre</th>
              <th className="px-4 py-3 text-left">Date facture</th>
              <th className="px-4 py-3 text-left">Échéance (jours)</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv._id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3" data-label="N° Facture">{inv.Numerofacture || '-'}</td>
                <td className="px-4 py-3" data-label="Client">{inv.firstName} {inv.lastName}</td>
                <td className="px-4 py-3" data-label="Email">{inv.email}</td>
                <td className="px-4 py-3" data-label="Montant TTC">{formatCurrency(inv.priceTTC)}</td>
                <td className="px-4 py-3" data-label="Timbre">{formatCurrency(inv.timbre)}</td>
                <td className="px-4 py-3" data-label="Date facture">{formatDate(inv.dateFacture)}</td>
                <td className="px-4 py-3" data-label="Échéance">{inv.NombreJourePayement} jours</td>
                <td className="px-4 py-3" data-label="Actions">
                  <button onClick={() => openViewModal(inv)} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full mr-2 hover:bg-indigo-200 transition">📄 Télécharger</button>
                  <button onClick={() => openEditModal(inv)} className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full mr-2 hover:bg-sky-200 transition">✏️ Modifier</button>
                  <button onClick={() => handleDelete(inv._id)} className="bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition">🗑️ Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'édition (inchangé) */}
      {editingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setEditingInvoice(null)}>
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Modifier la facture n° {editingInvoice.Numerofacture}</h3>
              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label className="block font-semibold text-slate-700 mb-1">Numéro de facture</label>
                  <input type="text" name="Numerofacture" value={formData.Numerofacture} onChange={handleInputChange} required className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none" />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold text-slate-700 mb-1">Nombre de jours de paiement</label>
                  <input type="number" name="NombreJourePayement" value={formData.NombreJourePayement} onChange={handleInputChange} required className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none" />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold text-slate-700 mb-1">Timbre (€)</label>
                  <input type="number" name="timbre" value={formData.timbre} onChange={handleInputChange} required className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none" />
                </div>

                <h4 className="font-semibold text-slate-800 mt-4 mb-2">Articles / Prestations</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
                  <div className="grid grid-cols-[2fr,1fr,1fr,1fr,0.5fr] bg-slate-100 p-2 font-semibold text-slate-700 text-sm">
                    <span>Description</span>
                    <span>Quantité</span>
                    <span>Unité</span>
                    <span>Prix HT (€)</span>
                    <span>Action</span>
                  </div>
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[2fr,1fr,1fr,1fr,0.5fr] gap-2 p-2 border-t border-slate-200 items-center">
                      <input type="text" value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} required className="border border-slate-300 rounded-lg px-2 py-1 text-sm" />
                      <input type="number" value={item.quantite} onChange={e => handleItemChange(idx, 'quantite', Number(e.target.value))} required className="border border-slate-300 rounded-lg px-2 py-1 text-sm" />
                      <input type="text" value={item.unite} onChange={e => handleItemChange(idx, 'unite', e.target.value)} required className="border border-slate-300 rounded-lg px-2 py-1 text-sm" />
                      <input type="number" value={item.prixHT} onChange={e => handleItemChange(idx, 'prixHT', Number(e.target.value))} required className="border border-slate-300 rounded-lg px-2 py-1 text-sm" />
                      <button type="button" onClick={() => removeItem(idx)} className="bg-red-100 text-red-600 rounded-full px-2 py-1 hover:bg-red-200 transition">✖</button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addItem} className="text-blue-600 border border-dashed border-blue-400 rounded-full px-4 py-1 mb-4 hover:bg-blue-50 transition">+ Ajouter un article</button>

                <div className="flex justify-end gap-3 mt-6">
                  <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition">Enregistrer</button>
                  <button type="button" onClick={() => setEditingInvoice(null)} className="bg-slate-200 text-slate-700 px-5 py-2 rounded-full hover:bg-slate-300 transition">Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation de la facture (avec téléchargement) */}
     {/* Modal de visualisation de la facture (avec téléchargement) */}
{isViewModalOpen && selectedInvoice && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsViewModalOpen(false)}>
    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
      <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
        <button onClick={downloadInvoiceAsImage} className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-green-700 transition">
          ⬇️ Télécharger en image
        </button>
      </div>
      <div className="p-6 flex justify-center">
        <div id="invoice-document-content" className="bg-white p-8 border shadow-lg rounded-lg" style={{ width: '800px', fontFamily: "'Inter', sans-serif" }}>
          
          {/* En-tête avec logo */}
          <div className="flex justify-between items-start pb-6 border-b-2 border-blue-200">
            <div className="flex items-center gap-4">
              {company.logo && (
                <img src={company.logo} alt="Logo" className="h-16 w-auto object-contain" />
              )}
              <div>
                <Image alt='logo' src={logo} width={120} />
                <h1 className="text-2xl font-bold text-gray-800">{company.name}</h1>
                <p className="text-sm text-gray-500">{company.address}</p>
                <p className="text-sm text-gray-500">Tél : {company.phone} | Email : {company.email}</p>
                <p className="text-sm text-gray-500">Matricule fiscale : {company.matriculeFiscal}</p>
                <p className="text-sm text-gray-500">RIB : {company.RIB}</p>
                
              </div>
            </div>
            <div className="text-right">
              <div className="px-6 py-3 rounded-lg border border-blue-200 bg-blue-50">
                <h2 className="text-3xl font-bold text-blue-700">FACTURE {selectedInvoice.Numerofacture} </h2>
              </div>
            </div>
          </div>

          {/* Informations Client + Informations Facture (côte à côte) */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            {/* Colonne Client */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Client</h3>
              <p className="text-lg font-semibold">{selectedInvoice.firstName} {selectedInvoice.lastName}</p>
              <p className="text-sm">{selectedInvoice.email} | {selectedInvoice.phone}</p>
              <p className="text-sm">Adresse : {selectedInvoice.addressClient}</p>
              <p className="text-sm">Matricule fiscale : {selectedInvoice.matriculeFiscaleClient}</p>
            </div>

            {/* Colonne Informations facture */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Détails facture</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Date de facture :</span> {formatDate(selectedInvoice.dateFacture)}</p>
                <p><span className="font-medium">Conditions de paiement :</span> {selectedInvoice.NombreJourePayement} jours</p>
                <p><span className="font-medium">Date d’échéance :</span> {formatDate(selectedInvoice.dateEcheancie)}</p>
              </div>
            </div>
          </div>

          {/* Tableau des articles */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Détail des prestations</h3>
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-left">Quantité</th>
                  <th className="border p-2 text-left">Unité</th>
                  <th className="border p-2 text-right">Prix HT</th>
                  <th className="border p-2 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{item.description}</td>
                    <td className="border p-2">{item.quantite}</td>
                    <td className="border p-2">{item.unite}</td>
                    <td className="border p-2 text-right">{formatCurrency(item.prixHT)}</td>
                    <td className="border p-2 text-right">{formatCurrency(item.prixHT * item.quantite)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totaux et timbre */}
          <div className="mt-6 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-1">
                <span>Total HT :</span>
                <span className="font-semibold">{formatCurrency(selectedInvoice.priceHT)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>TVA ({selectedInvoice.tvaRate}%) :</span>
                <span>{formatCurrency(selectedInvoice.priceHT * selectedInvoice.tvaRate / 100)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Timbre :</span>
                <span>{formatCurrency(selectedInvoice.timbre)}</span>
              </div>
              <div className="flex justify-between py-1 text-lg font-bold border-t pt-2">
                <span>Total TTC :</span>
                <span>{formatCurrency(selectedInvoice.priceTTC)}</span>
              </div>
            </div>
          </div>

          {/* Cachet et signature */}
          <div className="mt-6 flex justify-between items-end">
            <div className="text-xs text-gray-500">
              <p>✓ Facture à régler dans les {selectedInvoice.NombreJourePayement} jours</p>
              <p>✓ RIB : 07505006612167725677</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Cachet et signature</p>
              {company.cachet ? (
                <img src={company.cachet} alt="Cachet" className="h-16 w-auto opacity-80" />
              ) : (
                <div className="w-32 h-12 border-b-2 border-gray-400 border-dashed"></div>
              )}
              <p className="text-xs text-gray-400 mt-1">Fait à {company.city || 'Tunis'}, le {formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Responsive : transformation en cartes sur petits écrans */}
      <style>{`
        @media (max-width: 640px) {
          table thead { display: none; }
          table tbody tr { display: block; margin-bottom: 1rem; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 0.5rem; }
          table tbody td { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 1px solid #e2e8f0; }
          table tbody td:last-child { border-bottom: none; }
          table tbody td::before { content: attr(data-label); font-weight: 600; color: #0f172a; }
          .grid-cols-[2fr,1fr,1fr,1fr,0.5fr] { grid-template-columns: 1fr !important; gap: 0.5rem !important; }
          .items-header { display: none; }
          .item-row { border: 1px solid #e2e8f0; border-radius: 1rem; margin-bottom: 0.5rem; padding: 0.5rem; }
        }
      `}</style>
    </div>
  );
};

export default InvoicesList;