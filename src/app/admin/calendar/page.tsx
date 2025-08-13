// Soubor č. 2: Nahraď obsah v `frontend/src/app/admin/calendar/page.tsx`
// Přidali jsme logiku pro zpracování události přetažení.

'use client';

import { useEffect, useState } from 'react';
import { CalendarView, Therapist, Reservation } from '@/components/CalendarView';
import { addDays, format, startOfWeek } from 'date-fns';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

export default function CalendarPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = addDays(start, 6);

      const startDate = format(start, "yyyy-MM-dd'T00:00:00.000Z'");
      const endDate = format(end, "yyyy-MM-dd'T23:59:59.999Z'");

      try {
        // TODO: Tento token budeme v budoucnu získávat z přihlášení
        const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QubWFuYXplckBleGFtcGxlLmNvbSIsInN1YiI6Miwicm9sZSI6Ik1BTkFHRVIiLCJpYXQiOjE3NTUwNDQ1ODksImV4cCI6MTc1NTA0ODE4OX0.q90CGT-BXJ5A6mm6_qNApcM9hyAzrCpgyhog20HA3so';

        const response = await fetch(
          `http://localhost:3000/calendar/manager-view?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              'Authorization': `Bearer ${tempToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Nepodařilo se načíst data z API (status: ${response.status})`);
        }

        const data: Therapist[] = await response.json();
        setTherapists(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Neznámá chyba');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [currentDate]);

  // --- TOTO JE NOVÁ FUNKCE ---
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const reservation = active.data.current?.reservation as Reservation;
      const newHour = over.data.current?.hour as number;
      const newTherapistId = over.data.current?.therapistId as number;

      if (!reservation || newHour === undefined || newTherapistId === undefined) return;

      const originalDate = new Date(reservation.startTime);
      const newStartTime = new Date(originalDate.setHours(newHour, 0, 0, 0));
      const duration = new Date(reservation.endTime).getTime() - new Date(reservation.startTime).getTime();
      const newEndTime = new Date(newStartTime.getTime() + duration);

      // Optimistic UI update: Ihned aktualizujeme stav
      setTherapists(prev => {
        const newTherapists = JSON.parse(JSON.stringify(prev));
        // TOTO JE OPRAVA: Přidali jsme typ Therapist
        const oldTherapist = newTherapists.find((t: Therapist) => t.id === reservation.therapistId);
        const newTherapist = newTherapists.find((t: Therapist) => t.id === newTherapistId);
        
        if (oldTherapist) {
           // TOTO JE OPRAVA: Přidali jsme typ Reservation
           oldTherapist.reservationsAsTherapist = oldTherapist.reservationsAsTherapist.filter((r: Reservation) => r.id !== reservation.id);
        }
        if (newTherapist) {
          newTherapist.reservationsAsTherapist.push({
            ...reservation,
            startTime: newStartTime.toISOString(),
            endTime: newEndTime.toISOString(),
            therapistId: newTherapistId,
          });
        }
        return newTherapists;
      });

      // Zavoláme API na backendu
      try {
        const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QubWFuYXplckBleGFtcGxlLmNvbSIsInN1YiI6Miwicm9sZSI6Ik1BTkFHRVIiLCJpYXQiOjE3NTUwNDIwMjAsImV4cCI6MTc1NTA0NTYyMH0.dWnecqYLYDp_vOvdHZWQhgxSfoopyBMJMD9k3TvrrXk';
        await fetch(`http://localhost:3000/reservations/${reservation.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tempToken}`,
          },
          body: JSON.stringify({
            startTime: newStartTime.toISOString(),
            endTime: newEndTime.toISOString(),
            therapistId: newTherapistId,
          }),
        });
      } catch (error) {
        console.error("Chyba při aktualizaci rezervace:", error);
        // TODO: Vrátit změny zpět v případě chyby
      }
    }
  }

  const goToPreviousWeek = () => setCurrentDate(prevDate => addDays(prevDate, -7));
  const goToNextWeek = () => setCurrentDate(prevDate => addDays(prevDate, 7));

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-[calc(100vh-80px)]">
        <div className="p-6 flex justify-between items-center">
          <h1 className="font-serif text-3xl font-bold" style={{ color: '#3C3633' }}>
            Týdenní Přehled
          </h1>
          <div className="flex items-center space-x-4">
            <button onClick={goToPreviousWeek} style={{ backgroundColor: '#6A5F5A', color: '#E1D7C6' }} className="px-4 py-2 rounded-md">&lt; Předchozí</button>
            <span className="font-semibold" style={{ color: '#3C3633' }}>
              {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd. M.')} - {format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6), 'd. M. yyyy')}
            </span>
            <button onClick={goToNextWeek} style={{ backgroundColor: '#6A5F5A', color: '#E1D7C6' }} className="px-4 py-2 rounded-md">Další &gt;</button>
          </div>
        </div>

        {isLoading && <p className="p-6" style={{ color: '#6A5F5A' }}>Načítám data...</p>}
        {error && <p className="p-6 text-red-600">Chyba: {error}</p>}
        
        {!isLoading && !error && <CalendarView therapists={therapists} />}
      </div>
    </DndContext>
  );
}
