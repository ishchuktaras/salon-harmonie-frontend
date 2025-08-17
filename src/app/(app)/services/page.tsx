// src/app/(app)/services/page.tsx

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Clock, Star, ArrowRight, Sparkles, Heart, Zap } from "lucide-react"
import Link from "next/link"
import { servicesApi } from "@/lib/api/services"
import type { Service } from "@/lib/api/types"

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const servicesData = await servicesApi.getAll()
      setServices(servicesData)
    } catch (error) {
      console.error("Error loading services:", error)
      // Fallback to mock data
      setServices([
        {
          id: "1",
          name: "Relaxační masáž",
          description: "Hluboce relaxační masáž celého těla s použitím přírodních olejů",
          duration: 60,
          price: 1200,
          category: "massage",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Kosmetické ošetření",
          description: "Kompletní péče o pleť s čištěním, peelingem a hydratací",
          duration: 90,
          price: 1500,
          category: "skincare",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Sauna a wellness",
          description: "Privátní sauna s aromaterapií a relaxačním prostorem",
          duration: 45,
          price: 800,
          category: "wellness",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: "all", name: "Všechny služby", icon: Sparkles },
    { id: "massage", name: "Masáže", icon: Heart },
    { id: "skincare", name: "Kosmetika", icon: Star },
    { id: "wellness", name: "Wellness", icon: Zap },
  ]

  const filteredServices =
    selectedCategory === "all" ? services : services.filter((service) => service.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-sage-50 to-stone-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-700 mx-auto mb-4"></div>
              <p className="text-stone-600">Načítám služby...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-sage-50 to-stone-100">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl shadow-sm">
                <Leaf className="w-6 h-6 text-sage-700" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-semibold text-stone-800">Salon Harmonie</h1>
                <p className="text-sm text-stone-600">Wellness Management</p>
              </div>
            </Link>
            <Link href="/booking">
              <Button className="bg-sage-600 hover:bg-sage-700 text-white shadow-sm">
                Rezervovat termín
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl shadow-lg mr-4">
              <Sparkles className="w-8 h-8 text-sage-700" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-stone-800">Naše služby</h2>
          </div>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Objevte naši nabídku prémiových wellness služeb navržených pro vaše tělo i duši. Každá služba je pečlivě
            vybrána pro maximální relaxaci a regeneraci.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id
                    ? "bg-sage-600 hover:bg-sage-700 text-white"
                    : "border-sage-200 text-sage-700 hover:bg-sage-50"
                } transition-all duration-300`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="border-stone-200 hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm group overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-sage-100 to-sage-200 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white/90 text-sage-700 hover:bg-white">{service.duration} min</Badge>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-stone-800 font-serif text-xl group-hover:text-sage-700 transition-colors">
                    {service.name}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-sage-700">{service.price} Kč</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <CardDescription className="text-stone-600 leading-relaxed mb-6">{service.description}</CardDescription>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-stone-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration} minut
                  </div>

                  <Link href="/booking">
                    <Button
                      size="sm"
                      className="bg-sage-600 hover:bg-sage-700 text-white shadow-sm group-hover:shadow-md transition-all duration-300"
                    >
                      Rezervovat
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <div className="p-4 bg-stone-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-xl font-semibold text-stone-600 mb-2">Žádné služby nenalezeny</h3>
            <p className="text-stone-500">Zkuste vybrat jinou kategorii nebo se vraťte později.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-sage-600 to-sage-700 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-serif font-bold mb-4">Připraveni na relaxaci?</h3>
          <p className="text-sage-100 text-lg mb-8 max-w-2xl mx-auto">
            Rezervujte si svůj termín ještě dnes a dopřejte si chvíli klidu a regenerace v našem wellness centru.
          </p>
          <Link href="/booking">
            <Button
              size="lg"
              className="bg-white text-sage-700 hover:bg-stone-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Rezervovat termín
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
