"use client";

import { Home, Calendar, CircleDollarSign, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/potinhos", label: "Potinhos", icon: CircleDollarSign },
  { href: "/perfil", label: "Perfil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 left-0 right-0 w-full bg-card/80 backdrop-blur-lg border-t z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors duration-200",
                isActive ? "text-primary" : "hover:text-foreground"
              )}
            >
              <item.icon
                className="w-6 h-6"
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
