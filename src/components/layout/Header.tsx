"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth"; 
import { navItems, settingsNavItem } from "@/config/nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HelpCircle, LogOut, User, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Role } from "@/config/roles";

export default function Header() {
  const { user, logout } = useAuth();
  const userRole = user?.role as Role;

  const accessibleNavItems = navItems.filter(item => 
    !item.roles || item.roles.length === 0 || (userRole && item.roles.includes(userRole))
  );
  
  const canAccessSettings = userRole && settingsNavItem.roles.includes(userRole);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Otevřít menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs bg-card">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Sparkles className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Salon Harmonie</span>
            </Link>
            {accessibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
              </Link>
            ))}
            {canAccessSettings && (
               <Link
                href={settingsNavItem.href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <settingsNavItem.icon className="h-5 w-5 mr-2" />
                {settingsNavItem.label}
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="relative ml-auto flex-1 md:grow-0" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative flex items-center gap-3 h-10 px-3"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('') : <User className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium leading-none">
                {user?.name || "Uživatel"}
              </p>
              <p className="text-xs text-muted-foreground leading-none">
                {user?.role || ""}
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.name || "Můj účet"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canAccessSettings && (
            <DropdownMenuItem asChild>
              <Link href={settingsNavItem.href} className="flex items-center cursor-pointer">
                <settingsNavItem.icon className="mr-2 h-4 w-4" />
                <span>{settingsNavItem.label}</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Podpora</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Odhlásit se</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}