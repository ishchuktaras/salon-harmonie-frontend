"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Users, DollarSign, FileText, Download } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reporty</h1>
          <p className="text-muted-foreground">Přehledy a analýzy výkonnosti salonu</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportovat
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkové tržby</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 320 Kč</div>
            <p className="text-xs text-muted-foreground">+20.1% oproti minulému měsíci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Počet klientů</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">+12% oproti minulému měsíci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Počet služeb</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+8% oproti minulému měsíci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Průměrná hodnota</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">290 Kč</div>
            <p className="text-xs text-muted-foreground">+5% oproti minulému měsíci</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Měsíční přehled</CardTitle>
            <CardDescription>Tržby a počet služeb za posledních 12 měsíců</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Graf bude implementován s daty z API
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nejpopulárnější služby</CardTitle>
            <CardDescription>Top 5 nejčastěji objednaných služeb</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Střih a foukaná", count: 45, percentage: 28.8 },
                { name: "Barvení vlasů", count: 32, percentage: 20.5 },
                { name: "Manikúra", count: 28, percentage: 17.9 },
                { name: "Pedikúra", count: 24, percentage: 15.4 },
                { name: "Masáž", count: 18, percentage: 11.5 },
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{service.name}</p>
                    <div className="w-full bg-secondary rounded-full h-2 mt-1">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${service.percentage}%` }} />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-medium">{service.count}</p>
                    <p className="text-xs text-muted-foreground">{service.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dostupné reporty
          </CardTitle>
          <CardDescription>Stáhněte si detailní reporty pro různá období</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="justify-start bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Denní report
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Týdenní report
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Měsíční report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
