import {
  Calendar,
  Home,
  BarChart3,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Role } from "./roles"; 

export const navItems = [
  { 
    href: "/dashboard", 
    icon: Home, 
    label: "Dashboard",
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.RECEPCNI]
  },
  { 
    href: "/calendar", 
    icon: Calendar, 
    label: "Kalendář",
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.RECEPCNI, Role.TERAPEUT]
  },
  { 
    href: "/clients", 
    icon: Users, 
    label: "Klienti",
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.RECEPCNI, Role.TERAPEUT]
  },
  { 
    href: "/pos", 
    icon: ShoppingCart, 
    label: "Pokladna",
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.RECEPCNI]
  },
  { 
    href: "/reports", 
    icon: BarChart3, 
    label: "Reporty",
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER]
  },
];

export const settingsNavItem = {
  href: "/settings",
  icon: Settings,
  label: "Nastavení",
  roles: [Role.SUPER_ADMIN, Role.ADMIN]
};