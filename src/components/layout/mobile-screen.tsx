import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type MobileScreenProps = {
  children: ReactNode;
  className?: string;
};

export default function MobileScreen({ children, className }: MobileScreenProps) {
  return (
    <div className="h-dvh w-full flex items-center justify-center">
      <div className={cn(
        "relative flex flex-col h-full w-full max-w-sm bg-background shadow-2xl md:h-[95vh] md:max-h-[800px] md:rounded-[3rem] md:border-8 md:border-gray-800 dark:md:border-gray-600",
        className
      )}>
        {children}
      </div>
    </div>
  );
}
