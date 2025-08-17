// frontend/src/components/dashboard/overview.tsx
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Overview() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Přehled tržeb</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
          Graf bude brzy doplněn
        </div>
      </CardContent>
    </Card>
  )
}