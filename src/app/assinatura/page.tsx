"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, Check, Sparkles, Calendar, Clock, XCircle, ArrowLeft } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import MobileScreen from "@/components/layout/mobile-screen";
import BottomNav from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebase } from "@/firebase";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Logo from "@/components/profe/logo";
import { Badge } from "@/components/ui/badge";

export default function AssinaturaPage() {
  const router = useRouter();
  const { user } = useFirebase();
  const { toast } = useToast();
  const subscriptionData = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          name: user.displayName,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        variant: "destructive",
        title: "Erro ao processar",
        description: error.message || "Não foi possível iniciar o pagamento. Tente novamente.",
      });
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (!user || !subscriptionData.subscription) return;

    setIsLoading(true);

    try {
      // Get customer ID from user profile
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.uid, // This should be stripeCustomerId
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error creating portal:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível abrir o portal de pagamentos.",
      });
      setIsLoading(false);
    }
  };

  if (subscriptionData.isLoading) {
    return (
      <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/perfil')}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo className="h-8 w-auto text-primary" />
          <div className="w-10" /> {/* Spacer for centering */}
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="text-center py-8">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <Skeleton className="h-64 w-full" />
        </main>
        <BottomNav />
      </MobileScreen>
    );
  }

  return (
    <MobileScreen>
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/perfil')}
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Logo className="h-8 w-auto text-primary" />
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold font-headline text-foreground mb-2">
            {subscriptionData.hasAccess ? "Sua Assinatura" : "Assine o Profe PJ"}
          </h1>
          {subscriptionData.isTrialing && subscriptionData.daysLeftInTrial !== null && (
            <p className="text-muted-foreground">
              {subscriptionData.daysLeftInTrial} dias restantes no período de teste
            </p>
          )}
        </div>

        {/* Status Card - TRIAL */}
        {subscriptionData.isTrialing && (
          <Card className="border-green-500/30 bg-green-50 dark:bg-green-950">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Período de Teste Ativo
                </CardTitle>
                <Badge variant="secondary" className="bg-green-600 text-white">
                  Trial
                </Badge>
              </div>
              <CardDescription className="text-green-800 dark:text-green-200">
                Aproveite todos os recursos gratuitamente!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-green-900 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tempo restante</span>
                </div>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {subscriptionData.daysLeftInTrial} {subscriptionData.daysLeftInTrial === 1 ? 'dia' : 'dias'}
                </span>
              </div>
              
              {subscriptionData.userProfile?.trialEndsAt && (
                <p className="text-xs text-center text-muted-foreground">
                  Seu trial termina em {format(new Date(subscriptionData.userProfile.trialEndsAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </p>
              )}

              <div className="pt-2">
                <Button
                  onClick={handleSubscribe}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Assinar Agora e Garantir Acesso
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Ou continue aproveitando o período de teste
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Card - ASSINATURA ATIVA */}
        {subscriptionData.isActive && !subscriptionData.isTrialing && subscriptionData.subscription && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Assinatura Ativa
                </CardTitle>
                <Badge className="bg-green-600 text-white">
                  Ativa
                </Badge>
              </div>
              <CardDescription>
                Você tem acesso total ao Profe PJ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informações da Assinatura */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Assinando desde</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {subscriptionData.userProfile?.createdAt 
                      ? formatDistanceToNow(new Date(subscriptionData.userProfile.createdAt), { 
                          addSuffix: false, 
                          locale: ptBR 
                        })
                      : 'Recentemente'}
                  </span>
                </div>

                {subscriptionData.subscription && subscriptionData.subscription.currentPeriodEnd && (
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Próxima cobrança</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {format(new Date(subscriptionData.subscription.currentPeriodEnd), "dd/MM/yyyy")}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Valor mensal</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    R$ 19,90
                  </span>
                </div>
              </div>

              {/* Botão de Gerenciar */}
              <div className="pt-2 space-y-2">
                <Button
                  onClick={handleManageBilling}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Gerenciar Assinatura e Pagamento
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Atualize seu cartão, veja faturas ou cancele quando quiser
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Card - TRIAL EXPIRADO */}
        {subscriptionData.trialEnded && !subscriptionData.isActive && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-destructive" />
                  Período de Teste Encerrado
                </CardTitle>
                <Badge variant="destructive">
                  Expirado
                </Badge>
              </div>
              <CardDescription className="text-destructive">
                Assine agora para continuar usando o Profe PJ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSubscribe}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Assinar Agora - R$ 19,90/mês
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pricing Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-bold rounded-bl-lg">
            Melhor Escolha
          </div>
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Plano Mensal</CardTitle>
            </div>
            <div className="text-4xl font-bold text-primary">
              R$ 19,90<span className="text-lg text-muted-foreground">/mês</span>
            </div>
            {!subscriptionData.hasAccess && (
              <CardDescription className="text-base font-semibold text-green-600">
                + 14 dias grátis para testar
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Agenda ilimitada de aulas</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Potinhos automáticos (13º e férias)</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Controle de múltiplas instituições</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Alertas de DAS e recessos</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Assistente IA personalizado</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Sincronização em tempo real</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Suporte prioritário</p>
              </div>
            </div>

            <div className="pt-4">
              {subscriptionData.hasAccess && subscriptionData.isActive ? (
                <Button
                  onClick={handleManageBilling}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Gerenciar Assinatura
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleSubscribe}
                  className="w-full bg-primary hover:bg-primary/90 text-lg h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      {subscriptionData.isTrialing ? "Continuar Usando" : "Começar Agora"}
                    </>
                  )}
                </Button>
              )}
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Cancele quando quiser. Sem multas ou taxas adicionais.
            </p>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="space-y-4 pt-4">
          <h3 className="font-bold text-lg text-foreground font-headline">Perguntas Frequentes</h3>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Como funciona o período de teste?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Você tem 14 dias para usar todos os recursos gratuitamente, sem precisar cadastrar cartão de crédito.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Posso cancelar a qualquer momento?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem multas. O acesso permanece até o fim do período pago.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quais formas de pagamento são aceitas?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aceitamos cartões de crédito e débito através do Stripe, com total segurança.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </MobileScreen>
  );
}
