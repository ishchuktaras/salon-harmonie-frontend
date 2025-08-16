"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, CheckCircle, Settings, Zap, Database, FolderSyncIcon as Sync } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAbraFlexiService } from "@/lib/services/abra-flexi"

interface IntegrationStatus {
  abraFlexi: {
    connected: boolean
    lastSync: string | null
    autoSync: boolean
    error: string | null
  }
}

export default function IntegrationsPage() {
  const [status, setStatus] = useState<IntegrationStatus>({
    abraFlexi: {
      connected: false,
      lastSync: null,
      autoSync: true,
      error: null,
    },
  })

  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [config, setConfig] = useState({
    baseUrl: process.env.NEXT_PUBLIC_ABRA_FLEXI_URL || "",
    username: process.env.NEXT_PUBLIC_ABRA_FLEXI_USERNAME || "",
    password: process.env.NEXT_PUBLIC_ABRA_FLEXI_PASSWORD || "",
    company: process.env.NEXT_PUBLIC_ABRA_FLEXI_COMPANY || "",
  })

  useEffect(() => {
    // Načtení stavu integrace při načtení stránky
    checkAbraFlexiConnection()
  }, [])

  const checkAbraFlexiConnection = async () => {
    try {
      const abraService = getAbraFlexiService()
      const isConnected = await abraService.testConnection()

      setStatus((prev) => ({
        ...prev,
        abraFlexi: {
          ...prev.abraFlexi,
          connected: isConnected,
          error: isConnected ? null : "Nepodařilo se připojit k ABRA Flexi",
        },
      }))
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        abraFlexi: {
          ...prev.abraFlexi,
          connected: false,
          error: error instanceof Error ? error.message : "Neznámá chyba",
        },
      }))
    }
  }

  const testConnection = async () => {
    setIsTestingConnection(true)
    await checkAbraFlexiConnection()
    setIsTestingConnection(false)
  }

  const performManualSync = async () => {
    setIsSyncing(true)
    try {
      const abraService = getAbraFlexiService()

      // Simulace synchronizace dat
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStatus((prev) => ({
        ...prev,
        abraFlexi: {
          ...prev.abraFlexi,
          lastSync: new Date().toLocaleString("cs-CZ"),
          error: null,
        },
      }))

      alert("Synchronizace byla úspěšně dokončena")
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        abraFlexi: {
          ...prev.abraFlexi,
          error: error instanceof Error ? error.message : "Chyba při synchronizaci",
        },
      }))
    }
    setIsSyncing(false)
  }

  const toggleAutoSync = (enabled: boolean) => {
    setStatus((prev) => ({
      ...prev,
      abraFlexi: {
        ...prev.abraFlexi,
        autoSync: enabled,
      },
    }))
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Integrace</h1>
        <p className="text-stone-600">Správa připojení k externím systémům a službám</p>
      </div>

      <div className="space-y-6">
        {/* ABRA Flexi Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>ABRA Flexi</CardTitle>
                  <CardDescription>Účetní systém pro automatické zpracování tržeb</CardDescription>
                </div>
              </div>
              <Badge variant={status.abraFlexi.connected ? "default" : "destructive"}>
                {status.abraFlexi.connected ? "Připojeno" : "Odpojeno"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {status.abraFlexi.connected ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm">
                {status.abraFlexi.connected
                  ? "Připojení k ABRA Flexi je aktivní"
                  : "Připojení k ABRA Flexi není dostupné"}
              </span>
            </div>

            {status.abraFlexi.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{status.abraFlexi.error}</AlertDescription>
              </Alert>
            )}

            {/* Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseUrl">URL serveru</Label>
                <Input
                  id="baseUrl"
                  value={config.baseUrl}
                  onChange={(e) => setConfig((prev) => ({ ...prev, baseUrl: e.target.value }))}
                  placeholder="https://server.flexibee.eu:5434"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Firma</Label>
                <Input
                  id="company"
                  value={config.company}
                  onChange={(e) => setConfig((prev) => ({ ...prev, company: e.target.value }))}
                  placeholder="demo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Uživatelské jméno</Label>
                <Input
                  id="username"
                  value={config.username}
                  onChange={(e) => setConfig((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="winstrom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Heslo</Label>
                <Input
                  id="password"
                  type="password"
                  value={config.password}
                  onChange={(e) => setConfig((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Separator />

            {/* Sync Settings */}
            <div className="space-y-4">
              <h4 className="font-semibold text-stone-800">Nastavení synchronizace</h4>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Automatická synchronizace</Label>
                  <p className="text-sm text-stone-600">Automaticky odesílat data při denní uzávěrce</p>
                </div>
                <Switch checked={status.abraFlexi.autoSync} onCheckedChange={toggleAutoSync} />
              </div>

              {status.abraFlexi.lastSync && (
                <div className="text-sm text-stone-600">Poslední synchronizace: {status.abraFlexi.lastSync}</div>
              )}
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={testConnection} disabled={isTestingConnection} variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                {isTestingConnection ? "Testování..." : "Test připojení"}
              </Button>

              <Button
                onClick={performManualSync}
                disabled={isSyncing || !status.abraFlexi.connected}
                className="bg-sage-600 hover:bg-sage-700"
              >
                <Sync className="h-4 w-4 mr-2" />
                {isSyncing ? "Synchronizuji..." : "Ruční synchronizace"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Integration Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Funkce integrace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-lg">
                <h4 className="font-semibold text-stone-800 mb-2">Automatické účetnictví</h4>
                <p className="text-sm text-stone-600">
                  Denní tržby se automaticky odesílají do ABRA Flexi při uzávěrce
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg">
                <h4 className="font-semibold text-stone-800 mb-2">Synchronizace klientů</h4>
                <p className="text-sm text-stone-600">Noví klienti se automaticky přidávají do adresáře ABRA Flexi</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg">
                <h4 className="font-semibold text-stone-800 mb-2">Faktury a doklady</h4>
                <p className="text-sm text-stone-600">Automatické vytváření faktur a účetních dokladů</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg">
                <h4 className="font-semibold text-stone-800 mb-2">Platební metody</h4>
                <p className="text-sm text-stone-600">Rozlišení hotovostních a kartových plateb v účetnictví</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

