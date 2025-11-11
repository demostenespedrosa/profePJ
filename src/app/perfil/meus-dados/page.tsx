
"use client";

import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

import MobileScreen from "@/components/layout/mobile-screen";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import UserProfileForm from "./_components/user-profile-form";


type UserProfile = {
  name: string;
  email: string;
  dasDueDate: number;
};

export default function MyDataPage() {
    const router = useRouter();
    const { user, firestore, auth, isUserLoading } = useFirebase();
    const { toast } = useToast();

    const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
    
    const handleUpdateProfile = async (values: any) => {
        if (!user || !userProfile) return;

        try {
            // Update Firestore document
            const userDocRef = doc(firestore, "users", user.uid);
            await updateDoc(userDocRef, {
                name: values.name,
                dasDueDate: values.dasDueDate,
            });

            // Update Firebase Auth profile if name changed
            if (user.displayName !== values.name) {
                await updateProfile(auth.currentUser!, { displayName: values.name });
            }

            toast({
                title: "Sucesso!",
                description: "Seus dados foram atualizados.",
            });
            router.push("/perfil");

        } catch (error: any) {
             console.error("Error updating profile:", error);
            toast({
                variant: "destructive",
                title: "Erro ao atualizar",
                description: error.message || "Não foi possível atualizar seus dados. Tente novamente.",
            });
        }
    }
    
    if (isUserLoading || isProfileLoading) {
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
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
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
                    Meus Dados
                </h1>
                <div className="w-9 h-9" />
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Perfil</CardTitle>
                        <CardDescription>Atualize seu nome e data de vencimento do DAS.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {userProfile && (
                            <UserProfileForm
                                currentUser={userProfile}
                                onSubmit={handleUpdateProfile} 
                                onCancel={() => router.back()} 
                            />
                        )}
                    </CardContent>
                </Card>
            </main>
        </MobileScreen>
    );
}
