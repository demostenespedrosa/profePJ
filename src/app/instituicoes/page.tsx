"use client";

import { useState } from 'react';
import MobileScreen from "@/components/layout/mobile-screen";
import BottomNav from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoreVertical, Plus, CalendarPlus, CalendarRange } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
        recessStart: null,
        recessEnd: null,
    },
    {
        id: 2,
        name: "Escola XYZ",
        hourlyRate: 65,
        color: "#F87171",
        recessStart: null,
        recessEnd: null,
    },
    {
        id: 3,
        name: "Escola 123",
        hourlyRate: 75,
        color: "#60A5FA",
        recessStart: new Date("2024-07-01T03:00:00.000Z"),
        recessEnd: new Date("2024-07-31T03:00:00.000Z"),
    }
];

export default function InstituicoesPage() {
  const [schools, setSchools] = useState(initialSchools);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddSchool = (newSchool: Omit<typeof initialSchools[0], 'id' | 'recessStart' | 'recessEnd'>) => {
    setSchools(prev => [...prev, { ...newSchool, id: prev.length + 1, recessStart: null, recessEnd: null }]);
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
                      <CardDescription>Preencha os dados para cadastrar uma nova escola.</CardDescription>
                  </DialogHeader>
                  <NewSchoolForm onSubmit={handleAddSchool} onCancel={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
            {schools.length > 0 ? schools.map((school) => (
                 <Card key={school.id} className="transform transition-transform duration-200 hover:scale-[1.02]">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-3 h-3 mt-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: school.color }} />
                                <div className='flex flex-col'>
                                    <p className="font-bold text-lg">{school.name}</p>
                                    <p className="text-sm text-muted-foreground">R$ {school.hourlyRate.toFixed(2).replace('.', ',')} / hora</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground flex-shrink-0">
                                    <MoreVertical className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className='border-t my-4'></div>

                        {school.recessStart && school.recessEnd ? (
                             <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <CalendarRange className="w-4 h-4 flex-shrink-0" />
                                <div>
                                    <span className='font-medium text-foreground'>Período de recesso</span>
                                    <p>
                                        {format(school.recessStart, "dd/MM/yyyy")} - {format(school.recessEnd, "dd/MM/yyyy")}
                                    </p>
                                </div>
                             </div>
                        ) : (
                            <Button variant="outline" className="w-full">
                                <CalendarPlus className="mr-2 h-4 w-4" />
                                Adicionar Recesso
                            </Button>
                        )}
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
