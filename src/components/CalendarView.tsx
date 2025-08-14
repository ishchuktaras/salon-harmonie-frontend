// Soubor č. 1: Nahraď obsah v `frontend/src/components/CalendarView.tsx`
// Vylepšili jsme komponentu o logiku pro přetahování.

'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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
  therapistId: number; // Přidáno pro snazší přístup
}
export interface Therapist {
  id: number;
  firstName: string;
  lastName: string;
  reservationsAsTherapist: Reservation[];
}

// --- Komponenty s logikou pro Drag & Drop ---

// Karta rezervace, kterou lze přetahovat
function DraggableReservation({ reservation }: { reservation: Reservation }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `reservation-${reservation.id}`,
    data: { reservation }, // Předáváme celá data rezervace
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    backgroundColor: '#A4907C',
    borderColor: '#6A5F5A',
    borderLeftWidth: '4px',
    zIndex: 10,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="p-2 rounded-md shadow-sm overflow-hidden cursor-grab">
      <p className="font-bold text-sm truncate" style={{ color: '#3C3633' }}>
        {reservation.client.firstName} {reservation.client.lastName}
      </p>
      <p className="text-xs truncate" style={{ color: '#3C3633' }}>{reservation.service.name}</p>
    </div>
  );
}

// Časový slot v kalendáři, na který lze přetáhnout rezervaci
function DroppableHour({ hour, day, therapistId, children }: { hour: number, day: Date, therapistId: number, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: `slot-${therapistId}-${day.toISOString().split('T')[0]}-${hour}`,
    data: { hour, therapistId, day },
  });

  return (
    <div ref={setNodeRef} className="relative h-[60px] border-t" style={{ borderColor: '#E1D7C6' }}>
      {children}
    </div>
  );
}


// --- Hlavní komponenta kalendáře ---
export function CalendarView({ therapists, weekDays }: { therapists: Therapist[], weekDays: Date[] }) {
  const getReservationDuration = (startTime: string, endTime: string) => {
     const start = new Date(startTime);
     const end = new Date(endTime);
     const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
     return (durationMinutes / 60) * 60;
  }

  return (
    <div className="flex flex-1 overflow-auto" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="flex flex-col w-16 text-right pr-2 pt-10">
        {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
          <div key={hour} className="h-[60px] -mt-2">
            <span className="text-xs" style={{ color: '#6A5F5A' }}>{`${hour}:00`}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 gap-px" style={{ backgroundColor: '#E1D7C6' }}>
        {weekDays.map((day) => {
          const therapistForDay = therapists.find(t => t.reservationsAsTherapist.some(r => new Date(r.startTime).toDateString() === day.toDateString()));
          const therapist = therapistForDay || therapists[0]; // Fallback pro zobrazení sloupců

          return (
            <div key={day.toISOString()} className="relative" style={{ backgroundColor: 'white' }}>
              <div className="sticky top-0 z-20 p-2 text-center border-b" style={{ backgroundColor: '#E1D7C6', borderColor: '#A4907C' }}>
                <h3 className="font-serif font-semibold" style={{ color: '#3C3633' }}>
                  {day.toLocaleDateString('cs-CZ', { weekday: 'short', day: 'numeric' })}
                </h3>
              </div>
              
              <div className="relative h-[720px]">
                {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
                  <DroppableHour key={hour} hour={hour} day={day} therapistId={therapist?.id || 0}>
                    {therapist?.reservationsAsTherapist
                      .filter(res => new Date(res.startTime).toDateString() === day.toDateString() && new Date(res.startTime).getHours() === hour)
                      .map(res => (
                        <div 
                          key={res.id} 
                          className="absolute left-1 right-1" 
                          style={{ top: `${(new Date(res.startTime).getMinutes() / 60) * 60}px`, height: `${getReservationDuration(res.startTime, res.endTime)}px` }}
                        >
                          <DraggableReservation reservation={res} />
                        </div>
                      ))
                    }
                  </DroppableHour>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
