
"use client";

import MobileScreen from "@/components/layout/mobile-screen";
import BottomNav from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ChevronRight, HelpCircle, LogOut, School, Shield, User as UserIcon } from "lucide-react";
import { useFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const menuItems = [
    { icon: UserIcon, label: "Meus Dados", href: "/perfil/meus-dados" },
    { icon: School, label: "Instituições de Ensino", href: "/instituicoes" },
    { icon: Bell, label: "Notificações", href: "#" },
    { icon: Shield, label: "Segurança", href: "/perfil/seguranca" },
    { icon: HelpCircle, label: "Ajuda", href: "#" },
];

export default function PerfilPage() {
  const { user, auth, isUserLoading } = useFirebase();
  const router = useRouter();

  const handleLogout = async () => {
    try {
        await signOut(auth);
        // Remove cookie
        document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    } catch (error) {
        console.error("Error signing out: ", error);
    }
  }

  if (isUserLoading || !user) {
    return (
        <MobileScreen>
             <header className="sticky top-0 z-10 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm border-b">
                <h1 className="text-2xl font-bold font-headline text-foreground">
                Meu Perfil
                </h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                 <div className="flex flex-col items-center space-y-4 pt-4">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <div className="w-full space-y-2 flex flex-col items-center">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </main>
            <BottomNav />
        </MobileScreen>
    )
  }

  return (
    <MobileScreen>
      <header className="sticky top-0 z-10 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm border-b">
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Meu Perfil
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex flex-col items-center space-y-2 pt-4 text-center">
           <Avatar className="w-24 h-24 mb-4">
            <AvatarFallback className="text-4xl bg-muted">
              {user.displayName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold font-headline text-foreground">{user.displayName}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <Card>
            <CardContent className="p-0">
                <ul className="divide-y">
                    {menuItems.map((item) => (
                         <li key={item.label}>
                             <Link href={item.href} className="flex items-center p-4 hover:bg-secondary/50 transition-colors">
                                 <item.icon className="w-5 h-5 mr-4 text-muted-foreground" />
                                 <span className="flex-1 font-medium">{item.label}</span>
                                 <ChevronRight className="w-5 h-5 text-muted-foreground" />
                             </Link>
                         </li>
                    ))}
                </ul>
            </CardContent>
        </Card>

        <div className="pt-4">
            <Button onClick={handleLogout} variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair da Conta
            </Button>
        </div>

      </main>

      <BottomNav />
    </MobileScreen>
  );
}
