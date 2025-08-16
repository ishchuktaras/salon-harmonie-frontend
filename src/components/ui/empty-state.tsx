"use client"

import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-4 bg-sage-50 rounded-full mb-4">
        <Icon className="h-8 w-8 text-sage-600" />
      </div>
      <h3 className="text-lg font-semibold text-stone-800 mb-2">{title}</h3>
      <p className="text-stone-600 mb-6 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="bg-sage-600 hover:bg-sage-700">
          {action.label}
        </Button>
      )}
    </div>
  )
}
