// src/components/calendar/StaffCalendar.tsx

"use client"

import { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer, Views, View, Event as BigCalendarEvent } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/cs';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { reservationsApi } from '@/lib/api/reservations';
import { Reservation } from '@/lib/api/types';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

moment.locale('cs');
const localizer = momentLocalizer(moment)
const DnDCalendar = withDragAndDrop(Calendar)

const StaffCalendar = () => {
  const [events, setEvents] = useState<BigCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  // Stavy pro sledování aktuálního data a pohledu
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.WEEK);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const reservations = await reservationsApi.getAll();
      const formattedEvents = reservations.map((res: Reservation) => ({
        title: `${res.service?.name} - ${res.client?.firstName} ${res.client?.lastName}`,
        start: new Date(res.startTime),
        end: new Date(res.endTime),
        resource: res,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Nepodařilo se načíst rezervace:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Funkce, která se zavolá při přetažení události
  const handleEventDrop = useCallback(
    (args: { event: BigCalendarEvent; start: Date | string; end: Date | string }) => {
      const { event, start, end } = args;
      const originalReservation = event.resource as Reservation;
      const startDate = start instanceof Date ? start : new Date(start);
      const endDate = end instanceof Date ? end : new Date(end);
      console.log(`Rezervace ID ${originalReservation.id} byla přesunuta na ${startDate}.`);
      
      // Zde v budoucnu zavoláme API pro uložení změny
      // await reservationsApi.update(originalReservation.id, { startTime: startDate.toISOString(), endTime: endDate.toISOString() });
      
      // Optimisticky aktualizujeme UI
      setEvents((prev) => {
        const existing = prev.find((e) => e.resource.id === originalReservation.id);
        if (existing) {
            return prev.map((e) => e.resource.id === originalReservation.id ? { ...existing, start: startDate, end: endDate } : e);
        }
        return prev;
      });
    },
    []
  );

  if (loading) {
    return <div>Načítání kalendáře...</div>;
  }

  return (
    <div className="h-[75vh] bg-white p-4 rounded-lg shadow-sm">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor={(event: BigCalendarEvent) => event.start ?? new Date(0)}
        endAccessor={(event: BigCalendarEvent) => event.end ?? new Date(0)}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        // Propojení se stavy a funkcemi
        date={date}
        view={view}
        onNavigate={(newDate) => setDate(newDate)}
        onView={(newView) => setView(newView as View)}
        onEventDrop={handleEventDrop}
        resizable
        selectable
        messages={{
          next: "Další",
          previous: "Předchozí",
          today: "Dnes",
          month: "Měsíc",
          week: "Týden",
          day: "Den",
          agenda: "Agenda",
          date: "Datum",
          time: "Čas",
          event: "Událost",
          noEventsInRange: "V tomto rozsahu nejsou žádné události.",
          showMore: total => `+ Zobrazit další (${total})`
        }}
        culture='cs'
      />
    </div>
  )
}

export default StaffCalendar;
