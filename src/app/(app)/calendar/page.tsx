// src/app/(app)/calendar/page.tsx

"use client"

import { useState, useCallback, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import type { EventClickArg, DateSelectArg, EventInput, EventDropArg } from "@fullcalendar/core"
import csLocale from "@fullcalendar/core/locales/cs"
import CreateBookingModal from "@/components/calendar/CreateBookingModal"
import CalendarFilter from "@/components/calendar/CalendarFilter"
import CreateBlockModal from "@/components/calendar/CreateBlockModal"
import { Button } from "@/components/ui/button"
import type { Reservation } from "@/lib/api/types"
import { reservationsApi } from "@/lib/api/reservations"
import { timeBlocksApi } from "@/lib/api/time-blocks"

type ModalState = {
  isOpen: boolean
  initialDate?: Date
  existingReservation?: Reservation
}

export default function CalendarPage() {
  const [events, setEvents] = useState<EventInput[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(null)
  const [blockModalOpen, setBlockModalOpen] = useState(false)

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
  })

  const fetchReservations = useCallback(async () => {
    setLoading(true)
    try {
      let reservationsData: Reservation[]

      if (selectedTherapistId) {
        reservationsData = await reservationsApi.getByTherapist(Number(selectedTherapistId))
      } else {
        reservationsData = await reservationsApi.getAll()
      }

      const timeBlocks = selectedTherapistId
        ? await timeBlocksApi.getByTherapist(Number(selectedTherapistId))
        : await timeBlocksApi.getAll()

      const reservationEvents = reservationsData.map((reservation) => ({
        id: String(reservation.id),
        title: `${reservation.client?.firstName} ${reservation.client?.lastName} - ${reservation.service?.name}`,
        start: reservation.startTime,
        end: reservation.endTime,
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        extendedProps: { ...reservation, type: "reservation" },
      }))

      const typeLabels = {
        BREAK: "Přestávka",
        VACATION: "Dovolená",
        SICK_LEAVE: "Nemocenská",
        OTHER: "Jiné",
      }

      const blockEvents = timeBlocks.map((block) => ({
        id: `block-${block.id}`,
        title: `${typeLabels[block.type]} - ${block.therapist?.firstName} ${block.therapist?.lastName}`,
        start: block.startTime,
        end: block.endTime,
        backgroundColor: "#ef4444",
        borderColor: "#dc2626",
        extendedProps: { ...block, type: "timeBlock" },
      }))

      setEvents([...reservationEvents, ...blockEvents])
    } catch (error) {
      console.error("Failed to fetch calendar data:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedTherapistId])

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setModalState({
      isOpen: true,
      initialDate: selectInfo.start,
    })
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const extendedProps = clickInfo.event.extendedProps

    if (extendedProps.type === "reservation") {
      setModalState({
        isOpen: true,
        existingReservation: extendedProps as Reservation,
      })
    }
  }

  const handleEventDrop = async (dropInfo: EventDropArg) => {
    const { event } = dropInfo
    const extendedProps = event.extendedProps

    if (extendedProps.type === "reservation") {
      try {
        const duration = new Date(extendedProps.endTime).getTime() - new Date(extendedProps.startTime).getTime()
        const newEndTime = new Date(event.start!.getTime() + duration)

        await reservationsApi.update(extendedProps.id, {
          startTime: event.start!.toISOString(),
          endTime: newEndTime.toISOString(),
        })

        console.log("Rezervace byla úspěšně přesunuta")
      } catch (error) {
        console.error("Nepodařilo se přesunout rezervaci:", error)
        dropInfo.revert()
      }
    } else {
      dropInfo.revert()
    }
  }

  const handleModalClose = () => {
    setModalState({ isOpen: false })
  }

  const handleBookingCreated = () => {
    fetchReservations()
  }

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Kalendář rezervací</h1>
        <Button onClick={() => setBlockModalOpen(true)}>Vytvořit časový blok</Button>
      </div>

      <CalendarFilter onTherapistChange={setSelectedTherapistId} selectedTherapistId={selectedTherapistId} />

      <div className="bg-white p-4 rounded-lg shadow">
        {loading ? (
          <div>Načítání kalendáře...</div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
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
            eventDrop={handleEventDrop}
            locale={csLocale}
            height="auto"
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
          />
        )}
      </div>

      {modalState.isOpen && (
        <CreateBookingModal
          isOpen={modalState.isOpen}
          onClose={handleModalClose}
          onBookingCreated={handleBookingCreated}
          initialData={modalState.initialDate ? { startTime: modalState.initialDate } : undefined}
          existingReservation={modalState.existingReservation}
        />
      )}

      <CreateBlockModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onBlockCreated={handleBookingCreated}
      />
    </div>
  )
}
