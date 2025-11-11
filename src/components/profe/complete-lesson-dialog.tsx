"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Confetti from "./confetti";

interface CompleteLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CompleteLessonDialog({
  open,
  onOpenChange,
}: CompleteLessonDialogProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (open) {
      // TODO: Play 'ka-ching' sound
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000); // Stop confetti after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [open]);

  // TODO: This data would come from the `onAulaConcluida` Cloud Function
  // and be passed via props after calling the `generateDopamineFeedback` AI flow.
  const feedback = {
    total: 150.0,
    pots: [
      { name: "Meu 13º", amount: 12.5, icon: "🎁" },
      { name: "Férias", amount: 12.5, icon: "🏖️" },
    ],
    pocket: 125.0,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        {showConfetti && <Confetti />}
        <div className="p-8 text-center bg-primary/10">
          <div className="animate-scale-in">
            <h2 className="text-5xl font-bold text-primary font-headline">
              + R$ {feedback.total.toFixed(2).replace(".", ",")}
            </h2>
            <p className="font-bold text-primary mt-2">É ISSO AÍ! 🥳 Você arrasou!</p>
          </div>
        </div>
        <div className="px-8 py-6 space-y-4">
            <p className="text-sm text-center text-muted-foreground">Desses R$ {feedback.total.toFixed(2).replace(".", ",")}, eu já fiz a mágica:</p>
            <ul className="space-y-3">
                {feedback.pots.map(pot => (
                    <li key={pot.name} className="flex items-center text-lg">
                        <span className="text-2xl mr-3">{pot.icon}</span>
                        <span className="font-bold">+ R$ {pot.amount.toFixed(2).replace(".", ",")}</span>
                        <span className="text-muted-foreground ml-2"> -&gt; {pot.name}</span>
                    </li>
                ))}
            </ul>
            <div className="text-center bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">Sobrou na sua mão:</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300 font-headline">
                    R$ {feedback.pocket.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Limpinhos pra você usar como quiser!</p>
            </div>
        </div>
        <DialogFooter className="p-6 pt-0">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          >
            Valeu!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
