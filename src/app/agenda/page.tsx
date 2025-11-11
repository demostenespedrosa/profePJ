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
import { format } from "date-fns";

// Mock data, to be replaced by dynamic data later
const lessonsByDay = {
    '2024-07-15': [
        { id: 1, time: "10:00", school: "Escola ABC", value: "R$ 50,00", color: "#34D399" }, // green-400
    ],
    '2024-07-18': [
        { id: 2, time: "14:00", school: "Escola XYZ", value: "R$ 65,00", color: "#F87171" }, // red-400
        { id: 3, time: "16:00", school: "Escola 123", value: "R$ 75,00", color: "#60A5FA" }, // blue-400
    ],
    '2024-07-25': [
        { id: 4, time: "09:00", school: "Escola XYZ", value: "R$ 65,00", color: "#F87171" }, // red-400
    ],
};

function DayWithDots(props: DayProps) {
  const dateStr = format(props.date, 'yyyy-MM-dd');
  // @ts-ignore
  const lessons = lessonsByDay[dateStr];
  
  return (
    <div className="relative">
      <DayContent {...props} />
      {lessons && lessons.length > 0 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center space-x-1">
          {lessons.slice(0, 3).map((lesson, index) => (
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


export default function AgendaPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : '';
  // @ts-ignore
  const scheduledLessons = lessonsByDay[selectedDateStr] || [];

  return (
    <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
            <h1 className="text-2xl font-bold font-headline text-foreground">
            Agenda
            </h1>
            <Link href="/agenda/nova">
              <Button variant="ghost" size="icon" asChild>
                <span>
                    <Plus className="h-6 w-6" />
                    <span className="sr-only">Adicionar evento</span>
                </span>
              </Button>
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
                    scheduledLessons.map((lesson: any) => (
                        <Card key={lesson.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="font-bold text-lg">{lesson.time}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">{lesson.school}</p>
                                        <p className="text-sm text-muted-foreground">Valor: {lesson.value}</p>
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
