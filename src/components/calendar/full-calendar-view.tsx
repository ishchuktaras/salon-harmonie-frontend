"use client";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import { EventInput } from '@fullcalendar/core';
import csLocale from '@fullcalendar/core/locales/cs'; 

interface FullCalendarViewProps {
  events: EventInput[];
  onEventDrop: (info: any) => void;
  onEventClick: (info: any) => void;
  onDateClick: (info: any) => void;
}

export function FullCalendarView({ events, onEventDrop, onEventClick, onDateClick }: FullCalendarViewProps) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      events={events}
      editable={true} // Povolí drag-and-drop
      droppable={true}
      eventDrop={onEventDrop}
      eventClick={onEventClick}
      dateClick={onDateClick}
      locale={csLocale} // Nastavení češtiny
      height="auto" // Přizpůsobí výšku
      slotMinTime="08:00:00" // Začátek pracovní doby
      slotMaxTime="20:00:00" // Konec pracovní doby
    />
  );
}