
"use client";

import { useState, useEffect, useMemo } from "react";
import { DollarSign, Pocket, Calendar, TrendingUp, Smile, PiggyBank } from "lucide-react";
import { useRouter } from "next/navigation";
import { collection, doc } from "firebase/firestore";
import { differenceInDays, isSameMonth, parseISO, isAfter, format, differenceInMonths, endOfYear } from "date-fns";

import MobileScreen from "@/components/layout/mobile-screen";
import ActionCard from "@/components/profe/action-card";
import PayDasDialog from "@/components/profe/pay-das-dialog";
import BottomNav from "@/components/layout/bottom-nav";
import MonsterIcon from "@/components/icons/monster-icon";
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
  deadline?: string;
  type: 'Mandatory' | 'Dream';
};

type Institution = {
    id: string;
    name: string;
    hourlyRate: number;
    color: string;
    recessStart?: string;
    recessEnd?: string;
};

type MonthlyObligation = {
    id: string;
    status: 'Pending' | 'Paid' | 'Overdue';
}


export default function Home() {
  const [dasDialogOpen, setDasDialogOpen] = useState(false);
  const [greeting, setGreeting] = useState<{ title: string; subtitle: string } | null>(null);
  
  const { user, firestore, isUserLoading } = useFirebase();
  const router = useRouter();

  // Memoize Firestore references
  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const lessonsColRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/lessons`) : null, [firestore, user]);
  const potsColRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/pots`) : null, [firestore, user]);
  const institutionsColRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/institutions`) : null, [firestore, user]);
  const monthlyObligationsColRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/monthly_obligations`) : null, [firestore, user]);

  // Fetch data
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
  const { data: lessons, isLoading: areLessonsLoading } = useCollection<Lesson>(lessonsColRef);
  const { data: pots, isLoading: arePotsLoading } = useCollection<Pot>(potsColRef);
  const { data: institutions, isLoading: areInstitutionsLoading } = useCollection<Institution>(institutionsColRef);
  const { data: monthlyObligations, isLoading: areObligationsLoading, refetch: refetchObligations } = useCollection<MonthlyObligation>(monthlyObligationsColRef);

  const isLoading = isUserLoading || isProfileLoading || areLessonsLoading || arePotsLoading || areInstitutionsLoading || areObligationsLoading;

  const monthlyStats = useMemo(() => {
    if (!lessons) return { totalLessons: 0, totalValue: 0 };
    
    const today = new Date();
    const currentMonthLessons = lessons.filter(lesson => isSameMonth(parseISO(lesson.startTime), today));
    
    const totalLessons = currentMonthLessons.length;
    const totalValue = currentMonthLessons.reduce((acc, lesson) => acc + lesson.totalValue, 0);

    return { totalLessons, totalValue };
  }, [lessons]);

  const dasDueDateInfo = useMemo(() => {
    if (!userProfile) return null;
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth(), userProfile.dasDueDate);
    const daysUntilDue = differenceInDays(dueDate, today);
    return { daysUntilDue };
  }, [userProfile]);

  const showDasCard = useMemo(() => {
    if (!dasDueDateInfo || !monthlyObligations) return false;
    
    // Check if DAS for the current month is already paid
    const currentMonthId = format(new Date(), "yyyy-MM");
    const isPaid = monthlyObligations.some(ob => ob.id === currentMonthId && ob.status === 'Paid');

    // Show card if not paid and it's 5 days or less until the due date
    return !isPaid && dasDueDateInfo.daysUntilDue >= 0 && dasDueDateInfo.daysUntilDue <= 5;

  }, [dasDueDateInfo, monthlyObligations]);

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

  const potSavingSuggestions = useMemo(() => {
    if (!pots || !institutions) return [];

    const today = new Date();
    
    return pots.map(pot => {
        let deadline: Date | null = null;
        
        if (pot.name.includes("13º")) {
            deadline = endOfYear(today);
        } else if (pot.name.includes("Férias")) {
            const upcomingRecesses = institutions
                .filter(inst => inst.recessStart && isAfter(parseISO(inst.recessStart), today))
                .map(inst => parseISO(inst.recessStart!))
                .sort((a, b) => a.getTime() - b.getTime());
            if (upcomingRecesses.length > 0) {
                deadline = upcomingRecesses[0];
            }
        } else if (pot.deadline) {
            deadline = parseISO(pot.deadline);
        }

        if (!deadline || pot.goal <= 0 || pot.virtualBalance >= pot.goal) return null;

        const monthsRemaining = differenceInMonths(deadline, today) + 1;
        if (monthsRemaining <= 0) return null;
        
        const remainingGoal = pot.goal - pot.virtualBalance;
        const monthlyAmount = remainingGoal / monthsRemaining;
        
        if (monthlyAmount <= 0) return null;

        return {
            id: pot.id,
            name: pot.name,
            monthlyAmount: monthlyAmount,
        };
    }).filter(p => p !== null);

  }, [pots, institutions]);


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

  if (isLoading) {
    return (
        <MobileScreen>
            <header className="sticky top-0 z-10 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm border-b">
               <Logo className="h-8 w-auto text-primary" />
            </header>
            <div className="flex flex-col items-center justify-center h-full p-4 space-y-8">
                 <div className="w-full space-y-2 text-center">
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

        {(showDasCard || potSavingSuggestions.length > 0) && <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground font-headline">Sua vez de agir!</h3>
            {showDasCard && dasDueDateInfo && (
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
            {potSavingSuggestions.map((pot: any) => (
                <ActionCard
                    key={pot.id}
                    icon={<PiggyBank className="text-green-500" />}
                    title={`Guarde para seu potinho: ${pot.name}`}
                    description={`Para alcançar sua meta, guarde R$ ${pot.monthlyAmount.toFixed(2).replace('.', ',')} este mês.`}
                    variant="info"
                    className="bg-green-500/10 border-green-500/20"
                />
            ))}
        </div>}

        {pots && pots.length > 0 && <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground font-headline">Seus Potinhos</h3>
            <div className="grid grid-cols-2 gap-4">
                {pots.filter(p => p.type === 'Mandatory').map((pot, index) => (
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

      {dasDueDateInfo && 
        <PayDasDialog 
          open={dasDialogOpen} 
          onOpenChange={setDasDialogOpen} 
          onPaymentConfirmed={() => refetchObligations && refetchObligations()}
          daysUntilDue={dasDueDateInfo.daysUntilDue}
        />
      }

      <BottomNav />
    </MobileScreen>
  );
}
