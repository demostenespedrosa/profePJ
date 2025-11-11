"use client";

import { useEffect, useState } from "react";
import MobileScreen from "@/components/layout/mobile-screen";
import BottomNav from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Plus, Pocket, Target } from "lucide-react";
import { differenceInDays, eachDayOfInterval, getDay } from 'date-fns';

// Mock data for schools, should come from a context or API later
const schools = [
    { hourlyRate: 50, recessStart: new Date("2024-12-15"), recessEnd: new Date("2025-01-05") },
    { hourlyRate: 65, recessStart: new Date("2024-12-20"), recessEnd: new Date("2025-01-10") },
    { hourlyRate: 75, recessStart: new Date("2024-07-01"), recessEnd: new Date("2024-07-31") }
];

const calculateVacationGoal = () => {
    let totalGoal = 0;
    schools.forEach(school => {
        const interval = { start: school.recessStart, end: school.recessEnd };
        const daysInRecess = eachDayOfInterval(interval);
        
        const workDays = daysInRecess.filter(day => {
            const dayOfWeek = getDay(day);
            return dayOfWeek >= 1 && dayOfWeek <= 6; // Monday to Saturday
        });

        totalGoal += workDays.length * 4 * school.hourlyRate;
    });
    return totalGoal;
};


const initialPotinhos = [
    {
        id: 1,
        name: "Férias 🏖️",
        current: 780,
        goal: 2500, // This will be dynamically calculated
        icon: <Pocket className="w-8 h-8 text-accent" />,
        isMandatory: true,
    },
    {
        id: 2,
        name: "Meu 13º 🎁",
        current: 820.50,
        goal: 1500,
        icon: <DollarSign className="w-8 h-8 text-accent" />,
        isMandatory: true,
    },
    {
        id: 3,
        name: "Celular Novo 📱",
        current: 350,
        goal: 4000,
        icon: <Target className="w-8 h-8 text-accent" />,
        isMandatory: false,
    }
];

export default function PotinhosPage() {
  const [potinhos, setPotinhos] = useState(initialPotinhos);

  useEffect(() => {
    const vacationGoal = calculateVacationGoal();
    setPotinhos(prevPotinhos =>
        prevPotinhos.map(p =>
            p.id === 1 ? { ...p, goal: vacationGoal } : p
        )
    );
  }, []);

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
