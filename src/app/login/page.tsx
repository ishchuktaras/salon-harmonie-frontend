import { LoginForm } from '@/components/login-form'
import { GalleryVerticalEnd } from 'lucide-react'

// Tato komponenta je nyní jednoduchá "Server Component", která pouze obaluje formulář.
export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Salon Harmonie
        </a>
        {/* Veškerá logika je nyní uvnitř této klientské komponenty */}
        <LoginForm />
      </div>
      <div className="text-muted-foreground text-center text-xs text-balance">
        Vytvořeno s péčí pro Salon Harmonie.
      </div>
    </div>
  )
}

