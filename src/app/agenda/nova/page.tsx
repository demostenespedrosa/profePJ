"use client";

import { useRouter } from "next/navigation";
import { collection, addDoc, doc } from "firebase/firestore";
import { setHours, setMinutes } from 'date-fns';

import NewLessonForm from "../_components/new-lesson-form";
import MobileScreen from "@/components/layout/mobile-screen";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

type Institution = {
    id: string;
    name: string;
    hourlyRate: number;
    color: string;
};

export default function NewLessonPage() {
    const router = useRouter();
    const { user, firestore, isUserLoading } = useFirebase();
    const { toast } = useToast();

    const institutionsColRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/institutions`) : null, [firestore, user]);
    const { data: institutions, isLoading: areInstitutionsLoading } = useCollection<Institution>(institutionsColRef);

    const handleAddLesson = async (values: any) => {
        if (!user || !institutions) return;

        const { type, schoolId, date, dates, startTime, endTime } = values;

        const selectedInstitution = institutions.find(inst => inst.id === schoolId);
        if (!selectedInstitution) {
            toast({ variant: "destructive", title: "Erro", description: "Instituição não encontrada." });
            return;
        }

        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const durationInHours = (endHour - startHour) + (endMinute - startMinute) / 60;
        if (durationInHours <= 0) {
            toast({ variant: "destructive", title: "Erro de Validação", description: "O horário de término deve ser após o horário de início." });
            return;
        }

        const totalValue = durationInHours * selectedInstitution.hourlyRate;
        const lessonsColRef = collection(firestore, `users/${user.uid}/lessons`);

        try {
            const createLessonObject = (lessonDate: Date) => {
                const startDateTime = setMinutes(setHours(lessonDate, startHour), startMinute);
                const endDateTime = setMinutes(setHours(lessonDate, endHour), endMinute);

                return {
                    institutionId: selectedInstitution.id,
                    institutionName: selectedInstitution.name,
                    startTime: startDateTime.toISOString(),
                    endTime: endDateTime.toISOString(),
                    totalValue: totalValue,
                    status: 'Scheduled',
                };
            };
            
            if (type === 'single' && date) {
                const newLesson = createLessonObject(date);
                await addDoc(lessonsColRef, newLesson);
            } else if (type === 'batch' && dates.length > 0) {
                for (const lessonDate of dates) {
                    const newLesson = createLessonObject(lessonDate);
                    // We don't await here to make it faster for the user, but we could
                    addDoc(lessonsColRef, newLesson);
                }
            }
            
            toast({
                title: "Sucesso!",
                description: `Aula(s) agendada(s) com sucesso.`,
            });
            router.push("/agenda");

        } catch (error: any) {
            console.error("Error adding lesson(s):", error);
            toast({
                variant: "destructive",
                title: "Erro ao agendar",
                description: error.message || "Não foi possível agendar a(s) aula(s). Tente novamente.",
            });
        }
    }
    
    if (isUserLoading || areInstitutionsLoading) {
        return (
            <MobileScreen>
                <header className="sticky top-0 z-10 flex items-center p-4 bg-background/80 backdrop-blur-sm border-b">
                     <Skeleton className="h-9 w-9" />
                     <Skeleton className="h-6 w-32 mx-auto" />
                    <div className="w-9 h-9" />
                </header>
                 <main className="flex-1 overflow-y-auto p-4">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-40 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </MobileScreen>
        )
    }

    return (
        <MobileScreen>
             <header className="sticky top-0 z-10 flex items-center p-4 bg-background/80 backdrop-blur-sm border-b">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="h-6 w-6" />
                    <span className="sr-only">Voltar</span>
                </Button>
                <h1 className="text-xl font-bold font-headline text-foreground text-center flex-1">
                    Agendar Aulas
                </h1>
                <div className="w-9 h-9" />
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Detalhes da Aula</CardTitle>
                        <CardDescription>Selecione o tipo de agendamento e preencha os detalhes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NewLessonForm 
                            schools={institutions || []}
                            onSubmit={handleAddLesson} 
                            onCancel={() => router.back()} 
                        />
                    </CardContent>
                </Card>
            </main>

        </MobileScreen>
    );
}
