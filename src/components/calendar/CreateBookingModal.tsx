"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reservationsApi } from "@/lib/api/reservations";
import { clientsApi } from "@/lib/api/clients";
import { servicesApi } from "@/lib/api/services";
import { Client, Service, Reservation } from "@/lib/api/types";
import { therapistsApi } from "@/lib/api/therapists";
import { User } from "@/lib/api/types";


// --- OPRAVA ZDE (1): Rozšířené props pro modal ---
interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date; // Pro předvyplnění data
  existingReservation?: Reservation; // Pro režim úprav
}

// Počáteční stav formuláře
const initialFormState = {
  clientId: "",
  serviceId: "",
  therapistId: "",
  startTime: "",
  notes: "",
};

export default function CreateBookingModal({
  isOpen,
  onClose,
  onSuccess,
  initialDate,
  existingReservation,
}: CreateBookingModalProps) {
  const isEditMode = !!existingReservation;

  const [formData, setFormData] = useState(initialFormState);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [therapists, setTherapists] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Načtení dat pro select boxy
  useEffect(() => {
    async function loadDropdownData() {
      try {
        const [clientsData, servicesData, therapistsData] = await Promise.all([
          clientsApi.getAll(),
          servicesApi.getAll(),
          therapistsApi.getAll(),
        ]);
        setClients(clientsData);
        setServices(servicesData);
        setTherapists(therapistsData);
      } catch (err) {
        setError("Nepodařilo se načíst data pro formulář.");
      }
    }
    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen]);

  // Efekt pro předvyplnění formuláře
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && existingReservation) {
        setFormData({
          clientId: existingReservation.clientId?.toString() || "",
          serviceId: existingReservation.serviceId?.toString() || "",
          therapistId: existingReservation.therapistId?.toString() || "",
          startTime: new Date(existingReservation.startTime).toISOString().slice(0, 16),
          notes: existingReservation.notes || "",
        });
      } else if (initialDate) {
        setFormData({
          ...initialFormState,
          startTime: new Date(initialDate).toISOString().slice(0, 16),
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, isEditMode, existingReservation, initialDate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const selectedService = services.find(s => s.id.toString() === formData.serviceId);
    const duration = selectedService?.duration ?? 60;
    const startTime = new Date(formData.startTime);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    const payload = {
      ...formData,
      clientId: parseInt(formData.clientId, 10),
      serviceId: parseInt(formData.serviceId, 10),
      therapistId: parseInt(formData.therapistId, 10),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    try {
      if (isEditMode) {
        await reservationsApi.update(existingReservation.id.toString(), payload);
      } else {
        await reservationsApi.create(payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save reservation:", err);
      setError("Nepodařilo se uložit rezervaci.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Upravit Rezervaci" : "Vytvořit Novou Rezervaci"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Klient */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientId" className="text-right">Klient</Label>
              <Select name="clientId" value={formData.clientId} onValueChange={(value: string) => handleSelectChange("clientId", value)}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Vyberte klienta" /></SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id.toString()}>{client.firstName} {client.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Služba */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceId" className="text-right">Služba</Label>
               <Select name="serviceId" value={formData.serviceId} onValueChange={(value: string) => handleSelectChange("serviceId", value)}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Vyberte službu" /></SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id.toString()}>{service.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Terapeut */}
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="therapistId" className="text-right">Terapeut</Label>
               <Select name="therapistId" value={formData.therapistId} onValueChange={(value: string) => handleSelectChange("therapistId", value)}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Vyberte terapeuta" /></SelectTrigger>
                <SelectContent>
                  {therapists.map(therapist => (
                    <SelectItem key={therapist.id} value={therapist.id.toString()}>{therapist.firstName} {therapist.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Čas */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">Začátek</Label>
              <Input id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} type="datetime-local" className="col-span-3" />
            </div>
            {/* Poznámky */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Poznámky</Label>
              <Input id="notes" name="notes" value={formData.notes} onChange={handleChange} className="col-span-3" />
            </div>
            {error && <p className="col-span-4 text-red-500 text-sm text-center">{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary" onClick={onClose}>Zrušit</Button></DialogClose>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Ukládám..." : (isEditMode ? "Uložit změny" : "Vytvořit rezervaci")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

