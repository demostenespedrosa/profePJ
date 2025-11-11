
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from 'next/image';
import { DollarSign, Pocket, Star, Calendar, TrendingUp, Smile, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { collection, doc } from "firebase/firestore";
import { differenceInDays, isSameMonth, startOfMonth, endOfMonth, isAfter, isToday, parseISO } from "date-fns";

import MobileScreen from "@/components/layout/mobile-screen";
import ActionCard from "@/components/profe/action-card";
import CompleteLessonDialog from "@/components/profe/complete-lesson-dialog";
import PayDasDialog from "@/components/profe/pay-das-dialog";
import BottomNav from "@/components/layout/bottom-nav";
import MonsterIcon from "@/components/icons/monster-icon";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { generateHomeGreeting } from "@/ai/flows/generate-home-greeting";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirebase, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { Lesson } from "@/types";
import Logo from "@/components/profe/logo";

type UserProfile = {
  name: string;
  email: string;
  dasDueDate: number;
  streakDays: number;
  xpTotal: number;
};

type Pot = {
  id: string;
  name: string;
  virtualBalance: number;
  goal: number;
  allocationPercentage: number;
};

type Institution = {
    id: string;
    name: string;
    hourlyRate: number;
    color: string;
    recessStart?: string;
    recessEnd?: string;
};


export default function Home() {
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [dasDialogOpen, setDasDialogOpen] = useState(false);
  const [greeting, setGreeting] = useState<{ title: string; subtitle: string } | null>(null);
  
  const { user, firestore, isUserLoading } = useFirebase();
  const router = useRouter();

  // Memoize Firestore references
  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const lessonsColRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/lessons`) : null, [firestore, user]);
  const potsColRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/pots`) : null, [firestore, user]);
  const institutionsColRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/institutions`) : null, [firestore, user]);

  // Fetch data
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
  const { data: lessons, isLoading: areLessonsLoading } = useCollection<Lesson>(lessonsColRef);
  const { data: pots, isLoading: arePotsLoading } = useCollection<Pot>(potsColRef);
  const { data: institutions, isLoading: areInstitutionsLoading } = useCollection<Institution>(institutionsColRef);

  const isLoading = isUserLoading || isProfileLoading || areLessonsLoading || arePotsLoading || areInstitutionsLoading;

  const monthlyStats = useMemo(() => {
    if (!lessons) return { totalLessons: 0, totalValue: 0 };
    
    const today = new Date();
    const currentMonthLessons = lessons.filter(lesson => isSameMonth(parseISO(lesson.startTime), today));
    
    const totalLessons = currentMonthLessons.length;
    const totalValue = currentMonthLessons.reduce((acc, lesson) => acc + lesson.totalValue, 0);

    return { totalLessons, totalValue };
  }, [lessons]);

  const nextLesson = useMemo(() => {
    if (!lessons) return null;
    const sortedLessons = [...lessons].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    const now = new Date();
    return sortedLessons.find(lesson => isAfter(new Date(lesson.startTime), now) || isToday(new Date(lesson.startTime))) || null;
  }, [lessons]);


  const dasDueDateInfo = useMemo(() => {
    if (!userProfile) return null;
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth(), userProfile.dasDueDate);
    const daysUntilDue = differenceInDays(dueDate, today);
    return { daysUntilDue };
  }, [userProfile]);

  const recessAlert = useMemo(() => {
    if (!institutions) return null;
    const today = new Date();
    const upcomingRecess = institutions.find(inst => {
      if (!inst.recessStart) return false;
      const recessStartDate = parseISO(inst.recessStart);
      const daysUntilRecess = differenceInDays(recessStartDate, today);
      return daysUntilRecess > 0 && daysUntilRecess <= 30; // Alert for recesses within 30 days
    });
    return upcomingRecess;
  }, [institutions]);


  useEffect(() => {
    async function fetchGreeting() {
      if (!user || !userProfile || areLessonsLoading) return;
      try {
        const response = await generateHomeGreeting({
          userName: user.displayName || 'Professor(a)',
          streakDays: userProfile.streakDays || 0,
          monthlyLessons: monthlyStats.totalLessons,
          monthlyEarnings: monthlyStats.totalValue,
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
  }, [user, userProfile, areLessonsLoading, monthlyStats]);


  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-1');

  if (isLoading) {
    return (
        <MobileScreen>
            <div className="flex flex-col items-center justify-center h-full p-4 space-y-8">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="w-full space-y-2">
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-5 w-1/2 mx-auto" />
                </div>
                 <div className="w-full grid grid-cols-2 gap-4">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </div>
                <div className="w-full space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
             <BottomNav />
        </MobileScreen>
    )
  }

  return (
    <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm border-b">
           <Logo className="h-8 w-auto text-primary" />
        </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">

        <div className="text-center py-4">
             {greeting ? (
                <div className="animate-scale-in">
                    <h1 className="text-3xl font-bold font-headline text-foreground">{greeting.title}</h1>
                    <p className="text-md text-muted-foreground">{greeting.subtitle}</p>
                </div>
              ) : (
                 <div className="space-y-2 flex flex-col items-center">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-72" />
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

        {(nextLesson || dasDueDateInfo) && <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground font-headline">Sua vez de agir!</h3>
            {nextLesson && (
                <ActionCard
                    icon={<Star className="text-yellow-400 fill-yellow-400" />}
                    title={`Você deu a aula na '${nextLesson.institutionName}' hoje?`}
                    description="Bora receber por mais um dia de trabalho incrível!"
                    ctaText="SIM! CONCLUÍ! 🤑"
                    onCtaClick={() => setLessonDialogOpen(true)}
                    className="bg-primary/10 border-primary/20 hover:border-primary/40"
                    ctaClassName="bg-primary hover:bg-primary/90 text-primary-foreground"
                />
            )}
            {dasDueDateInfo && dasDueDateInfo.daysUntilDue <= 5 && (
                <ActionCard
                    icon={<MonsterIcon className="w-8 h-8 text-destructive" />}
                    title="MISSÃO DO MÊS"
                    description={`Derrotar o 'Monstro do DAS'! Ele vence em ${dasDueDateInfo.daysUntilDue} dia(s).`}
                    ctaText="JÁ PAGUEI! DERROTEI! ⚔️"
                    onCtaClick={() => setDasDialogOpen(true)}
                    className="bg-destructive/10 border-destructive/20 hover:border-destructive/40"
                    ctaClassName="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                />
            )}
        </div>}

        {pots && pots.length > 0 && <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground font-headline">Seus Potinhos</h3>
            <div className="grid grid-cols-2 gap-4">
                {pots.filter(p => p.name.includes('Férias') || p.name.includes('13º')).map((pot, index) => (
                    <div key={pot.id} className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                        {pot.name.includes('Férias') ? <Pocket className="w-8 h-8 text-accent mb-2" /> : <DollarSign className="w-8 h-8 text-accent mb-2" />}
                        <span className="font-bold text-lg">R$ {pot.virtualBalance.toFixed(2).replace('.', ',')}</span>
                        <span className="text-sm text-muted-foreground">{pot.name}</span>
                    </div>
                ))}
            </div>
        </div>}
        
        {recessAlert && (
            <div className="space-y-4">
                <h3 className="font-bold text-lg text-foreground font-headline">Alerta do Profe</h3>
                <ActionCard
                    icon={<Smile className="text-accent" />}
                    title="Recesso à vista!"
                    description={`Lembrei que a '${recessAlert.name}' entra de férias dia ${format(parseISO(recessAlert.recessStart!), "dd/MM")}. Mas relaxa! Seu Potinho de Férias está aí pra isso!`}
                    variant="info"
                />
            </div>
        )}

      </main>

      <CompleteLessonDialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen} />
      <PayDasDialog open={dasDialogOpen} onOpenChange={setDasDialogOpen} />

      <BottomNav />
    </MobileScreen>
  );
}
