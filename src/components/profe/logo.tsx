import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("inline-flex items-center justify-center", className)}>
            <span className="font-bold text-2xl font-headline tracking-tight">
                Profe <span className="text-primary">PJ</span>
            </span>
        </div>
    );
}
