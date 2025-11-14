"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";

export default function TrialBanner() {
  const router = useRouter();
  const { isTrialing, daysLeftInTrial, trialEnded, hasAccess, isActive } = useSubscription();

  // Don't show banner if user has active paid subscription
  if (isActive || !hasAccess) {
    return null;
  }

  // Trial ended - urgent message
  if (trialEnded) {
    return (
      <Alert variant="destructive" className="border-destructive/50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between gap-2">
          <span className="text-sm">
            Seu período de teste terminou. Assine para continuar!
          </span>
          <Button
            size="sm"
            onClick={() => router.push('/assinatura')}
            className="shrink-0"
          >
            Assinar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Trial active - gentle reminder
  if (isTrialing && daysLeftInTrial !== null) {
    // Show warning when less than 3 days left
    if (daysLeftInTrial <= 3) {
      return (
        <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950">
          <Sparkles className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex items-center justify-between gap-2">
            <span className="text-sm text-amber-800 dark:text-amber-200">
              {daysLeftInTrial === 0
                ? "Último dia do período de teste!"
                : `Restam ${daysLeftInTrial} dias do período de teste`}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push('/assinatura')}
              className="shrink-0 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
            >
              Assinar
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    // Show info when more than 3 days left
    return (
      <Alert className="border-primary/50">
        <Sparkles className="h-4 w-4 text-primary" />
        <AlertDescription className="flex items-center justify-between gap-2">
          <span className="text-sm">
            Você tem {daysLeftInTrial} dias grátis restantes
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push('/assinatura')}
            className="shrink-0 text-primary hover:text-primary"
          >
            Ver Planos
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
