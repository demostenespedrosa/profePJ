import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type MobileScreenProps = {
  children: ReactNode;
  className?: string;
};

export default function MobileScreen({ children, className }: MobileScreenProps) {
  return (
    <div className="flex justify-center w-full min-h-screen">
      <div className={cn(
        "relative flex flex-col w-full bg-background",
        className
      )}>
        {children}
      </div>
    </div>
  );
}
