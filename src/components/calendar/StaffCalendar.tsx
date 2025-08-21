"use client"

import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/cs'; // Import Czech locale for moment
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup the localizer by providing the moment Object
moment.locale('cs'); // Set moment to use Czech locale
const localizer = momentLocalizer(moment)

// Mock data for demonstration
const myEventsList = [
  {
    id: 1,
    title: 'Masáž lávovými kameny - Jana Nováková',
    start: new Date(2025, 7, 21, 10, 0, 0),
    end: new Date(2025, 7, 21, 11, 0, 0),
    resourceId: 1,
  },
  {
    id: 2,
    title: 'Kosmetické ošetření - Petra Dvořáková',
    start: new Date(2025, 7, 21, 12, 30, 0),
    end: new Date(2025, 7, 21, 14, 0, 0),
    resourceId: 2,
  },
];

const StaffCalendar = () => {
  return (
    <div className="h-[75vh] bg-white p-4 rounded-lg shadow-sm">
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
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
