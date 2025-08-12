// frontend/src/app/admin/calendar/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { CalendarView, Therapist } from '@/components/CalendarView';

export default function CalendarPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      console.log('Začínám stahovat data...'); // Diagnostika 1: Začátek

      try {
        // TODO: Tento token budeme v budoucnu získávat z přihlášení
        const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QubWFuYXplckBleGFtcGxlLmNvbSIsInN1YiI6Miwicm9sZSI6Ik1BTkFHRVIiLCJpYXQiOjE3NTUwNDAwOTcsImV4cCI6MTc1NTA0MzY5N30.oebCRref6ZgDnUAvnENgOAns9rFf_DXBxexXhu3JKRI';

        const response = await fetch(
          'http://localhost:3000/calendar/manager-view?startDate=2025-08-11T00:00:00.000Z&endDate=2025-08-17T23:59:59.999Z',
          {
            headers: {
              'Authorization': `Bearer ${tempToken}`,
            },
          },
        );

        console.log('Odpověď ze serveru:', response); // Diagnostika 2: Celá odpověď

        if (!response.ok) {
          throw new Error(`Nepodařilo se načíst data z API (status: ${response.status})`);
        }

        const data: Therapist[] = await response.json();
        console.log('Zpracovaná data:', data); // Diagnostika 3: Data po převedení z JSON

        setTherapists(data);
      } catch (err) {
        console.error('Došlo k chybě:', err); // Diagnostika 4: Zachycení chyby
        setError(err instanceof Error ? err.message : 'Neznámá chyba');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="p-6">
        <h1 className="font-serif text-3xl font-bold" style={{ color: '#3C3633' }}>
          Týdenní Přehled Kalendáře
        </h1>
      </div>

      {isLoading && <p className="p-6" style={{ color: '#6A5F5A' }}>Načítám data...</p>}
      {error && <p className="p-6 text-red-600">Chyba: {error}</p>}
      
      {!isLoading && !error && <CalendarView therapists={therapists} />}
    </div>
  );
}