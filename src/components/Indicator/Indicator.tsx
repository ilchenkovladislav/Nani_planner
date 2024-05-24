import { cn } from "@/lib/utils";

type IndicatorProps = {
    className?: string;
};

export function Indicator({ className = "" }: IndicatorProps) {
    return (
        <div
            className={cn(
                "absolute size-1 rounded-full bg-slate-400",
                className,
            )}
        />
    );
}
