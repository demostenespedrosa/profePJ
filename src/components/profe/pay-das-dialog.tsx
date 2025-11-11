
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MonsterIcon from "@/components/icons/monster-icon";
import Confetti from "./confetti";
import { useFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface PayDasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentConfirmed: () => void;
  daysUntilDue: number;
}

export default function PayDasDialog({ open, onOpenChange, onPaymentConfirmed, daysUntilDue }: PayDasDialogProps) {
  const [defeated, setDefeated] = useState(false);
  const { user, firestore } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    // Reset state when dialog is closed
    if (!open) {
      setTimeout(() => setDefeated(false), 300);
    }
  }, [open]);

  const handleDefeat = async () => {
    if (!user) return;
    // TODO: Add haptic feedback
    setDefeated(true);

    try {
      const today = new Date();
      const obligationId = format(today, "yyyy-MM");
      const monthRef = format(today, "MMMM/yyyy");
      const obligationRef = doc(firestore, `users/${user.uid}/monthly_obligations/${obligationId}`);

      await setDoc(obligationRef, {
        monthRef: monthRef,
        status: 'Paid',
        paymentDate: today.toISOString(),
        totalRevenue: 0, // This could be calculated in a more complex app
        estimatedTaxValue: 82.00, // The fixed value
      });
      
      onPaymentConfirmed();

    } catch (error) {
       toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível registrar o pagamento. Tente novamente.",
      });
       console.error("Error saving DAS payment:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center p-8">
        <DialogHeader>
          <DialogTitle className="sr-only">Confirmar Pagamento do DAS</DialogTitle>
          <DialogDescription className="sr-only">Uma tela para confirmar que você pagou o imposto mensal do DAS e derrotar o "monstro".</DialogDescription>
        </DialogHeader>
        {defeated && <Confetti />}
        {!defeated ? (
          <>
            <div className="flex justify-center">
                <MonsterIcon className="w-24 h-24 text-destructive animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mt-4 font-headline">Derrote o Monstro do DAS!</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              O boleto chato do DAS no valor de <span className="font-bold text-foreground">R$ 82,00</span> vence em {daysUntilDue} dia(s). Já pagou?
            </p>
            <Button onClick={handleDefeat} className="w-full font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground text-lg h-12">
              JÁ PAGUEI! DERROTEI! ⚔️
            </Button>
          </>
        ) : (
          <div className="animate-scale-in">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mt-4 font-headline">BOA! Chefe derrotado!</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              Mais um mês 100% em dia! Você é imparável!
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
