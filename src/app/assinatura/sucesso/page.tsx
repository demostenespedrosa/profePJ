"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Confetti from "@/components/profe/confetti";

import MobileScreen from "@/components/layout/mobile-screen";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/profe/logo";

function PagamentoSucessoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Optional: You can verify the session with Stripe here
    // and update subscription status if needed
  }, [sessionId]);

  return (
    <MobileScreen>
      <Confetti />
      <header className="sticky top-0 z-10 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm border-b">
        <Logo className="h-8 w-auto text-primary" />
      </header>

      <main className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
            <CardDescription className="text-base">
              Sua assinatura foi ativada com sucesso. Bem-vindo ao Profe PJ!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-semibold">O que você pode fazer agora:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Gerenciar sua agenda de aulas</li>
                <li>Configurar seus potinhos automáticos</li>
                <li>Adicionar suas instituições</li>
                <li>Receber alertas personalizados</li>
              </ul>
            </div>

            <Button
              onClick={() => router.push('/')}
              className="w-full"
              size="lg"
            >
              Começar a Usar
            </Button>

            <Button
              onClick={() => router.push('/assinatura')}
              variant="outline"
              className="w-full"
            >
              Ver Detalhes da Assinatura
            </Button>
          </CardContent>
        </Card>
      </main>
    </MobileScreen>
  );
}

export default function PagamentoSucessoPage() {
  return (
    <Suspense fallback={
      <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm border-b">
          <Logo className="h-8 w-auto text-primary" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
          <div className="text-center text-muted-foreground">Carregando...</div>
        </main>
      </MobileScreen>
    }>
      <PagamentoSucessoContent />
    </Suspense>
  );
}
