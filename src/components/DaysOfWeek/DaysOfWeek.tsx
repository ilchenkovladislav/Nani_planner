import { memo } from "react";

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

export const DaysOfWeek = memo(() => {
    return (
        <div className="relative z-10 bg-white">
            <div className="ml-[30px] grid grid-cols-7 gap-3 border-b-[1px] bg-white py-1">
                {daysOfWeek.map((el) => (
                    <div className="text-center text-xs" key={el}>
                        {el}
                    </div>
                ))}
            </div>
        </div>
    );
});
