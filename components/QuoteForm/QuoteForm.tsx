// components/QuoteForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QuoteFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function QuoteForm({ onSuccess, onError, className = '' }: QuoteFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    addressClient: '',
    matriculeFiscaleClient: '',
    phone: '',
    moveType: 'residential',
    pickupAddress: '',
    pickupFloors: '',
    pickupElevator: '',
    deliveryAddress: '',
    deliveryFloors: '',
    deliveryElevator: '',
    cleaningAddress: '',
    cleaningType: '',
    cleaningFloors: '',
    cleaningInclusions: { jardin: false, meuble: false, mur: false },
    storageItemType: '',
    storageStartDate: null as Date | null,
    storageEndDate: null as Date | null,
    quoteDate: null as Date | null,
    moveStartDate: null as Date | null,
    additionalInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    field: keyof typeof formData.cleaningInclusions,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      cleaningInclusions: { ...prev.cleaningInclusions, [field]: checked },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!formData.moveType) {
      const errMsg = 'Veuillez sélectionner un type de service.';
      setError(errMsg);
      onError?.(errMsg);
      setLoading(false);
      return;
    }

    try {
      const payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        moveType: formData.moveType,
        addressClient: formData.addressClient,
        matriculeFiscaleClient: formData.matriculeFiscaleClient,
      };

      if (formData.quoteDate) payload.quoteDate = formData.quoteDate;
      if (formData.moveStartDate) payload.moveStartDate = formData.moveStartDate;
      if (formData.additionalInfo) payload.additionalInfo = formData.additionalInfo;

      // Déménagement / entreposage (adresse de départ)
      if (formData.moveType !== 'cleaning') {
        if (formData.pickupAddress) payload.pickupAddress = formData.pickupAddress;
        if (formData.pickupFloors !== '') payload.pickupFloors = Number(formData.pickupFloors);
        if (formData.pickupElevator) payload.pickupElevator = formData.pickupElevator;

        // Adresse d'arrivée (sauf pour storage)
        if (formData.moveType !== 'storage') {
          if (formData.deliveryAddress) payload.deliveryAddress = formData.deliveryAddress;
          if (formData.deliveryFloors !== '') payload.deliveryFloors = Number(formData.deliveryFloors);
          if (formData.deliveryElevator) payload.deliveryElevator = formData.deliveryElevator;
        }
      }

      // Nettoyage
      if (formData.moveType === 'cleaning') {
        if (formData.cleaningAddress) payload.cleaningAddress = formData.cleaningAddress;
        if (formData.cleaningType) payload.cleaningType = formData.cleaningType;
        if (formData.cleaningFloors !== '') payload.cleaningFloors = Number(formData.cleaningFloors);

        const hasInclusion = Object.values(formData.cleaningInclusions).some((v) => v === true);
        if (hasInclusion) {
          payload.cleaningInclusions = formData.cleaningInclusions;
        }
      }

      // Entreposage
      if (formData.moveType === 'storage') {
        if (formData.storageItemType) payload.storageItemType = formData.storageItemType;
        if (formData.storageStartDate) payload.storageStartDate = formData.storageStartDate;
        if (formData.storageEndDate) payload.storageEndDate = formData.storageEndDate;
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/quote/api`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSuccess(true);
      onSuccess?.();

      
    } catch (err: any) {
      console.error('Erreur détaillée :', err.response?.data);
      const errMsg = err.response?.data?.message || "Une erreur est survenue lors de l'envoi du devis.";
      setError(errMsg);
      onError?.(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <Card className="backdrop-blur bg-background/80 shadow-xl border-muted/30">
          <CardHeader>
            <CardTitle className="text-2xl">Formulaire de devis gratuit</CardTitle>
            <CardDescription>
              Réponse rapide sous 24h par notre équipe.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Votre demande de devis a été envoyée avec succès ! Nous vous répondrons sous 24h.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations personnelles */}
              <div>
                <h3 className="text-lg font-bold mb-4">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Prénom *"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                  />
                  <Input
                    placeholder="Nom *"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Email *"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                  <Input
                    type="tel"
                    placeholder="Téléphone *"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Adresse de l’entreprise cliente *"
                    required
                    value={formData.addressClient}
                    onChange={(e) => handleChange('addressClient', e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="MF: 1857856Z/N/N/000"
                    required
                    value={formData.matriculeFiscaleClient}
                    onChange={(e) => handleChange('matriculeFiscaleClient', e.target.value)}
                  />
                </div>
              </div>

              {/* Détails du déménagement */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Détails du déménagement</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    value={formData.moveType}
                    onValueChange={(value) => handleChange('moveType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de déménagement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Résidentiel</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="cleaning">Nettoyage</SelectItem>
                      <SelectItem value="storage">Entreposage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Déménagement (résidentiel/commercial) ou entreposage - adresse de départ */}
                {formData.moveType && formData.moveType !== 'cleaning' && (
                  <>
                    <div className="mt-4 space-y-2">
                      <label className="text-sm font-medium">
                        {formData.moveType === 'storage'
                          ? 'Adresse de collecte des affaires *'
                          : 'Adresse de départ *'}
                      </label>
                      <Input
                        placeholder="Adresse"
                        required
                        value={formData.pickupAddress}
                        onChange={(e) => handleChange('pickupAddress', e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Nombre d'étages"
                          value={formData.pickupFloors}
                          onChange={(e) => handleChange('pickupFloors', e.target.value)}
                        />
                        <Select
                          value={formData.pickupElevator}
                          onValueChange={(value) => handleChange('pickupElevator', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Ascenseur ?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="oui">Oui</SelectItem>
                            <SelectItem value="non">Non</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Adresse d'arrivée sauf pour storage */}
                    {formData.moveType !== 'storage' && (
                      <div className="mt-4 space-y-2">
                        <label className="text-sm font-medium">Adresse d'arrivée *</label>
                        <Input
                          placeholder="Adresse d'arrivée"
                          required
                          value={formData.deliveryAddress}
                          onChange={(e) => handleChange('deliveryAddress', e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Nombre d'étages"
                            value={formData.deliveryFloors}
                            onChange={(e) => handleChange('deliveryFloors', e.target.value)}
                          />
                          <Select
                            value={formData.deliveryElevator}
                            onValueChange={(value) => handleChange('deliveryElevator', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Ascenseur ?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="oui">Oui</SelectItem>
                              <SelectItem value="non">Non</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Nettoyage */}
                {formData.moveType === 'cleaning' && (
                  <div className="mt-6 p-4 border rounded-lg bg-muted/20">
                    <h4 className="font-semibold mb-3">Détails du nettoyage</h4>
                    <div className="space-y-4">
                      <Input
                        placeholder="Adresse du local *"
                        required
                        value={formData.cleaningAddress}
                        onChange={(e) => handleChange('cleaningAddress', e.target.value)}
                      />
                      <Select
                        value={formData.cleaningType}
                        onValueChange={(value) => handleChange('cleaningType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type de local" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entreprise">Entreprise</SelectItem>
                          <SelectItem value="appartement">Appartement</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Nombre d'étages"
                        value={formData.cleaningFloors}
                        onChange={(e) => handleChange('cleaningFloors', e.target.value)}
                      />
                      <div>
                        <label className="text-sm font-medium block mb-2">Nettoyage inclus :</label>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="jardin"
                              checked={formData.cleaningInclusions.jardin}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange('jardin', checked === true)
                              }
                            />
                            <label htmlFor="jardin">Jardin</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="meuble"
                              checked={formData.cleaningInclusions.meuble}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange('meuble', checked === true)
                              }
                            />
                            <label htmlFor="meuble">Meuble</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="mur"
                              checked={formData.cleaningInclusions.mur}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange('mur', checked === true)
                              }
                            />
                            <label htmlFor="mur">Mur et sol</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Entreposage */}
                {formData.moveType === 'storage' && (
                  <div className="mt-6 p-4 border rounded-lg bg-muted/20">
                    <h4 className="font-semibold mb-3">Détails de l'entreposage</h4>
                    <div className="space-y-4">
                      <Input
                        placeholder="Type de meuble *"
                        required
                        value={formData.storageItemType}
                        onChange={(e) => handleChange('storageItemType', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.storageStartDate
                                ? formData.storageStartDate.toLocaleDateString()
                                : 'Date de début'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.storageStartDate || undefined}
                              onSelect={(date) => handleChange('storageStartDate', date)}
                            />
                          </PopoverContent>
                        </Popover>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.storageEndDate
                                ? formData.storageEndDate.toLocaleDateString()
                                : 'Date de fin'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.storageEndDate || undefined}
                              onSelect={(date) => handleChange('storageEndDate', date)}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dates communes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.quoteDate ? formData.quoteDate.toLocaleDateString() : 'Date de devis'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.quoteDate || undefined}
                        onSelect={(date) => handleChange('quoteDate', date)}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.moveStartDate
                          ? formData.moveStartDate.toLocaleDateString()
                          : 'Date de début du déménagement'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.moveStartDate || undefined}
                        onSelect={(date) => handleChange('moveStartDate', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Informations complémentaires */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Informations complémentaires</h3>
                <Textarea
                  rows={5}
                  placeholder="Objets fragiles, contraintes particulières..."
                  value={formData.additionalInfo}
                  onChange={(e) => handleChange('additionalInfo', e.target.value)}
                />
              </div>

              {/* Bouton de soumission */}
              <Button type="submit" size="lg" className="w-full text-lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer ma demande de devis'
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Devis gratuit • Sans engagement • Réponse sous 24h
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}