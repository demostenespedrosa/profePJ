"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ptBR } from "date-fns/locale";
import MobileScreen from "@/components/layout/mobile-screen";
import BottomNav from "@/components/layout/bottom-nav";

const scheduledLessons = [
    { id: 1, time: "10:00", school: "Escola ABC", value: "R$ 50,00" },
    { id: 2, time: "14:00", school: "Escola XYZ", value: "R$ 65,00" },
];

export default function AgendaPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
            <h1 className="text-2xl font-bold font-headline text-foreground">
            Agenda
            </h1>
            <Button variant="ghost" size="icon">
                <Plus className="h-6 w-6" />
                <span className="sr-only">Adicionar evento</span>
            </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <Card>
            <CardContent className="p-0 flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ptBR}
                    className="p-4"
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
                {scheduledLessons.map((lesson) => (
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
                ))}
                {scheduledLessons.length === 0 && (
                     <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Nenhuma aula agendada para hoje.</p>
                     </div>
                )}
            </div>
        </div>
      </main>

      <BottomNav />
    </MobileScreen>
  );
}
