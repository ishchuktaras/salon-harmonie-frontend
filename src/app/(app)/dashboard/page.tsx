'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// OPRAVA: Nahradili jsme 'CalendarCheck' za 'CalendarCheck2' a smazali nepoužívanou 'BarChart2'
import { TrendingUp, Users, Calendar, Sparkles } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from 'recharts';

// Definujeme si typ pro data, která očekáváme z backendu
interface DashboardData {
  todaySales: number;
  salesChangePercentage: number;
  todayReservationsCount: number;
  reservationsChangeCount: number;
  upcomingReservations: {
    startTime: string;
    client: { firstName: string; lastName: string };
    service: { name: string };
  }[];
  topTherapist: string;
  topService: string;
  weeklySalesData: { date: string, total: number | null }[]; // Upraveno pro možný null
}

// Komponenta pro jednu statistickou kartu
const StatCard = ({ title, value, change, icon: Icon, formatFn, changeSuffix = '%' }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{formatFn ? formatFn(value) : value}</div>
      {typeof change === 'number' && (
        <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change > 0 ? '+' : ''}{change.toFixed(1)}{changeSuffix} oproti včerejšku
        </p>
      )}
    </CardContent>
  </Card>
);

// Komponenta pro načítací "kostru"
const StatCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-6 w-6 rounded-full" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-40 mt-2" />
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<DashboardData>('/reports/dashboard-summary');
        setData(response.data);
      } catch (err) {
        setError('Data pro dashboard se nepodařilo načíst.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (value: number) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  const formatTime = (date: string) => new Date(date).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });

  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <> <StatCardSkeleton /> <StatCardSkeleton /> <StatCardSkeleton /> <StatCardSkeleton /> </>
        ) : (
          <>
            <StatCard title="Dnešní tržby" value={data?.todaySales} change={data?.salesChangePercentage} icon={TrendingUp} formatFn={formatCurrency} />
            <StatCard title="Dnešní rezervace" value={data?.todayReservationsCount} change={data?.reservationsChangeCount} icon={Users} changeSuffix="" />
            <StatCard title="Nejžádanější služba" value={data?.topService || 'N/A'} icon={Sparkles} />
            <StatCard title="Nejvytíženější terapeut" value={data?.topTherapist || 'N/A'} icon={Calendar} />
          </>
        )}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Tržby za poslední týden</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoading ? <Skeleton className="h-[350px] w-full" /> : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data?.weeklySalesData}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => new Date(value).toLocaleDateString('cs-CZ', {day: 'numeric', month: 'numeric'})}/>
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${formatCurrency(value as number)}`} />
                  <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nadcházející rezervace</CardTitle>
            <CardDescription>Dnešní naplánované schůzky.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
            ) : data?.upcomingReservations && data.upcomingReservations.length > 0 ? (
              data.upcomingReservations.map((res, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{res.client.firstName} {res.client.lastName}</span>
                    <span className="text-sm text-muted-foreground">{res.service.name}</span>
                  </div>
                  <div className="ml-auto font-medium">{formatTime(res.startTime)}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Pro dnešek nejsou žádné další rezervace.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

