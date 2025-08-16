"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/layout/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ClientList } from "@/components/crm/client-list"
import { ClientModal } from "@/components/crm/client-modal"
import { ClientProfile } from "@/components/crm/client-profile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Search, Filter, UserCheck, Star, Calendar } from "lucide-react"
import { clientsApi } from "@/lib/api/clients"

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "profile">("list")

  useEffect(() => {
    loadClientsData()
  }, [])

  const loadClientsData = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("[v0] Loading clients data from API...")

      const clientsData = await clientsApi.getAll()
      console.log("[v0] Loaded clients:", clientsData)

      const transformedClients = clientsData.map((client: any) => ({
        id: client.id,
        name: `${client.firstName} ${client.lastName}`,
        email: client.email,
        phone: client.phone || "N/A",
        dateOfBirth: client.dateOfBirth,
        address: client.address,
        registrationDate: client.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
        lastVisit: client.lastVisit || client.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
        totalVisits: client.totalVisits || 0,
        totalSpent: client.totalSpent || 0,
        loyaltyPoints: client.loyaltyPoints || 0,
        status: client.status || "new",
        preferences: client.preferences || {
          massagePressure: "",
          favoriteTherapist: "",
          allergies: [],
          notes: "",
        },
        visitHistory: client.visitHistory || [],
        communications: client.communications || [],
      }))

      setClients(transformedClients)
    } catch (err) {
      console.error("[v0] Error loading clients data:", err)
      setError(err instanceof Error ? err.message : "Chyba při načítání klientů")
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || client.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const clientStats = {
    total: clients.length,
    new: clients.filter((c) => c.status === "new").length,
    regular: clients.filter((c) => c.status === "regular").length,
    vip: clients.filter((c) => c.status === "vip").length,
    totalRevenue: clients.reduce((sum: number, c: any) => sum + (c.totalSpent || 0), 0),
  }

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId)
    setViewMode("profile")
  }

  const handleClientEdit = (clientId: string) => {
    setEditingClient(clientId)
    setIsClientModalOpen(true)
  }

  const handleClientCreate = async (clientData: any) => {
    try {
      console.log("[v0] Creating new client:", clientData)

      const newClient = await clientsApi.create({
        firstName: clientData.name.split(" ")[0] || clientData.firstName,
        lastName: clientData.name.split(" ").slice(1).join(" ") || clientData.lastName,
        email: clientData.email,
        phone: clientData.phone,
        dateOfBirth: clientData.dateOfBirth,
        address: clientData.address,
        preferences: clientData.preferences,
      })

      console.log("[v0] Client created successfully:", newClient)

      await loadClientsData()

      setIsClientModalOpen(false)
      setEditingClient(null)
    } catch (err) {
      console.error("[v0] Error creating client:", err)
      setError(err instanceof Error ? err.message : "Chyba při vytváření klienta")
    }
  }

  const handleClientUpdate = async (clientId: string, clientData: any) => {
    try {
      console.log("[v0] Updating client:", clientId, clientData)

      await clientsApi.update(clientId, {
        firstName: clientData.name.split(" ")[0] || clientData.firstName,
        lastName: clientData.name.split(" ").slice(1).join(" ") || clientData.lastName,
        email: clientData.email,
        phone: clientData.phone,
        dateOfBirth: clientData.dateOfBirth,
        address: clientData.address,
        preferences: clientData.preferences,
      })

      console.log("[v0] Client updated successfully")

      await loadClientsData()

      setIsClientModalOpen(false)
      setEditingClient(null)
    } catch (err) {
      console.error("[v0] Error updating client:", err)
      setError(err instanceof Error ? err.message : "Chyba při aktualizaci klienta")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "regular":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "new":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-stone-100 text-stone-800 border-stone-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "vip":
        return "VIP"
      case "regular":
        return "Stálý"
      case "new":
        return "Nový"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mx-auto mb-4"></div>
                <p className="text-stone-600">Načítám klienty...</p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-600 mb-4">
                  <Users className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-stone-800 mb-2">Chyba při načítání klientů</h3>
                <p className="text-stone-600 mb-4">{error}</p>
                <Button onClick={loadClientsData} className="bg-amber-700 hover:bg-amber-800">
                  Zkusit znovu
                </Button>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
        <Navigation />

        <main className="container mx-auto px-4 py-8">
          {viewMode === "list" ? (
            <>
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">Správa klientů</h1>
                  <p className="text-stone-600">CRM systém pro Salon Harmonie</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                  <Button onClick={() => setIsClientModalOpen(true)} className="bg-amber-700 hover:bg-amber-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Nový klient
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <Card className="border-stone-200 bg-white/80">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-stone-600">Celkem klientů</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-stone-800">{clientStats.total}</div>
                  </CardContent>
                </Card>

                <Card className="border-stone-200 bg-white/80">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-stone-600">VIP klienti</CardTitle>
                    <Star className="h-4 w-4 text-amber-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-stone-800">{clientStats.vip}</div>
                  </CardContent>
                </Card>

                <Card className="border-stone-200 bg-white/80">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-stone-600">Stálí klienti</CardTitle>
                    <UserCheck className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-stone-800">{clientStats.regular}</div>
                  </CardContent>
                </Card>

                <Card className="border-stone-200 bg-white/80">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-stone-600">Noví klienti</CardTitle>
                    <Calendar className="h-4 w-4 text-emerald-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-stone-800">{clientStats.new}</div>
                  </CardContent>
                </Card>

                <Card className="border-stone-200 bg-white/80">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-stone-600">Celkové tržby</CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-stone-800">
                      {clientStats.totalRevenue.toLocaleString()} Kč
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filters */}
              <Card className="border-stone-200 bg-white/80 mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <Input
                          placeholder="Hledat klienty..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-stone-500" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filtrovat podle statusu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Všichni klienti</SelectItem>
                            <SelectItem value="vip">VIP klienti</SelectItem>
                            <SelectItem value="regular">Stálí klienti</SelectItem>
                            <SelectItem value="new">Noví klienti</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="text-sm text-stone-600">
                      Zobrazeno {filteredClients.length} z {clients.length} klientů
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client List */}
              <Card className="border-stone-200 bg-white/80">
                <CardContent className="p-6">
                  <ClientList
                    clients={filteredClients}
                    onClientSelect={handleClientSelect}
                    onClientEdit={handleClientEdit}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            selectedClient && (
              <ClientProfile
                client={clients.find((c) => c.id === selectedClient)!}
                onBack={() => {
                  setViewMode("list")
                  setSelectedClient(null)
                }}
                onEdit={() => handleClientEdit(selectedClient)}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
              />
            )
          )}
        </main>

        {/* Client Modal */}
        <ClientModal
          isOpen={isClientModalOpen}
          onClose={() => {
            setIsClientModalOpen(false)
            setEditingClient(null)
          }}
          client={editingClient ? clients.find((c) => c.id === editingClient) : null}
          onClientCreate={handleClientCreate}
          onClientUpdate={handleClientUpdate}
        />
      </div>
    </ProtectedRoute>
  )
}
