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
  DialogDescription as DialogDescriptionComponent,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewSchoolForm from './_components/new-school-form';
import AddRecessForm from './_components/add-recess-form';
import { format, parseISO } from 'date-fns';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type Institution = {
    id: string;
    name: string;
    hourlyRate: number;
    color: string;
    recessStart?: string | null;
    recessEnd?: string | null;
};


export default function InstituicoesPage() {
  const [isNewSchoolFormOpen, setIsNewSchoolFormOpen] = useState(false);
  const [editingRecessSchool, setEditingRecessSchool] = useState<Institution | null>(null);
  const { user, firestore, isUserLoading } = useFirebase();
  const { toast } = useToast();

  const institutionsColRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/institutions`) : null, [firestore, user]);
  const { data: schools, isLoading: areSchoolsLoading } = useCollection<Institution>(institutionsColRef);

  const handleAddSchool = async (newSchoolData: Omit<Institution, 'id' | 'recessStart' | 'recessEnd'>) => {
    if (!user) return;

    try {
        const institutionsRef = collection(firestore, `users/${user.uid}/institutions`);
        await addDoc(institutionsRef, {
            ...newSchoolData,
            recessStart: null,
            recessEnd: null,
        });
        toast({
            title: "Sucesso!",
            description: `A instituição "${newSchoolData.name}" foi adicionada.`,
        });
        setIsNewSchoolFormOpen(false);
    } catch (error: any) {
        console.error("Error adding institution: ", error);
        toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: error.message || "Não foi possível adicionar a instituição. Tente novamente.",
        });
    }
  }

  const handleSaveRecess = async (data: { startDate: Date; endDate: Date }) => {
    if (!user || !editingRecessSchool) return;

    try {
        const institutionRef = doc(firestore, `users/${user.uid}/institutions/${editingRecessSchool.id}`);
        
        // Fix timezone issue: set to noon to avoid UTC conversion problems
        const startDate = new Date(data.startDate);
        startDate.setHours(12, 0, 0, 0);
        
        const endDate = new Date(data.endDate);
        endDate.setHours(12, 0, 0, 0);
        
        await updateDoc(institutionRef, {
            recessStart: startDate.toISOString(),
            recessEnd: endDate.toISOString(),
        });
        toast({
            title: "Sucesso!",
            description: `Recesso para "${editingRecessSchool.name}" foi salvo.`,
        });
        setEditingRecessSchool(null);
    } catch (error: any) {
        console.error("Error saving recess: ", error);
        toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: error.message || "Não foi possível salvar o recesso. Tente novamente.",
        });
    }
  };
  
  const isLoading = isUserLoading || areSchoolsLoading;

  return (
    <MobileScreen>
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
            <h1 className="text-2xl font-bold font-headline text-foreground">
                Instituições
            </h1>
            <Dialog open={isNewSchoolFormOpen} onOpenChange={setIsNewSchoolFormOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!user}>
                    <Plus className="h-6 w-6" />
                    <span className="sr-only">Adicionar Instituição</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                  <DialogHeader>
                      <DialogTitle>Nova Instituição</DialogTitle>
                      <CardDescription>Preencha os dados para cadastrar uma nova escola.</CardDescription>
                  </DialogHeader>
                  <NewSchoolForm onSubmit={handleAddSchool} onCancel={() => setIsNewSchoolFormOpen(false)} />
              </DialogContent>
            </Dialog>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
            {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-4 space-y-4">
                           <div className="flex items-start justify-between">
                             <div className="flex items-start gap-4">
                                <Skeleton className="w-3 h-3 mt-1.5 rounded-full flex-shrink-0" />
                                <div className='flex flex-col space-y-2'>
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                                <Skeleton className="h-9 w-9" />
                           </div>
                           <Skeleton className="h-px w-full" />
                           <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                ))
            ) : schools && schools.length > 0 ? schools.map((school) => (
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
                                        {format(parseISO(school.recessStart), "dd/MM/yyyy")} - {format(parseISO(school.recessEnd), "dd/MM/yyyy")}
                                    </p>
                                </div>
                             </div>
                        ) : (
                            <Dialog open={editingRecessSchool?.id === school.id} onOpenChange={(isOpen) => setEditingRecessSchool(isOpen ? school : null)}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        <CalendarPlus className="mr-2 h-4 w-4" />
                                        Adicionar Recesso
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Adicionar Recesso para {school.name}</DialogTitle>
                                        <DialogDescriptionComponent>Selecione a data de início e fim do período de recesso.</DialogDescriptionComponent>
                                    </DialogHeader>
                                    <AddRecessForm 
                                        onSubmit={handleSaveRecess}
                                        onCancel={() => setEditingRecessSchool(null)} 
                                    />
                                </DialogContent>
                             </Dialog>
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

       {/* This Dialog is for the 'add recess' functionality */}
        <Dialog open={!!editingRecessSchool} onOpenChange={(isOpen) => !isOpen && setEditingRecessSchool(null)}>
            <DialogContent className="max-w-md">
                 <DialogHeader>
                    <DialogTitle>Adicionar Recesso para {editingRecessSchool?.name}</DialogTitle>
                     <DialogDescriptionComponent>Selecione a data de início e fim do período de recesso.</DialogDescriptionComponent>
                </DialogHeader>
                <AddRecessForm 
                    onSubmit={handleSaveRecess}
                    onCancel={() => setEditingRecessSchool(null)} 
                />
            </DialogContent>
        </Dialog>


      <BottomNav />
    </MobileScreen>
  );
}
