"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import StaffCalendar from "@/components/calendar/StaffCalendar";
import CreateBookingModal from "@/components/calendar/CreateBookingModal";

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-serif font-bold">Plánovací Kalendář</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nová rezervace
        </Button>
      </div>
      <div className="flex-1">
        {/* Kalendář zabere zbytek dostupného místa */}
        <StaffCalendar />
      </div>
      <CreateBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
