"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import apiClient from "@/lib/api/client"
import type { User } from "@/lib/api/types"

interface CalendarFilterProps {
  onTherapistChange: (therapistId: string | null) => void
  selectedTherapistId: string | null
}

export default function CalendarFilter({ onTherapistChange, selectedTherapistId }: CalendarFilterProps) {
  const [therapists, setTherapists] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await apiClient.get<User[]>("/users?role=TERAPEUT,MASER")
        setTherapists(response.data)
      } catch (error) {
        console.error("Nepodařilo se načíst terapeuty:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTherapists()
  }, [])

  return (
    <div className="flex items-center space-x-4 mb-4">
      <Label htmlFor="therapist-filter">Filtrovat podle terapeuta:</Label>
      <Select
        value={selectedTherapistId || "all"}
        onValueChange={(value) => onTherapistChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder={loading ? "Načítání..." : "Všichni terapeuti"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Všichni terapeuti</SelectItem>
          {therapists.map((therapist) => (
            <SelectItem key={therapist.id} value={String(therapist.id)}>
              {therapist.firstName} {therapist.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
