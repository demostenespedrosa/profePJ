import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomeHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
      <div>
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Olá, Professor(a)!
        </h1>
        <p className="text-sm text-muted-foreground">Aqui está seu resumo de hoje.</p>
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-6 w-6" />
        <Badge variant="destructive" className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs">2</Badge>
        <span className="sr-only">Notificações</span>
      </Button>
    </header>
  );
}
