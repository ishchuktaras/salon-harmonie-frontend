import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, CreditCard, BarChart3, Leaf, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-sage-50 to-stone-100">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl shadow-sm">
                <Leaf className="w-6 h-6 text-sage-700" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-semibold text-stone-800">Salon Harmonie</h1>
                <p className="text-sm text-stone-600">Wellness Management System</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/calendar" className="text-stone-700 hover:text-sage-700 transition-colors font-medium">
                Kalendář
              </Link>
              <Link href="/clients" className="text-stone-700 hover:text-sage-700 transition-colors font-medium">
                Klienti
              </Link>
              <Link href="/pos" className="text-stone-700 hover:text-sage-700 transition-colors font-medium">
                Pokladna
              </Link>
              <Link href="/analytics" className="text-stone-700 hover:text-sage-700 transition-colors font-medium">
                Analytika
              </Link>
            </nav>
            <Link href="/login">
              <Button className="bg-sage-600 hover:bg-sage-700 text-white shadow-sm">
                Přihlásit se
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl shadow-lg mr-4">
              <Sparkles className="w-8 h-8 text-sage-700" />
            </div>
            <h2 className="text-5xl font-serif font-bold text-stone-800">Vítejte v Salon Harmonie</h2>
          </div>
          <p className="text-xl text-stone-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Komplexní systém pro správu vašeho wellness centra. Elegantní, intuitivní a navržený pro prémiovou péči o
            klienty s důrazem na přírodní harmonii a klid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-sage-600 hover:bg-sage-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Rezervovat termín
              <Calendar className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-stone-300 text-stone-700 hover:bg-sage-50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
            >
              Prohlédnout služby
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto">
          <h3 className="text-4xl font-serif font-bold text-center text-stone-800 mb-16">Klíčové funkce systému</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-stone-200 hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm group">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Calendar className="w-8 h-8 text-sage-700" />
                  </div>
                </div>
                <CardTitle className="text-stone-800 font-serif text-lg">Rezervační systém</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-stone-600 text-center leading-relaxed">
                  Pokročilý kalendář s online rezervacemi, správou zdrojů a automatickými připomínkami.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-stone-200 hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm group">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Users className="w-8 h-8 text-blue-700" />
                  </div>
                </div>
                <CardTitle className="text-stone-800 font-serif text-lg">CRM systém</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-stone-600 text-center leading-relaxed">
                  Kompletní správa klientů s historií, preferencemi a věrnostním programem.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-stone-200 hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm group">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <CreditCard className="w-8 h-8 text-amber-700" />
                  </div>
                </div>
                <CardTitle className="text-stone-800 font-serif text-lg">POS systém</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-stone-600 text-center leading-relaxed">
                  Integrovaná pokladna s e-shopem, správou zásob a automatickým účetnictvím.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-stone-200 hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm group">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <BarChart3 className="w-8 h-8 text-purple-700" />
                  </div>
                </div>
                <CardTitle className="text-stone-800 font-serif text-lg">Analytika</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-stone-600 text-center leading-relaxed">
                  Pokročilé reporty, sledování výkonnosti a business intelligence.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-stone-800 to-stone-900 text-stone-200 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-2 bg-sage-600 rounded-lg mr-3">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif font-semibold text-xl">Salon Harmonie</span>
          </div>
          <p className="text-stone-400 text-lg">
            © 2025 Salon Harmonie Management System. Vytvořeno s láskou pro wellness průmysl.
          </p>
        </div>
      </footer>
    </div>
  )
}
