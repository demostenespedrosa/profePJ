import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

type ActionCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
  ctaClassName?: string;
  variant?: 'default' | 'info';
};

export default function ActionCard({
  icon,
  title,
  description,
  ctaText,
  onCtaClick,
  className,
  ctaClassName,
  variant = 'default'
}: ActionCardProps) {
  return (
    <Card className={cn(
        "transform transition-transform duration-200 hover:scale-[1.02]",
        variant === 'info' && 'bg-accent/20 border-accent/30',
        className
    )}>
      <CardContent className="p-4 flex items-start gap-4">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
          <h4 className="font-bold font-headline">{title}</h4>
          <p className="text-sm text-muted-foreground mb-3">
            {description}
          </p>
          {ctaText && onCtaClick && (
            <Button
              onClick={onCtaClick}
              className={cn("w-full md:w-auto font-bold", ctaClassName)}
            >
              {ctaText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
