"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { navItems, settingsNavItem } from "@/config/nav"
import { Role } from "@/config/roles"

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const userRole = user?.role as Role;

  const accessibleNavItems = navItems.filter(item => 
    !item.roles || item.roles.length === 0 || (userRole && item.roles.includes(userRole))
  );

  const canAccessSettings = userRole && settingsNavItem.roles.includes(userRole);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-card sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Sparkles className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Salon Harmonie</span>
          </Link>
          {accessibleNavItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                    pathname.startsWith(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        {canAccessSettings && (
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={settingsNavItem.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                    pathname.startsWith(settingsNavItem.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <settingsNavItem.icon className="h-5 w-5" />
                  <span className="sr-only">{settingsNavItem.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{settingsNavItem.label}</TooltipContent>
            </Tooltip>
          </nav>
        )}
      </TooltipProvider>
    </aside>
  )
}