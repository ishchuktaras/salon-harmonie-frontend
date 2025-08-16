"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  client?: any
  onClientCreate: (clientData: any) => void
  onClientUpdate: (clientId: string, clientData: any) => void
}

const commonAllergies = [
  "mandlový olej",
  "citrusy",
  "latex",
  "parfém",
  "lanolin",
  "parabeny",
  "sulfáty",
  "ořechy",
  "mléčné produkty",
  "gluten",
]

export function ClientModal({ isOpen, onClose, client, onClientCreate, onClientUpdate }: ClientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    massagePressure: "",
    favoriteTherapist: "",
    allergies: [] as string[],
    notes: "",
  })

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        dateOfBirth: client.dateOfBirth || "",
        address: client.address || "",
        massagePressure: client.preferences?.massagePressure || "",
        favoriteTherapist: client.preferences?.favoriteTherapist || "",
        allergies: client.preferences?.allergies || [],
        notes: client.preferences?.notes || "",
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        address: "",
        massagePressure: "",
        favoriteTherapist: "",
        allergies: [],
        notes: "",
      })
    }
  }, [client, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const clientData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      preferences: {
        massagePressure: formData.massagePressure,
        favoriteTherapist: formData.favoriteTherapist,
        allergies: formData.allergies,
        notes: formData.notes,
      },
    }

    if (client) {
      onClientUpdate(client.id, clientData)
    } else {
      onClientCreate(clientData)
    }
  }

  const handleAllergyToggle = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy],
    }))
  }

  const removeAllergy = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">{client ? "Upravit klienta" : "Nový klient"}</DialogTitle>
          <DialogDescription>
            {client ? "Upravte informace o klientovi" : "Přidejte nového klienta do systému"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Základní údaje</TabsTrigger>
              <TabsTrigger value="preferences">Preference</TabsTrigger>
              <TabsTrigger value="health">Zdravotní info</TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Jméno a příjmení *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Datum narození</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adresa</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="massagePressure">Preferovaný tlak při masáži</Label>
                  <Select
                    value={formData.massagePressure}
                    onValueChange={(value) => setFormData({ ...formData, massagePressure: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte tlak" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jemný">Jemný</SelectItem>
                      <SelectItem value="střední">Střední</SelectItem>
                      <SelectItem value="silný">Silný</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="favoriteTherapist">Oblíbený terapeut</Label>
                  <Select
                    value={formData.favoriteTherapist}
                    onValueChange={(value) => setFormData({ ...formData, favoriteTherapist: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte terapeuta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Anna Krásná">Anna Krásná</SelectItem>
                      <SelectItem value="Pavel Wellness">Pavel Wellness</SelectItem>
                      <SelectItem value="Lucie Harmonie">Lucie Harmonie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Poznámky</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Speciální požadavky, preference, poznámky..."
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* Health Information */}
            <TabsContent value="health" className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-4 block">Alergie</Label>

                {/* Selected allergies */}
                {formData.allergies.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-stone-700 mb-2">Vybrané alergie:</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive" className="bg-red-100 text-red-800">
                          {allergy}
                          <button
                            type="button"
                            onClick={() => removeAllergy(allergy)}
                            className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common allergies */}
                <div>
                  <div className="text-sm font-medium text-stone-700 mb-2">Běžné alergie:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {commonAllergies.map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={allergy}
                          checked={formData.allergies.includes(allergy)}
                          onCheckedChange={() => handleAllergyToggle(allergy)}
                        />
                        <Label htmlFor={allergy} className="text-sm">
                          {allergy}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-stone-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Zrušit
            </Button>
            <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
              {client ? "Uložit změny" : "Vytvořit klienta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
