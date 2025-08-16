"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Calendar, Users, CreditCard, BarChart3, Leaf, Menu, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Kalendář", href: "/calendar", icon: Calendar },
  { name: "Klienti", href: "/clients", icon: Users },
  { name: "Pokladna", href: "/pos", icon: CreditCard },
  { name: "Nastavení", href: "/settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl group-hover:shadow-md transition-all duration-200">
              <Leaf className="w-6 h-6 text-sage-700" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold text-stone-800 group-hover:text-sage-800 transition-colors">
                Salon Harmonie
              </h1>
              <p className="text-sm text-stone-600">Wellness Management</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sage-100 text-sage-800 shadow-sm"
                      : "text-stone-700 hover:text-sage-700 hover:bg-sage-50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user && (
              <div className="hidden md:block text-right mr-4 px-3 py-2 bg-stone-50 rounded-lg">
                <p className="text-sm font-medium text-stone-800">{user.name}</p>
                <p className="text-xs text-stone-600 capitalize">{user.role}</p>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-stone-700 hover:text-sage-700 hover:bg-sage-50 rounded-lg"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Odhlásit
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden hover:bg-sage-50 rounded-lg">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-md">
                <div className="flex flex-col space-y-3 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-sage-100 text-sage-800 shadow-sm"
                            : "text-stone-700 hover:text-sage-700 hover:bg-sage-50",
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
