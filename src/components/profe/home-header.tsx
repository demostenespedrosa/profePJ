import { useFirebase } from "@/firebase";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function HomeHeader() {
  const { user, auth } = useFirebase();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    // Remove cookie
    document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  }


  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
      <div>
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Olá, {user?.displayName?.split(' ')[0] || 'Professor(a)'}!
        </h1>
        <p className="text-sm text-muted-foreground">Aqui está seu resumo de hoje.</p>
      </div>
       <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
       </Button>
    </header>
  );
}