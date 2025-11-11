"use client";

import { useRouter } from "next/navigation";
import NewLessonForm from "../_components/new-lesson-form";
import MobileScreen from "@/components/layout/mobile-screen";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data, to be replaced by dynamic data later
const schools = [
    { id: 1, name: "Escola ABC", color: "#34D399" },
    { id: 2, name: "Escola XYZ", color: "#F87171" },
    { id: 3, name: "Escola 123", color: "#60A5FA" },
];

export default function NewLessonPage() {
    const router = useRouter();

    const handleAddLesson = (values: any) => {
        console.log("New lesson(s):", values);
        // Here you would typically update your state or call an API
        // After submission, redirect back to the agenda page
        router.push("/agenda");
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
                            schools={schools}
                            onSubmit={handleAddLesson} 
                            onCancel={() => router.back()} 
                        />
                    </CardContent>
                </Card>
            </main>

        </MobileScreen>
    );
}
