
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

import MobileScreen from "@/components/layout/mobile-screen";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import ChangePasswordForm from "./_components/change-password-form";

export default function SecurityPage() {
    const router = useRouter();
    const { user, auth, isUserLoading } = useFirebase();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChangePassword = async (values: any) => {
        if (!user) return;
        setIsSubmitting(true);

        try {
            // Re-authenticate the user first for security reasons
            const credential = EmailAuthProvider.credential(user.email!, values.currentPassword);
            await reauthenticateWithCredential(user, credential);
            
            // If re-authentication is successful, update the password
            await updatePassword(user, values.newPassword);

            toast({
                title: "Sucesso!",
                description: "Sua senha foi alterada.",
            });
            router.back();

        } catch (error: any) {
            console.error("Error changing password:", error);
            let description = "Não foi possível alterar sua senha. Tente novamente.";
            if (error.code === 'auth/wrong-password') {
                description = "A senha atual que você digitou está incorreta.";
            }
             if (error.code === 'auth/weak-password') {
                description = "A nova senha é muito fraca. Tente uma com pelo menos 6 caracteres.";
            }
            toast({
                variant: "destructive",
                title: "Erro ao alterar senha",
                description: description,
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <MobileScreen>
             <header className="sticky top-0 z-10 flex items-center p-4 bg-background/80 backdrop-blur-sm border-b">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="h-6 w-6" />
                    <span className="sr-only">Voltar</span>
                </Button>
                <h1 className="text-xl font-bold font-headline text-foreground text-center flex-1">
                    Segurança
                </h1>
                <div className="w-9 h-9" />
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Alterar Senha</CardTitle>
                        <CardDescription>Para sua segurança, você precisará informar sua senha atual antes de definir uma nova.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChangePasswordForm
                            onSubmit={handleChangePassword} 
                            onCancel={() => router.back()} 
                            isSubmitting={isSubmitting}
                        />
                    </CardContent>
                </Card>
            </main>
        </MobileScreen>
    );
}

