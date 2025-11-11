
"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { DollarSign, Pocket, Smile, Star, Calendar, TrendingUp } from "lucide-react";

import MobileScreen from "@/components/layout/mobile-screen";
import HomeHeader from "@/components/profe/home-header";
import ActionCard from "@/components/profe/action-card";
import CompleteLessonDialog from "@/components/profe/complete-lesson-dialog";
import PayDasDialog from "@/components/profe/pay-das-dialog";
import BottomNav from "@/components/layout/bottom-nav";
import { Badge } from "@/components/ui/badge";
import MonsterIcon from "@/components/icons/monster-icon";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card } from "@/components/ui/card";

// Mock data, to be replaced by dynamic data later
const lessonsByDay = {
    '2024-07-15': [
        { id: 1, time: "10:00", school: "Escola ABC", value: 50, color: "#34D399" },
    ],
    '2024-07-18': [
        { id: 2, time: "14:00", school: "Escola XYZ", value: 65, color: "#F87171" },
        { id: 3, time: "16:00", school: "Escola 123", value: 75, color: "#60A5FA" },
    ],
    '2024-07-25': [
        { id: 4, time: "09:00", school: "Escola XYZ", value: 65, color: "#F87171" },
    ],
     '2024-08-05': [
        { id: 5, time: "09:00", school: "Escola ABC", value: 50, color: "#34D399" },
    ],
};


export default function Home() {
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [dasDialogOpen, setDasDialogOpen] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState({ totalLessons: 0, totalValue: 0 });

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let totalLessons = 0;
    let totalValue = 0;

    Object.keys(lessonsByDay).forEach(dateStr => {
        const date = new Date(dateStr);
        if(date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            // @ts-ignore
            const lessons = lessonsByDay[dateStr];
            totalLessons += lessons.length;
            totalValue += lessons.reduce((acc: number, lesson: { value: number; }) => acc + lesson.value, 0);
        }
    });

    setMonthlyStats({ totalLessons, totalValue });
  }, []);

  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-1');

  return (
    <MobileScreen>
      <HomeHeader />

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="text-center py-6">
          <div className="inline-block relative mb-4">
             {userAvatar && <Image
              src={userAvatar.imageUrl}
              alt={userAvatar.description}
              width={96}
              height={96}
              className="rounded-full border-4 border-white shadow-lg"
              data-ai-hint={userAvatar.imageHint}
            />}
            <Badge className="absolute -bottom-2 -right-2 text-2xl" variant="secondary">
              🔥
            </Badge>
          </div>
          <h2 className="text-2xl font-bold font-headline text-foreground">5 dias de ofensiva!</h2>
          <p className="text-muted-foreground">Você está no controle da sua grana!</p>
        </div>

        <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground font-headline">Seu Mês em Números 🚀</h3>
             <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 flex flex-col items-center justify-center text-center animate-scale-in">
                    <Calendar className="w-8 h-8 text-primary mb-2" />
                    <span className="font-bold text-3xl">{monthlyStats.totalLessons}</span>
                    <span className="text-sm text-muted-foreground">Aulas Agendadas</span>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center text-center animate-scale-in" style={{ animationDelay: '100ms' }}>
                    <TrendingUp className="w-8 h-8 text-primary mb-2" />
                    <span className="font-bold text-3xl">
                        R$ {monthlyStats.totalValue.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-sm text-muted-foreground">Valor Bruto Previsto</span>
                </Card>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground font-headline">Sua vez de agir!</h3>
            <ActionCard
                icon={<Star className="text-yellow-400 fill-yellow-400" />}
                title="Você deu a aula na 'Escola ABC' hoje?"
                description="Bora receber por mais um dia de trabalho incrível!"
                ctaText="SIM! CONCLUÍ! 🤑"
                onCtaClick={() => setLessonDialogOpen(true)}
                className="bg-primary/10 border-primary/20 hover:border-primary/40"
                ctaClassName="bg-primary hover:bg-primary/90 text-primary-foreground"
            />
            <ActionCard
                icon={<MonsterIcon className="w-8 h-8 text-destructive" />}
                title="MISSÃO DO MÊS"
                description="Derrotar o 'Monstro do DAS'! Ele vence em 3 dias."
                ctaText="JÁ PAGUEI! DERROTEI! ⚔️"
                onCtaClick={() => setDasDialogOpen(true)}
                className="bg-destructive/10 border-destructive/20 hover:border-destructive/40"
                ctaClassName="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            />
        </div>

        <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground font-headline">Seus Potinhos</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                    <Pocket className="w-8 h-8 text-accent mb-2" />
                    <span className="font-bold text-lg">R$ 780,00</span>
                    <span className="text-sm text-muted-foreground">Férias 🏖️</span>
                </div>
                <div className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                    <DollarSign className="w-8 h-8 text-accent mb-2" />
                    <span className="font-bold text-lg">R$ 820,50</span>
                    <span className="text-sm text-muted-foreground">Meu 13º 🎁</span>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground font-headline">Alerta do Profe</h3>
            <ActionCard
                icon={<Smile className="text-accent" />}
                title="Recesso à vista!"
                description="Lembrei que a 'Escola ABC' entra de férias dia 15/12. Mas relaxa! Seu Potinho de Férias está aí pra isso!"
                variant="info"
            />
        </div>

      </main>

      <CompleteLessonDialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen} />
      <PayDasDialog open={dasDialogOpen} onOpenChange={setDasDialogOpen} />

      <BottomNav />
    </MobileScreen>
  );
}
