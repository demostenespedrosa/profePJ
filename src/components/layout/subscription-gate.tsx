"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { useSubscription } from "@/hooks/use-subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/profe/logo";
import MobileScreen from "./mobile-screen";

interface SubscriptionGateProps {
  children: React.ReactNode;
  /**
   * If true, shows a blocking screen instead of redirecting
   * Useful for pages where you want to explain why access is blocked
   */
  showBlockedScreen?: boolean;
}

export default function SubscriptionGate({ children, showBlockedScreen = false }: SubscriptionGateProps) {
  const router = useRouter();
  const { hasAccess, isLoading, needsPayment, isTrialing, daysLeftInTrial, trialEnded } = useSubscription();

  useEffect(() => {
    // Only redirect if not loading and user doesn't have access
    if (!isLoading && !hasAccess && !showBlockedScreen) {
      router.push('/assinatura');
    }
  }, [hasAccess, isLoading, showBlockedScreen, router]);

  // Show loading state
  if (isLoading) {
    return (
      <MobileScreen>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Logo className="h-12 w-auto mx-auto text-primary" />
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Verificando assinatura...</p>
          </div>
        </div>
      </MobileScreen>
    );
  }

  // Show blocked screen if requested and user doesn't have access
  if (showBlockedScreen && !hasAccess) {
    return (
      <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm border-b">
          <Logo className="h-8 w-auto text-primary" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Acesso Bloqueado</CardTitle>
              <CardDescription>
                {trialEnded
                  ? "Seu período de teste terminou. Assine agora para continuar usando o Profe PJ!"
                  : "Você precisa de uma assinatura ativa para acessar este recurso."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isTrialing && daysLeftInTrial !== null && daysLeftInTrial > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Você ainda tem {daysLeftInTrial} dias de teste grátis!
                  </p>
                </div>
              )}
              <Button
                onClick={() => router.push('/assinatura')}
                className="w-full"
              >
                Ver Planos
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

  // If no access and not showing blocked screen, return null (redirecting)
  if (!hasAccess) {
    return null;
  }

  // User has access, render children
  return <>{children}</>;
}
