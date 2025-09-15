import { Sparkles } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[380px] gap-6">
          <div className="grid gap-4 text-center">
            <Link href="/" className="flex items-center justify-center gap-2 self-center font-semibold text-xl">
                <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                    <Sparkles className="size-5" />
                </div>
                <span>Salon Harmonie</span>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Přihlášení</h1>
              <p className="text-balance text-muted-foreground">
                Vítejte zpět! Zadejte své údaje pro vstup do systému.
              </p>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1552693673-1bf95829b51f?q=80&w=2070&auto=format&fit=crop"
          alt="Obrázek interiéru wellness salonu"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.3]"
        />
      </div>
    </div>
  );
}

