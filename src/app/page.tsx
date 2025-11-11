
"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { DollarSign, Pocket, Smile, Star, Calendar, TrendingUp, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import MobileScreen from "@/components/layout/mobile-screen";
import ActionCard from "@/components/profe/action-card";
import CompleteLessonDialog from "@/components/profe/complete-lesson-dialog";
import PayDasDialog from "@/components/profe/pay-das-dialog";
import BottomNav from "@/components/layout/bottom-nav";
import { Badge } from "@/components/ui/badge";
import MonsterIcon from "@/components/icons/monster-icon";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card } from "@/components/ui/card";
import { generateHomeGreeting } from "@/ai/flows/generate-home-greeting";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";


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

const streakDays = 5;


export default function Home() {
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [dasDialogOpen, setDasDialogOpen] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState({ totalLessons: 0, totalValue: 0 });
  const [greeting, setGreeting] = useState<{ title: string; subtitle: string } | null>(null);
  
  const { user, auth, isUserLoading } = useFirebase();
  const router = useRouter();

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

    async function fetchGreeting() {
      if (!user) return;
      try {
        const response = await generateHomeGreeting({
          userName: user.displayName || 'Professor(a)',
          streakDays: streakDays,
          monthlyLessons: totalLessons,
          monthlyEarnings: totalValue,
        });
        setGreeting({
          title: response.greetingTitle,
          subtitle: response.greetingSubtitle
        });
      } catch (error) {
        console.error("Error generating greeting:", error);
        // Fallback greeting
        setGreeting({
          title: `Olá, ${user.displayName || 'Professor(a)'}!`,
          subtitle: "Você está no controle da sua grana!"
        });
      }
    }

    fetchGreeting();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    // Remove cookie
    document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  }

  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-1');

  if (isUserLoading || !user) {
    return (
        <MobileScreen>
            <div className="flex items-center justify-center h-full">
                <Skeleton className="w-24 h-24 rounded-full" />
            </div>
        </MobileScreen>
    )
  }

  return (
    <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
            <div>
                <h1 className="text-2xl font-bold font-headline text-foreground">
                Olá, {user?.displayName?.split(' ')[0] || 'Professor(a)'}!
                </h1>
                <p className="text-sm text-muted-foreground">Aqui está seu resumo de hoje.</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
            </Button>
        </header>


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
          </div>
          {greeting ? (
            <div className="animate-scale-in">
              <h2 className="text-2xl font-bold font-headline text-foreground">{greeting.title}</h2>
              <p className="text-muted-foreground">{greeting.subtitle}</p>
            </div>
          ) : (
             <div className="space-y-2">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-5 w-1/2 mx-auto" />
            </div>
          )}
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
                    <span className="text-sm text-muted-foreground">Ganhos Previstos</span>
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