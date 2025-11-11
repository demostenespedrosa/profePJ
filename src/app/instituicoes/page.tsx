"use client";

import { useState } from 'react';
import MobileScreen from "@/components/layout/mobile-screen";
import BottomNav from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoreVertical, Plus, Trash2, CalendarRange } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import NewSchoolForm from './_components/new-school-form';
import { format } from 'date-fns';

const initialSchools = [
    {
        id: 1,
        name: "Escola ABC",
        hourlyRate: 50,
        color: "#34D399",
        recessStart: new Date("2024-12-15"),
        recessEnd: new Date("2025-01-05"),
    },
    {
        id: 2,
        name: "Escola XYZ",
        hourlyRate: 65,
        color: "#F87171",
        recessStart: new Date("2024-12-20"),
        recessEnd: new Date("2025-01-10"),
    },
    {
        id: 3,
        name: "Escola 123",
        hourlyRate: 75,
        color: "#60A5FA",
        recessStart: new Date("2024-07-01"),
        recessEnd: new Date("2024-07-31"),
    }
];

export default function InstituicoesPage() {
  const [schools, setSchools] = useState(initialSchools);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddSchool = (newSchool: Omit<typeof initialSchools[0], 'id'>) => {
    setSchools(prev => [...prev, { ...newSchool, id: prev.length + 1 }]);
    setIsFormOpen(false);
  }

  return (
    <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
            <h1 className="text-2xl font-bold font-headline text-foreground">
                Instituições
            </h1>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Plus className="h-6 w-6" />
                    <span className="sr-only">Adicionar Instituição</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                  <DialogHeader>
                      <DialogTitle>Nova Instituição</DialogTitle>
                      <CardDescription>Preencha os dados para cadastrar uma nova escola e seu período de recesso.</CardDescription>
                  </DialogHeader>
                  <NewSchoolForm onSubmit={handleAddSchool} onCancel={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
            {schools.length > 0 ? schools.map((school) => (
                 <Card key={school.id} className="transform transition-transform duration-200 hover:scale-[1.02]">
                    <CardContent className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-4 h-full min-h-[4rem] rounded-full" style={{ backgroundColor: school.color }} />
                          <div>
                            <p className="font-bold text-lg">{school.name}</p>
                            <p className="text-sm text-muted-foreground">R$ {school.hourlyRate.toFixed(2).replace('.', ',')} / hora</p>
                             <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                <CalendarRange className="w-4 h-4" />
                                <span>
                                    {format(school.recessStart, "dd/MM")} - {format(school.recessEnd, "dd/MM")}
                                </span>
                             </div>
                          </div>
                       </div>
                       <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <MoreVertical className="h-5 w-5" />
                       </Button>
                    </CardContent>
                </Card>
            )) : (
                <div className="text-center py-12 px-4 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground">Nenhuma instituição cadastrada</h3>
                    <p className="text-muted-foreground mt-1">Clique no botão '+' para adicionar a primeira.</p>
                </div>
            )}
        </div>
      </main>

      <BottomNav />
    </MobileScreen>
  );
}
