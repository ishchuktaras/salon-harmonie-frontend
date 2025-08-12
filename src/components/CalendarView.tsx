// Soubor č. 1: Vytvoř ho v `frontend/src/components/CalendarView.tsx`
// Toto je naše nová, znovupoužitelná komponenta pro zobrazení kalendáře.

'use client';

// --- Definice typů dat (přesunuto sem pro přehlednost) ---
interface Client {
  firstName: string;
  lastName: string;
}
interface Service {
  name: string;
}
export interface Reservation {
  id: number;
  startTime: string;
  endTime: string;
  client: Client;
  service: Service;
}
export interface Therapist {
  id: number;
  firstName: string;
  lastName: string;
  reservationsAsTherapist: Reservation[];
}

// --- Pomocné funkce pro práci s časem ---
const HOURS_IN_DAY = Array.from({ length: 12 }, (_, i) => i + 8); // Zobrazíme hodiny od 8:00 do 19:00

// --- Komponenta pro Týdenní Kalendář ---
export function CalendarView({ therapists }: { therapists: Therapist[] }) {
  // Funkce pro výpočet pozice a výšky rezervace v mřížce
  const getReservationStyle = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const top = (start.getHours() - 8 + start.getMinutes() / 60) * 60; // 60px per hour
    const height = (durationMinutes / 60) * 60;

    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  return (
    <div className="flex flex-1 overflow-auto" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Časová osa vlevo */}
      <div className="flex flex-col w-16 text-right pr-2">
        {HOURS_IN_DAY.map((hour) => (
          <div key={hour} className="h-[60px] -mt-2">
            <span className="text-xs" style={{ color: '#6A5F5A' }}>{`${hour}:00`}</span>
          </div>
        ))}
      </div>

      {/* Mřížka kalendáře */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-px" style={{ backgroundColor: '#E1D7C6' }}>
        {therapists.map((therapist) => (
          <div key={therapist.id} className="relative" style={{ backgroundColor: 'white' }}>
            {/* Jméno terapeuta nahoře */}
            <div className="sticky top-0 z-10 p-2 text-center border-b" style={{ backgroundColor: '#E1D7C6', borderColor: '#A4907C' }}>
              <h3 className="font-serif font-semibold" style={{ color: '#3C3633' }}>
                {therapist.firstName} {therapist.lastName}
              </h3>
            </div>

            {/* Kontejner pro rezervace */}
            <div className="relative h-[720px]"> {/* 12 hodin * 60px */}
              {/* Vykreslení hodinových čar */}
              {HOURS_IN_DAY.map(hour => (
                <div key={hour} className="h-[60px] border-t" style={{ borderColor: '#E1D7C6' }}></div>
              ))}

              {/* Vykreslení rezervací */}
              {therapist.reservationsAsTherapist.map((reservation) => (
                <div
                  key={reservation.id}
                  className="absolute left-1 right-1 p-2 rounded-md shadow-sm overflow-hidden"
                  style={{
                    ...getReservationStyle(reservation.startTime, reservation.endTime),
                    backgroundColor: '#A4907C',
                    borderColor: '#6A5F5A',
                    borderLeftWidth: '4px'
                  }}
                >
                  <p className="font-bold text-sm truncate" style={{ color: '#3C3633' }}>
                    {reservation.client.firstName} {reservation.client.lastName}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#3C3633' }}>{reservation.service.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}