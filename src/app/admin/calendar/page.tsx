// frontend/src/app/admin/calendar/page.tsx

'use client';

import { useEffect, useState } from 'react';

// --- Definice typů dat ---
interface Client {
  firstName: string;
  lastName: string;
}

interface Service {
  name: string;
}

interface Reservation {
  id: number;
  startTime: string;
  endTime: string;
  client: Client;
  service: Service;
}

interface Therapist {
  id: number;
  firstName: string;
  lastName: string;
  reservationsAsTherapist: Reservation[];
}

// --- Komponenta pro zobrazení jedné rezervace (řeší chybu hydratace) ---
function ReservationCard({ reservation }: { reservation: Reservation }) {
  const [isClient, setIsClient] = useState(false);

  // Tento efekt se spustí jen na straně klienta
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      key={reservation.id}
      className="p-3 rounded-md shadow"
      style={{ backgroundColor: '#A4907C' }}
    >
      <p className="font-bold" style={{ color: '#3C3633' }}>
        {/* Čas formátujeme až na klientovi, abychom se vyhnuli chybě */}
        {isClient && new Date(reservation.startTime).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
        {' - '}
        {isClient && new Date(reservation.endTime).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
      </p>
      <p style={{ color: '#3C3633' }}>{reservation.client.firstName} {reservation.client.lastName}</p>
      <p className="text-sm" style={{ color: '#6A5F5A' }}>{reservation.service.name}</p>
    </div>
  );
}


// --- Hlavní komponenta stránky ---
export default function CalendarPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Tento token budeme v budoucnu získávat z přihlášení
        const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QubWFuYXplckBleGFtcGxlLmNvbSIsInN1YiI6Miwicm9sZSI6Ik1BTkFHRVIiLCJpYXQiOjE3NTUwNDAwOTcsImV4cCI6MTc1NTA0MzY5N30.oebCRref6ZgDnUAvnENgOAns9rFf_DXBxexXhu3JKRI';

        const response = await fetch(
          'http://localhost:3000/calendar/manager-view?startDate=2025-08-11T00:00:00.000Z&endDate=2025-08-17T23:59:59.999Z',
          {
            headers: {
              // Přidali jsme autorizační hlavičku
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
  }, []);

  return (
    <div style={{ backgroundColor: '#FFFFFF' }} className="p-8 rounded-lg shadow-lg">
      <h1 className="font-serif text-3xl font-bold mb-6" style={{ color: '#3C3633' }}>
        Přehled Kalendáře
      </h1>

      {isLoading && <p style={{ color: '#6A5F5A' }}>Načítám data...</p>}
      {error && <p className="text-red-600">Chyba: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {therapists.map((therapist) => (
          <div key={therapist.id} className="border-r pr-4" style={{ borderColor: '#A4907C' }}>
            <h2 className="font-serif text-xl font-semibold text-center mb-4" style={{ color: '#3C3633' }}>
              {therapist.firstName} {therapist.lastName}
            </h2>
            <div className="space-y-2">
              {therapist.reservationsAsTherapist.length > 0 ? (
                therapist.reservationsAsTherapist.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))
              ) : (
                <p className="text-sm text-center" style={{ color: '#6A5F5A' }}>Žádné rezervace</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
