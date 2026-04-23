"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Link,
  Map,
  Briefcase,
  Calendar,
  Users,
  Plus,
  X,
  FileText,
  Stamp,
  Upload,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

interface CompanyInfo {
  companyName: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  RIB: string;
  matriculeFiscal: string;
  postalCode: string;
  website: string;

  description: string;
  mondayFriday: string;
  saturday: string;
  sunday: string;
  cachet: string; // Ajout du champ cachet
  socials: { title: string; url: string }[];
  activityZones: string[];
  services: string[];
  foundedYear: number | null;
  employees: number | null;
  isAvailable24h: boolean;
}

const COMPANY_ID = process.env.NEXT_PUBLIC_COMPANY_ID;
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}/company/api/${COMPANY_ID}`;

export function CompanySettings() {
  const [info, setInfo] = useState<CompanyInfo>({
    companyName: "",
    logo: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    website: "",
    description: "",
    mondayFriday: "",
    RIB: "",
    saturday: "",
    sunday: "",
    matriculeFiscal: "",
    cachet: "", // Initialisation du cachet
    socials: [],
    activityZones: [],
    services: [],
    foundedYear: null,
    employees: null,
    isAvailable24h: false,
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCachet, setUploadingCachet] = useState(false);
  const cachetInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = response.data;
        setInfo({
          companyName: data.name || "",
          logo: data.logo || "",
          email: data.email || "",
          phone: data.phone || "",
          RIB: data.RIB || "",
          address: data.address ? data.address.split(",")[0].trim() : "",
          city: data.city || "",
          matriculeFiscal: data.matriculeFiscal || "",
          postalCode: data.postalCode || "",
          website: data.website || "",
          description: data.description || "",
          mondayFriday: data.hours?.mondayFriday || "",
          saturday: data.hours?.saturday || "",
          sunday: data.hours?.sunday || "",
          cachet: data.cachet || "", // Récupération du cachet
          socials: data.socials || [],
          activityZones: data.activityZones || [],
          services: data.services || [],
          foundedYear: data.foundedYear || null,
          employees: data.employees || null,
          isAvailable24h: data.isAvailable24h || false,
        });
      } catch (err) {
        console.error("Erreur chargement entreprise :", err);
        setError("Impossible de charger les informations.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  // Fonction pour convertir une image en base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Fonction pour compresser l'image en WebP
  const compressToWebP = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Redimensionnement si l'image est trop grande (max 800px de largeur)
          let width = img.width;
          let height = img.height;
          const maxWidth = 800;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(img, 0, 0, width, height);

          // Conversion en WebP avec qualité 0.8
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                  resolve(reader.result as string);
                };
              } else {
                reject(new Error("Erreur lors de la conversion en WebP"));
              }
            },
            "image/webp",
            0.8
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Gestionnaire pour l'upload du cachet
  const handleCachetUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du type de fichier
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Format d'image non supporté. Utilisez JPEG, PNG ou WebP.");
      return;
    }

    // Validation de la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 2 Mo.");
      return;
    }

    setUploadingCachet(true);
    setError(null);

    try {
      // Conversion en WebP base64
      const base64Image = await compressToWebP(file);
      setInfo({ ...info, cachet: base64Image });
    } catch (err) {
      console.error("Erreur lors de la conversion de l'image:", err);
      setError("Erreur lors du traitement de l'image.");
    } finally {
      setUploadingCachet(false);
    }
  };

  // Fonction pour supprimer le cachet
  const handleRemoveCachet = () => {
    setInfo({ ...info, cachet: "" });
    if (cachetInputRef.current) {
      cachetInputRef.current.value = "";
    }
  };

  // Gestionnaires pour les listes
  const handleAddSocial = () => {
    setInfo({
      ...info,
      socials: [...info.socials, { title: "", url: "" }],
    });
  };

  const handleSocialChange = (index: number, field: "title" | "url", value: string) => {
    const updated = [...info.socials];
    updated[index][field] = value;
    setInfo({ ...info, socials: updated });
  };

  const handleRemoveSocial = (index: number) => {
    setInfo({
      ...info,
      socials: info.socials.filter((_, i) => i !== index),
    });
  };

  const handleAddZone = () => {
    setInfo({
      ...info,
      activityZones: [...info.activityZones, ""],
    });
  };

  const handleZoneChange = (index: number, value: string) => {
    const updated = [...info.activityZones];
    updated[index] = value;
    setInfo({ ...info, activityZones: updated });
  };

  const handleRemoveZone = (index: number) => {
    setInfo({
      ...info,
      activityZones: info.activityZones.filter((_, i) => i !== index),
    });
  };

  const handleAddService = () => {
    setInfo({
      ...info,
      services: [...info.services, ""],
    });
  };

  const handleServiceChange = (index: number, value: string) => {
    const updated = [...info.services];
    updated[index] = value;
    setInfo({ ...info, services: updated });
  };

  const handleRemoveService = (index: number) => {
    setInfo({
      ...info,
      services: info.services.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const companyData = {
      name: info.companyName,
      email: info.email,
       RIB: info.RIB, 
      phone: info.phone,
      address: `${info.address}, ${info.postalCode} ${info.city}`.trim(),
      description: info.description,
      website: info.website,
      logo: info.logo,
      city: info.city,
      postalCode: info.postalCode,
      cachet: info.cachet, // Envoi du cachet en base64
      hours: {
        mondayFriday: info.mondayFriday,
        saturday: info.saturday,
        sunday: info.sunday,
      },
      socials: info.socials,
      activityZones: info.activityZones,
      matriculeFiscal: info.matriculeFiscal,
      services: info.services,
      foundedYear: info.foundedYear ? Number(info.foundedYear) : undefined,
      employees: info.employees ? Number(info.employees) : undefined,
      isAvailable24h: info.isAvailable24h,
    };

    try {
      const response = await axios.put(API_URL, companyData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Mise à jour réussie :", response.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde :", err);
      if (err.response) {
        const messages = err.response.data.details || [err.response.data.message];
        setError(messages.join(", "));
      } else if (err.request) {
        setError("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        setError("Une erreur inattendue s'est produite.");
      }
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Informations de l'Entreprise</CardTitle>
              <CardDescription>Gérez toutes les informations affichées sur votre site web</CardDescription>
            </div>
            <Button type="submit" className="bg-primary text-primary-foreground">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {saved && (
            <Alert className="border-green-500 bg-green-50">
              <Save className="h-4 w-4" />
              <AlertDescription>Informations sauvegardées avec succès !</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Identité */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Identité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input
                  id="companyName"
                  value={info.companyName}
                  onChange={(e) => setInfo({ ...info, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={info.description}
                  onChange={(e) => setInfo({ ...info, description: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Coordonnées */}
          <Card className="border-2 border-[oklch(0.60_0.18_230)]/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5 text-[oklch(0.60_0.18_230)]" />
                Coordonnées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={info.email}
                    onChange={(e) => setInfo({ ...info, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mf" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Matricule Fiscal *
                  </Label>
                  <Input
                    id="mf"
                    type="text"
                    value={info.matriculeFiscal}
                    onChange={(e) => setInfo({ ...info, matriculeFiscal: e.target.value })}
                    required
                  />
                </div>


                <div className="space-y-2">
                  <Label htmlFor="RIB" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    RIB *
                  </Label>
                  <Input
                    id="RIB"
                    type="text"
                    value={info.RIB ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInfo({ ...info, RIB: val }); // toujours string
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                    required
                  />
                </div>

                {/* Section Cachet - Upload d'image */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Stamp className="h-4 w-4" />
                    Cachet de l'entreprise
                  </Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => cachetInputRef.current?.click()}
                        disabled={uploadingCachet}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingCachet ? "Traitement..." : "Sélectionner une image"}
                      </Button>
                      {info.cachet && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={handleRemoveCachet}
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <input
                      ref={cachetInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleCachetUpload}
                      className="hidden"
                    />
                    {info.cachet && (
                      <div className="mt-2 p-3 border rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-2">Aperçu du cachet :</p>
                        <div className="flex justify-center">
                          <img
                            src={info.cachet || "/placeholder.svg"}
                            alt="Cachet de l'entreprise"
                            className="max-w-full h-auto max-h-32 object-contain border rounded-lg shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Formats acceptés : JPEG, PNG, WebP. Taille max : 2 Mo. L'image sera automatiquement convertie en WebP.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Site web
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={info.website}
                  onChange={(e) => setInfo({ ...info, website: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Adresse */}
          <Card className="border-2 border-[oklch(0.65_0.20_150)]/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[oklch(0.65_0.20_150)]" />
                Adresse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Rue *</Label>
                <Input
                  id="address"
                  value={info.address}
                  onChange={(e) => setInfo({ ...info, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    value={info.postalCode}
                    onChange={(e) => setInfo({ ...info, postalCode: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={info.city}
                    onChange={(e) => setInfo({ ...info, city: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horaires d'ouverture */}
          <Card className="border-2 border-[oklch(0.75_0.15_60)]/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-[oklch(0.75_0.15_60)]" />
                Horaires d'ouverture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mondayFriday">Lundi - Vendredi</Label>
                <Input
                  id="mondayFriday"
                  value={info.mondayFriday}
                  onChange={(e) => setInfo({ ...info, mondayFriday: e.target.value })}
                  placeholder="Ex: 08:00 - 18:00"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="saturday">Samedi</Label>
                  <Input
                    id="saturday"
                    value={info.saturday}
                    onChange={(e) => setInfo({ ...info, saturday: e.target.value })}
                    placeholder="Ex: 09:00 - 13:00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sunday">Dimanche</Label>
                  <Input
                    id="sunday"
                    value={info.sunday}
                    onChange={(e) => setInfo({ ...info, sunday: e.target.value })}
                    placeholder="Ex: Fermé"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Réseaux sociaux */}
          <Card className="border-2 border-[oklch(0.55_0.25_280)]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Link className="h-5 w-5 text-[oklch(0.55_0.25_280)]" />
                  Réseaux sociaux
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={handleAddSocial}>
                  <Plus className="h-4 w-4 mr-1" /> Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {info.socials.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun lien social ajouté.</p>
              )}
              {info.socials.map((social, index) => (
                <div key={index} className="flex items-start gap-2 border p-3 rounded-md">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Titre (ex: Facebook)"
                      value={social.title}
                      onChange={(e) => handleSocialChange(index, "title", e.target.value)}
                    />
                    <Input
                      placeholder="URL"
                      type="url"
                      value={social.url}
                      onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSocial(index)}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Zones d'activité */}
          <Card className="border-2 border-[oklch(0.70_0.18_120)]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Map className="h-5 w-5 text-[oklch(0.70_0.18_120)]" />
                  Zones d'activité
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={handleAddZone}>
                  <Plus className="h-4 w-4 mr-1" /> Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {info.activityZones.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune zone d'activité.</p>
              )}
              {info.activityZones.map((zone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={zone}
                    onChange={(e) => handleZoneChange(index, e.target.value)}
                    placeholder="Ex: Île-de-France"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveZone(index)}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="border-2 border-[oklch(0.65_0.20_200)]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[oklch(0.65_0.20_200)]" />
                  Services
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={handleAddService}>
                  <Plus className="h-4 w-4 mr-1" /> Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {info.services.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun service.</p>
              )}
              {info.services.map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={service}
                    onChange={(e) => handleServiceChange(index, e.target.value)}
                    placeholder="Ex: Déménagement résidentiel"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveService(index)}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Autres informations */}
          <Card className="border-2 border-[oklch(0.50_0.20_300)]/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[oklch(0.50_0.20_300)]" />
                Informations complémentaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Année de fondation</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    value={info.foundedYear ?? ""}
                    onChange={(e) =>
                      setInfo({ ...info, foundedYear: e.target.value ? Number(e.target.value) : null })
                    }
                    placeholder="Ex: 2010"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employees">Nombre d'employés</Label>
                  <Input
                    id="employees"
                    type="number"
                    value={info.employees ?? ""}
                    onChange={(e) =>
                      setInfo({ ...info, employees: e.target.value ? Number(e.target.value) : null })
                    }
                    placeholder="Ex: 50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isAvailable24h"
                  checked={info.isAvailable24h}
                  onCheckedChange={(checked) =>
                    setInfo({ ...info, isAvailable24h: checked === true })
                  }
                />
                <Label htmlFor="isAvailable24h" className="cursor-pointer">
                  Disponible 24h/24
                </Label>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </form>
  );
}