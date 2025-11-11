"use client";

import MobileScreen from "@/components/layout/mobile-screen";
import BottomNav from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ChevronRight, HelpCircle, LogOut, School, Shield, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const menuItems = [
    { icon: UserIcon, label: "Meus Dados", href: "#" },
    { icon: School, label: "Instituições de Ensino", href: "/instituicoes" },
    { icon: Bell, label: "Notificações", href: "#" },
    { icon: Shield, label: "Segurança", href: "#" },
    { icon: HelpCircle, label: "Ajuda", href: "#" },
];

export default function PerfilPage() {
  const { user, auth, isUserLoading } = useFirebase();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    // Remove cookie
    document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  }

  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-1');

  if (isUserLoading || !user) {
    return (
        <MobileScreen>
            <div className="flex items-center justify-center h-full">
                <Skeleton className="w-24 h-24 rounded-full" />
            </div>
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
        <div className="flex flex-col items-center space-y-2 pt-4">
          {userAvatar && <Image
            src={userAvatar.imageUrl}
            alt={userAvatar.description}
            width={96}
            height={96}
            className="rounded-full border-4 border-white shadow-lg"
            data-ai-hint={userAvatar.imageHint}
          />}
          <h2 className="text-xl font-bold font-headline text-foreground">{user.displayName}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <Card>
            <CardContent className="p-0">
                <ul className="divide-y">
                    {menuItems.map((item) => (
                         <li key={item.label}>
                             <a href={item.href} className="flex items-center p-4 hover:bg-secondary/50 transition-colors">
                                 <item.icon className="w-5 h-5 mr-4 text-muted-foreground" />
                                 <span className="flex-1 font-medium">{item.label}</span>
                                 <ChevronRight className="w-5 h-5 text-muted-foreground" />
                             </a>
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