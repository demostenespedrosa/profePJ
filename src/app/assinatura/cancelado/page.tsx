"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

import MobileScreen from "@/components/layout/mobile-screen";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/profe/logo";

export default function PagamentoCanceladoPage() {
  const router = useRouter();

  return (
    <MobileScreen>
      <header className="sticky top-0 z-10 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm border-b">
        <Logo className="h-8 w-auto text-primary" />
      </header>

      <main className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-2xl">Pagamento Cancelado</CardTitle>
            <CardDescription className="text-base">
              Você cancelou o processo de pagamento. Nenhuma cobrança foi realizada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Não se preocupe! Você pode tentar novamente quando quiser. 
                Seus dados estão seguros e você ainda pode aproveitar seu período de teste gratuito.
              </p>
            </div>

            <Button
              onClick={() => router.push('/assinatura')}
              className="w-full"
              size="lg"
            >
              Tentar Novamente
            </Button>

            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Voltar para Início
            </Button>
          </CardContent>
        </Card>
      </main>
    </MobileScreen>
  );
}
