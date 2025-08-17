// src/app/(app)/layout.tsx

import { Navigation } from "@/components/layout/navigation"
import type React from "react"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Statický sidebar pro desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <Navigation />
      </div>

      {/* Hlavní obsah */}
      <div className="lg:pl-64">
        {/* Zde bude horní lišta (header) */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Obsah horní lišty může být přidán později */}
        </div>
        
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
