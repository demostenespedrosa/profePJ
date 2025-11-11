"use client";

import MobileScreen from "@/components/layout/mobile-screen";
import BottomNav from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Plus, Pocket, Target } from "lucide-react";

const potinhos = [
    {
        id: 1,
        name: "Férias 🏖️",
        current: 780,
        goal: 2500,
        icon: <Pocket className="w-8 h-8 text-accent" />,
    },
    {
        id: 2,
        name: "Meu 13º 🎁",
        current: 820.50,
        goal: 1500,
        icon: <DollarSign className="w-8 h-8 text-accent" />,
    },
    {
        id: 3,
        name: "Celular Novo 📱",
        current: 350,
        goal: 4000,
        icon: <Target className="w-8 h-8 text-accent" />,
    }
];

export default function PotinhosPage() {
  return (
    <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
            <h1 className="text-2xl font-bold font-headline text-foreground">
                Meus Potinhos
            </h1>
            <Button variant="ghost" size="icon">
                <Plus className="h-6 w-6" />
                <span className="sr-only">Criar Potinho</span>
            </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
            {potinhos.map((potinho) => (
                 <Card key={potinho.id} className="transform transition-transform duration-200 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                        {potinho.icon}
                        <div className="flex-1">
                            <CardTitle className="text-xl font-bold">{potinho.name}</CardTitle>
                            <CardDescription className="text-sm">Meta: R$ {potinho.goal.toFixed(2).replace('.', ',')}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                       <div className="mb-2">
                         <span className="text-2xl font-bold text-foreground">R$ {potinho.current.toFixed(2).replace('.', ',')}</span>
                       </div>
                        <Progress value={(potinho.current / potinho.goal) * 100} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-1.5 text-right">
                            {Math.round((potinho.current / potinho.goal) * 100)}% completo
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </main>

      <BottomNav />
    </MobileScreen>
  );
}
