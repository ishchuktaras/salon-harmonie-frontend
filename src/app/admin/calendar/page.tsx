// src/app/admin/calendar/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react'; // <-- Přidán import useMemo
import { useAuth } from '@/contexts/AuthContext';
import { CalendarView, Therapist, Reservation } from '@/components/CalendarView';
import { addDays, format, startOfWeek } from 'date-fns';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

export default function CalendarPage() {
  const { token, logout } = useAuth();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // ✅ OPRAVA: Výpočet weekDays je nyní "zapamatován" pomocí useMemo.
  // Změní se pouze tehdy, když se změní `currentDate`.
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [currentDate]);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      const startDate = format(weekDays[0], "yyyy-MM-dd'T00:00:00.000Z'");
      const endDate = format(weekDays[6], "yyyy-MM-dd'T23:59:59.999Z'");

      try {
        const response = await fetch(
          `http://localhost:3000/calendar/manager-view?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 401) {
          setError('Vaše přihlášení vypršelo. Prosím, přihlaste se znovu.');
          setTimeout(() => logout(), 3000);
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Nepodařilo se načíst data z API (status: ${response.status})`,
          );
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
    // ✅ OPRAVA: Ze závislostí jsme odstranili `weekDays`, protože
    // je nyní odvozeno od `currentDate`. `logout` je stabilní funkce.
  }, [currentDate, token, logout]);

  // Zbytek kódu (handleDragEnd, JSX) zůstává stejný.
  // Ujistěte se, že zbytek souboru odpovídá vaší poslední funkční verzi.

  async function handleDragEnd(event: DragEndEvent) {
    if (!token) return;

    const { active, over } = event;

    if (over && active.id !== over.id) {
      const reservation = active.data.current?.reservation as Reservation;
      const newHour = over.data.current?.hour as number;
      const newTherapistId = over.data.current?.therapistId as number;
      const newDay = over.data.current?.day as Date;

      if (
        !reservation ||
        newHour === undefined ||
        newTherapistId === undefined ||
        !newDay
      )
        return;

      const newStartTime = new Date(
        newDay.getFullYear(),
        newDay.getMonth(),
        newDay.getDate(),
        newHour,
      );
      const duration =
        new Date(reservation.endTime).getTime() -
        new Date(reservation.startTime).getTime();
      const newEndTime = new Date(newStartTime.getTime() + duration);

      setTherapists((prev) => {
        const newTherapists = JSON.parse(JSON.stringify(prev));
        const oldTherapist = newTherapists.find(
          (t: Therapist) => t.id === reservation.therapistId,
        );
        const newTherapist = newTherapists.find(
          (t: Therapist) => t.id === newTherapistId,
        );

        if (oldTherapist) {
          oldTherapist.reservationsAsTherapist =
            oldTherapist.reservationsAsTherapist.filter(
              (r: Reservation) => r.id !== reservation.id,
            );
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

      try {
        await fetch(
          `http://localhost:3000/reservations/${reservation.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              startTime: newStartTime.toISOString(),
              endTime: newEndTime.toISOString(),
              therapistId: newTherapistId,
            }),
          },
        );
      } catch (error) {
        console.error('Chyba při aktualizaci rezervace:', error);
      }
    }
  }

  const goToPreviousWeek = () =>
    setCurrentDate((prevDate) => addDays(prevDate, -7));
  const goToNextWeek = () =>
    setCurrentDate((prevDate) => addDays(prevDate, 7));

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-full">
        <div className="pb-6 flex justify-between items-center">
          <h1 className="font-serif text-3xl font-bold text-brand-primary">
            Týdenní Přehled
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousWeek}
              className="px-4 py-2 rounded-md bg-brand-muted text-brand-accent hover:bg-brand-primary transition-colors"
            >
              &lt; Předchozí
            </button>
            <span className="font-semibold text-brand-primary">
              {format(weekDays[0], 'd. M.')} -{' '}
              {format(weekDays[6], 'd. M. yyyy')}
            </span>
            <button
              onClick={goToNextWeek}
              className="px-4 py-2 rounded-md bg-brand-muted text-brand-accent hover:bg-brand-primary transition-colors"
            >
              Další &gt;
            </button>
          </div>
        </div>

        {isLoading && (
          <p className="p-6 text-brand-muted">Načítám data...</p>
        )}
        {error && <p className="p-6 text-red-600">Chyba: {error}</p>}

        {!isLoading && !error && (
          <div className="flex-1 flex overflow-hidden">
            <CalendarView therapists={therapists} weekDays={weekDays} />
          </div>
        )}
      </div>
    </DndContext>
  );
}