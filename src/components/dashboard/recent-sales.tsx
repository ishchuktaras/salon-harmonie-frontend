// frontend/src/components/dashboard/recent-sales.tsx
"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentSales() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Poslední transakce</CardTitle>
        <CardDescription>Zde se zobrazí poslední dokončené transakce.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Žádné nedávné transakce.
        </div>
      </CardContent>
    </Card>
  )
}