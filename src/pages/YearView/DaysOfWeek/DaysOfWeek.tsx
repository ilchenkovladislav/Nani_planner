export const daysOfWeek = ["п", "в", "с", "ч", "п", "с", "в"] as const;

type DaysOfWeekProps = {
    show?: boolean;
};

export function DaysOfWeek({ show }: DaysOfWeekProps) {
    if (!show) return null;

    return (
        <div className="grid grid-cols-8 text-center text-xs text-gray-400">
            {daysOfWeek.map((dayOfWeek, index) => (
                <div key={`${dayOfWeek}-${index}`}>{dayOfWeek}</div>
            ))}
        </div>
    );
}
