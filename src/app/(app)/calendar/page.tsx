"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { EventInput, EventDropArg, EventClickArg } from '@fullcalendar/core';
import { type DateClickArg } from '@fullcalendar/interaction';
import { reservationsApi } from "@/lib/api/reservations";
import { Reservation } from "@/lib/api/types";
import { FullCalendarView } from "@/components/calendar/full-calendar-view";
import CreateBookingModal from "@/components/calendar/CreateBookingModal";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";

// --- VYLEPŠENÍ (1): Aktualizovaný stav pro modál ---
// Odkomentovali jsme a povolili jsme předávání dat pro předvyplnění.
type ModalState = {
  isOpen: boolean;
  initialDate?: Date;
  existingReservation?: Reservation;
};

export default function CalendarPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Nastavujeme počáteční stav jako zavřený bez dat
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false });

  // Funkce pro načtení dat z API (beze změny)
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

  // Načtení dat při prvním renderování (beze změny)
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);
  
  // Přeformátování rezervací pro FullCalendar (beze změny)
  const calendarEvents: EventInput[] = useMemo(() => {
    return reservations.map((reservation) => ({
      id: reservation.id.toString(),
      title: `${reservation.client?.firstName || 'Klient'} - ${reservation.service?.name || 'Služba'}`,
      start: new Date(reservation.startTime),
      end: new Date(reservation.endTime),
      extendedProps: {
        originalReservation: reservation,
      },
    }));
  }, [reservations]);

  // Funkce pro drag-and-drop (s opravou pro 'null')
  const handleEventDrop = async (info: EventDropArg) => {
    const { event } = info;
    
    if (!event.start) {
      console.error("Chyba při přesunu: chybí počáteční datum.");
      info.revert();
      return;
    }

    const reservationId = event.id;
    const newStartTime = event.start.toISOString();
    const newEndTime = event.end ? event.end.toISOString() : new Date(event.start.getTime() + 60 * 60 * 1000).toISOString(); 

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
  
  // --- VYLEPŠENÍ (2): Kliknutí na rezervaci otevře modal pro editaci ---
  const handleEventClick = (info: EventClickArg) => {
    const originalReservation = info.event.extendedProps.originalReservation as Reservation;
    console.log("Otevírám editaci pro rezervaci:", originalReservation);
    // Otevřeme modal a předáme mu existující rezervaci
    setModalState({ isOpen: true, existingReservation: originalReservation });
  };
  
  // --- VYLEPŠENÍ (3): Kliknutí na kalendář předvyplní datum ---
  const handleDateClick = (info: DateClickArg) => {
    console.log("Vytvářím novou rezervaci na datum:", info.dateStr);
    // Otevřeme modal a předáme mu vybrané datum
    setModalState({ isOpen: true, initialDate: info.date });
  };

  // Funkce pro zavření modálu a obnovení dat
  const handleModalSuccess = () => {
    setModalState({ isOpen: false }); // Resetuje stav
    fetchReservations();
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false }); // Resetuje stav
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
        {/* Toto tlačítko nyní otevře modal bez předvyplněných dat */}
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

      {/* --- VYLEPŠENÍ (4): Předáváme nové props do modálu --- */}
      {modalState.isOpen && (
        <CreateBookingModal
          isOpen={modalState.isOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          initialDate={modalState.initialDate}
          existingReservation={modalState.existingReservation}
        />
      )}
    </>
  );
}
