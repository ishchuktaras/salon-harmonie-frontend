import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-stone-800">{title}</h1>
        {children}
      </div>
      {description && <p className="text-stone-600">{description}</p>}
    </div>
  )
}
