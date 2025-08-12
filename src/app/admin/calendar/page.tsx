// frontend/src/app/admin/calendar/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { CalendarView, Therapist } from '@/components/CalendarView';
import { addDays, format, startOfWeek } from 'date-fns';

// --- Hlavní komponenta stránky ---
export default function CalendarPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stav pro aktuální datum, které sledujeme
  const [currentDate, setCurrentDate] = useState(new Date());

  // Tento "efekt" se nyní spustí pokaždé, když se změní `currentDate`
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      // Vypočítáme začátek a konec týdne podle aktuálního data
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Týden začíná pondělím
      const end = addDays(start, 6);

      const startDate = format(start, "yyyy-MM-dd'T00:00:00.000Z'");
      const endDate = format(end, "yyyy-MM-dd'T23:59:59.999Z'");

      try {
        const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QubWFuYXplckBleGFtcGxlLmNvbSIsInN1YiI6Miwicm9sZSI6Ik1BTkFHRVIiLCJpYXQiOjE3NTUwNDIwMjAsImV4cCI6MTc1NTA0NTYyMH0.dWnecqYLYDp_vOvdHZWQhgxSfoopyBMJMD9k3TvrrXk';

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
  }, [currentDate]); // Efekt závisí na `currentDate`

  // --- Funkce pro změnu týdne ---
  const goToPreviousWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };

  const goToNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="p-6 flex justify-between items-center">
        <h1 className="font-serif text-3xl font-bold" style={{ color: '#3C3633' }}>
          Týdenní Přehled
        </h1>
        {/* TOTO JSOU NOVÁ TLAČÍTKA */}
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
  );
}