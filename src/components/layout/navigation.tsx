// src/components/layout/navigation.tsx

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calendar,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Leaf,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mainNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Kalendář", href: "/calendar", icon: Calendar },
  { name: "Klienti", href: "/clients", icon: Users },
  { name: "Pokladna", href: "/pos", icon: CreditCard },
]

const secondaryNavigation = [
  { name: "Nastavení", href: "/settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center gap-x-4">
        <Leaf className="h-8 w-8 text-sage-600" />
        <span className="font-serif text-xl font-semibold">Salon Harmonie</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {mainNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname.startsWith(item.href)
                        ? "bg-gray-50 text-sage-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-sage-600",
                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                    )}
                  >
                    <item.icon
                      className={cn(
                        pathname.startsWith(item.href)
                          ? "text-sage-600"
                          : "text-gray-400 group-hover:text-sage-600",
                        "h-6 w-6 shrink-0",
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {secondaryNavigation.map((item) => (
                 <li key={item.name}>
                 <Link
                   href={item.href}
                   className={cn(
                     pathname.startsWith(item.href)
                       ? "bg-gray-50 text-sage-600"
                       : "text-gray-700 hover:bg-gray-50 hover:text-sage-600",
                     "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                   )}
                 >
                   <item.icon
                     className={cn(
                       pathname.startsWith(item.href)
                         ? "text-sage-600"
                         : "text-gray-400 group-hover:text-sage-600",
                       "h-6 w-6 shrink-0",
                     )}
                     aria-hidden="true"
                   />
                   {item.name}
                 </Link>
               </li>
              ))}
               <li>
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-sage-600 hover:bg-gray-50 w-full justify-start"
                >
                    <LogOut className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-sage-600" aria-hidden="true" />
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
