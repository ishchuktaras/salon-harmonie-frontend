'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useApi } from '@/hooks/useApi'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

export default function DailySummaryPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const api = useApi()

  const handlePerformCloseout = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      // Voláme backend endpoint pomocí správné metody apiFetch
      const response = await api.apiFetch('/reports/daily-closeout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Odesíláme prázdný objekt
      })

      // Zde bychom ideálně zobrazili data z 'response', např. souhrn tržeb
      setSuccess(
        'Denní uzávěrka byla úspěšně provedena a odeslána do účetnictví.',
      )
      console.log('Daily closeout response:', response)
    } catch (err: any) {
      console.error('Failed to perform daily closeout:', err)
      setError(
        'Nepodařilo se provést denní uzávěrku. Zkontrolujte konzoli pro více detailů.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title="Denní uzávěrka"
        description="Proveďte uzávěrku tržeb za aktuální den a odešlete souhrn do účetního systému."
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Provést uzávěrku</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Kliknutím na tlačítko níže dojde k sečtení všech dnešních transakcí a
            vytvoření souhrnného dokladu v systému POHODA. Tato akce je
            nevratná.
          </p>
          <Button
            onClick={handlePerformCloseout}
            disabled={loading}
            size="lg"
          >
            {loading ? 'Provádím...' : 'Provést denní uzávěrku'}
          </Button>

          {success && (
            <Alert variant="default">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Úspěch!</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Chyba</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

