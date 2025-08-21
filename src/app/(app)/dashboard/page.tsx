import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Dashboard() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card
          className="sm:col-span-2"
          x-chunk="dashboard-05-chunk-0"
        >
          <CardHeader className="pb-3">
            <CardTitle className="font-serif">Váš Salon Harmonie</CardTitle>
            <CardDescription className="max-w-lg text-balance leading-relaxed">
              Vítejte v řídícím centru Vašeho salonu. Zde naleznete přehledy, statistiky a nástroje pro efektivní správu.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card x-chunk="dashboard-05-chunk-1">
          <CardHeader className="pb-2">
            <CardDescription>Dnešní tržby</CardDescription>
            <CardTitle className="text-4xl">12,580 Kč</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +10% oproti včerejšku
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-05-chunk-2">
          <CardHeader className="pb-2">
            <CardDescription>Dnešní rezervace</CardDescription>
            <CardTitle className="text-4xl">25</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +5 oproti včerejšku
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-serif">Přehled</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Placeholder for a chart */}
            <div className="w-full h-[300px] bg-secondary rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Graf bude zde</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="font-serif">Poslední aktivita</CardTitle>
            <CardDescription>
              Bylo vytvořeno 5 nových rezervací.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {/* Placeholder for recent activity feed */}
             <div className="text-sm text-muted-foreground">Seznam aktivit bude zde.</div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
