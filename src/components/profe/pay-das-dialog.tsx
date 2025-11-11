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

interface PayDasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PayDasDialog({ open, onOpenChange }: PayDasDialogProps) {
  const [defeated, setDefeated] = useState(false);

  useEffect(() => {
    // Reset state when dialog is closed
    if (!open) {
      setTimeout(() => setDefeated(false), 300);
    }
  }, [open]);

  const handleDefeat = () => {
    // TODO: Add haptic feedback
    setDefeated(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center p-8">
        <DialogHeader className="sr-only">
          <DialogTitle>Confirmar Pagamento do DAS</DialogTitle>
          <DialogDescription>Uma tela para confirmar que você pagou o imposto mensal do DAS e derrotar o "monstro".</DialogDescription>
        </DialogHeader>
        {defeated && <Confetti />}
        {!defeated ? (
          <>
            <div className="flex justify-center">
                <MonsterIcon className="w-24 h-24 text-destructive animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mt-4 font-headline">Derrote o Monstro do DAS!</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              O boleto chato do DAS no valor de <span className="font-bold text-foreground">R$ 68,00</span> vence em 3 dias. Já pagou?
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
