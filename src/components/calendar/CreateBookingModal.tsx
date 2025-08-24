"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { cs } from 'date-fns/locale';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Check, } from "lucide-react"; 
import { ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

import { Client, Service, Therapist } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";
import { reservationsApi } from "@/lib/api/reservations";


const bookingFormSchema = z.object({
  clientId: z.string().min(1, { message: "Prosím vyberte klienta." }),
  serviceId: z.string().min(1, { message: "Prosím vyberte službu." }),
  therapistId: z.string().min(1, { message: "Prosím vyberte terapeuta." }),
  startDate: z.date(),
  time: z.string().min(1, { message: "Prosím zadejte čas." }),
}).refine(data => {
}).superRefine((data, ctx) => {
    if (!data.startDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Prosím vyberte datum.",
            path: ["startDate"],
        });
    }
    if (!data.startDate || !data.time) return;
    const [hours, minutes] = data.time.split(':').map(Number);
    const startTime = new Date(data.startDate);
    startTime.setHours(hours, minutes, 0, 0);
    const now = new Date();
    now.setSeconds(0, 0);
    if (startTime < now) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Datum a čas nesmí být v minulosti.",
            path: ["time"],
        });
    }
});
interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBookingModal({ isOpen, onClose, onSuccess }: CreateBookingModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);

  const [clientPopoverOpen, setClientPopoverOpen] = useState(false);
  const [servicePopoverOpen, setServicePopoverOpen] = useState(false);
  const [therapistPopoverOpen, setTherapistPopoverOpen] = useState(false);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      clientId: "",
      serviceId: "",
      therapistId: "",
      startDate: undefined,
      time: "",
    }
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [clientsData, servicesData, therapistsData] = await Promise.all([
            apiClient.get<Client[]>('/clients'),
            apiClient.get<Service[]>('/services'),
            apiClient.get<Therapist[]>('/users?role=TERAPEUT'),
          ]);
          setClients(clientsData);
          setServices(servicesData);
          setTherapists(therapistsData);
        } catch (error) {
          console.error("Chyba při načítání dat pro formulář:", error);
        }
      };
      fetchData();
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: z.infer<typeof bookingFormSchema>) => {
    try {
        const selectedService = services.find(s => s.id === data.serviceId);
        if (!selectedService) {
            throw new Error("Vybraná služba nebyla nalezena.");
        }

        const [hours, minutes] = data.time.split(':').map(Number);
        const startTime = new Date(data.startDate);
        startTime.setHours(hours, minutes);

        const endTime = new Date(startTime.getTime() + selectedService.duration * 60000);

        await reservationsApi.create({
            clientId: data.clientId,
            serviceId: data.serviceId,
            therapistId: data.therapistId,
            endTime: endTime.toISOString(),
            startTime: startTime.toISOString(),
        });
        
        onSuccess();
        onClose();
    } catch (error) {
        console.error("Nepodařilo se vytvořit rezervaci:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Vytvořit novou rezervaci</DialogTitle>
          <DialogDescription>
            Vyplňte údaje pro vytvoření nové rezervace.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Klient */}
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Klient</FormLabel>
                    <Popover open={clientPopoverOpen} onOpenChange={setClientPopoverOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                    {field.value ? `${clients.find((c) => c.id === field.value)?.firstName} ${clients.find((c) => c.id === field.value)?.lastName}` : "Vybrat klienta"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                           <Command>
                                <CommandInput placeholder="Hledat klienta..." />
                                <CommandList>
                                    <CommandEmpty>Žádný klient nenalezen.</CommandEmpty>
                                    <CommandGroup>
                                        {clients.map((client) => (
                                            <CommandItem value={`${client.firstName} ${client.lastName}`} key={client.id} onSelect={() => {
                                                form.setValue("clientId", client.id, { shouldValidate: true });
                                                setClientPopoverOpen(false);
                                            }}>
                                                <Check className={cn("mr-2 h-4 w-4", client.id === field.value ? "opacity-100" : "opacity-0")} />
                                                {client.firstName} {client.lastName}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                           </Command>
                        </PopoverContent>
                    </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Služba */}
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Služba</FormLabel>
                    <Popover open={servicePopoverOpen} onOpenChange={setServicePopoverOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                    {field.value ? services.find((s) => s.id === field.value)?.name : "Vybrat službu"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                           <Command>
                                <CommandInput placeholder="Hledat službu..." />
                                <CommandList>
                                    <CommandEmpty>Žádná služba nenalezena.</CommandEmpty>
                                    <CommandGroup>
                                        {services.map((service) => (
                                            <CommandItem value={service.name} key={service.id} onSelect={() => {
                                                form.setValue("serviceId", service.id, { shouldValidate: true });
                                                setServicePopoverOpen(false);
                                            }}>
                                                <Check className={cn("mr-2 h-4 w-4", service.id === field.value ? "opacity-100" : "opacity-0")} />
                                                {service.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                           </Command>
                        </PopoverContent>
                    </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terapeut */}
            <FormField
              control={form.control}
              name="therapistId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Terapeut</FormLabel>
                    <Popover open={therapistPopoverOpen} onOpenChange={setTherapistPopoverOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                    {field.value ? `${therapists.find((t) => t.id === field.value)?.firstName} ${therapists.find((t) => t.id === field.value)?.lastName}` : "Vybrat terapeuta"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                           <Command>
                                <CommandInput placeholder="Hledat terapeuta..." />
                                <CommandList>
                                    <CommandEmpty>Žádný terapeut nenalezen.</CommandEmpty>
                                    <CommandGroup>
                                        {therapists.map((therapist) => (
                                            <CommandItem value={`${therapist.firstName} ${therapist.lastName}`} key={therapist.id} onSelect={() => {
                                                form.setValue("therapistId", therapist.id, { shouldValidate: true });
                                                setTherapistPopoverOpen(false);
                                            }}>
                                                <Check className={cn("mr-2 h-4 w-4", therapist.id === field.value ? "opacity-100" : "opacity-0")} />
                                                {therapist.firstName} {therapist.lastName}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                           </Command>
                        </PopoverContent>
                    </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Datum a čas */}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Datum</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? (format(field.value, "PPP", { locale: cs })) : (<span>Vyberte datum</span>)}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Čas</FormLabel>
                            <FormControl>
                                <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Zrušit</Button>
              <Button type="submit">Uložit rezervaci</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
