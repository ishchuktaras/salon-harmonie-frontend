// src/components/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/admin', label: 'Přehled' },
  { href: '/admin/calendar', label: 'Kalendář' },
  { href: '/admin/clients', label: 'Klienti' }, // <-- PŘIDANÝ ŘÁDEK
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-brand-primary text-brand-accent flex flex-col">
      <div className="font-serif text-2xl font-bold text-center py-6 border-b border-brand-muted">
        Admin Panel
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-3 rounded-md transition-colors duration-200 ${
                  pathname === item.href
                    ? 'bg-brand-muted text-white'
                    : 'hover:bg-brand-muted/50'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-4 py-6 border-t border-brand-muted">
        <button
          onClick={logout}
          className="w-full block text-left px-4 py-3 rounded-md hover:bg-brand-muted/50 transition-colors duration-200"
        >
          Odhlásit se
        </button>
      </div>
    </aside>
  );
}