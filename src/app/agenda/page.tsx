"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ptBR } from "date-fns/locale";
import MobileScreen from "@/components/layout/mobile-screen";
import BottomNav from "@/components/layout/bottom-nav";
import { DayContent, DayProps } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Lesson } from "@/types";

type Institution = {
    id: string;
    name: string;
    hourlyRate: number;
    color: string;
};

export default function AgendaPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user, firestore, isUserLoading } = useFirebase();

  // Memoize Firestore references
  const lessonsColRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/lessons`) : null, [firestore, user]);
  const institutionsColRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/institutions`) : null, [firestore, user]);

  // Fetch data
  const { data: lessons, isLoading: areLessonsLoading } = useCollection<Lesson>(lessonsColRef);
  const { data: institutions, isLoading: areInstitutionsLoading } = useCollection<Institution>(institutionsColRef);

  const lessonsByDay = useMemoFirebase(() => {
    if (!lessons || !institutions) return {};
    return lessons.reduce((acc, lesson) => {
        const dateStr = format(parseISO(lesson.startTime), 'yyyy-MM-dd');
        const institution = institutions.find(inst => inst.id === lesson.institutionId);
        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }
        acc[dateStr].push({
            ...lesson,
            color: institution?.color || '#888888' // Default color
        });
        return acc;
    }, {} as Record<string, (Lesson & { color: string })[]>);
  }, [lessons, institutions]);


  function DayWithDots(props: DayProps) {
    const dateStr = format(props.date, 'yyyy-MM-dd');
    // @ts-ignore
    const lessonsForDay = lessonsByDay ? lessonsByDay[dateStr] : [];
    
    return (
      <div className="relative">
        <DayContent {...props} />
        {lessonsForDay && lessonsForDay.length > 0 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-1">
            {lessonsForDay.slice(0, 3).map((lesson, index) => (
              <div
                key={index}
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: lesson.color }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : '';
  // @ts-ignore
  const scheduledLessons = (lessonsByDay && lessonsByDay[selectedDateStr]) || [];

  const isLoading = isUserLoading || areLessonsLoading || areInstitutionsLoading;

  if (isLoading) {
    return (
      <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-9 w-9" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-6">
            <Skeleton className="h-80 w-full" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-24 w-full" />
            </div>
        </main>
        <BottomNav />
      </MobileScreen>
    )
  }


  return (
    <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
            <h1 className="text-2xl font-bold font-headline text-foreground">
            Agenda
            </h1>
            <Link href="/agenda/nova" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                <Plus className="h-6 w-6" />
                <span className="sr-only">Adicionar evento</span>
            </Link>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <Card>
            <CardContent className="flex justify-center pt-6">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ptBR}
                    components={{
                        DayContent: DayWithDots,
                    }}
                    classNames={{
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
                        day_today: "bg-accent/50 text-accent-foreground",
                    }}
                />
            </CardContent>
        </Card>
        
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground font-headline">Aulas do dia</h3>
            <div className="space-y-3">
                {scheduledLessons.length > 0 ? (
                    scheduledLessons.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map((lesson: any) => (
                        <Card key={lesson.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     <div className="h-full w-1 rounded-full" style={{ backgroundColor: lesson.color }}/>
                                    <div className="text-center">
                                        <p className="font-bold text-lg">{format(parseISO(lesson.startTime), 'HH:mm')}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">{lesson.institutionName}</p>
                                        {(lesson.turma || lesson.disciplina) && (
                                            <p className="text-sm text-muted-foreground">
                                                {lesson.turma}{lesson.turma && lesson.disciplina ? ' - ' : ''}{lesson.disciplina}
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground">Valor: R$ {lesson.totalValue.toFixed(2).replace('.', ',')}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground">
                                    <Plus className="h-5 w-5 -rotate-45" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                     <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Nenhuma aula agendada para este dia.</p>
                     </div>
                )}
            </div>
        </div>
      </main>

      <BottomNav />
    </MobileScreen>
  );
}
