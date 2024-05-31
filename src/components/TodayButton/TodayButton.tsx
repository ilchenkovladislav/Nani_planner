import { cn } from "@/lib/utils";

const TODAY = new Date().getDate();

type TodayButtonProps = {
    onClick?: () => void;
    className?: string;
    show?: boolean;
};

export function TodayButton({ onClick, className, show }: TodayButtonProps) {
    if (!show) return null;

    return (
        <button
            onClick={onClick}
            className={cn(
                "size-10 rounded-full bg-blue-500 font-semibold text-white",
                className,
            )}
        >
            {TODAY}
        </button>
    );
}
