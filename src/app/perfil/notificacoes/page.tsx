
"use client";

import { useRouter } from "next/navigation";

import MobileScreen from "@/components/layout/mobile-screen";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFirebase } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
    const router = useRouter();
    const { isUserLoading } = useFirebase();

    if (isUserLoading) {
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
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-6 w-11" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-6 w-11" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-44" />
                                <Skeleton className="h-6 w-11" />
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
                    Notificações
                </h1>
                <div className="w-9 h-9" />
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Gerenciar Notificações</CardTitle>
                        <CardDescription>Escolha quais alertas e lembretes você deseja receber.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                            <div>
                                <Label htmlFor="lesson-reminders" className="font-semibold">Lembretes de aula</Label>
                                <p className="text-sm text-muted-foreground">Alertas sobre suas próximas aulas.</p>
                            </div>
                            <Switch id="lesson-reminders" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                             <div>
                                <Label htmlFor="das-alerts" className="font-semibold">Alertas do DAS</Label>
                                <p className="text-sm text-muted-foreground">Lembretes sobre o vencimento do seu imposto.</p>
                             </div>
                            <Switch id="das-alerts" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                            <div>
                                <Label htmlFor="app-news" className="font-semibold">Novidades do Profe PJ</Label>
                                <p className="text-sm text-muted-foreground">Dicas e novas funcionalidades do app.</p>
                            </div>
                            <Switch id="app-news" />
                        </div>
                    </CardContent>
                </Card>
            </main>
        </MobileScreen>
    );
}
