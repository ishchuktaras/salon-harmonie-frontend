// src/components/layout/sidebar.tsx

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  Users,
  CreditCard,
  BarChart3,
  Leaf,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Kalendář", href: "/calendar", icon: Calendar },
  { name: "Klienti", href: "/clients", icon: Users },
  { name: "Pokladna", href: "/pos", icon: CreditCard },
]

const settingsNavigation = [{ name: "Nastavení", href: "/settings", icon: Settings }]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-sage-100 to-sage-200 rounded-lg group-hover:shadow-md transition-all duration-200">
            <Leaf className="w-5 h-5 text-sage-700" />
          </div>
          <div>
            <h1 className="text-lg font-serif font-semibold text-stone-800 group-hover:text-sage-800 transition-colors">
              Salon Harmonie
            </h1>
          </div>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname.startsWith(item.href)
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                        isActive
                          ? "bg-gray-50 text-sage-600"
                          : "text-gray-700 hover:text-sage-600 hover:bg-gray-50",
                      )}
                    >
                      <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
                {settingsNavigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <li key={item.name}>
                            <Link
                            href={item.href}
                            className={cn(
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                isActive
                                ? "bg-gray-50 text-sage-600"
                                : "text-gray-700 hover:text-sage-600 hover:bg-gray-50",
                            )}
                            >
                            <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            {item.name}
                            </Link>
                        </li>
                    )
                })}
                 <li>
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-sage-600 hover:bg-gray-50 w-full justify-start"
                    >
                        <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                        Odhlásit
                    </Button>
                </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}
