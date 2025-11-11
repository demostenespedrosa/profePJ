"use client";

import { useState } from "react";
import MobileScreen from "@/components/layout/mobile-screen";
import BottomNav from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Plus, Pocket, Target } from "lucide-react";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewPotForm from "./_components/new-pot-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Pot = {
    id: string;
    name: string;
    virtualBalance: number;
    goal: number;
    allocationPercentage: number;
    type: 'Mandatory' | 'Dream';
    deadline?: string;
};

const iconMap = {
    "Férias 🏖️": <Pocket className="w-8 h-8 text-accent" />,
    "Meu 13º 🎁": <DollarSign className="w-8 h-8 text-accent" />,
    "default": <Target className="w-8 h-8 text-accent" />
}

const getIconForPot = (potName: string) => {
    if (potName.includes("Férias")) return iconMap["Férias 🏖️"];
    if (potName.includes("13º")) return iconMap["Meu 13º 🎁"];
    return iconMap.default;
}

export default function PotinhosPage() {
  const [isNewPotFormOpen, setIsNewPotFormOpen] = useState(false);
  const { user, firestore, isUserLoading } = useFirebase();
  const { toast } = useToast();
  
  const potsColRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/pots`) : null, [firestore, user]);
  const { data: potinhos, isLoading: arePotsLoading } = useCollection<Pot>(potsColRef);

  const handleAddPot = async (newPotData: { name: string; goal: number; deadline?: Date }) => {
     if (!user) return;

      try {
        const potsRef = collection(firestore, `users/${user.uid}/pots`);
        await addDoc(potsRef, {
            ...newPotData,
            deadline: newPotData.deadline?.toISOString(),
            type: "Dream",
            virtualBalance: 0,
            allocationPercentage: 0, // Defaulting to 0, user might edit this later
        });
        toast({
            title: "Sucesso!",
            description: `Seu potinho "${newPotData.name}" foi criado.`,
        });
        setIsNewPotFormOpen(false);
    } catch (error: any) {
        console.error("Error adding pot: ", error);
        toast({
            variant: "destructive",
            title: "Erro ao criar",
            description: error.message || "Não foi possível criar o potinho. Tente novamente.",
        });
    }
  }

  const isLoading = isUserLoading || arePotsLoading;
  
  const mandatoryPots = potinhos?.filter(p => p.type === 'Mandatory') || [];
  const dreamPots = potinhos?.filter(p => p.type === 'Dream') || [];


  return (
    <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
            <h1 className="text-2xl font-bold font-headline text-foreground">
                Meus Potinhos
            </h1>
            <Dialog open={isNewPotFormOpen} onOpenChange={setIsNewPotFormOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!user}>
                    <Plus className="h-6 w-6" />
                    <span className="sr-only">Criar Potinho</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                  <DialogHeader>
                      <DialogTitle>Criar Potinho dos Sonhos</DialogTitle>
                      <CardDescription>Defina sua nova meta para poupar.</CardDescription>
                  </DialogHeader>
                  <NewPotForm onSubmit={handleAddPot} onCancel={() => setIsNewPotFormOpen(false)} />
              </DialogContent>
            </Dialog>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                           <Skeleton className="h-6 w-32" />
                           <Skeleton className="h-4 w-24" />
                        </div>
                    </CardHeader>
                    <CardContent>
                       <div className="mb-2">
                         <Skeleton className="h-8 w-28" />
                       </div>
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-1/4 mt-1.5 ml-auto" />
                    </CardContent>
                </Card>
            ))
        ) : (
            <>
                {mandatoryPots.length > 0 && <div className="space-y-4">
                    <h3 className="font-bold text-lg text-foreground font-headline">Potinhos Obrigatórios</h3>
                     {mandatoryPots.map((potinho) => (
                         <Card key={potinho.id} className="transform transition-transform duration-200 hover:scale-[1.02]">
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                {getIconForPot(potinho.name)}
                                <div className="flex-1">
                                    <CardTitle className="text-xl font-bold">{potinho.name}</CardTitle>
                                    <CardDescription className="text-sm">Meta: R$ {potinho.goal.toFixed(2).replace('.', ',')}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                            <div className="mb-2">
                                <span className="text-2xl font-bold text-foreground">R$ {potinho.virtualBalance.toFixed(2).replace('.', ',')}</span>
                            </div>
                                <Progress value={(potinho.virtualBalance / potinho.goal) * 100} className="h-3" />
                                <p className="text-xs text-muted-foreground mt-1.5 text-right">
                                    {Math.round((potinho.virtualBalance / potinho.goal) * 100)}% completo
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>}

                {dreamPots.length > 0 && <div className="space-y-4">
                    <h3 className="font-bold text-lg text-foreground font-headline">Potinhos dos Sonhos</h3>
                     {dreamPots.map((potinho) => (
                         <Card key={potinho.id} className="transform transition-transform duration-200 hover:scale-[1.02]">
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                {getIconForPot(potinho.name)}
                                <div className="flex-1">
                                    <CardTitle className="text-xl font-bold">{potinho.name}</CardTitle>
                                    <CardDescription className="text-sm">
                                        Meta: R$ {potinho.goal.toFixed(2).replace('.', ',')}
                                        {potinho.deadline && ` até ${format(new Date(potinho.deadline), 'dd/MM/yyyy', {locale: ptBR})}`}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                            <div className="mb-2">
                                <span className="text-2xl font-bold text-foreground">R$ {potinho.virtualBalance.toFixed(2).replace('.', ',')}</span>
                            </div>
                                <Progress value={(potinho.virtualBalance / potinho.goal) * 100} className="h-3" />
                                <p className="text-xs text-muted-foreground mt-1.5 text-right">
                                    {Math.round((potinho.virtualBalance / potinho.goal) * 100)}% completo
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>}
                
                {!potinhos || potinhos.length === 0 && (
                    <div className="text-center py-12 px-4 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-semibold text-foreground">Você ainda não tem potinhos</h3>
                        <p className="text-muted-foreground mt-1">Os potinhos obrigatórios (Férias e 13º) serão criados com sua conta. Clique no '+' para criar um potinho dos seus sonhos!</p>
                    </div>
                )}
            </>
        )}
      </main>

      <BottomNav />
    </MobileScreen>
  );
}
