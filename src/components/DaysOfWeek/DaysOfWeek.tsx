import { memo } from "react";

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

export const DaysOfWeek = memo(() => {
    return (
        <div className="relative z-10 bg-white">
            <div className="ml-[20px] grid grid-cols-7 gap-3 border-b border-gray-100 bg-background py-1">
                {daysOfWeek.map((el) => (
                    <div className="text-center text-xs text-gray-400" key={el}>
                        {el}
                    </div>
                ))}
            </div>
        </div>
    );
});
