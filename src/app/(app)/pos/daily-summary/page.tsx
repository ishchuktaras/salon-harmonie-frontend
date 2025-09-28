'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { PageHeader } from '@/components/ui/page-header';
import { useApi } from '@/hooks/use-api';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface CloseoutResponse {
  message: string;
  totalRevenue: number;
  closedCount: number;
}

export default function DailySummaryPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState<CloseoutResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const api = useApi();

  const handleCloseout = async () => {
    setIsLoading(true);
    setSummary(null);
    try {
      const response = await api.request<CloseoutResponse>('/reports/daily-closeout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      setSummary(response);
      toast.success(response.message);
    } catch (error) {
      toast.error('Denní uzávěrku se nepodařilo provést.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' }).format(value / 100);

  return (
    <>
      
      <PageHeader
        title="Denní uzávěrka"
        description="Zde můžete provést denní uzávěrku tržeb pro vybrané datum. Tato akce sečte všechny dokončené transakce a označí je jako uzavřené."
      />
      <div className="p-4 md:p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Provést uzávěrku</CardTitle>
            <CardDescription>Vyberte datum a spusťte uzávěrku.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleCloseout} disabled={isLoading} className="w-full">
              {isLoading ? 'Provádím...' : 'Spustit uzávěrku'}
            </Button>
            {summary && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold">{summary.message}</h3>
                <p>Celkové tržby: {formatCurrency(summary.totalRevenue)}</p>
                <p>Počet uzavřených transakcí: {summary.closedCount}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}