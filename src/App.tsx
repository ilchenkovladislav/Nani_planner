import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MonthCalendar } from "./components/MonthCalendar/MonthCalendar";

function App() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    function updateCurrentDate(month: Date) {
        setCurrentDate(month);
    }

    return (
        <>
            <div className="relative z-10 bg-white">
                <div>{format(currentDate, "yyyy LLLL", { locale: ru })}</div>
            </div>
            {
                <MonthCalendar
                    currentDate={currentDate}
                    onUpdateCurrentDate={updateCurrentDate}
                />
            }
        </>
    );
}

export default App;
