import {
  Calendar,
  Home,
  BarChart3,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { UserRole } from "@/lib/api/types"; 

export const navItems = [
  { 
    href: "/dashboard", 
    icon: Home, 
    label: "Dashboard",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPCNI]
  },
  { 
    href: "/calendar", 
    icon: Calendar, 
    label: "Kalendář",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPCNI, UserRole.TERAPEUT]
  },
  { 
    href: "/clients", 
    icon: Users, 
    label: "Klienti",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPCNI, UserRole.TERAPEUT]
  },
  { 
    href: "/pos", 
    icon: ShoppingCart, 
    label: "Pokladna",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPCNI]
  },
  { 
    href: "/reports", 
    icon: BarChart3, 
    label: "Reporty",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]
  },
];

export const settingsNavItem = {
  href: "/settings",
  icon: Settings,
  label: "Nastavení",
  roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
};