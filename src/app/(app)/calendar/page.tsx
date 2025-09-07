'use client'

import { useState, useCallback, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventClickArg, DateSelectArg, EventInput } from '@fullcalendar/core'
import csLocale from '@fullcalendar/core/locales/cs'
import CreateBookingModal from '@/components/calendar/CreateBookingModal'
// OPRAVA: Importujeme apiClient místo smazaného useApi
import { apiClient } from '@/lib/api/client' 
import { Reservation } from '@/lib/api/types'

type ModalState = {
  isOpen: boolean
  initialDate?: Date
  existingReservation?: Reservation
}

export default function CalendarPage() {
  const [events, setEvents] = useState<EventInput[]>([])
  const [loading, setLoading] = useState(true)
  
  // OPRAVA: Odstraněno `const api = useApi()`

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
  })

  const fetchReservations = useCallback(async () => {
    setLoading(true)
    try {
      // OPRAVA: Používáme přímo apiClient
      const data = await apiClient.get<Reservation[]>('/reservations')
      const formattedEvents = data.map((reservation) => ({
        id: String(reservation.id),
        title: `${reservation.client?.firstName} ${reservation.client?.lastName} - ${reservation.service?.name}`,
        start: reservation.startTime,
        end: reservation.endTime,
        extendedProps: reservation,
      }))
      setEvents(formattedEvents)
    } catch (error) {
      console.error('Failed to fetch reservations:', error)
    } finally {
      setLoading(false)
    }
  }, []) // Odstraněna závislost na `api`

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setModalState({
      isOpen: true,
      initialDate: selectInfo.start,
    })
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    setModalState({
      isOpen: true,
      existingReservation: clickInfo.event.extendedProps as Reservation,
    })
  }

  const handleModalClose = () => {
    setModalState({ isOpen: false })
  }

  const handleBookingCreated = () => {
    fetchReservations()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Kalendář rezervací</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        {loading ? (
          <div>Načítání kalendáře...</div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            initialView="timeGridWeek"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            locale={csLocale}
            height="auto"
          />
        )}
      </div>

      {modalState.isOpen && (
        <CreateBookingModal
          isOpen={modalState.isOpen}
          onClose={handleModalClose}
          onBookingCreated={handleBookingCreated}
          initialData={{startTime: modalState.initialDate!}}
          existingReservation={modalState.existingReservation}
        />
      )}
    </div>
  )
}