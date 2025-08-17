"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, CreditCard, Banknote, Download, Send } from "lucide-react"
import { getAbraFlexiService, type DailySummaryData } from "@/lib/services/abra-flexi"

// Mock data pro denní uzávěrku
const mockDailySummary = {
  date: new Date().toLocaleDateString("cs-CZ"),
  transactions: [
    { id: 1, time: "09:15", client: "Anna Nováková", items: ["Relaxační masáž"], total: 800, method: "card" },
    {
      id: 2,
      time: "10:30",
      client: "Petr Svoboda",
      items: ["Kosmetické ošetření", "Pleťový krém"],
      total: 2090,
      method: "cash",
    },
    {
      id: 3,
      time: "14:00",
      client: "Marie Dvořáková",
      items: ["Sauna", "Aromatická svíčka"],
      total: 620,
      method: "card",
    },
    { id: 4, time: "15:45", client: "Bez registrace", items: ["Dárkový poukaz 1000 Kč"], total: 1000, method: "cash" },
    { id: 5, time: "16:30", client: "Jana Svobodová", items: ["Manikúra", "Masážní olej"], total: 950, method: "card" },
  ],
  summary: {
    totalRevenue: 5460,
    totalTransactions: 5,
    cashPayments: 3090,
    cardPayments: 2370,
    servicesRevenue: 4150,
    productsRevenue: 1310,
    averageTransaction: 1092,
  },
}

export default function DailySummaryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isClosing, setIsClosing] = useState(false)

  const handleDailyClose = async () => {
    setIsClosing(true)
    try {
      // Příprava dat pro ABRA Flexi
      const summaryData: DailySummaryData = {
        date: mockDailySummary.date,
        totalRevenue: mockDailySummary.summary.totalRevenue,
        transactions: mockDailySummary.transactions,
        servicesRevenue: mockDailySummary.summary.servicesRevenue,
        productsRevenue: mockDailySummary.summary.productsRevenue,
        cashPayments: mockDailySummary.summary.cashPayments,
        cardPayments: mockDailySummary.summary.cardPayments,
      }

      const abraService = getAbraFlexiService()
      await abraService.sendDailySummary(summaryData)

      setIsClosing(false)
      alert("Denní uzávěrka byla úspěšně provedena a data odeslána do ABRA Flexi.")
    } catch (error) {
      setIsClosing(false)
      console.error("Chyba při denní uzávěrce:", error)
      alert("Chyba při odesílání dat do ABRA Flexi. Zkuste to prosím znovu.")
    }
  }

  const exportToPDF = () => {
    // Implementace exportu do PDF
    console.log("Export do PDF")
    alert("Export do PDF bude implementován")
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Denní uzávěrka</h1>
        <p className="text-stone-600">Přehled tržeb a denní uzávěrka pro účetnictví</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Datum</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Celkové tržby</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sage-700">
              {mockDailySummary.summary.totalRevenue.toLocaleString()} Kč
            </div>
            <p className="text-sm text-stone-500">{mockDailySummary.summary.totalTransactions} transakcí</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Průměrná transakce</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">
              {mockDailySummary.summary.averageTransaction.toLocaleString()} Kč
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              +12% oproti včera
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">Způsoby platby</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Karta
                </span>
                <span className="font-medium">{mockDailySummary.summary.cardPayments.toLocaleString()} Kč</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Banknote className="h-3 w-3" />
                  Hotově
                </span>
                <span className="font-medium">{mockDailySummary.summary.cashPayments.toLocaleString()} Kč</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Transakce dne</CardTitle>
              <CardDescription>Detailní přehled všech transakcí za {mockDailySummary.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDailySummary.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-stone-600">{transaction.time}</span>
                        <Badge variant={transaction.method === "card" ? "default" : "secondary"}>
                          {transaction.method === "card" ? "Karta" : "Hotově"}
                        </Badge>
                      </div>
                      <p className="font-medium text-stone-800">{transaction.client}</p>
                      <p className="text-sm text-stone-600">{transaction.items.join(", ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-sage-700">{transaction.total.toLocaleString()} Kč</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rozpis tržeb</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Služby</span>
                <span className="font-medium">{mockDailySummary.summary.servicesRevenue.toLocaleString()} Kč</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Produkty</span>
                <span className="font-medium">{mockDailySummary.summary.productsRevenue.toLocaleString()} Kč</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Celkem</span>
                <span className="text-sage-700">{mockDailySummary.summary.totalRevenue.toLocaleString()} Kč</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Akce</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={exportToPDF} variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export do PDF
              </Button>

              <Button onClick={handleDailyClose} disabled={isClosing} className="w-full bg-sage-600 hover:bg-sage-700">
                <Send className="h-4 w-4 mr-2" />
                {isClosing ? "Zpracovávám..." : "Provést denní uzávěrku"}
              </Button>

              <p className="text-xs text-stone-500 text-center">
                Denní uzávěrka odešle data do ABRA Flexi pro účetnictví
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
