// src/app/page.tsx - OPRAVENÁ VERZE

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, CreditCard, BarChart3, Leaf, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    // Používáme barvy z tématu (--background)
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary shadow-sm">
              <Leaf className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground">Salon Harmonie</h1>
              <p className="text-sm text-muted-foreground">Wellness Management System</p>
            </div>
          </div>
          
          {/* Tlačítka vpravo */}
          <div className="flex items-center space-x-2">
            <Link href="/login">
              {/* Tlačítko "Přihlásit se" - nyní používá variantu "outline" */}
              <Button variant="outline">
                Přihlásit se
              </Button>
            </Link>
            <Link href="/booking">
               {/* Tlačítko "Rezervovat termín" - nyní používá výchozí (tmavou) variantu */}
              <Button>
                Rezervovat termín
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto text-center">
          <div className="mb-8 flex items-center justify-center">
            <div className="mr-4 rounded-2xl bg-secondary p-3 shadow-lg">
              <Sparkles className="h-8 w-8 text-secondary-foreground" />
            </div>
            <h2 className="font-serif text-5xl font-bold text-foreground">Vítejte v Salon Harmonie</h2>
          </div>
          <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Komplexní systém pro správu vašeho wellness centra. Elegantní, intuitivní a navržený pro prémiovou péči o
            klienty s důrazem na přírodní harmonii a klid.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/booking">
              {/* Hlavní CTA tlačítko - používá výchozí (tmavou) variantu */}
              <Button size="lg">
                Rezervovat termín
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/services">
              {/* Sekundární CTA tlačítko - používá variantu "secondary" */}
              <Button size="lg" variant="secondary">
                Prohlédnout služby
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-background/80 px-4 py-20 backdrop-blur-sm">
        <div className="container mx-auto">
          <h3 className="mb-16 text-center font-serif text-4xl font-bold text-foreground">Klíčové funkce systému</h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Karty nyní používají standardní Card komponentu, která si bere barvy z tématu */}
            <Card>
              <CardHeader className="items-center text-center pb-4">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary shadow-lg">
                  <Calendar className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="font-serif text-lg">Rezervační systém</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Pokročilý kalendář s online rezervacemi, správou zdrojů a automatickými připomínkami.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="items-center text-center pb-4">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary shadow-lg">
                  <Users className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="font-serif text-lg">CRM systém</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Kompletní správa klientů s historií, preferencemi a věrnostním programem.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="items-center text-center pb-4">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary shadow-lg">
                  <CreditCard className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="font-serif text-lg">POS systém</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Integrovaná pokladna s e-shopem, správou zásob a automatickým účetnictvím.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="items-center text-center pb-4">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary shadow-lg">
                  <BarChart3 className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="font-serif text-lg">Analytika</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Pokročilé reporty, sledování výkonnosti a business intelligence.
                </CardDescription>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-12 px-4 text-background">
        <div className="container mx-auto text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="mr-3 rounded-lg bg-primary p-2">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold">Salon Harmonie</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 Salon Harmonie Management System. Vytvořeno s láskou pro wellness průmysl.
          </p>
        </div>
      </footer>
    </div>
  )
}