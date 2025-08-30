// soubor: src/app/(app)/calendar/page.tsx

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { EventInput } from '@fullcalendar/core';
import { reservationsApi } from "@/lib/api/reservations";
import { Reservation } from "@/lib/api/types";
import { FullCalendarView } from "@/components/calendar/full-calendar-view";
import CreateBookingModal from "@/components/calendar/CreateBookingModal";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";

// Typ pro stav modálního okna
type ModalState = {
  isOpen: boolean;
  // Zde zatím neřešíme předvyplnění, modal to nepodporuje
  // initialDate?: Date;
  // existingReservation?: Reservation;
};

export default function CalendarPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false });

  // Funkce pro načtení dat z API
  const fetchReservations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await reservationsApi.getAll();
      setReservations(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
      setError("Nepodařilo se načíst rezervace.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Načtení dat při prvním renderování
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);
  
  // Přeformátování rezervací pro FullCalendar
  const calendarEvents: EventInput[] = useMemo(() => {
    return reservations.map((reservation) => ({
      id: reservation.id,
      title: `${reservation.client?.firstName || 'Klient'} - ${reservation.service?.name || 'Služba'}`,
      start: new Date(reservation.startTime),
      end: new Date(reservation.endTime),
      extendedProps: {
        originalReservation: reservation,
      },
    }));
  }, [reservations]);

  // Funkce pro drag-and-drop
  const handleEventDrop = async (info: any) => {
    const { event } = info;
    const reservationId = event.id;
    const newStartTime = event.start.toISOString();
    const newEndTime = event.end ? event.end.toISOString() : new Date(event.start.getTime() + 60 * 60 * 1000).toISOString(); // Fallback pokud end chybí

    try {
      await reservationsApi.update(reservationId, {
        startTime: newStartTime,
        endTime: newEndTime,
      });
      fetchReservations();
      alert("Rezervace byla úspěšně přesunuta.");
    } catch (error) {
      console.error("Failed to update reservation:", error);
      alert("Chyba: Rezervaci se nepodařilo přesunout.");
      info.revert();
    }
  };
  
  // Funkce pro klik na existující rezervaci (pro budoucí editaci)
  const handleEventClick = (info: any) => {
    const originalReservation = info.event.extendedProps.originalReservation as Reservation;
    console.log("Kliknuto na rezervaci:", originalReservation);
    // Zde otevřete editační modal, až bude připraven
    // setModalState({ isOpen: true, existingReservation: originalReservation });
    alert(`Vybrána rezervace pro: ${originalReservation.client?.firstName} ${originalReservation.client?.lastName}`);
  };
  
  // Funkce pro klik na volný časový slot
  const handleDateClick = (info: any) => {
    console.log("Kliknuto na datum:", info.dateStr);
    // Otevře modal pro vytvoření nové rezervace
    setModalState({ isOpen: true });
  };

  // Funkce pro zavření modálu a obnovení dat
  const handleModalSuccess = () => {
    setModalState({ isOpen: false });
    fetchReservations(); // Znovu načte rezervace po úspěšném vytvoření nové
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false });
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <>
      <PageHeader
        title="Kalendář Rezervací"
        description="Přehled všech rezervací a správa časových slotů."
      >
        <Button onClick={() => setModalState({ isOpen: true })}>
          Vytvořit novou rezervaci
        </Button>
      </PageHeader>
      
      <FullCalendarView
        events={calendarEvents}
        onEventDrop={handleEventDrop}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
      />

      {/* Modální okno pro tvorbu */}
      {modalState.isOpen && (
        <CreateBookingModal
          isOpen={modalState.isOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  );
}